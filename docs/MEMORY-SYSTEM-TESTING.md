# Memory System Testing Guide

**Status:** Phase 0 - End-to-End Testing
**Date:** December 3, 2024

This guide provides step-by-step instructions for testing the memory system implementation.

---

## Overview

The memory system passively learns from user behavior across 5 key areas:
1. **Dietary Preferences** - Detected from user messages
2. **Allergies** - Detected from explicit user statements
3. **Favorite Items** - Tracked when items added to cart 3+ times
4. **Brand Preferences** - Learned from swap acceptances
5. **Shopping Patterns** - Time of day, day of week, basket size, category preferences

---

## Pre-Test Setup

### 1. Get Your User ID

Run this in Supabase SQL Editor:

```sql
SELECT id, email, name FROM profiles LIMIT 5;
```

Copy your user ID for the queries below.

### 2. Clear Existing Test Data (Optional)

If you want to start fresh:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID
DELETE FROM interaction_history WHERE user_id = 'YOUR_USER_ID';
DELETE FROM memory_insights WHERE user_id = 'YOUR_USER_ID';
DELETE FROM shopping_patterns WHERE user_id = 'YOUR_USER_ID';
DELETE FROM customer_preferences WHERE user_id = 'YOUR_USER_ID';
```

---

## Test 1: Dietary Preference Detection

**What to Test:** AI detects dietary restrictions from natural conversation

### Steps:
1. Open the chat interface at `/chat`
2. Send message: "I'm vegetarian"
3. Wait 2 seconds for async operation
4. Verify in Supabase:

```sql
SELECT preference_type, preference_key, confidence, reason, source
FROM customer_preferences
WHERE user_id = 'YOUR_USER_ID' AND preference_type = 'dietary';
```

### Expected Result:
- One row with `preference_key = 'vegetarian'`
- `confidence = 1.0` (explicit statement)
- `source = 'explicit'`
- `reason` contains the original message

### Also Test:
- "I'm vegan"
- "I need gluten free options"
- "I follow a keto diet"

---

## Test 2: Allergy Detection

**What to Test:** AI detects and flags allergies with high priority

### Steps:
1. Send message: "I'm allergic to peanuts"
2. Wait 2 seconds
3. Verify in Supabase:

```sql
SELECT preference_type, preference_key, confidence, reason, source
FROM customer_preferences
WHERE user_id = 'YOUR_USER_ID' AND preference_type = 'allergy';
```

### Expected Result:
- One row with `preference_key = 'peanuts'`
- `confidence = 1.0`
- `source = 'explicit'`
- Allergy should appear in AI context with ⚠️ warning

### Test AI Respects Allergy:
4. Send message: "What snacks do you recommend?"
5. AI response should NOT include any peanut products
6. AI prompt includes: "⚠️ PEANUTS (CRITICAL - NEVER suggest these)"

---

## Test 3: Favorite Item Tracking

**What to Test:** Items added to cart 3+ times become favorites

### Steps:
1. Add "Great Value Whole Milk" to cart
2. Clear cart (don't checkout)
3. Add "Great Value Whole Milk" to cart again
4. Clear cart
5. Add "Great Value Whole Milk" to cart a third time
6. Wait 2 seconds
7. Verify in Supabase:

```sql
SELECT preference_type, preference_key, confidence, reason, source, times_confirmed
FROM customer_preferences
WHERE user_id = 'YOUR_USER_ID' AND preference_type = 'favorite';
```

### Expected Result:
- One row with `preference_key = 'milk-whole-gal'` (the SKU)
- `confidence >= 0.74` (0.50 + 3 * 0.08)
- `source = 'pattern'`
- `reason = 'Added to cart 3 times'`

### Also Check Interactions:
```sql
SELECT interaction_type, interaction_key, interaction_value
FROM interaction_history
WHERE user_id = 'YOUR_USER_ID' AND interaction_type = 'view_item'
ORDER BY created_at DESC
LIMIT 5;
```

Should show 3 view_item entries for milk.

---

## Test 4: Brand Preference Learning

**What to Test:** Accepting swaps learns brand preferences

### Steps:
1. Add "Great Value Bread" to cart
2. Ask AI: "Help me save money"
3. AI should suggest swap (if applicable)
4. Click "Swap" button on any savings suggestion
5. Wait 2 seconds
6. Verify in Supabase:

```sql
SELECT preference_type, preference_key, confidence, reason, source
FROM customer_preferences
WHERE user_id = 'YOUR_USER_ID' AND preference_type = 'brand';
```

### Expected Result:
- One row with extracted brand name
- `confidence = 0.65`
- `reason = 'Accepted savings swap'`
- `source = 'pattern'`

### Also Check Swap Interactions:
```sql
SELECT interaction_type, interaction_key, interaction_value
FROM interaction_history
WHERE user_id = 'YOUR_USER_ID' AND interaction_type = 'swap'
ORDER BY created_at DESC;
```

Should show swap acceptance with original and replacement SKUs.

---

## Test 5: Shopping Pattern Tracking (Checkout)

**What to Test:** Checkout tracks time, day, basket size, category preferences

### Steps:
1. Add 5-10 items to cart from different categories
2. Click "Checkout"
3. Complete checkout process
4. Wait 2 seconds
5. Verify in Supabase:

```sql
SELECT pattern_type, pattern_key, pattern_value, confidence, occurrence_count
FROM shopping_patterns
WHERE user_id = 'YOUR_USER_ID'
ORDER BY updated_at DESC;
```

### Expected Results:

**Time of Day Pattern:**
- `pattern_type = 'time_of_day'`
- `pattern_key` = one of: 'morning', 'afternoon', 'evening', 'night'
- `occurrence_count >= 1`

**Day of Week Pattern:**
- `pattern_type = 'day_of_week'`
- `pattern_key` = current day (e.g., 'tuesday')
- `occurrence_count >= 1`

**Basket Size Pattern:**
- `pattern_type = 'basket_size'`
- `pattern_key` = one of: 'small', 'medium', 'large', 'bulk'
- `pattern_value` contains `item_count` and `total`

**Category Preferences:**
- Multiple rows with `pattern_type = 'category_preference'`
- `pattern_key` = category names (e.g., 'Dairy', 'Produce', 'Bakery')
- `pattern_value` contains quantity and price

---

## Test 6: Memory Context Injection

**What to Test:** AI uses memory context in responses

### Steps:
1. Complete Tests 1-5 above to populate memory
2. Open browser DevTools console
3. Send a new chat message
4. Check the network request to `/api/chat`
5. Inspect the request payload's `system` field

### Expected Result:

The system prompt should include a section like:

```
## Customer Memory (Personalization Data)

