-- Memory System Migration
-- Adds customer memory tables for personalized AI
-- Run this after initial schema.sql

-- ============================================
-- CUSTOMER_PREFERENCES TABLE
-- Stores explicit and inferred preferences
-- ============================================
CREATE TABLE customer_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Preference details
  preference_type VARCHAR(50) NOT NULL CHECK (preference_type IN ('dietary', 'brand', 'favorite', 'dislike', 'allergy')),
  preference_key VARCHAR(255) NOT NULL,
  preference_value TEXT,
  confidence DECIMAL(3,2) DEFAULT 0.50 CHECK (confidence >= 0.00 AND confidence <= 1.00),

  -- Context
  reason TEXT,
  source VARCHAR(50) DEFAULT 'inferred' CHECK (source IN ('explicit', 'inferred', 'pattern')),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_confirmed_at TIMESTAMPTZ,
  times_confirmed INTEGER DEFAULT 0,

  UNIQUE(user_id, preference_type, preference_key)
);

-- Indexes
CREATE INDEX idx_customer_preferences_user ON customer_preferences(user_id);
CREATE INDEX idx_customer_preferences_type ON customer_preferences(user_id, preference_type);
CREATE INDEX idx_customer_preferences_confidence ON customer_preferences(user_id, confidence DESC);

-- Enable RLS
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own preferences" ON customer_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON customer_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON customer_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences" ON customer_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER customer_preferences_updated_at
  BEFORE UPDATE ON customer_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SHOPPING_PATTERNS TABLE
-- Tracks behavioral patterns
-- ============================================
CREATE TABLE shopping_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Pattern details
  pattern_type VARCHAR(50) NOT NULL CHECK (pattern_type IN ('time_of_day', 'day_of_week', 'frequency', 'basket_size', 'category_preference')),
  pattern_key VARCHAR(255),
  pattern_value JSONB,
  confidence DECIMAL(3,2) DEFAULT 0.50 CHECK (confidence >= 0.00 AND confidence <= 1.00),

  -- Statistics
  occurrence_count INTEGER DEFAULT 1,
  last_occurrence TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, pattern_type, pattern_key)
);

-- Indexes
CREATE INDEX idx_shopping_patterns_user ON shopping_patterns(user_id);
CREATE INDEX idx_shopping_patterns_type ON shopping_patterns(user_id, pattern_type);
CREATE INDEX idx_shopping_patterns_occurrence ON shopping_patterns(user_id, last_occurrence DESC);

-- Enable RLS
ALTER TABLE shopping_patterns ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own patterns" ON shopping_patterns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patterns" ON shopping_patterns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patterns" ON shopping_patterns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own patterns" ON shopping_patterns
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER shopping_patterns_updated_at
  BEFORE UPDATE ON shopping_patterns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- INTERACTION_HISTORY TABLE
-- Logs specific interactions
-- ============================================
CREATE TABLE interaction_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Interaction details
  interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('question', 'search', 'view_item', 'swap', 'reject_swap', 'voice_used', 'feature_used')),
  interaction_key VARCHAR(255),
  interaction_value JSONB,

  -- Context
  session_id UUID,
  message_id VARCHAR(255),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_interaction_history_user ON interaction_history(user_id, created_at DESC);
CREATE INDEX idx_interaction_history_type ON interaction_history(user_id, interaction_type);
CREATE INDEX idx_interaction_history_session ON interaction_history(session_id);

-- Enable RLS
ALTER TABLE interaction_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own interactions" ON interaction_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions" ON interaction_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions" ON interaction_history
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- MEMORY_INSIGHTS TABLE
-- High-level insights derived from data
-- ============================================
CREATE TABLE memory_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Insight details
  insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('persona', 'goal', 'context', 'constraint')),
  insight_key VARCHAR(255) NOT NULL,
  insight_value TEXT NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 0.50 CHECK (confidence >= 0.00 AND confidence <= 1.00),

  -- Evidence
  supporting_data JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,

  UNIQUE(user_id, insight_type, insight_key)
);

-- Indexes
CREATE INDEX idx_memory_insights_user ON memory_insights(user_id);
CREATE INDEX idx_memory_insights_type ON memory_insights(user_id, insight_type);
CREATE INDEX idx_memory_insights_confidence ON memory_insights(user_id, confidence DESC);
CREATE INDEX idx_memory_insights_expires ON memory_insights(expires_at) WHERE expires_at IS NOT NULL;

-- Enable RLS
ALTER TABLE memory_insights ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own insights" ON memory_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights" ON memory_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" ON memory_insights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights" ON memory_insights
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER memory_insights_updated_at
  BEFORE UPDATE ON memory_insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to upsert preferences (insert or update confidence)
