# Phase 3B: Household Map Testing Guide

**Date:** December 5, 2024
**Status:** Ready for Testing
**Prerequisites:** Database migration must be applied first

---

## Step 1: Apply Database Migration

Before testing, you must apply the database migration to Supabase:

1. Open your Supabase project dashboard: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/004_household_map.sql`
5. Paste into the SQL Editor
6. Click **Run** to execute the migration
7. Verify success by checking for these tables:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND (table_name LIKE '%household%' OR table_name LIKE '%decision%');
   ```
   Should return:
   - `household_facts`
   - `decision_trees`
   - `decision_tree_sessions`
   - `household_map_snapshots`

---

## Step 2: Manual Testing Through UI

The household map system works in the background during normal usage. Here's how to test it:

### Test 1: Discovery from Chat Messages

1. **Log in** to the application at http://localhost:3000
2. **Navigate to Chat** (main page)
3. Send these messages one by one:

   **Message 1:** "I live in an apartment with my dog"
   - Expected: System discovers `property_type: apartment` and `has_dog: true`

   **Message 2:** "I need snacks for my baby"
   - Expected: System discovers `has_baby: true`

   **Message 3:** "I'm vegan and need groceries"
   - Expected: System discovers `dietary_preference: vegan`

4. **Check Console Logs** (in terminal running `npm run dev`):
   ```
   🔍 Discovered 2 facts for user [user_id]
      ✓ Created: property_type (confidence: 1.00)
      ✓ Created: has_dog (confidence: 1.00)
   ```

5. **View Memory Map**:
   - Navigate to http://localhost:3000/memory
   - You should see the discovered facts in the UI

---

### Test 2: Discovery from Purchases

1. **Make a Purchase** with baby products:
   - Add diapers, formula, baby food to cart
   - Complete checkout

2. **Check Console Logs** (order completion triggers discovery):
   ```
   🔍 Discovered 3 facts for user [user_id]
      ✓ Created: has_baby (confidence: 0.90)
      ✓ Updated: has_baby (confidence: 0.95)
      ✓ Created: life_stage: young_family (confidence: 0.85)
   ```

3. **View Memory Map**:
   - Navigate to http://localhost:3000/memory
   - Facts should show increased confidence if already discovered
   - New facts should appear

---

### Test 3: Property Type Inference

Test the housing diversity detection:

1. **Apartment Scenario**:
   - Purchase: Storage bins, compact organizers, space-saving furniture
   - Message: "Need ideas for my small apartment kitchen"
   - Expected: `property_type: apartment` with high confidence

2. **House with Yard Scenario**:
   - Purchase: BBQ grill, lawn mower, garden hose, patio furniture
   - Expected: `property_type: house` or `townhouse`, `has_yard: true`

3. **Garage Detection**:
   - Purchase: Car care products, garage organizers, tools
   - Expected: `has_garage: true`

4. **Pool Detection**:
   - Purchase: Pool chemicals, pool toys, pool maintenance
   - Expected: `has_pool: true`

---

### Test 4: API Endpoints (Manual)

Use browser console or Postman with authenticated session:

#### GET /api/household
Fetch complete household map:
```javascript
// Run in browser console while logged in
fetch('/api/household')
  .then(res => res.json())
  .then(data => console.log(data))
```

Expected response:
```json
{
  "success": true,
  "map": {
    "completeness": 25,
    "totalFacts": 5,
    "facts": [
      {
        "category": "physical_space",
        "factKey": "property_type",
        "factValue": "apartment",
        "confidence": 1.0,
        "dataPoints": 1
      },
      {
        "category": "pets",
        "factKey": "has_dog",
        "factValue": true,
        "confidence": 1.0,
        "dataPoints": 1
      }
      // ... more facts
    ],
    "physicalSpace": {
      "propertyType": "apartment",
      "features": []
    },
    "people": [],
    "pets": [
      {
        "type": "dog",
        "confidence": 1.0
      }
    ],
    "lifestyle": {},
    "patterns": []
  }
}
```