### Dietary Preferences:
- vegetarian (confidence: 100%)

### Allergies (CRITICAL - NEVER suggest these):
- ⚠️ PEANUTS - User said: "I'm allergic to peanuts"

### Favorite Items:
- milk-whole-gal (purchased 3 times)

### Brand Preferences:
- Prefers great value (confidence: 65%)
```

### Test AI Uses Memory:
1. Ask: "What should I buy for breakfast?"
2. AI should:
   - Suggest vegetarian options only
   - NOT suggest peanut products
   - Prioritize Great Value brand
   - May suggest milk (favorite item)

---

## Test 7: Memory Context Refresh

**What to Test:** Memory refreshes after orders

### Steps:
1. Note current `orders.length` in React DevTools
2. Complete a checkout (Test 5)
3. Watch for memory context re-fetch in Network tab
4. New preferences should appear in next AI response

### Expected Result:
- `fetchMemoryContext` called after checkout
- `memoryContext` state updates with new data
- Next AI message uses updated context

---

## Test 8: RPC Functions

**What to Test:** Database functions work correctly

### Test fetch_memory_context:
```sql
SELECT * FROM fetch_memory_context('YOUR_USER_ID', 0.70);
```

**Expected Result:**
- Returns rows grouped by category (dietary, allergy, favorite, brand)
- Each row has `category` and `items` (JSONB array)
- Only preferences with confidence >= 0.70 included

### Test upsert_preference:
```sql
SELECT upsert_preference(
  'YOUR_USER_ID',
  'brand',
  'test_brand',
  0.60,
  'Manual test',
  'explicit'
);

-- Verify it was created
SELECT * FROM customer_preferences
WHERE user_id = 'YOUR_USER_ID' AND preference_key = 'test_brand';

