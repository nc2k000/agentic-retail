# Testing Guide - Weather & Recipe Features

## Automated Tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- **Weather Service** (`src/lib/weather/__tests__/weather.test.ts`)
  - Cold weather suggestions
  - Hot weather suggestions
  - Rainy weather suggestions
  - Seasonal suggestions
  - Prompt context formatting

- **Recipe Import Modal** (`src/components/chat/__tests__/RecipeImportModal.test.tsx`)
  - Modal open/close behavior
  - Tab switching (URL, Image, Text)
  - Input validation
  - Form submission
  - User interactions

---

## Manual Testing Guide

### 🌤️ Weather Integration Testing

#### Test 1: Location Permission & Weather Fetch
**Steps:**
1. Open https://agentic-retail.vercel.app/chat in a fresh browser session
2. Look for browser location permission prompt
3. Click "Allow"

**Expected Results:**
- Location permission requested
- No console errors
- Weather data fetched in background

**Verify in Console:**
```javascript
// Open DevTools Console
// Should NOT see: "Geolocation not supported" or "Geolocation permission denied"
```

#### Test 2: Cold Weather Suggestions
**Steps:**
1. Wait for weather to load
2. Ask: "What should I make for dinner?"

**Expected Results:**
- If temp < 50°F: Claude suggests soups, stews, comfort foods
- Response mentions warming/hot items
- Suggestions are contextually appropriate

#### Test 3: Hot Weather Suggestions
**Steps:**
1. (If testing in hot climate OR mock data)
2. Ask: "What should I buy for a BBQ?"

**Expected Results:**
- If temp > 75°F: Claude suggests salads, cold drinks, BBQ items
- Outdoor/summer items prioritized
- Refreshing/light foods mentioned

#### Test 4: Graceful Degradation
**Steps:**
1. Open chat in incognito/private mode
2. Deny location permission

**Expected Results:**
- Chat works normally
- No errors shown to user
- Console warns: "Geolocation permission denied"
- Recommendations still work (just without weather context)

---

### 🍳 Recipe Import Testing

#### Test 5: Import from URL
**Steps:**
1. Click green "🍳 Import Recipe" button (bottom-right)
2. Stay on "URL" tab
3. Paste: `https://www.allrecipes.com/recipe/12409/apple-crisp-ii/`
4. Click "Import Recipe"

**Expected Results:**
- Modal opens with 3 tabs
- URL input accepts paste
- "Import Recipe" button enabled
- Modal closes after import
- Chat shows "Extract ingredients from this recipe: [URL]"
- Claude fetches recipe and creates shopping list
- Shop block appears with matched items

**Test URLs:**
- AllRecipes: https://www.allrecipes.com/recipe/12409/apple-crisp-ii/
- Food Network: https://www.foodnetwork.com/recipes/
- Instagram post URL
- TikTok video URL

#### Test 6: Import from Image
**Steps:**
1. Click "🍳 Import Recipe"
2. Switch to "Image" tab
3. Upload screenshot of recipe (from phone, social media, etc.)
4. Click "Import Recipe"

**Expected Results:**
- File picker opens
- Image preview shows after upload
- Import button enabled
- Claude Vision analyzes image
- Ingredients extracted and matched to catalog
- Shop block created

**Test Images:**
- Recipe card screenshot
- Instagram recipe post screenshot
- TikTok recipe video thumbnail
- Handwritten recipe photo

#### Test 7: Import from Text
**Steps:**
1. Click "🍳 Import Recipe"
2. Switch to "Text" tab
3. Paste ingredients list:
```
2 cups flour
1 cup sugar
3 eggs
1/2 cup butter
1 tsp vanilla
```
4. Click "Import Recipe"

**Expected Results:**
- Text area accepts paste
- Import button enabled when text present
- Claude parses ingredients
- Items matched to catalog
- Shop block with matched products

#### Test 8: Modal Interactions
**Steps:**
1. Click "🍳 Import Recipe"
2. Test each interaction:
   - Click X button → Modal closes
   - Click Cancel → Modal closes
   - Click outside modal (dark overlay) → (Should stay open - no click-outside-to-close)
   - Press Escape key → (Not implemented yet)
3. Try submitting with empty fields

**Expected Results:**
- X and Cancel buttons work
- Empty form = Import button disabled
- UI is responsive on mobile

#### Test 9: Floating Button Hover
**Steps:**
1. On desktop, hover over "🍳" button
2. On mobile, tap button

**Expected Results:**
- Desktop: Button expands to show "Import Recipe" text
- Mobile: Tapping opens modal directly
- Button visible but not overlapping chat input
- z-index correct (appears above other elements)

---

## Integration Testing

### Test 10: Recipe + Dietary Preferences
**Prerequisite:** Set dietary restriction (e.g., vegetarian) in profile/onboarding

