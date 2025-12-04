# Manual Test Scenarios - Complete App Testing

**Date:** December 3, 2024
**Purpose:** Comprehensive manual testing for all features including new Weather & Recipe integrations
**Estimated Time:** 60-90 minutes for full suite

---

## 🧪 Test Environment Setup

**Prerequisites:**
- [ ] Browser: Chrome, Firefox, Safari, or Edge
- [ ] Device: Desktop + Mobile (iPhone/Android)
- [ ] Network: Stable internet connection
- [ ] Account: Clean test account OR willingness to reset data

**URLs:**
- **Production:** https://agentic-retail.vercel.app
- **Local:** http://localhost:3001

---

## Part 1: New Features Testing (Weather & Recipe)

### Test 1.1: Weather Integration - First Load
**Time:** 3 minutes

**Steps:**
1. Open https://agentic-retail.vercel.app/chat in **incognito mode**
2. Observe browser permission prompt for location
3. Click **Allow**
4. Open DevTools → Console tab

**✅ Expected Results:**
- Location permission requested
- No console errors related to weather
- Page loads normally
- Chat interface functional

**❌ Failure Signs:**
- Console error: "Geolocation not supported"
- Console error: "Weather API error"
- Page freeze or crash

**Pass/Fail:** ___________

---

### Test 1.2: Weather Integration - Cold Weather Suggestions
**Time:** 2 minutes
**Prerequisite:** Test 1.1 passed, location allowed

**Steps:**
1. Wait 5 seconds after page load (weather fetches in background)
2. Type in chat: "What should I make for dinner tonight?"
3. Send message

**✅ Expected Results (if cold < 60°F):**
- Claude mentions comfort food, soups, or warm meals
- Suggestions include hot beverages or hearty dishes
- Weather context used naturally (not forced)

**✅ Expected Results (if hot > 75°F):**
- Claude suggests salads, cold drinks, light meals
- May mention BBQ or outdoor items
- Refreshing/cooling foods prioritized

**Pass/Fail:** ___________
**Notes:** ________________________________

---

### Test 1.3: Weather Integration - Graceful Degradation
**Time:** 2 minutes

**Steps:**
1. Open https://agentic-retail.vercel.app/chat in **new incognito window**
2. When location permission prompt appears, click **Block** or **Deny**
3. Type: "Help me plan dinner"
4. Send message

**✅ Expected Results:**
- Chat works normally
- No error message shown to user
- Console shows warning: "Geolocation permission denied" (acceptable)
- Claude provides recommendations (without weather context)

**Pass/Fail:** ___________

---

### Test 1.4: Recipe Import - URL Method
**Time:** 4 minutes

**Steps:**
1. Look for green "🍳" button (floating, bottom-right corner)
2. Click the button
3. Modal should open with "Import Recipe" title
4. Verify 3 tabs visible: URL, Image, Text
5. Stay on **URL** tab
6. Paste this URL: `https://www.allrecipes.com/recipe/12409/apple-crisp-ii/`
7. Click "Import Recipe" button
8. Wait for Claude's response

**✅ Expected Results:**
- Modal opens smoothly
- Tabs are clickable and styled correctly
- URL input accepts paste
- "Import Recipe" button enables when URL present
- Modal closes after clicking import
- Chat shows message about extracting ingredients
- Claude creates a shop block with apple crisp ingredients
- Items matched to catalog (apples, butter, sugar, cinnamon, etc.)

**Pass/Fail:** ___________
**Ingredients Found:** ___________

---

### Test 1.5: Recipe Import - Image Upload
**Time:** 5 minutes

**Steps:**
1. Click "🍳 Import Recipe" button
2. Switch to **Image** tab
3. Click the upload area or drag/drop an image
4. Upload: Screenshot of a recipe (from phone, Pinterest, Instagram, etc.)
5. Verify image preview appears
6. Click "Import Recipe"
7. Wait for Claude Vision to analyze

**✅ Expected Results:**
- File picker opens
- Image preview displays after upload
- Import button enables
- Modal closes after import
- Claude analyzes image and extracts ingredients
- Shop block created with matched items
- If recipe isn't clear in image, Claude explains what it found/couldn't find

**Pass/Fail:** ___________
**Quality of Extraction:** ___________

---

### Test 1.6: Recipe Import - Text Paste
**Time:** 3 minutes

