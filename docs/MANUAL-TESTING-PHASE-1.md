# Manual Testing Guide - Phase 1 Features

**Version:** 1.0
**Date:** December 3, 2024
**Testing Time:** ~30-40 minutes for full suite

---

## Prerequisites

1. **Deploy Status:** Check that Vercel deployment succeeded
2. **Browser:** Chrome/Safari with DevTools open (Console tab)
3. **Account:** Use a test account or create a new one
4. **Clear Data:** Start fresh - clear `sessionStorage` before each test suite

**Clear Session Storage:**
```javascript
// In browser console:
sessionStorage.clear()
location.reload()
```

---

## Test Suite 1: Funnel Detection System

### Objective
Verify that the system tracks customer journey stages and transitions correctly.

### Setup
1. Clear session storage
2. Navigate to `/chat`
3. Open browser console
4. Run: `console.log('Funnel State:', sessionStorage.getItem('funnel-state'))`

---

### Test 1.1: Funnel Initialization
**Expected:** Funnel state initializes on first visit

**Steps:**
1. Load `/chat` page (first time)
2. In console, run:
   ```javascript
   JSON.parse(sessionStorage.getItem('funnel-state'))
   ```

**Expected Result:**
```javascript
{
  stage: "arriving",
  enteredAt: "2024-12-03T...",
  actions: [],
  itemsViewed: 0,
  itemsAdded: 0,
  questionsAsked: 0
}
```

✅ **Pass Criteria:** `stage` is `"arriving"`, all counters are 0

---

### Test 1.2: Transition to "Browsing" Stage
**Expected:** After first message, stage transitions to "browsing"

**Steps:**
1. Send any message (e.g., "Hi")
2. Wait for AI response
3. In console, check:
   ```javascript
   JSON.parse(sessionStorage.getItem('funnel-state')).stage
   ```

**Expected Result:** `"browsing"`

✅ **Pass Criteria:** Stage changed from "arriving" to "browsing" after first message

---

### Test 1.3: Transition to "Decided" Stage
**Expected:** Adding item to cart transitions to "decided"

**Steps:**
1. Send message: "I need milk and eggs"
2. Wait for AI to create shopping list
3. Click "Add to Cart" button on any item
4. Check funnel state:
   ```javascript
   const state = JSON.parse(sessionStorage.getItem('funnel-state'))
   console.log('Stage:', state.stage)
   console.log('Items Added:', state.itemsAdded)
   ```

**Expected Result:**
- `stage`: `"decided"`
- `itemsAdded`: `1` (or more)

✅ **Pass Criteria:** Stage is "decided" and itemsAdded counter incremented

---

### Test 1.4: Transition to "Checkout" Stage
**Expected:** Initiating checkout transitions to "checkout"

**Steps:**
1. Have items in cart (from Test 1.3)
2. Open cart sidebar
3. Click "Checkout" button
4. Check funnel state:
   ```javascript
   JSON.parse(sessionStorage.getItem('funnel-state')).stage
   ```

**Expected Result:** `"checkout"`

✅ **Pass Criteria:** Stage is "checkout"

---

### Test 1.5: Funnel Context in AI Prompt
**Expected:** AI behavior adapts to funnel stage

**Steps:**
1. Clear session and reload
2. Stage: **Arriving** - Send: "Hi"
   - **Expected AI Tone:** Welcoming, friendly greeting
3. Stage: **Browsing** - Send: "I need groceries"
   - **Expected AI Tone:** Helpful, asks about needs
4. Stage: **Decided** (add items to cart) - Send: "Should I checkout?"
   - **Expected AI Tone:** Reassuring, encourages completion

✅ **Pass Criteria:** AI tone/verbosity changes appropriately per stage

---

## Test Suite 2: Verbosity Control System

### Objective
Verify that the system learns communication preferences from user behavior.

### Setup
1. Clear session storage
2. Navigate to `/chat`
3. Open browser console

---

### Test 2.1: Verbosity Initialization
**Expected:** Verbosity defaults to "balanced"

**Steps:**
1. Load `/chat` (fresh session)
2. In console:
   ```javascript
   JSON.parse(sessionStorage.getItem('verbosity-preference'))
   ```

**Expected Result:**
```javascript
{
  verbosity: "balanced",
  confidence: 0.5,
  learnedFrom: "behavior",
  updatedAt: "2024-12-03T..."
}
```

