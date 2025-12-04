-- Migration 003: Mission-Based Funnel System
-- Adds funnel tracking to missions and updates interaction_history constraint

-- 1. Update interaction_history to allow funnel_transition type
ALTER TABLE interaction_history
DROP CONSTRAINT IF EXISTS interaction_history_interaction_type_check;

ALTER TABLE interaction_history
ADD CONSTRAINT interaction_history_interaction_type_check
CHECK (interaction_type IN (
  'question',
  'search',
  'view_item',
  'swap',
  'reject_swap',
  'voice_used',
  'feature_used',
  'funnel_transition'
));

-- 2. Add funnel state fields to missions table
ALTER TABLE missions ADD COLUMN IF NOT EXISTS funnel_stage TEXT DEFAULT 'arriving'
  CHECK (funnel_stage IN ('arriving', 'browsing', 'comparing', 'decided', 'checkout'));

ALTER TABLE missions ADD COLUMN IF NOT EXISTS items_viewed INT DEFAULT 0;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS items_added INT DEFAULT 0;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS questions_asked INT DEFAULT 0;

-- 3. Add mission lifecycle fields
ALTER TABLE missions ADD COLUMN IF NOT EXISTS expected_next_action TEXT;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE missions ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS abandoned_at TIMESTAMPTZ;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS abandon_threshold_hours INT;

-- 4. Add mission context fields
ALTER TABLE missions ADD COLUMN IF NOT EXISTS detected_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE missions ADD COLUMN IF NOT EXISTS detection_confidence DECIMAL(3,2) DEFAULT 0.80;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;

-- 5. Set default abandon thresholds based on mission type
-- Essential shops: 12 hours
-- Recipe/Event: 7 days (168 hours)
-- Research/Precision: 7 days (168 hours)
UPDATE missions
SET abandon_threshold_hours = CASE
  WHEN type = 'essentials' THEN 12
  WHEN type IN ('recipe', 'event') THEN 168
  WHEN type IN ('research', 'precision') THEN 168
  ELSE 72 -- Default: 3 days
END
WHERE abandon_threshold_hours IS NULL;

-- 6. Create index for active mission lookups
CREATE INDEX IF NOT EXISTS idx_missions_active
ON missions(user_id, status, last_active_at)
WHERE status = 'active';

-- 7. Create index for paused mission lookups
CREATE INDEX IF NOT EXISTS idx_missions_paused
ON missions(user_id, status, paused_at)
WHERE status = 'active' AND paused_at IS NOT NULL;

-- 8. Add helper function to check if mission is abandoned
CREATE OR REPLACE FUNCTION is_mission_abandoned(mission_row missions)
RETURNS BOOLEAN AS $$
BEGIN
  -- Mission is abandoned if:
  -- 1. It's marked as abandoned
  -- 2. OR it's been inactive past its threshold
  RETURN mission_row.abandoned_at IS NOT NULL
    OR (
      mission_row.status = 'active'
      AND mission_row.last_active_at < NOW() - (mission_row.abandon_threshold_hours || ' hours')::INTERVAL
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 9. Add helper function to get active missions for user
CREATE OR REPLACE FUNCTION get_active_missions(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  query TEXT,
  type TEXT,
  funnel_stage TEXT,
  items_viewed INT,
  items_added INT,
  questions_asked INT,
  expected_next_action TEXT,
  last_active_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  hours_since_active DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.query,
    m.type,
    m.funnel_stage,
    m.items_viewed,
    m.items_added,
    m.questions_asked,
    m.expected_next_action,
    m.last_active_at,
    m.paused_at,
    EXTRACT(EPOCH FROM (NOW() - m.last_active_at)) / 3600 AS hours_since_active
  FROM missions m
  WHERE m.user_id = p_user_id
    AND m.status = 'active'
    AND NOT is_mission_abandoned(m)
  ORDER BY
    CASE WHEN m.paused_at IS NULL THEN 0 ELSE 1 END, -- Active missions first
    m.last_active_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 10. Add helper function to get paused missions needing nudge
CREATE OR REPLACE FUNCTION get_missions_for_nudge(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  query TEXT,
  type TEXT,
  funnel_stage TEXT,
  items_added INT,
  hours_since_active DECIMAL,
  should_nudge BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.query,
    m.type,
    m.funnel_stage,
    m.items_added,
    EXTRACT(EPOCH FROM (NOW() - m.last_active_at)) / 3600 AS hours_since_active,
    CASE
      -- Nudge if paused and within threshold
      WHEN m.paused_at IS NOT NULL
        AND m.last_active_at > NOW() - (m.abandon_threshold_hours || ' hours')::INTERVAL
      THEN TRUE
      ELSE FALSE
    END AS should_nudge
  FROM missions m
  WHERE m.user_id = p_user_id
    AND m.status = 'active'
    AND NOT is_mission_abandoned(m)
    AND m.paused_at IS NOT NULL
  ORDER BY m.last_active_at DESC
  LIMIT 3;
END;
$$ LANGUAGE plpgsql;

-- 11. Add comments for documentation
COMMENT ON COLUMN missions.funnel_stage IS 'Current stage in shopping journey: arriving → browsing → comparing → decided → checkout';
COMMENT ON COLUMN missions.expected_next_action IS 'What we expect user to do next (for context deviation detection)';
COMMENT ON COLUMN missions.abandon_threshold_hours IS 'Hours of inactivity before mission is considered abandoned';
COMMENT ON COLUMN missions.paused_at IS 'When mission was paused (context switch detected)';
COMMENT ON COLUMN missions.abandoned_at IS 'When mission was explicitly abandoned';

COMMENT ON FUNCTION is_mission_abandoned IS 'Check if a mission has been abandoned based on threshold';
COMMENT ON FUNCTION get_active_missions IS 'Get all active (non-abandoned) missions for a user';
COMMENT ON FUNCTION get_missions_for_nudge IS 'Get paused missions that should be nudged for resumption';