**Steps:**
1. Click "🍳 Import Recipe"
2. Switch to **Text** tab
3. Copy and paste this ingredient list:
```
Chocolate Chip Cookies

2 cups all-purpose flour
1 teaspoon baking soda
1/2 teaspoon salt
1 cup butter, softened
3/4 cup white sugar
3/4 cup brown sugar
2 eggs
1 teaspoon vanilla extract
2 cups chocolate chips
```
4. Click "Import Recipe"

**✅ Expected Results:**
- Text area accepts paste
- Line breaks preserved
- Import button enables
- Claude parses ingredients
- Shop block created with flour, sugar, butter, eggs, vanilla, chocolate chips
- Quantities and units preserved where possible

**Pass/Fail:** ___________

---

### Test 1.7: Recipe + Dietary Preferences
**Time:** 4 minutes
**Prerequisite:** Have vegetarian preference set in profile OR set now

**Steps:**
1. (If needed) Go to `/profile`, add vegetarian dietary preference
2. Click "🍳 Import Recipe"
3. Paste a meat-based recipe URL or text:
```
Grilled Chicken Recipe
- 2 chicken breasts
- 1 tbsp olive oil
- Salt and pepper
- Garlic powder
```
4. Import the recipe

**✅ Expected Results:**
- Claude recognizes dietary restriction
- Suggests vegetarian alternatives ("substitute chicken with tofu/tempeh")
- Respects user's preferences in recommendations
- May create shop block with vegetarian substitutes

**Pass/Fail:** ___________

---

## Part 2: Core Features Regression Testing

### Test 2.1: New User Onboarding (FTUX)
**Time:** 8 minutes

**Steps:**
1. Open https://agentic-retail.vercel.app in **incognito mode**
2. Click "Sign Up"
3. Create new account: test+[timestamp]@example.com
4. Check email for confirmation
5. Click confirmation link
6. Complete onboarding flow:
   - Screen 1: Welcome, click "Get Started"
   - Screen 2: Enter name
   - Screen 3: Household size (select 2-4)
   - Screen 4: Add household member (name, age, dietary)
   - Screen 5: Add pet (optional, or skip)
   - Screen 6: Your dietary preferences & allergies
   - Screen 7: Brand preferences
7. Click "Start Shopping"

**✅ Expected Results:**
- Sign up works without errors
- Email confirmation arrives
- Onboarding flow is smooth, one screen at a time
- Can skip optional sections
- Chip selections work (guided UI)
- Progress indicator updates
- After completion, redirects to `/chat`
- Welcome screen shows personalized greeting with your name

**Pass/Fail:** ___________
**Issues:** ________________________________

---

### Test 2.2: Chat - Basic Conversation
**Time:** 3 minutes

**Steps:**
1. In chat, type: "I need milk"
2. Send message
3. Observe response

**✅ Expected Results:**
- Claude suggests 1-2 milk options
- Shop block appears with milk products
- Includes whole milk, 2%, skim, or alternatives
- Prices and images (emojis) shown
- Can add to cart from shop block

**Pass/Fail:** ___________

---

### Test 2.3: Chat - Weekly Groceries (Mission Detection)
**Time:** 5 minutes

**Steps:**
1. Type: "Help me build my weekly grocery list"
2. Send message
3. Answer any questions Claude asks
4. Review the shop block

**✅ Expected Results:**
- Claude asks 1-2 questions (household size, preferences)
- Builds comprehensive list (15-30 items)
- Items organized by category (Dairy, Produce, Meat, etc.)
- Respects dietary preferences from profile
- Includes variety and staples
- Suggests savings opportunities

**Pass/Fail:** ___________
**Item Count:** ___________

---

### Test 2.4: High Consideration Shopping (TV Purchase)
**Time:** 6 minutes

**Steps:**
1. Type: "I need a new TV"
2. Send message
3. Answer Claude's questions ONE AT A TIME:
   - Room size/viewing distance
   - Budget
   - Features needed (4K, OLED, etc.)
   - Use case (gaming, movies, etc.)
4. Review the compare block

**✅ Expected Results:**
- Claude asks sequential questions (not all at once)
- Shows 3-4 TV options in compare block format
- Includes:
  - Product name, price, image
  - Highlights (key features)
  - "Best for" recommendation
  - One marked as "recommended"
