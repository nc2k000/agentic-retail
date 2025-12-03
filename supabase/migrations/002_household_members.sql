-- Household Members Migration
-- Adds member attribution to memory tables for household member tracking
-- Run this after 001_memory_system.sql

BEGIN;

-- ============================================
-- ADD MEMBER_ID COLUMNS TO EXISTING TABLES
-- ============================================

-- Add member_id to customer_preferences
ALTER TABLE customer_preferences
ADD COLUMN member_id VARCHAR(50) NULL,
ADD COLUMN member_name VARCHAR(100) NULL; -- Denormalized for quick display

-- Add member_id to shopping_patterns
ALTER TABLE shopping_patterns
ADD COLUMN member_id VARCHAR(50) NULL,
ADD COLUMN member_name VARCHAR(100) NULL;

-- Add member_id to interaction_history
ALTER TABLE interaction_history
ADD COLUMN member_id VARCHAR(50) NULL,
ADD COLUMN member_name VARCHAR(100) NULL;

-- ============================================
-- INDEXES FOR MEMBER QUERIES
-- ============================================

-- Indexes for member-specific queries
CREATE INDEX idx_preferences_member ON customer_preferences(user_id, member_id);
CREATE INDEX idx_patterns_member ON shopping_patterns(user_id, member_id);
CREATE INDEX idx_interactions_member ON interaction_history(user_id, member_id);

-- ============================================
-- UPDATE UNIQUE CONSTRAINTS
-- ============================================

-- Drop old unique constraint and add new one including member_id
ALTER TABLE customer_preferences
DROP CONSTRAINT customer_preferences_user_id_preference_type_preference_key_key;

ALTER TABLE customer_preferences
ADD CONSTRAINT customer_preferences_unique_key
UNIQUE (user_id, preference_type, preference_key, member_id);

ALTER TABLE shopping_patterns
DROP CONSTRAINT shopping_patterns_user_id_pattern_type_pattern_key_key;

ALTER TABLE shopping_patterns
ADD CONSTRAINT shopping_patterns_unique_key
UNIQUE (user_id, pattern_type, pattern_key, member_id);

-- ============================================
-- UPDATE HELPER FUNCTIONS FOR MEMBER SUPPORT
-- ============================================

