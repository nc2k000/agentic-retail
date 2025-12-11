-- AI Decision Trees Cache Table
-- Stores AI-generated decision trees with expiration

CREATE TABLE IF NOT EXISTS public.ai_decision_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Category identifier
  category TEXT NOT NULL,

  -- Tree definition (JSON)
  tree_definition JSONB NOT NULL,

  -- Catalog snapshot at generation time
  catalog_snapshot JSONB,

  -- Generation metadata
  generation_metadata JSONB NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,

  -- Index on category for fast lookups
  CONSTRAINT unique_active_tree_per_category UNIQUE (category, expires_at)
);

-- Index for finding active trees by category
CREATE INDEX idx_ai_decision_trees_category_expires
  ON public.ai_decision_trees (category, expires_at DESC)
  WHERE expires_at > now();

-- Index for cleanup of expired trees
CREATE INDEX idx_ai_decision_trees_expires
  ON public.ai_decision_trees (expires_at)
  WHERE expires_at <= now();

-- Enable Row Level Security
ALTER TABLE public.ai_decision_trees ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active (non-expired) trees
CREATE POLICY "Anyone can read active decision trees"
  ON public.ai_decision_trees
  FOR SELECT
  USING (expires_at > now());

-- Policy: Service role can insert/update trees
CREATE POLICY "Service role can manage decision trees"
  ON public.ai_decision_trees
  FOR ALL
  USING (auth.role() = 'service_role');

-- Function to cleanup expired trees (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_decision_trees()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.ai_decision_trees
  WHERE expires_at <= now() - INTERVAL '7 days'; -- Keep expired trees for 7 days for debugging

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.ai_decision_trees IS
  'Caches AI-generated decision trees for product categories. Trees expire and are regenerated periodically.';

COMMENT ON COLUMN public.ai_decision_trees.category IS
  'Product category this tree is for (e.g., "Beverages", "Dairy & Eggs")';

COMMENT ON COLUMN public.ai_decision_trees.tree_definition IS
  'Complete decision tree structure including questions, options, and filters';

COMMENT ON COLUMN public.ai_decision_trees.catalog_snapshot IS
  'Snapshot of catalog state when tree was generated (product count, sample products)';

COMMENT ON COLUMN public.ai_decision_trees.generation_metadata IS
  'Metadata about tree generation (processing time, attributes analyzed, confidence score, model used)';

COMMENT ON COLUMN public.ai_decision_trees.expires_at IS
  'When this tree expires and should be regenerated';
