-- Fix: Ambiguous column reference in fetch_memory_context
-- Replace the function with corrected version

DROP FUNCTION IF EXISTS fetch_memory_context(UUID, DECIMAL);

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
      ) as pref_items  -- Renamed from 'items' to avoid ambiguity
    FROM customer_preferences
    WHERE user_id = p_user_id
      AND confidence >= p_min_confidence
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
      ) as insight_items  -- Renamed from 'items' to avoid ambiguity
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

COMMENT ON FUNCTION fetch_memory_context IS 'Fetch memory context for AI prompt injection - Fixed ambiguous column reference';
