# Phase 1: Decision Tree Test Criteria

**Date:** December 7, 2025

**Purpose:** Verify product caching works across all high-consideration verticals

---

## Test Setup

### Prerequisites
1. Dev server running at http://localhost:3000
2. Logged in to application
3. Browser console open (F12) to see logs
4. Terminal visible to see server logs

### General Success Criteria

For EACH vertical, you need to verify:

✅ **Tree Detection** - Decision tree triggers correctly
✅ **Product Display** - 4-8 products shown in carousel
✅ **Product Save** - Products saved to database
✅ **Mission Resumption** - EXACT same products on second search
✅ **Console Logs** - All expected logs appear

---

## Vertical 1: Coffee Machines ☕

### Test Queries (Pick One)

**Initial Search:**
- "I need a coffee machine"
- "Looking for a coffee maker"
- "I want to buy an espresso machine"
- "Help me find a coffee machine"

**Resumption Search:**
- "I need a coffee machine again"
- "Still looking for that coffee maker"
- "Coffee machine recommendation"

### Step-by-Step Test

**RUN 1: Initial Search**

1. **Clear Browser:**
   - Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
   - Clear any existing chat messages

2. **Send Initial Query:**
   - Type: "I need a coffee machine"
   - Press Enter

3. **Verify Tree Detection (Server Console):**
   ```
   🌲 Step 6: Tree detection result: {
     treeId: 'coffee-machine-purchase',
     treeName: 'Find Your Perfect Coffee Machine'
   }
   ✅ TREE MATCH FOUND! Intercepting request
   ```

4. **Complete Decision Tree:**
   - Answer all quiz questions
   - Submit final answers

5. **Verify Products Displayed:**
   - Look for carousel with 4-8 coffee machines
   - Note the exact products shown:
     - [ ] Product 1: ___________________ (Price: $_______)
     - [ ] Product 2: ___________________ (Price: $_______)
     - [ ] Product 3: ___________________ (Price: $_______)
     - [ ] Product 4: ___________________ (Price: $_______)

6. **Verify Product Save (Browser Console):**
   ```
   💾 Saving carousel products to mission: {
     treeId: 'coffee-machine-purchase',
     skuCount: 4,
     skus: ['coffee-xxx', 'coffee-yyy', ...]
   }
   ✅ Carousel products saved successfully
   ```

7. **Record SKUs from Console:**
   - SKU 1: ___________________
   - SKU 2: ___________________
   - SKU 3: ___________________
   - SKU 4: ___________________

---

**RUN 2: Mission Resumption**

1. **Hard Refresh Browser:**
   - Cmd+Shift+R / Ctrl+Shift+R
   - This simulates abandonment + return

2. **Send Resumption Query:**
   - Type: "I need a coffee machine again"
   - Press Enter

3. **Verify Tree Detection:**
   ```
   🌲 Tree detection result: { treeId: 'coffee-machine-purchase', ... }
   ⏭️ Tree match found BUT completed mission exists - letting Claude handle resumption
   ```

4. **Verify Hard Block (Server Console):**
   ```
   🛑 BLOCKING rank_products - Cached products exist in system prompt
      Returning 4 cached products: coffee-xxx, coffee-yyy, ...
   ```

5. **Verify Carousel Enrichment (Browser Console):**
   ```
   🔄 Enriching carousel block with SKUs: ['coffee-xxx', 'coffee-yyy', ...]
      ✅ Enriched 4 products from 4 SKUs
   ```

6. **Verify EXACT Same Products:**
   - Compare products with Run 1:
     - [ ] Product 1 MATCHES Run 1 (same name, same price)
     - [ ] Product 2 MATCHES Run 1 (same name, same price)
     - [ ] Product 3 MATCHES Run 1 (same name, same price)
     - [ ] Product 4 MATCHES Run 1 (same name, same price)
     - [ ] Same order as Run 1

7. **Record SKUs from Console:**
   - SKU 1: ___________________ (should match Run 1)
   - SKU 2: ___________________ (should match Run 1)
   - SKU 3: ___________________ (should match Run 1)
   - SKU 4: ___________________ (should match Run 1)

### Success Checklist

- [ ] Tree detected correctly
- [ ] Decision tree displayed
- [ ] 4-8 coffee machines shown in carousel
- [ ] Products saved to database (console confirms)
- [ ] Hard refresh worked
- [ ] Mission resumption detected
- [ ] Hard block triggered (rank_products blocked)
- [ ] Carousel enrichment ran
- [ ] EXACT same products in Run 2
- [ ] Same prices in Run 2
- [ ] Same order in Run 2