- Recommendation matches Claude's reasoning in text

**Pass/Fail:** ___________

---

### Test 2.5: Outcome Basket (Birthday Party)
**Time:** 5 minutes

**Steps:**
1. Type: "I'm planning a birthday party for my 7-year-old"
2. Send message
3. Answer Claude's questions about:
   - Number of attendees
   - Theme (if asked)
   - Dietary restrictions

**✅ Expected Results:**
- Claude asks sequential questions
- Infers categories needed (cake, decorations, party favors, snacks, drinks)
- Builds complete shopping list organized by category
- Comprehensive solution in single view
- Age-appropriate suggestions

**Pass/Fail:** ___________

---

### Test 2.6: Cart Management
**Time:** 5 minutes

**Steps:**
1. Ask for "weekly groceries" to get a shop block
2. Click "Add to Cart" on 3-5 items
3. Click cart icon (top-right)
4. Cart sidebar opens
5. Increase quantity of one item (+)
6. Decrease quantity of another (-)
7. Remove one item (trash icon)
8. Close cart (X button)

**✅ Expected Results:**
- Items add to cart successfully
- Cart count updates in header
- Quantity changes work
- Remove item works
- Total recalculates correctly
- Bulk discounts auto-apply if applicable
- Cart persists when closing sidebar

**Pass/Fail:** ___________

---

### Test 2.7: Bulk Deals
**Time:** 4 minutes

**Steps:**
1. Ask: "Add milk to my cart"
2. Claude should suggest milk
3. Add 1 milk to cart
4. Open cart
5. Look for bulk deal notification

**✅ Expected Results:**
- Bulk deal badge visible ("Buy 2, save $1.00")
- Can click to increase quantity to 2
- Price updates to bulk deal price
- Savings shown
- Total reflects discount

**Pass/Fail:** ___________

---

### Test 2.8: Savings / Swap Suggestions
**Time:** 4 minutes

**Steps:**
1. Add 5-6 branded items to cart (Kraft, Chobani, etc.)
2. Open cart sidebar
3. Click "Find Savings" button
4. Wait for savings to load

**✅ Expected Results:**
- "Finding savings..." loading state appears
- Savings display inline in cart (not chat)
- Shows original item vs. replacement (Great Value/store brand)
- Savings amount per item
- Total potential savings
- Can swap individual items or all
- Swapping updates cart immediately

**Pass/Fail:** ___________
**Total Savings:** ___________

---

### Test 2.9: Replenishment Suggestions
**Time:** 5 minutes
**Prerequisite:** Have 2+ orders with overlapping items

**Steps:**
1. Complete 2 orders with milk (different dates)
2. Go to chat welcome screen (empty messages)
3. Look for "Time to Restock" section

**✅ Expected Results:**
- Replenishment section appears
- Shows items you buy regularly
- Displays cycle (e.g., "You buy this every 7 days")
- Click item → adds to cart
- Up to 3 suggestions shown

**Pass/Fail:** ___________

(If no orders, you can skip or create test orders first)

---

### Test 2.10: Checkout Flow
**Time:** 4 minutes

**Steps:**
1. Add 5+ items to cart
2. Open cart
3. Click "Checkout" button
4. Wait for confirmation

**✅ Expected Results:**
- Checkout button visible (not disabled)
- Click starts checkout process
- Order confirmation appears in chat
- Shows:
  - Order number
  - Item count
  - Total amount
  - Estimated delivery or pickup time
  - Order status: confirmed
- Cart clears after checkout
- Order appears in history (`/history` page)

**Pass/Fail:** ___________

---

### Test 2.11: Voice Input (Desktop Chrome)
**Time:** 3 minutes
**Device:** Desktop Chrome

**Steps:**
1. Click microphone icon (chat input)
2. Allow microphone permission if prompted
3. Say: "Add bread and eggs to my cart"
4. Microphone should automatically stop after silence
5. Message should appear in input field

**✅ Expected Results:**
- Microphone permission requested (first time)
- Icon shows listening state (pulsing/recording indicator)
- Speech transcribes to text
- Accuracy is reasonable
- Automatically stops after pause
- Can edit text before sending

**Pass/Fail:** ___________
**Accuracy:** Good / Fair / Poor

**Note:** Voice input NOT supported on Safari iOS (browser limitation)