-- Run again to test upsert (should increase confidence)
SELECT upsert_preference(
  'YOUR_USER_ID',
  'brand',
  'test_brand',
  0.70,
  'Second test',
  'explicit'
);

-- Verify confidence increased
SELECT confidence, times_confirmed FROM customer_preferences
WHERE user_id = 'YOUR_USER_ID' AND preference_key = 'test_brand';
```

**Expected Result:**
- First call creates new row with confidence 0.60
- Second call updates: confidence → 0.70, times_confirmed → 1

### Test update_pattern:
```sql
SELECT update_pattern(
  'YOUR_USER_ID',
  'time_of_day',
  'morning',
  '{"test": true}'::jsonb
);

-- Verify it was created
SELECT * FROM shopping_patterns
WHERE user_id = 'YOUR_USER_ID' AND pattern_key = 'morning';

-- Run again to test increment
SELECT update_pattern(
  'YOUR_USER_ID',
  'time_of_day',
  'morning',
  '{"test": true}'::jsonb
);

-- Verify occurrence count increased
SELECT occurrence_count FROM shopping_patterns
WHERE user_id = 'YOUR_USER_ID' AND pattern_key = 'morning';
```

**Expected Result:**
- First call: occurrence_count = 1
- Second call: occurrence_count = 2

### Test record_interaction:
```sql
SELECT record_interaction(
  'YOUR_USER_ID',
  'question',
  'test_query',
  '{"content": "test question"}'::jsonb,
  NULL
);

-- Verify it was created
SELECT * FROM interaction_history
WHERE user_id = 'YOUR_USER_ID' AND interaction_key = 'test_query'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Result:**
- New row created with all fields populated
- `created_at` is current timestamp

---

## Test 9: Row-Level Security

**What to Test:** Users can only access their own data