#### POST /api/household/discover
Manually trigger discovery:
```javascript
// Run in browser console while logged in
fetch('/api/household/discover', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'message',
    data: {
      message: 'I have two cats and a toddler',
      timestamp: new Date().toISOString()
    }
  })
})
  .then(res => res.json())
  .then(data => console.log(data))
```

Expected response:
```json
{
  "success": true,
  "discovered": 2,
  "facts": [
    {
      "factKey": "has_cat",
      "factValue": true,
      "confidence": 1.0,
      "category": "pets"
    },
    {
      "factKey": "has_toddler",
      "factValue": true,
      "confidence": 1.0,
      "category": "people"
    }
  ],
  "mapCompleteness": 30
}
```

---

## Step 3: Verify Database

Check Supabase dashboard to see stored facts:

1. Go to **Table Editor** → `household_facts`
2. You should see rows with:
   - `user_id`: Your test user ID
   - `fact_key`: `property_type`, `has_dog`, `has_baby`, etc.
   - `fact_value`: JSON values
   - `confidence`: 0.0 - 1.0
   - `supporting_evidence`: Array of evidence objects

3. Sample query:
   ```sql
   SELECT
     fact_key,
     fact_value,
     confidence,
     data_points,
     discovered_from,
     created_at
   FROM household_facts
   WHERE user_id = '[your-user-id]'
   ORDER BY created_at DESC;
   ```

---

## Step 4: Advanced Testing

### Confidence Blending

Test that multiple observations increase confidence:

1. First purchase with baby products → `has_baby: 0.90`
2. Chat message "my baby needs..." → `has_baby: 0.95`
3. Second purchase with baby products → `has_baby: 0.98`
4. Explicit confirmation "Yes, I have a baby" → `has_baby: 1.00`

### Conflict Detection

Test contradictory information:

1. Message: "I live in an apartment"
2. Later message: "I'm mowing my lawn"
3. System should detect conflict (apartments typically don't have lawns)
4. Should generate confirmation question

---

## Expected Console Output Examples

### Successful Discovery:
```
🔍 Discovered 2 facts for user a1b2c3d4-...
   ✓ Created: property_type (confidence: 1.00)
   ✓ Created: has_dog (confidence: 1.00)
```

### Confidence Update:
```
🔍 Discovered 1 facts for user a1b2c3d4-...
   ✓ Updated: has_baby (confidence: 0.95)
```

### Background Discovery:
```
⚠️ Background discovery error: [error message]
```
(Should be rare, and won't block chat)

---

## Troubleshooting

### "Unauthorized" errors
- Make sure you're logged in
- Check browser console for auth errors
- Verify Supabase RLS policies are applied

### No facts discovered
- Check console logs for discovery attempts
- Verify chat API integration is working
- Test with explicit messages like "I have a dog"

### Migration errors
- Check Supabase SQL Editor for error messages
- Verify auth.users table exists
- Ensure gen_random_uuid() is available

### Discovery not working in chat
- Check that `src/app/api/chat/route.ts` has discovery integration
- Verify imports: `import { discoverFromMessage } from '@/lib/household/discovery'`
- Check for fire-and-forget fetch call around line 76

---

## Success Criteria

✅ Database migration applied without errors
✅ Chat messages trigger background discovery
✅ Facts appear in database with correct confidence scores
✅ Multiple observations increase confidence
✅ Property type inference respects housing diversity
✅ Memory Map UI displays discovered facts
✅ API endpoints return household map data
✅ No blocking/slowdown in chat responses

---

## Next Steps After Testing

1. **Phase 3C: UI Integration**
   - Expand Memory Map page with household insights
   - Add confidence indicators
   - Show property type and features
   - Display people and pet profiles

2. **Phase 3D: AI Personalization**
   - Inject household context into chat prompts
   - Enable AI to reference household facts
   - Generate personalized recommendations

3. **Phase 4: Decision Trees**
   - Build guided discovery flows
   - High-consideration purchases (appliances, furniture)
   - Strategic confirmation questions

4. **Phase 5: Persona Clustering**
   - Group customers by household similarity
   - Predict lifecycle transitions
   - Enable golden pathway recommendations
