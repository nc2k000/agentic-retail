-- Debug Memory System Test Results
-- Run these queries in Supabase SQL Editor to check what got recorded

-- STEP 1: Get your user ID (copy this for other queries)
SELECT id, email, name FROM profiles LIMIT 5;

-- Replace 'YOUR_USER_ID' in queries below with your actual user ID

-------------------------------------------------------------------
-- TEST 1: Check if Tide Pods was recorded as favorite
-------------------------------------------------------------------
SELECT
  preference_type,
  preference_key,
  confidence,
  times_confirmed,
  reason,
  source,
  created_at
FROM customer_preferences
WHERE user_id = 'YOUR_USER_ID'
  AND preference_type = 'favorite'
ORDER BY created_at DESC;

-- Expected: Should see an entry with preference_key like 'tide-pods-...'
-- If missing: Favorite detection didn't trigger
-- If confidence < 0.70: Won't appear in memory context

-------------------------------------------------------------------
-- TEST 2: Check if cart additions were tracked
-------------------------------------------------------------------
SELECT
  interaction_type,
  interaction_key,
  interaction_value,
  created_at
FROM interaction_history
WHERE user_id = 'YOUR_USER_ID'
  AND interaction_type = 'view_item'
ORDER BY created_at DESC
LIMIT 20;

-- Expected: Should see 3+ entries with interaction_key = 'tide-pods-...'
-- This proves addToCart function is recording interactions

-------------------------------------------------------------------
-- TEST 3: Check shopping patterns from checkout
-------------------------------------------------------------------
SELECT
  pattern_type,
  pattern_key,
  pattern_value,
  confidence,
  occurrence_count,
  last_occurrence
FROM shopping_patterns
WHERE user_id = 'YOUR_USER_ID'
ORDER BY updated_at DESC;

-- Expected patterns:
-- - time_of_day: 'morning', 'afternoon', 'evening', or 'night'
-- - day_of_week: current day (e.g., 'tuesday')
-- - basket_size: 'small', 'medium', 'large', or 'bulk'
-- - category_preference: Multiple rows for each category purchased

-------------------------------------------------------------------
-- TEST 4: Check dietary preferences
-------------------------------------------------------------------
SELECT
  preference_type,
  preference_key,
  confidence,
  reason,
  source,
  times_confirmed
FROM customer_preferences
WHERE user_id = 'YOUR_USER_ID'
  AND preference_type IN ('dietary', 'allergy')
ORDER BY preference_type, confidence DESC;

-- Expected:
-- - dietary: vegetarian (confidence: 1.0, source: explicit)
-- - allergy: peanuts (confidence: 1.0, source: explicit)

-------------------------------------------------------------------
-- TEST 5: Check memory context (what AI actually sees)
-------------------------------------------------------------------
SELECT * FROM fetch_memory_context('YOUR_USER_ID', 0.70);

-- This is what gets injected into AI prompts
-- Should return rows grouped by category (dietary, allergy, favorite, brand)
-- Each row has 'category' and 'items' (JSONB array)

-------------------------------------------------------------------
-- TEST 6: All preferences overview
-------------------------------------------------------------------
SELECT
  preference_type,
  COUNT(*) as count,
  AVG(confidence) as avg_confidence
FROM customer_preferences
WHERE user_id = 'YOUR_USER_ID'
GROUP BY preference_type;

-- Shows breakdown of what's been learned

-------------------------------------------------------------------
-- DIAGNOSIS: Why Tide Pods wasn't suggested
-------------------------------------------------------------------

-- Possible Issue 1: Tide Pods never became a favorite
-- Check if quantity threshold was reached:
SELECT
  interaction_key,
  COUNT(*) as view_count,
  jsonb_agg(interaction_value) as details
FROM interaction_history
WHERE user_id = 'YOUR_USER_ID'
  AND interaction_type = 'view_item'
  AND interaction_key LIKE '%tide%'
GROUP BY interaction_key;

-- If view_count < 3: addToCart wasn't called enough times
-- If view_count >= 3 but no favorite: upsertPreference didn't trigger

-- Possible Issue 2: Favorite exists but confidence too low
SELECT * FROM customer_preferences
WHERE user_id = 'YOUR_USER_ID'
  AND preference_key LIKE '%tide%';

-- If confidence < 0.70: Won't be in memory context
-- If confidence >= 0.70: Should appear in AI recommendations

-- Possible Issue 3: Memory context not fetched
-- Check browser console for errors during chat
-- Check Network tab for /api/chat request → system field should include memory

-------------------------------------------------------------------
-- CLEANUP: Reset test data (optional)
-------------------------------------------------------------------
-- Uncomment to clear all test data and start fresh:

-- DELETE FROM interaction_history WHERE user_id = 'YOUR_USER_ID';
-- DELETE FROM shopping_patterns WHERE user_id = 'YOUR_USER_ID';
-- DELETE FROM customer_preferences WHERE user_id = 'YOUR_USER_ID';
-- DELETE FROM memory_insights WHERE user_id = 'YOUR_USER_ID';
