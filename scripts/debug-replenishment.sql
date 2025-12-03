-- Debug: Check orders and replenishment data
-- Run this in Supabase SQL Editor

-- 1. Check total orders
SELECT COUNT(*) as total_orders FROM orders;

-- 2. Check order structure (see first order)
SELECT
  id,
  user_id,
  created_at,
  total,
  status,
  jsonb_array_length(items) as item_count,
  items
FROM orders
ORDER BY created_at DESC
LIMIT 3;

-- 3. Check for items purchased multiple times (needed for replenishment)
SELECT
  item->>'sku' as sku,
  item->>'name' as name,
  COUNT(*) as purchase_count,
  MIN(created_at) as first_purchase,
  MAX(created_at) as last_purchase,
  EXTRACT(DAY FROM (MAX(created_at) - MIN(created_at))) as days_between
FROM orders,
LATERAL jsonb_array_elements(items) as item
GROUP BY item->>'sku', item->>'name'
HAVING COUNT(*) >= 2
ORDER BY purchase_count DESC;

-- 4. Check for blank/duplicate orders
SELECT
  created_at,
  total,
  status,
  jsonb_array_length(items) as item_count
FROM orders
WHERE total = 0 OR items IS NULL OR jsonb_array_length(items) = 0
ORDER BY created_at DESC;
