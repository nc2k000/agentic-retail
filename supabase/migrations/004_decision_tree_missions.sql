-- Migration 004: Decision Tree Mission Tracking
-- Adds fields to track decision tree sessions in missions

-- Add decision tree tracking fields
ALTER TABLE missions ADD COLUMN IF NOT EXISTS tree_id TEXT;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS tree_answers JSONB DEFAULT '{}'::jsonb;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS tree_filters JSONB DEFAULT '{}'::jsonb;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS tree_completed BOOLEAN DEFAULT FALSE;

-- Add index for tree lookups
CREATE INDEX IF NOT EXISTS idx_missions_tree
ON missions(user_id, tree_id, status)
WHERE tree_id IS NOT NULL;

-- Add helper function to get active decision tree missions
CREATE OR REPLACE FUNCTION get_active_tree_missions(p_user_id UUID, p_tree_id TEXT)
RETURNS TABLE (
  id UUID,
  query TEXT,
  tree_id TEXT,
  tree_answers JSONB,
  tree_filters JSONB,
  tree_completed BOOLEAN,
  funnel_stage TEXT,
  last_active_at TIMESTAMPTZ,
  hours_since_active DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.query,
    m.tree_id,
    m.tree_answers,
    m.tree_filters,
    m.tree_completed,
    m.funnel_stage,
    m.last_active_at,
    EXTRACT(EPOCH FROM (NOW() - m.last_active_at)) / 3600 AS hours_since_active
  FROM missions m
  WHERE m.user_id = p_user_id
    AND m.tree_id = p_tree_id
    AND m.status = 'active'
    AND NOT is_mission_abandoned(m)
  ORDER BY m.last_active_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Add comments
COMMENT ON COLUMN missions.tree_id IS 'Decision tree ID (e.g., "tv-purchase", "appliance-purchase")';
COMMENT ON COLUMN missions.tree_answers IS 'Question/answer pairs from decision tree';
COMMENT ON COLUMN missions.tree_filters IS 'Product filters derived from tree answers';
COMMENT ON COLUMN missions.tree_completed IS 'Whether user completed the decision tree';
COMMENT ON FUNCTION get_active_tree_missions IS 'Get active decision tree mission for resumption';