CREATE OR REPLACE FUNCTION upsert_preference(
  p_user_id UUID,
  p_type VARCHAR,
  p_key VARCHAR,
  p_confidence DECIMAL DEFAULT 0.50,
  p_reason TEXT DEFAULT NULL,
  p_source VARCHAR DEFAULT 'inferred'
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
  v_existing_confidence DECIMAL;
BEGIN
  -- Check if preference exists
  SELECT id, confidence INTO v_id, v_existing_confidence
  FROM customer_preferences
  WHERE user_id = p_user_id AND preference_type = p_type AND preference_key = p_key;

  IF v_id IS NULL THEN
    -- Insert new preference
    INSERT INTO customer_preferences (user_id, preference_type, preference_key, confidence, reason, source)
    VALUES (p_user_id, p_type, p_key, p_confidence, p_reason, p_source)
    RETURNING id INTO v_id;
  ELSE
    -- Update existing preference (increase confidence, max 0.95)
    UPDATE customer_preferences
    SET
      confidence = LEAST(0.95, GREATEST(v_existing_confidence, p_confidence)),
      reason = COALESCE(p_reason, reason),
      last_confirmed_at = NOW(),
      times_confirmed = times_confirmed + 1,
      updated_at = NOW()
    WHERE id = v_id;
  END IF;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update shopping patterns
CREATE OR REPLACE FUNCTION update_pattern(
  p_user_id UUID,
  p_type VARCHAR,
  p_key VARCHAR,
  p_value JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
  v_count INTEGER;
BEGIN
  -- Check if pattern exists
  SELECT id, occurrence_count INTO v_id, v_count
  FROM shopping_patterns
  WHERE user_id = p_user_id AND pattern_type = p_type AND pattern_key = p_key;

  IF v_id IS NULL THEN
    -- Insert new pattern
    INSERT INTO shopping_patterns (user_id, pattern_type, pattern_key, pattern_value)
    VALUES (p_user_id, p_type, p_key, p_value)
    RETURNING id INTO v_id;
  ELSE
    -- Update existing pattern
    UPDATE shopping_patterns
    SET
      occurrence_count = v_count + 1,
      last_occurrence = NOW(),
      pattern_value = COALESCE(p_value, pattern_value),
      confidence = LEAST(0.95, 0.50 + (v_count * 0.03)), -- Increase confidence with occurrences
      updated_at = NOW()
    WHERE id = v_id;
  END IF;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record interaction
CREATE OR REPLACE FUNCTION record_interaction(
  p_user_id UUID,
  p_type VARCHAR,
  p_key VARCHAR DEFAULT NULL,
  p_value JSONB DEFAULT NULL,
  p_session_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO interaction_history (user_id, interaction_type, interaction_key, interaction_value, session_id)
  VALUES (p_user_id, p_type, p_key, p_value, p_session_id)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to fetch high-confidence preferences for prompt injection
CREATE OR REPLACE FUNCTION fetch_memory_context(
  p_user_id UUID,
  p_min_confidence DECIMAL DEFAULT 0.70
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
          'times_confirmed', times_confirmed
        )
        ORDER BY confidence DESC, times_confirmed DESC
      ) as pref_items
    FROM customer_preferences
    WHERE user_id = p_user_id AND confidence >= p_min_confidence
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
-- CLEANUP FUNCTIONS
-- ============================================

-- Function to clean up expired insights (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_insights()
RETURNS INTEGER AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM memory_insights
  WHERE expires_at IS NOT NULL AND expires_at < NOW();

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Function to archive old interactions (run periodically)
-- This would move data to an archive table (not created here)
CREATE OR REPLACE FUNCTION cleanup_old_interactions(
  p_months_old INTEGER DEFAULT 12
)
RETURNS INTEGER AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM interaction_history
  WHERE created_at < NOW() - INTERVAL '1 month' * p_months_old;

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE USAGE
-- ============================================
-- Example queries to test the memory system

-- 1. Upsert a preference
-- SELECT upsert_preference(
--   'USER_UUID',
--   'dietary',
--   'vegetarian',
--   0.90,
--   'User never orders meat products',
--   'inferred'
-- );

-- 2. Update a pattern
-- SELECT update_pattern(
--   'USER_UUID',
--   'time_of_day',
--   'evening',
--   '{"range": "18:00-21:00"}'::jsonb
-- );

-- 3. Record an interaction
-- SELECT record_interaction(
--   'USER_UUID',
--   'view_item',
--   'milk-whole-gal',
--   '{"name": "Whole Milk", "price": 3.48}'::jsonb
-- );

-- 4. Fetch memory context for prompt
-- SELECT * FROM fetch_memory_context('USER_UUID', 0.70);

-- 5. View all preferences for a user
-- SELECT * FROM customer_preferences
-- WHERE user_id = 'USER_UUID'
-- ORDER BY confidence DESC, times_confirmed DESC;
