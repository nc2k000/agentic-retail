-- Add recommendedProducts column to missions table to cache search results
ALTER TABLE missions
ADD COLUMN IF NOT EXISTS recommended_products JSONB DEFAULT '[]'::jsonb;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_missions_recommended_products ON missions USING gin (recommended_products);

-- Comment explaining the column
COMMENT ON COLUMN missions.recommended_products IS 'Array of product SKUs recommended based on decision tree answers. Cached to show same results on mission resume.';
