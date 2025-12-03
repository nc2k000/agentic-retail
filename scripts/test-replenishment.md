# Testing Replenishment Reminders

## What Replenishment Does
- Analyzes your order history
- Calculates average days between purchases for each item
- Shows "Time to restock" when items are 90% through their cycle
- Displays on the welcome screen (before you start chatting)

## How to Test

### Option 1: Check Current State
1. **Go to the homepage** (before sending any messages)
2. Look for a **"🔄 Time to restock"** section above the quick actions
3. If you see items there, replenishment is working!

### Option 2: Create Test Orders
To test replenishment, you need at least 2 orders with the same item:

1. **First Order (Day 1):**
   ```
   Add milk and eggs to my cart
   ```
   Then checkout

2. **Wait or manually update database** (orders need to be different days)

3. **Second Order (Day 8):**
   ```
   Add milk and eggs to my cart
   ```
   Then checkout

4. **Result:** System learns you buy milk/eggs every ~7 days

5. **Third Order (Day 15+):**
   Go to homepage → Should see "Time to restock milk and eggs"

### What You'll See
When replenishment suggestions exist:
- **Location:** Welcome screen (top, before quick actions)
- **Style:** Blue box with 🔄 icon
- **Content:**
  - Item name and image
  - Message: "You usually buy this every 7 days. Time to restock?"
  - Price
  - Clickable to add to cart
- **Limit:** Shows top 3, with "+X more" button if more exist

## Technical Details

### Calculation Logic
```typescript
// For each item you've purchased at least twice:
const purchases = orders.filter(has item)
const intervals = daysBetween(each purchase)
const avgCycle = average(intervals)

// Triggers when:
daysSinceLastPurchase >= avgCycle * 0.9
```

### Example
- Buy milk on Jan 1
- Buy milk on Jan 8 (7 days later)
- Buy milk on Jan 15 (7 days later)
- Average cycle: 7 days
- On Jan 21 (6 days since last): No reminder yet (6 < 7 * 0.9)
- On Jan 22 (7 days since last): Reminder appears! (7 >= 7 * 0.9)

## Debug: Check Orders

To see your current orders and test if you have enough data:
1. Go to `/history` in the app
2. Check the "Orders" tab
3. Need at least 2 orders with same items to calculate cycles

## Database Schema
```sql
-- Orders table structure
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  items JSONB, -- Array of cart items with SKUs
  total DECIMAL,
  created_at TIMESTAMP
);

-- Query to check replenishment data
SELECT
  item->>'sku' as sku,
  item->>'name' as name,
  COUNT(*) as purchase_count,
  MAX(created_at) as last_purchase
FROM orders,
LATERAL jsonb_array_elements(items) as item
WHERE user_id = 'YOUR_USER_ID'
GROUP BY item->>'sku', item->>'name'
HAVING COUNT(*) >= 2;
```