✅ **Pass Criteria:** Default is "balanced" with 0.5 confidence

---

### Test 2.2: Quick Add Detection (→ Concise)
**Expected:** Multiple quick adds lead to "concise" preference

**Steps:**
1. Send 6 quick messages:
   - "add milk"
   - "get eggs"
   - "add bread"
   - "get cheese"
   - "add butter"
   - "get yogurt"

2. Check preference:
   ```javascript
   JSON.parse(sessionStorage.getItem('verbosity-preference'))
   ```

**Expected Result:**
- `verbosity`: `"concise"`
- `confidence`: > 0.5 (increases with more quick adds)

✅ **Pass Criteria:** Preference changed to "concise" after pattern detected

---

### Test 2.3: Question Detection (→ Detailed)
**Expected:** Multiple questions lead to "detailed" preference

**Steps:**
1. Clear session and reload
2. Send 6 questions:
   - "What milk brands do you have?"
   - "Which eggs are organic?"
   - "How much is whole wheat bread?"
   - "What's the difference between cheddar and swiss?"
   - "Do you have lactose-free options?"
   - "What are your recommendations for breakfast?"

3. Check preference:
   ```javascript
   JSON.parse(sessionStorage.getItem('verbosity-preference'))
   ```

**Expected Result:**
- `verbosity`: `"detailed"`
- `confidence`: > 0.5

✅ **Pass Criteria:** Preference changed to "detailed" after asking questions

---

### Test 2.4: Verbosity Context in AI Responses
**Expected:** AI response length matches learned preference

**Steps:**
1. **Concise Mode Test:**
   - Follow Test 2.2 steps (quick adds)
   - Send: "tell me about milk"
   - **Expected:** 1-2 sentence response, very brief

2. **Detailed Mode Test:**
   - Follow Test 2.3 steps (questions)
   - Send: "tell me about milk"
   - **Expected:** Comprehensive response with nutritional info, options, reasoning

3. **Balanced Mode Test:**
   - Clear session (defaults to balanced)
   - Send: "tell me about milk"
   - **Expected:** Moderate response, helpful but not overwhelming

✅ **Pass Criteria:** AI response length clearly differs between modes

---

### Test 2.5: Verbosity Persistence in Database
**Expected:** Preference saved to `customer_preferences` table

**Steps:**
1. Trigger verbosity learning (complete Test 2.2 or 2.3)
2. Go to Supabase dashboard
3. Query `customer_preferences`:
   ```sql
   SELECT * FROM customer_preferences
   WHERE user_id = 'YOUR_USER_ID'
   AND preference_type = 'communication_style'
   ORDER BY updated_at DESC
   LIMIT 1;
   ```

**Expected Result:**
- Row exists with `preference_type = 'communication_style'`
- `preference_key` is "concise", "balanced", or "detailed"
- `confidence` score between 0.5-1.0
- `reason` describes behavior pattern

✅ **Pass Criteria:** Database row created with correct preference

---

## Test Suite 3: Memory Management UI

### Objective
Verify that users can view, filter, and delete stored preferences.

### Setup
1. Have some test data in your profile (from previous tests)
2. Navigate to `/profile`

---

### Test 3.1: Access Memory Management Modal
**Expected:** Modal opens from profile page

**Steps:**
1. Go to `/profile`
2. Click "Overview" tab (should be default)
3. Click "🧠 Manage My Memory" button

**Expected Result:**
- Modal opens with title "Your Memory"
- Shows subtitle: "View and manage what I've learned about your preferences"
- Filter tabs visible: All, Dietary, Allergy, Brand, Favorite, Communication

✅ **Pass Criteria:** Modal opens, UI renders correctly

---

### Test 3.2: View All Memories
**Expected:** All stored preferences displayed

**Steps:**
1. Open memory modal (Test 3.1)
2. Ensure "All" filter is selected
3. Observe displayed memories

**Expected Result:**
- Each memory shows:
  - Icon (emoji) for type
  - Preference key (e.g., "milk", "vegan", "concise")
  - Source badge: "You told me" (green) or "Learned from behavior" (blue)
  - Confidence percentage
  - Reason/explanation text
  - Times confirmed (if > 1)
  - Updated date
  - Delete button (red trash icon)

✅ **Pass Criteria:** Memories display with all metadata

---

### Test 3.3: Filter Memories by Type
**Expected:** Filtering works correctly