-- Updated upsert_preference function with member_id support
CREATE OR REPLACE FUNCTION upsert_preference(
  p_user_id UUID,
  p_type VARCHAR,
  p_key VARCHAR,
  p_confidence DECIMAL DEFAULT 0.50,
  p_reason TEXT DEFAULT NULL,
  p_source VARCHAR DEFAULT 'inferred',
  p_member_id VARCHAR DEFAULT NULL,
  p_member_name VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
  v_existing_confidence DECIMAL;
BEGIN
  -- Check if preference exists
  SELECT id, confidence INTO v_id, v_existing_confidence
  FROM customer_preferences
  WHERE user_id = p_user_id
    AND preference_type = p_type
    AND preference_key = p_key
    AND (member_id = p_member_id OR (member_id IS NULL AND p_member_id IS NULL));

  IF v_id IS NULL THEN
    -- Insert new preference
    INSERT INTO customer_preferences (
      user_id, preference_type, preference_key, confidence, reason, source,
      member_id, member_name
    )
    VALUES (
      p_user_id, p_type, p_key, p_confidence, p_reason, p_source,
      p_member_id, p_member_name
    )
    RETURNING id INTO v_id;
  ELSE
    -- Update existing preference (increase confidence, max 0.95)
    UPDATE customer_preferences
    SET
      confidence = LEAST(0.95, GREATEST(v_existing_confidence, p_confidence)),
      reason = COALESCE(p_reason, reason),
      last_confirmed_at = NOW(),
      times_confirmed = times_confirmed + 1,
      updated_at = NOW(),
      member_name = COALESCE(p_member_name, member_name)
    WHERE id = v_id;
  END IF;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated update_pattern function with member_id support
CREATE OR REPLACE FUNCTION update_pattern(
  p_user_id UUID,
  p_type VARCHAR,
  p_key VARCHAR,
  p_value JSONB DEFAULT NULL,
  p_member_id VARCHAR DEFAULT NULL,
  p_member_name VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
  v_count INTEGER;
BEGIN
  -- Check if pattern exists
  SELECT id, occurrence_count INTO v_id, v_count
  FROM shopping_patterns
  WHERE user_id = p_user_id
    AND pattern_type = p_type
    AND pattern_key = p_key
    AND (member_id = p_member_id OR (member_id IS NULL AND p_member_id IS NULL));

  IF v_id IS NULL THEN
    -- Insert new pattern
    INSERT INTO shopping_patterns (
      user_id, pattern_type, pattern_key, pattern_value,
      member_id, member_name
    )
    VALUES (
      p_user_id, p_type, p_key, p_value,
      p_member_id, p_member_name
    )
    RETURNING id INTO v_id;
  ELSE
    -- Update existing pattern
    UPDATE shopping_patterns
    SET
      occurrence_count = v_count + 1,
      last_occurrence = NOW(),
      pattern_value = COALESCE(p_value, pattern_value),
      confidence = LEAST(0.95, 0.50 + (v_count * 0.03)),
      updated_at = NOW(),
      member_name = COALESCE(p_member_name, member_name)
    WHERE id = v_id;
  END IF;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated record_interaction function with member_id support
CREATE OR REPLACE FUNCTION record_interaction(
  p_user_id UUID,
  p_type VARCHAR,
  p_key VARCHAR DEFAULT NULL,
  p_value JSONB DEFAULT NULL,
  p_session_id UUID DEFAULT NULL,
  p_member_id VARCHAR DEFAULT NULL,
  p_member_name VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO interaction_history (
    user_id, interaction_type, interaction_key, interaction_value, session_id,
    member_id, member_name
  )
  VALUES (
    p_user_id, p_type, p_key, p_value, p_session_id,
    p_member_id, p_member_name
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated fetch_memory_context function with member_id filter
CREATE OR REPLACE FUNCTION fetch_memory_context(
  p_user_id UUID,
  p_min_confidence DECIMAL DEFAULT 0.70,
  p_member_id VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  category TEXT,
  items JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH preferences AS (
    SELECT
      preference_type,
      jsonb_agg(
        jsonb_build_object(
          'key', preference_key,
          'confidence', confidence,
          'reason', reason,
          'times_confirmed', times_confirmed,
          'member_id', member_id,
          'member_name', member_name
        )
        ORDER BY confidence DESC, times_confirmed DESC
      ) as pref_items
    FROM customer_preferences
    WHERE user_id = p_user_id
      AND confidence >= p_min_confidence
      AND (p_member_id IS NULL OR member_id = p_member_id OR member_id IS NULL)
    GROUP BY preference_type
  ),
  insights AS (
    SELECT
      'insights' as insight_type,
      jsonb_agg(
        jsonb_build_object(
          'type', insight_type,
          'key', insight_key,
          'value', insight_value,
          'confidence', confidence
        )
        ORDER BY confidence DESC
      ) as insight_items
    FROM memory_insights
    WHERE user_id = p_user_id
      AND confidence >= p_min_confidence
      AND (expires_at IS NULL OR expires_at > NOW())
  )
  SELECT preference_type::TEXT as category, pref_items as items FROM preferences
  UNION ALL
  SELECT insight_type::TEXT as category, insight_items as items FROM insights;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- NEW HELPER FUNCTIONS FOR HOUSEHOLD MEMBERS
-- ============================================

-- Function to get member-specific preferences
CREATE OR REPLACE FUNCTION get_member_preferences(
  p_user_id UUID,
  p_member_id VARCHAR
)
RETURNS TABLE (
  preference_type VARCHAR,
  preference_key VARCHAR,
  confidence DECIMAL,
  times_confirmed INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cp.preference_type,
    cp.preference_key,
    cp.confidence,
    cp.times_confirmed
  FROM customer_preferences cp
  WHERE cp.user_id = p_user_id
    AND cp.member_id = p_member_id
  ORDER BY cp.confidence DESC, cp.times_confirmed DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get member shopping summary
CREATE OR REPLACE FUNCTION get_member_shopping_summary(
  p_user_id UUID,
  p_member_id VARCHAR
)
RETURNS TABLE (
  total_preferences INTEGER,
  total_patterns INTEGER,
  total_interactions INTEGER,
  avg_confidence DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM customer_preferences
     WHERE user_id = p_user_id AND member_id = p_member_id),
    (SELECT COUNT(*)::INTEGER FROM shopping_patterns
     WHERE user_id = p_user_id AND member_id = p_member_id),
    (SELECT COUNT(*)::INTEGER FROM interaction_history
     WHERE user_id = p_user_id AND member_id = p_member_id),
    (SELECT AVG(confidence)::DECIMAL FROM customer_preferences
     WHERE user_id = p_user_id AND member_id = p_member_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

-- ============================================
-- SAMPLE USAGE
-- ============================================
-- Example queries to test household member features

-- 1. Upsert a member-specific preference
-- SELECT upsert_preference(
--   'USER_UUID',
--   'dietary',
--   'vegetarian',
--   0.90,
--   'Sarah never orders meat products',
--   'inferred',
--   'member-sarah-123',
--   'Sarah'
-- );

-- 2. Update a member-specific pattern
-- SELECT update_pattern(
--   'USER_UUID',
--   'favorite_category',
--   'snacks',
--   '{"items": ["goldfish", "fruit-snacks"]}'::jsonb,
--   'member-sarah-123',
--   'Sarah'
-- );

-- 3. Record a member-specific interaction
-- SELECT record_interaction(
--   'USER_UUID',
--   'view_item',
--   'milk-whole-gal',
--   '{"name": "Whole Milk", "price": 3.48}'::jsonb,
--   'SESSION_UUID',
--   'member-sarah-123',
--   'Sarah'
-- );

-- 4. Fetch memory context for a specific member
-- SELECT * FROM fetch_memory_context('USER_UUID', 0.70, 'member-sarah-123');

-- 5. Get member-specific preferences
-- SELECT * FROM get_member_preferences('USER_UUID', 'member-sarah-123');

-- 6. Get member shopping summary
-- SELECT * FROM get_member_shopping_summary('USER_UUID', 'member-sarah-123');
