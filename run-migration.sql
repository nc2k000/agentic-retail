-- Add recommended_products column to missions table
-- Run this in Supabase SQL Editor

ALTER TABLE missions
ADD COLUMN IF NOT EXISTS recommended_products JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_missions_recommended_products ON missions USING gin (recommended_products);

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'missions' AND column_name = 'recommended_products';