**Steps:**
1. Open memory modal
2. Click each filter tab:
   - **Dietary** → Shows only dietary preferences
   - **Allergy** → Shows only allergies
   - **Brand** → Shows only brand preferences
   - **Favorite** → Shows only favorite items
   - **Communication** → Shows only verbosity preference

**Expected Result:**
- Only matching memories shown for selected filter
- Count badges show correct numbers: `Brand (3)`, `Favorite (5)`, etc.
- Empty state shown if no memories of that type

✅ **Pass Criteria:** Each filter shows only relevant memories

---

### Test 3.4: Delete a Memory
**Expected:** Memory deleted from UI and database

**Steps:**
1. Open memory modal
2. Select a test memory to delete (e.g., a favorite item)
3. Click red trash icon
4. Click "OK" on confirmation dialog
5. Observe UI update
6. Verify in Supabase:
   ```sql
   SELECT * FROM customer_preferences
   WHERE id = 'DELETED_MEMORY_ID';
   ```

**Expected Result:**
- Confirmation dialog appears: "Are you sure you want to delete this memory: [key]?"
- After confirming:
  - Memory immediately removed from UI
  - No page reload required
  - Database row deleted (query returns 0 rows)

✅ **Pass Criteria:** Memory deleted from both UI and database

---

### Test 3.5: Empty State Display
**Expected:** Helpful message when no memories exist

**Steps:**
1. Open memory modal
2. Click filter tab with no data (e.g., "Allergy" if you have none)

**Expected Result:**
- Brain emoji 🧠 displayed
- Text: "No memories found"
- Button: "View all memories"

✅ **Pass Criteria:** Empty state shows appropriate message

---

### Test 3.6: Memory Modal Close
**Expected:** Modal closes cleanly

**Steps:**
1. Open memory modal
2. Test all close methods:
   - Click X button (top right)
   - Click backdrop (dark area outside modal)
   - Press Escape key

**Expected Result:**
- Modal closes
- Profile page still visible behind
- No errors in console

✅ **Pass Criteria:** All close methods work

---

## Test Suite 4: Integration Tests

### Objective
Verify that all three systems work together correctly.

---

### Test 4.1: Full Journey - Arriving → Checkout
**Expected:** Funnel tracks complete shopping journey

**Steps:**
1. Clear session, start fresh
2. Stage: **Arriving** - Send: "Hello"
3. Stage: **Browsing** - Send: "I need breakfast items"
4. Wait for shopping list
5. Stage: **Decided** - Add 2-3 items to cart
6. Stage: **Checkout** - Click checkout button
7. Check final funnel state:
   ```javascript
   const state = JSON.parse(sessionStorage.getItem('funnel-state'))
   console.log('Final Stage:', state.stage)
   console.log('Total Actions:', state.actions.length)
   ```

**Expected Result:**
- `stage`: `"checkout"`
- `actions`: Array with all actions recorded
- `itemsAdded`: Matches cart additions

✅ **Pass Criteria:** Complete journey tracked correctly

---

### Test 4.2: Verbosity + Funnel Interaction
**Expected:** Both systems work independently

**Steps:**
1. Build "concise" preference (Test 2.2)
2. Add items to cart (transition to "decided")
3. Send: "Should I buy more?"
4. Observe AI response

**Expected Result:**
- AI response is brief (concise mode)
- AI encourages completion (decided stage)
- Both contexts applied correctly

✅ **Pass Criteria:** AI behavior reflects both systems

---

### Test 4.3: Memory Deletion Impact
**Expected:** Deleting preference affects AI immediately

**Steps:**
1. Build dietary preference (e.g., send "I'm vegan" to AI)
2. Verify AI suggests vegan products
3. Go to profile → Manage Memory
4. Delete "vegan" preference
5. Return to chat
6. Send: "What milk should I buy?"

**Expected Result:**
- Before deletion: AI only suggests vegan milk
- After deletion: AI suggests all milk types (dairy + plant-based)

✅ **Pass Criteria:** Deletion immediately impacts AI suggestions

---

### Test 4.4: Memory Persistence Across Sessions
**Expected:** Preferences persist after closing browser

**Steps:**
1. Build preferences (verbosity + add favorites)
2. Note current state
3. Close browser completely
4. Reopen and navigate to `/chat`
5. Check session storage (will be empty)
6. Send a message
7. Go to Profile → Manage Memory

**Expected Result:**
- Session storage resets (funnel + verbosity)
- Database-stored preferences still visible in memory UI
- AI still uses stored preferences from database