**Steps:**
1. Import recipe with meat (e.g., "Chicken Parmesan")
2. Click "Import Recipe"

**Expected Results:**
- Claude recognizes dietary restriction from memory
- Suggests vegetarian alternatives
- Respects allergy/dietary preferences
- Mentions substitutions in response

### Test 11: Recipe + Weather Context
**Steps:**
1. Import soup recipe on hot day (or vice versa)
2. Observe Claude's response

**Expected Results:**
- Claude may comment on weather appropriateness
- Example: "Great comfort food for this cold weather!"
- Context enhances but doesn't dominate response

### Test 12: Recipe → Cart → Checkout
**Steps:**
1. Import recipe
2. Add all items to cart
3. Review cart
4. Checkout

**Expected Results:**
- All recipe items added
- Quantities correct
- Bulk deals detected if applicable
- Checkout creates order
- Order includes recipe items

---

## Error Handling

### Test 13: Invalid URL
**Steps:**
1. Import Recipe → URL tab
2. Enter: `not-a-valid-url`
3. Try to import

**Expected Results:**
- Browser validation OR
- Claude handles gracefully: "I couldn't fetch that recipe..."

### Test 14: Invalid Image
**Steps:**
1. Import Recipe → Image tab
2. Upload non-recipe image (e.g., random photo)
3. Import

**Expected Results:**
- Claude analyzes image
- Response: "I couldn't find recipe ingredients in this image"
- No crash or error

### Test 15: Network Failure
**Steps:**
1. Open DevTools → Network tab
2. Set to "Offline"
3. Try to import recipe

**Expected Results:**
- Graceful error message
- No app crash
- User can dismiss and retry

---

## Performance Testing

### Test 16: Recipe Import Speed
**Measure:**
- URL import: Should respond within 5-10 seconds
- Image import: Should respond within 10-15 seconds (Claude Vision)
- Text import: Should respond within 3-5 seconds

### Test 17: Weather Fetch Speed
**Measure:**
- Initial load: Weather should fetch within 2-3 seconds
- Should not block chat interface loading

---

## Mobile Testing

### Test 18: Mobile Recipe Import
**Devices:** iPhone, Android

**Steps:**
1. Tap "🍳" button
2. Test all 3 input methods
3. Use camera to take photo (Image tab)

**Expected Results:**
- Button easily tappable (48px minimum)
- Modal fits screen
- Keyboard doesn't cover inputs
- Camera integration works
- Responsive on all screen sizes

### Test 19: Mobile Weather
**Steps:**
1. Open chat on mobile device
2. Allow location permission

**Expected Results:**
- Permission prompt works on mobile browsers
- Weather fetches correctly
- No performance issues

---

## Browser Compatibility

### Test 20: Cross-Browser
**Browsers:** Chrome, Firefox, Safari, Edge

**Features to Test:**
- Weather geolocation
- Recipe import modal
- Image file picker
- Text paste
- Floating button hover (desktop) / tap (mobile)

**Expected Results:**
- All features work across browsers
- UI consistent
- No browser-specific bugs

---

## Regression Testing Checklist

After deploying weather + recipe features:

- [ ] Existing chat functionality still works
- [ ] Cart still functional
- [ ] Checkout still works
- [ ] Voice input/output unaffected
- [ ] Profile page loads
- [ ] Onboarding flow works
- [ ] Memory/preferences respected
- [ ] No console errors on page load
- [ ] Mobile responsive on all pages

---

## Known Limitations

1. **Weather API**:
   - Requires geolocation permission
   - Free tier: 1000 calls/day
   - Only works with API key configured

2. **Recipe Import**:
   - URL fetching depends on site structure
   - Image analysis quality varies with image quality
   - Social media URLs may have rate limits

3. **Browser Support**:
   - Geolocation not supported on all browsers
   - File upload may vary on older browsers

---

## Debugging Tips

### Weather Not Working?
```javascript
// Check in console:
console.log('Weather API Key:', process.env.OPENWEATHER_API_KEY ? 'Set' : 'Missing')

// Check network tab for:
// - /api/weather?lat=XX&lon=XX
// - Should return 200 with weather data
```

### Recipe Import Not Working?
```javascript
// Check console for:
// - Image conversion errors
// - Fetch failures
// - Claude API errors

// Verify modal state:
// - Modal opens?
// - Input captured?
// - onImport called?
```

---

## Success Criteria

✅ **Weather Integration**:
- Fetches weather on page load
- Injects context into AI prompts
- Claude uses weather naturally
- Gracefully handles denied permission

✅ **Recipe Import**:
- All 3 input methods work (URL, Image, Text)
- Claude extracts ingredients accurately
- Items matched to 475-item catalog
- Shop blocks created correctly
- Respects dietary preferences

✅ **User Experience**:
- Fast response times
- No errors visible to users
- Mobile-friendly
- Accessible and intuitive

---

**Last Updated:** December 3, 2024