---

### Test 2.12: Profile Management
**Time:** 5 minutes

**Steps:**
1. Click profile icon (top-right) or go to `/profile`
2. Review "Overview" tab:
   - Maturity score card
   - Preferences card (dietary, allergies, favorites, brands)
   - Patterns card (shopping behaviors)
3. Switch to "Household" tab
4. Click "Add Member"
5. Add a household member (name, age, dietary)
6. Click "Add Pet"
7. Add a pet (type, name)
8. Go back to "Overview"

**✅ Expected Results:**
- Profile loads without errors
- Maturity score displays (0-100)
- Preferences shown:
  - Dietary restrictions (from onboarding)
  - Allergies (if set)
  - Favorite items (from purchases)
  - Brand preferences
- Patterns show shopping behaviors (if data exists)
- Household tab shows all members and pets
- Can add/edit/remove members
- Changes save and persist

**Pass/Fail:** ___________

---

### Test 2.13: Order History
**Time:** 2 minutes

**Steps:**
1. Go to `/history` page
2. Review orders and lists

**✅ Expected Results:**
- Page loads
- Shows past orders (if any)
- Shows saved shopping lists (if any)
- Each order shows:
  - Date
  - Item count
  - Total amount
  - Items list
- Each list shows:
  - Title
  - Date created
  - Items

**Pass/Fail:** ___________

---

### Test 2.14: Mobile Responsive (iPhone/Android)
**Time:** 8 minutes
**Device:** Mobile phone

**Steps:**
1. Open https://agentic-retail.vercel.app on mobile
2. Complete sign up / log in
3. Test chat interface:
   - Type message
   - Send
   - Scroll through conversation
4. Test cart:
   - Add items
   - Open cart sidebar
   - Swipe to close (or click X)
5. Test recipe import:
   - Click "🍳" button
   - Try image upload (use phone camera)
   - Take photo of recipe or food blog on another device
6. Test profile page
7. Test voice input (if supported)