✅ **Pass Criteria:** Database preferences persist across sessions

---

## Test Suite 5: Error Cases

### Objective
Verify graceful handling of edge cases.

---

### Test 5.1: Rapid Actions
**Expected:** System handles rapid user actions

**Steps:**
1. Send 5 messages rapidly (< 2 seconds apart)
2. Quickly add 3 items to cart
3. Check funnel state

**Expected Result:**
- No errors in console
- All actions recorded
- Counters accurate

✅ **Pass Criteria:** No crashes, state consistent

---

### Test 5.2: Memory Load Failure
**Expected:** Modal shows error state gracefully

**Steps:**
1. Open browser DevTools → Network tab
2. Go offline (disable network)
3. Navigate to `/profile`
4. Click "Manage My Memory"

**Expected Result:**
- Loading state shown
- After timeout: "Failed to load memories" or similar
- No React errors

✅ **Pass Criteria:** Graceful degradation

---

### Test 5.3: Invalid Funnel Data
**Expected:** System recovers from corrupted session storage

**Steps:**
1. In console, corrupt funnel data:
   ```javascript
   sessionStorage.setItem('funnel-state', 'INVALID_JSON')
   ```
2. Reload page
3. Check funnel state

**Expected Result:**
- System detects invalid data
- Initializes fresh funnel state
- No errors thrown

✅ **Pass Criteria:** Recovery from corruption

---

## Reporting Template

After completing tests, fill out:

```markdown
## Test Results - Phase 1

**Tester:** [Your Name]
**Date:** [Date]
**Environment:** [Production / Staging]
**Browser:** [Chrome 120 / Safari 17, etc.]

### Funnel Detection System
- Test 1.1: ✅ / ❌
- Test 1.2: ✅ / ❌
- Test 1.3: ✅ / ❌
- Test 1.4: ✅ / ❌
- Test 1.5: ✅ / ❌

### Verbosity Control System
- Test 2.1: ✅ / ❌
- Test 2.2: ✅ / ❌
- Test 2.3: ✅ / ❌
- Test 2.4: ✅ / ❌
- Test 2.5: ✅ / ❌

### Memory Management UI
- Test 3.1: ✅ / ❌
- Test 3.2: ✅ / ❌
- Test 3.3: ✅ / ❌
- Test 3.4: ✅ / ❌
- Test 3.5: ✅ / ❌
- Test 3.6: ✅ / ❌

### Integration Tests
- Test 4.1: ✅ / ❌
- Test 4.2: ✅ / ❌
- Test 4.3: ✅ / ❌
- Test 4.4: ✅ / ❌

### Error Cases
- Test 5.1: ✅ / ❌
- Test 5.2: ✅ / ❌
- Test 5.3: ✅ / ❌

### Issues Found
[List any bugs, unexpected behavior, or UX issues]

### Overall Status
✅ Ready for Production / ⚠️ Needs Fixes / ❌ Major Issues
```

---

## Quick Debug Commands

Run these in browser console for quick debugging:

```javascript
// View current funnel state
console.log('Funnel:', JSON.parse(sessionStorage.getItem('funnel-state')))

// View verbosity preference
console.log('Verbosity:', JSON.parse(sessionStorage.getItem('verbosity-preference')))

// Reset funnel
sessionStorage.removeItem('funnel-state')

// Reset verbosity
sessionStorage.removeItem('verbosity-preference')

// Clear all session data
sessionStorage.clear()

// Check memory context being sent to AI
// (look in Network tab → /api/chat → Request Payload → system)
```

---

## Expected Testing Time

- **Suite 1 (Funnel):** 10 minutes
- **Suite 2 (Verbosity):** 10 minutes
- **Suite 3 (Memory UI):** 10 minutes
- **Suite 4 (Integration):** 8 minutes
- **Suite 5 (Error Cases):** 5 minutes

**Total:** ~40 minutes for comprehensive testing

---

## Success Criteria

Phase 1 is **production-ready** if:
- ✅ All funnel transitions work (Suite 1)
- ✅ Verbosity learning works (Suite 2)
- ✅ Memory UI functional (Suite 3)
- ✅ Systems integrate correctly (Suite 4)
- ✅ No critical errors (Suite 5)

---

**Next Steps After Testing:**
1. Document any issues found
2. Create bug tickets for fixes needed
3. If all tests pass → Ready for Phase 2!