### Steps:
1. Get your user ID from Test 1
2. Create a second test user (or use a colleague's ID)
3. Try to query another user's data:

```sql
-- This should return empty if RLS is working
SELECT * FROM customer_preferences
WHERE user_id = 'ANOTHER_USER_ID';
```

### Expected Result:
- Query returns 0 rows (RLS blocks access)
- OR query returns data only if you're that user

**Note:** Service role key bypasses RLS. To properly test:
1. Use client-side Supabase queries (not SQL Editor)
2. Or create temporary user and test with their session token

---

## Test 10: Data Privacy

**What to Test:** Users can delete their memory

### Steps:
```sql
-- Count existing records
SELECT COUNT(*) FROM customer_preferences WHERE user_id = 'YOUR_USER_ID';
SELECT COUNT(*) FROM shopping_patterns WHERE user_id = 'YOUR_USER_ID';
SELECT COUNT(*) FROM interaction_history WHERE user_id = 'YOUR_USER_ID';

-- Delete all memories (future feature - test the queries work)
DELETE FROM interaction_history WHERE user_id = 'YOUR_USER_ID';
DELETE FROM memory_insights WHERE user_id = 'YOUR_USER_ID';
DELETE FROM shopping_patterns WHERE user_id = 'YOUR_USER_ID';
DELETE FROM customer_preferences WHERE user_id = 'YOUR_USER_ID';

-- Verify deletion
SELECT COUNT(*) FROM customer_preferences WHERE user_id = 'YOUR_USER_ID';
SELECT COUNT(*) FROM shopping_patterns WHERE user_id = 'YOUR_USER_ID';
SELECT COUNT(*) FROM interaction_history WHERE user_id = 'YOUR_USER_ID';
```

### Expected Result:
- All counts return 0 after deletion
- Foreign key cascade deletes work (no orphaned records)

---

## Verification Checklist

After completing all tests, verify:

- [ ] Dietary preferences detected from messages (Test 1)
- [ ] Allergies flagged with high confidence (Test 2)
- [ ] Favorites tracked after 3+ cart additions (Test 3)
- [ ] Brand preferences learned from swaps (Test 4)
- [ ] Shopping patterns tracked at checkout (Test 5)
- [ ] Memory context appears in AI system prompt (Test 6)
- [ ] Memory refreshes after orders (Test 7)
- [ ] All RPC functions work correctly (Test 8)
- [ ] RLS policies protect user data (Test 9)
- [ ] Privacy deletion works (Test 10)
- [ ] AI respects allergies (never suggests)
- [ ] AI uses dietary preferences (only suggests appropriate foods)
- [ ] AI prioritizes favorite items and brands
- [ ] No errors in browser console during tests
- [ ] No errors in Supabase logs during tests

---

## Performance Check

Monitor async operation performance:

```sql
-- Check average response time for memory operations
SELECT
  interaction_type,
  COUNT(*) as total,
  AVG(EXTRACT(EPOCH FROM (created_at - created_at))) as avg_seconds
FROM interaction_history
WHERE user_id = 'YOUR_USER_ID'
GROUP BY interaction_type;
```

**Expected:** All operations complete in < 100ms (async, non-blocking)

---

## Known Issues

### Issue 1: Memory Not Appearing in AI Context
**Symptom:** AI doesn't seem to use memory data
**Check:**
- Verify confidence >= 0.70 (default threshold)
- Check `memoryContext` state in React DevTools
- Verify `fetchMemoryContext` called on mount
- Check network request includes memory in system prompt

### Issue 2: Favorites Not Tracking
**Symptom:** Items added 3+ times not becoming favorites
**Check:**
- Verify `addToCart` function is being called
- Check browser console for errors
- Verify user is logged in (user.id exists)
- Check interaction_history for view_item entries

### Issue 3: Patterns Not Recording at Checkout
**Symptom:** No shopping_patterns rows after checkout
**Check:**
- Verify checkout completes successfully
- Check browser console for async errors
- Verify `handleCheckout` function includes memory calls
- Check Supabase logs for RPC errors

---

## Next Steps

After completing testing:
1. Document any bugs found → Create GitHub issues
2. Verify performance is acceptable
3. Update PROJECT-STATUS.md with test results
4. Move to Phase 1: Advanced Features (see MEMORY-SYSTEM-SCHEMA.md)
5. Consider adding memory management UI for users

---

## Quick Test Script

For rapid testing, run this SQL to populate test data:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID
DO $$
DECLARE
  v_user_id UUID := 'YOUR_USER_ID';
BEGIN
  -- Add dietary preference
  PERFORM upsert_preference(v_user_id, 'dietary', 'vegetarian', 0.95, 'Test data', 'explicit');

  -- Add allergy
  PERFORM upsert_preference(v_user_id, 'allergy', 'peanuts', 1.0, 'Test allergy', 'explicit');

  -- Add favorite
  PERFORM upsert_preference(v_user_id, 'favorite', 'milk-whole-gal', 0.85, 'Test favorite', 'pattern');

  -- Add brand preference
  PERFORM upsert_preference(v_user_id, 'brand', 'great value', 0.70, 'Test brand', 'pattern');

  -- Add shopping patterns
  PERFORM update_pattern(v_user_id, 'time_of_day', 'evening', NULL);
  PERFORM update_pattern(v_user_id, 'day_of_week', 'tuesday', NULL);
  PERFORM update_pattern(v_user_id, 'basket_size', 'medium', '{"item_count": 12}'::jsonb);

  -- Add interactions
  PERFORM record_interaction(v_user_id, 'question', 'recipe', '{"query": "pasta recipes"}'::jsonb, NULL);
  PERFORM record_interaction(v_user_id, 'view_item', 'milk-whole-gal', '{"category": "Dairy"}'::jsonb, NULL);
END $$;

-- Verify test data
SELECT 'Preferences:' as type, COUNT(*) as count FROM customer_preferences WHERE user_id = 'YOUR_USER_ID'
UNION ALL
SELECT 'Patterns:', COUNT(*) FROM shopping_patterns WHERE user_id = 'YOUR_USER_ID'
UNION ALL
SELECT 'Interactions:', COUNT(*) FROM interaction_history WHERE user_id = 'YOUR_USER_ID';

-- View memory context
SELECT * FROM fetch_memory_context('YOUR_USER_ID', 0.70);
```

This should create:
- 4 preferences (vegetarian, peanut allergy, milk favorite, great value brand)
- 3 patterns (evening, tuesday, medium basket)
- 2 interactions (question, view_item)

---

**Testing Status:** Ready for execution
**Estimated Time:** 30-45 minutes for full test suite
**Last Updated:** December 3, 2024