**✅ Expected Results:**
- All features accessible on mobile
- No horizontal scroll
- Touch targets 48px+ (easy to tap)
- Cart slides in smoothly
- Text inputs focus properly (keyboard doesn't cover)
- Images scale correctly
- Recipe modal fits screen
- Camera integration works for recipe photos
- Profile cards stack vertically
- All interactive elements functional

**Pass/Fail:** ___________
**Issues:** ________________________________

---

## Part 3: Integration & Edge Case Testing

### Test 3.1: Memory Integration - Allergies Respected
**Time:** 4 minutes

**Steps:**
1. Set peanut allergy in profile (if not already set)
2. Ask: "Suggest snacks for me"
3. Review suggestions

**✅ Expected Results:**
- NO peanut products suggested
- Claude may explicitly mention avoiding peanuts
- Alternatives suggested (pretzels, chips, crackers, non-peanut trail mix)
- Memory respected across all recommendations

**Pass/Fail:** ___________

---

### Test 3.2: Memory Integration - Vegetarian Respected
**Time:** 4 minutes

**Steps:**
1. Set vegetarian preference in profile
2. Ask: "Plan dinner for tonight"
3. Review suggestions

**✅ Expected Results:**
- NO meat products suggested
- Only vegetarian-appropriate items
- May suggest tofu, beans, veggie options
- If recipe includes meat, Claude substitutes

**Pass/Fail:** ___________

---

### Test 3.3: Multi-User Household
**Time:** 5 minutes

**Steps:**
1. Go to Profile → Household
2. Add member: "John (4yo, dairy allergy)"
3. Return to chat
4. Ask: "Snacks for John"

**✅ Expected Results:**
- Claude recognizes John from household
- Suggests dairy-free snacks
- Age-appropriate suggestions (4-year-old)
- Respects John's allergy

**Pass/Fail:** ___________

---

### Test 3.4: Session Persistence
**Time:** 3 minutes

**Steps:**
1. Add 3 items to cart
2. Close browser tab
3. Reopen https://agentic-retail.vercel.app
4. Check cart

**✅ Expected Results:**
- Cart items persist
- Quantities preserved
- Total correct
- Messages may not persist (chat history may clear)

**Pass/Fail:** ___________

---

### Test 3.5: Error Handling - Invalid Recipe URL
**Time:** 2 minutes

**Steps:**
1. Click "🍳 Import Recipe"
2. URL tab
3. Enter: `not-a-valid-url`
4. Try to import

**✅ Expected Results:**
- Browser validation OR
- Claude handles gracefully: "I couldn't fetch that recipe" or similar
- No app crash
- Can dismiss and retry

**Pass/Fail:** ___________

---

### Test 3.6: Error Handling - Non-Recipe Image
**Time:** 3 minutes

**Steps:**
1. Import Recipe → Image tab
2. Upload random non-food image (landscape, selfie, etc.)
3. Import

**✅ Expected Results:**
- Claude analyzes image
- Response: "I couldn't find recipe ingredients in this image" or similar
- Graceful handling
- No crash

**Pass/Fail:** ___________

---

### Test 3.7: Empty Cart Checkout
**Time:** 1 minute

**Steps:**
1. Clear cart (remove all items)
2. Open cart
3. Try to click "Checkout"

**✅ Expected Results:**
- Checkout button disabled (grayed out)
- Cannot click
- OR shows message "Cart is empty"

**Pass/Fail:** ___________

---

### Test 3.8: Concurrent Users (Optional)
**Time:** 5 minutes
**Prerequisite:** 2 browsers or incognito + regular

**Steps:**
1. Log in as User A in Chrome
2. Log in as User B in Firefox (or incognito)
3. Both add items to cart
4. Both checkout

**✅ Expected Results:**
- Each user has independent cart
- No data leakage between users
- Orders save to correct user account
- No conflicts

**Pass/Fail:** ___________

---

## Part 4: Performance & Polish

### Test 4.1: Page Load Speed
**Time:** 2 minutes

**Steps:**
1. Open DevTools → Network tab
2. Hard refresh page (Cmd+Shift+R or Ctrl+Shift+R)
3. Note "Load" time in Network tab bottom bar

**✅ Expected Results:**
- Page loads in < 5 seconds
- Chat interface appears < 3 seconds
- No prolonged white screen

**Time to Interactive:** ___________
**Pass/Fail:** ___________

---

### Test 4.2: Message Response Time
**Time:** 3 minutes

**Steps:**
1. Type: "Weekly groceries"
2. Note time before sending
3. Send
4. Note time when response starts appearing
5. Note time when response completes

**✅ Expected Results:**
- First token in < 2 seconds
- Streaming response visible
- Full response in < 10 seconds
- No hanging or timeout

**Time to First Token:** ___________
**Total Response Time:** ___________
**Pass/Fail:** ___________

---

### Test 4.3: Console Errors
**Time:** 2 minutes

**Steps:**
1. Open DevTools → Console
2. Perform 5-6 different actions:
   - Send message
   - Add to cart
   - Open cart
   - Import recipe
   - Go to profile
3. Check console for errors

**✅ Expected Results:**
- No red errors
- Warnings acceptable (API, deprecations, etc.)
- No "undefined" or "null" errors
- No network failures (404, 500)

**Errors Found:** ___________
**Pass/Fail:** ___________

---

## 🎯 Test Summary

**Date Tested:** ___________
**Tester:** ___________
**Environment:** Production / Local
**Browser:** ___________
**Device:** Desktop / Mobile

### Results Overview

| Category | Tests | Passed | Failed | Skipped |
|----------|-------|--------|--------|---------|
| New Features (Weather & Recipe) | 7 | ___ | ___ | ___ |
| Core Features | 14 | ___ | ___ | ___ |
| Integration & Edge Cases | 8 | ___ | ___ | ___ |
| Performance | 3 | ___ | ___ | ___ |
| **TOTAL** | **32** | ___ | ___ | ___ |

### Pass Rate: _____ %

---

## 🐛 Bugs Found

| Test # | Issue Description | Severity | Steps to Reproduce |
|--------|-------------------|----------|-------------------|
| | | | |
| | | | |
| | | | |

**Severity Levels:**
- **Critical:** App crash, data loss, security issue
- **High:** Feature doesn't work, blocks user flow
- **Medium:** Feature works but with issues, workaround exists
- **Low:** UI glitch, minor annoyance

---

## ✅ Sign-Off

**Tested By:** ___________
**Date:** ___________
**Approved for Production:** Yes / No / With Fixes

**Notes:**
_________________________________________
_________________________________________
_________________________________________