---

## Vertical 2: Paint 🎨

### Test Queries (Pick One)

**Initial Search:**
- "I need paint for my bedroom"
- "Looking for interior paint"
- "I want to buy paint"
- "Help me choose paint"

**Resumption Search:**
- "Still need that paint"
- "Paint recommendation again"
- "Looking for paint"

### Special Focus: Color Variance

**CRITICAL:** Paint is the ultimate test of SKU precision because colors matter!

Example products you might see:
- Behr Premium Plus Flat - **Ultra Pure White**
- Behr Premium Plus Flat - **Swiss Coffee**
- Sherwin-Williams Cashmere Flat - **Repose Gray**

**The Test:** If Run 1 shows "Ultra Pure White" and Run 2 shows "Swiss Coffee", the caching FAILED. Colors must match EXACTLY.

### Step-by-Step Test

**RUN 1: Initial Search**

1. **Clear Browser** (Hard refresh)

2. **Send Initial Query:**
   - Type: "I need paint for my bedroom"

3. **Verify Tree Detection:**
   ```
   🌲 Tree detection result: {
     treeId: 'paint-purchase',
     treeName: 'Find Your Perfect Paint'
   }
   ```

4. **Complete Decision Tree:**
   - Answer questions about room type, finish, color preference

5. **Verify Products Displayed:**
   - **RECORD EXACT COLOR NAMES:**
     - [ ] Product 1: ___________________ - **Color: ___________________**
     - [ ] Product 2: ___________________ - **Color: ___________________**
     - [ ] Product 3: ___________________ - **Color: ___________________**
     - [ ] Product 4: ___________________ - **Color: ___________________**

6. **Verify Product Save:**
   ```
   💾 Saving carousel products to mission: {
     treeId: 'paint-purchase',
     skuCount: 4,
     skus: ['paint-xxx', 'paint-yyy', ...]
   }
   ```

7. **Record SKUs (including color in name):**
   - SKU 1: ___________________
   - SKU 2: ___________________
   - SKU 3: ___________________
   - SKU 4: ___________________

---

**RUN 2: Mission Resumption**

1. **Hard Refresh Browser**

2. **Send Resumption Query:**
   - Type: "Still need that paint"

3. **Verify Hard Block:**
   ```
   🛑 BLOCKING rank_products - Cached products exist
      Returning 4 cached products: paint-xxx, paint-yyy, ...
   ```

4. **Verify Carousel Enrichment:**
   ```
   🔄 Enriching carousel block with SKUs: ['paint-xxx', 'paint-yyy', ...]
      ✅ Enriched 4 products from 4 SKUs
   ```

5. **Verify EXACT Same Paint Colors:**
   - **CRITICAL CHECK - Colors must match EXACTLY:**
     - [ ] Product 1 - Color MATCHES Run 1: ___________________
     - [ ] Product 2 - Color MATCHES Run 1: ___________________
     - [ ] Product 3 - Color MATCHES Run 1: ___________________
     - [ ] Product 4 - Color MATCHES Run 1: ___________________

6. **Verify Same Finishes:**
   - [ ] Finish types match (Flat/Eggshell/Satin/Semi-Gloss)

### Success Checklist

- [ ] Tree detected correctly
- [ ] Paint-specific decision tree displayed
- [ ] 4-8 paint products shown
- [ ] **COLOR NAMES recorded accurately**
- [ ] Products saved to database
- [ ] Mission resumption detected
- [ ] Hard block triggered
- [ ] **EXACT same colors in Run 2** (CRITICAL!)
- [ ] Same finishes in Run 2
- [ ] Same prices in Run 2
- [ ] Same order in Run 2

---

## Vertical 3: Mattresses 🛏️

### Test Queries (Pick One)

**Initial Search:**
- "I need a new mattress"
- "Looking for a queen mattress"
- "Help me buy a mattress"
- "I need a bed"

**Resumption Search:**
- "Still need that mattress"
- "Mattress recommendation again"
- "Looking for a mattress"

### Step-by-Step Test

**RUN 1: Initial Search**

1. **Clear Browser** (Hard refresh)

2. **Send Initial Query:**
   - Type: "I need a new mattress"

3. **Verify Tree Detection:**
   ```
   🌲 Tree detection result: {
     treeId: 'mattress-purchase',
     treeName: 'Find Your Perfect Mattress'
   }
   ```

4. **Complete Decision Tree:**
   - Answer questions about size, firmness, budget

5. **Verify Products Displayed:**
   - Record mattress details:
     - [ ] Product 1: ___________________ Size: _____ Type: _____
     - [ ] Product 2: ___________________ Size: _____ Type: _____
     - [ ] Product 3: ___________________ Size: _____ Type: _____
     - [ ] Product 4: ___________________ Size: _____ Type: _____

6. **Verify Product Save:**
   ```
   💾 Saving carousel products to mission: {
     treeId: 'mattress-purchase',
     skuCount: 4,
     skus: ['mattress-xxx', 'mattress-yyy', ...]
   }
   ```

7. **Record SKUs:**
   - SKU 1: ___________________
   - SKU 2: ___________________
   - SKU 3: ___________________
   - SKU 4: ___________________

---

**RUN 2: Mission Resumption**

1. **Hard Refresh Browser**

2. **Send Resumption Query:**
   - Type: "Still need that mattress"

3. **Verify Hard Block:**
   ```
   🛑 BLOCKING rank_products - Cached products exist
      Returning 4 cached products: mattress-xxx, mattress-yyy, ...
   ```

4. **Verify Carousel Enrichment:**
   ```
   🔄 Enriching carousel block with SKUs: ['mattress-xxx', ...]
      ✅ Enriched 4 products from 4 SKUs
   ```

5. **Verify EXACT Same Mattresses:**
   - [ ] Product 1 MATCHES (same size, type, price)
   - [ ] Product 2 MATCHES (same size, type, price)
   - [ ] Product 3 MATCHES (same size, type, price)
   - [ ] Product 4 MATCHES (same size, type, price)
   - [ ] Same order as Run 1

### Success Checklist

- [ ] Tree detected correctly
- [ ] Mattress decision tree displayed
- [ ] 4-8 mattresses shown
- [ ] Sizes recorded (Twin/Full/Queen/King)
- [ ] Types recorded (Innerspring/Memory Foam/Hybrid)
- [ ] Products saved to database
- [ ] Mission resumption detected
- [ ] Hard block triggered
- [ ] EXACT same mattresses in Run 2
- [ ] Same sizes in Run 2
- [ ] Same types in Run 2
- [ ] Same prices in Run 2

---

## Vertical 4: Power Tools 🔧

### Test Queries (Pick One)

**Initial Search:**
- "I need a drill"
- "Looking for a power drill"
- "Help me buy power tools"
- "I need a cordless drill"

**Resumption Search:**
- "Still need that drill"
- "Drill recommendation again"
- "Looking for a drill"

### Step-by-Step Test

**RUN 1: Initial Search**

1. **Clear Browser** (Hard refresh)

2. **Send Initial Query:**
   - Type: "I need a drill"

3. **Verify Tree Detection:**
   ```
   🌲 Tree detection result: {
     treeId: 'power-tool-purchase',
     treeName: 'Find Your Perfect Power Tool'
   }
   ```

4. **Complete Decision Tree:**
   - Answer questions about use case, power source, budget

5. **Verify Products Displayed:**
   - Record tool details:
     - [ ] Product 1: ___________________ Brand: _____ Voltage: _____
     - [ ] Product 2: ___________________ Brand: _____ Voltage: _____
     - [ ] Product 3: ___________________ Brand: _____ Voltage: _____
     - [ ] Product 4: ___________________ Brand: _____ Voltage: _____

6. **Verify Product Save:**
   ```
   💾 Saving carousel products to mission: {
     treeId: 'power-tool-purchase',
     skuCount: 4,
     skus: ['drill-xxx', 'drill-yyy', ...]
   }
   ```

7. **Record SKUs:**
   - SKU 1: ___________________
   - SKU 2: ___________________
   - SKU 3: ___________________
   - SKU 4: ___________________

---

**RUN 2: Mission Resumption**

1. **Hard Refresh Browser**

2. **Send Resumption Query:**
   - Type: "Still need that drill"

3. **Verify Hard Block:**
   ```
   🛑 BLOCKING rank_products - Cached products exist
      Returning 4 cached products: drill-xxx, drill-yyy, ...
   ```

4. **Verify Carousel Enrichment:**
   ```
   🔄 Enriching carousel block with SKUs: ['drill-xxx', ...]
      ✅ Enriched 4 products from 4 SKUs
   ```

5. **Verify EXACT Same Tools:**
   - [ ] Product 1 MATCHES (same brand, voltage, price)
   - [ ] Product 2 MATCHES (same brand, voltage, price)
   - [ ] Product 3 MATCHES (same brand, voltage, price)
   - [ ] Product 4 MATCHES (same brand, voltage, price)
   - [ ] Same order as Run 1

### Success Checklist

- [ ] Tree detected correctly
- [ ] Power tool decision tree displayed
- [ ] 4-8 drills/tools shown
- [ ] Brands recorded (DeWalt/Ryobi/Milwaukee/etc)
- [ ] Voltages/specs recorded
- [ ] Products saved to database
- [ ] Mission resumption detected
- [ ] Hard block triggered
- [ ] EXACT same tools in Run 2
- [ ] Same brands in Run 2
- [ ] Same specs in Run 2
- [ ] Same prices in Run 2

---

## Common Issues & Debugging

### Issue: Tree Not Triggering

**Symptoms:**
- No tree detection logs in console
- Claude responds with normal text instead of tree

**Check:**
1. Search query includes trigger keywords
2. Server logs show tree detection attempt
3. No existing completed mission for this tree

**Fix:**
- Try more explicit query: "I need a [product]"
- Check `detectTreeQuery` function in route.ts

---

### Issue: Products Not Saving

**Symptoms:**
- No "💾 Saving carousel products" log
- Console shows `savedProducts: 0`

**Check:**
1. Active mission exists (tree was triggered)
2. Carousel block was returned (not compare block)
3. Carousel has `items` array with SKU field

**Fix:**
- Check browser console for save attempt
- Check network tab for `/api/missions` POST request
- Verify carousel block format in Claude response

---

### Issue: Different Products on Resumption

**Symptoms:**
- Run 2 shows different products than Run 1
- No hard block logs

**Check:**
1. System prompt includes cached SKUs
2. Hard block string matches: `**Saved Product SKUs:**`
3. Mission was saved successfully in Run 1

**Fix:**
- Check server logs for hard block trigger
- Verify mission in database has `recommended_products`
- Check system prompt includes mission context

---

### Issue: Enrichment Failing

**Symptoms:**
- "Error: No products to display"
- Console shows enrichment but 0 products found

**Check:**
1. SKUs exist in catalog
2. Catalog imported correctly
3. Product lookup working

**Fix:**
- Verify SKUs in database match catalog SKUs
- Check `getAllProducts()` returns products
- Test SKU lookup: `catalog.find(p => p.sku === 'test-sku')`

---

## Database Verification

After each test, verify mission in database:

### Using Supabase Dashboard

1. Go to Supabase → Table Editor
2. Open `missions` table
3. Find row where `tree_id` matches your test
4. Verify:
   - `completed: true`
   - `recommended_products: ["sku1", "sku2", ...]`
   - SKUs match console logs

### Using SQL Query

```sql
SELECT
  id,
  tree_id,
  completed,
  recommended_products,
  created_at,
  updated_at
FROM missions
WHERE tree_id = 'coffee-machine-purchase'  -- or paint-purchase, etc.
ORDER BY created_at DESC
LIMIT 1;
```

---

## Final Verification Matrix

After testing all 4 verticals, verify:

| Vertical | Tree Detection | Products Display | Save Working | Resumption Working | Color/Spec Match |
|----------|---------------|------------------|--------------|-------------------|------------------|
| ☕ Coffee Machines | [ ] | [ ] | [ ] | [ ] | N/A |
| 🎨 Paint | [ ] | [ ] | [ ] | [ ] | [ ] |
| 🛏️ Mattresses | [ ] | [ ] | [ ] | [ ] | [ ] |
| 🔧 Power Tools | [ ] | [ ] | [ ] | [ ] | [ ] |

---

## Success Criteria Summary

**ALL 4 verticals must pass:**

✅ Tree detection works
✅ Decision tree displays
✅ Products show in carousel
✅ Products save to database
✅ Hard refresh doesn't lose state
✅ Mission resumption detected
✅ Hard block triggers
✅ Carousel enrichment runs
✅ **EXACT same products returned**
✅ **Same prices**
✅ **Same order**
✅ **(Paint only) Same colors**

---

## Reporting Results

After testing, create a summary:

**Date Tested:** _______________

**Results:**
- Coffee Machines: ✅ PASS / ❌ FAIL (Notes: _______________)
- Paint: ✅ PASS / ❌ FAIL (Notes: _______________)
- Mattresses: ✅ PASS / ❌ FAIL (Notes: _______________)
- Power Tools: ✅ PASS / ❌ FAIL (Notes: _______________)

**Overall Status:** ✅ READY FOR PRODUCTION / ❌ NEEDS FIXES

**Next Steps:**
- [ ] Document any failures
- [ ] Fix issues found
- [ ] Re-test failed verticals
- [ ] Update Phase 1 documentation
- [ ] Prepare for production deployment
