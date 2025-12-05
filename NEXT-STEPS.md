# 🚀 Next Steps: Apply Database Migration & Test

**Phase 3A Status:** ✅ Complete - Code ready, waiting for database migration

---

## Step 1: Apply Database Migration to Supabase

You need to run the SQL migration to create the household map tables:

### Instructions:

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New Query"

3. **Copy the Migration**
   - Open: `supabase/migrations/004_household_map.sql`
   - Copy the entire file contents (358 lines)

4. **Paste and Execute**
   - Paste into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

5. **Verify Success**
   - Should see "Success. No rows returned"
   - Run this verification query:
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   AND (table_name LIKE '%household%' OR table_name LIKE '%decision%')
   ORDER BY table_name;
   ```
   - Should return 4 tables:
     - `decision_tree_sessions`
     - `decision_trees`
     - `household_facts`
     - `household_map_snapshots`

---

## Step 2: Test the System

### Option A: Quick UI Test (Recommended)

1. **Make sure dev server is running**
   ```bash
   # Server should already be running at http://localhost:3000
   # If not, start it:
   npm run dev
   ```

2. **Log in to the application**
   - Open: http://localhost:3000
   - Sign in with your test account

3. **Test discovery from chat**
   - Navigate to the chat page (main page)
   - Send these messages:
     - "I live in an apartment with my dog"
     - "I need snacks for my baby"
     - "I'm vegan and looking for groceries"

4. **Check the console logs**
   - Look at your terminal where `npm run dev` is running
   - You should see discovery logs like:
   ```
   🔍 Discovered 2 facts for user [user-id]
      ✓ Created: property_type (confidence: 1.00)
      ✓ Created: has_dog (confidence: 1.00)
   ```

5. **View discovered facts**
   - Navigate to: http://localhost:3000/memory
   - You should see the discovered facts in the UI

### Option B: Test via Browser Console

1. **Open browser console** (F12 or Cmd+Option+I)

2. **Fetch household map**
   ```javascript
   fetch('/api/household')
     .then(res => res.json())
     .then(data => console.log(data))
   ```

3. **Trigger discovery manually**
   ```javascript
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

### Option C: Full Testing Guide

For comprehensive testing instructions, see:
- **`docs/PHASE-3B-TESTING-GUIDE.md`**

---

## Step 3: Verify Database

Check that facts are being stored correctly:

1. **Go to Supabase Dashboard → Table Editor**

2. **Open `household_facts` table**
   - You should see rows with discovered facts
   - Check fields:
     - `user_id`: Your test user ID
     - `fact_key`: property_type, has_dog, has_baby, etc.
     - `fact_value`: JSON values
     - `confidence`: 0.0 - 1.0
     - `supporting_evidence`: Array of evidence

3. **Run a query**
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

## 📋 What to Look For

### Success Indicators:
- ✅ Migration runs without errors
- ✅ 4 tables created in database
- ✅ Chat messages trigger background discovery
- ✅ Console logs show discovered facts
- ✅ Facts appear in database
- ✅ Confidence scores are correct (0.0-1.0)
- ✅ No errors in browser console or terminal

### Example Console Output:
```
🔍 Discovered 2 facts for user a1b2c3d4-...
   ✓ Created: property_type (confidence: 1.00)
   ✓ Created: has_dog (confidence: 1.00)
```

### Example API Response:
```json
{
  "success": true,
  "map": {
    "completeness": 15,
    "totalFacts": 2,
    "facts": [
      {
        "factKey": "property_type",
        "factValue": "apartment",
        "confidence": 1.0,
        "category": "physical_space"
      },
      {
        "factKey": "has_dog",
        "factValue": true,
        "confidence": 1.0,
        "category": "pets"
      }
    ],
    "physicalSpace": {
      "propertyType": "apartment"
    },
    "pets": [
      {
        "type": "dog",
        "confidence": 1.0
      }
    ]
  }
}
```

---

## 🐛 Troubleshooting

### "Unauthorized" errors
- Make sure you're logged in to the application
- Check browser cookies (should have Supabase auth token)

### Migration fails
- Check for existing tables (may need to drop them first)
- Verify Supabase connection is working
- Check SQL Editor for specific error messages

### No facts discovered
- Check terminal logs for discovery attempts
- Verify chat API integration is working
- Try explicit messages like "I have a dog"

### Discovery errors in console
- Check that discovery API endpoint is working
- Verify Supabase RLS policies allow user access
- Look for TypeScript errors in build output

---

## 📚 Documentation Reference

- **`docs/PHASE-3-SUMMARY.md`** - Quick overview of the system
- **`docs/PHASE-3-HOUSEHOLD-MAP.md`** - Complete architecture (496 lines)
- **`docs/PHASE-3A-PROGRESS.md`** - Development progress log
- **`docs/PHASE-3B-TESTING-GUIDE.md`** - Comprehensive testing guide

---

## 🎯 After Testing

Once testing is successful, we can move on to:

### Phase 3C: UI Integration
- Expand Memory Map page with household insights
- Add visual cards for people, pets, property
- Show confidence indicators
- Interactive fact confirmation

### Phase 3D: AI Personalization
- Inject household context into chat prompts
- Enable AI to reference household facts in responses
- Generate personalized recommendations

---

## ✅ Current Status

- ✅ Code implementation complete
- ✅ Build compiles successfully
- ✅ Dev server running on port 3000
- ✅ Documentation complete
- ⏳ **Next: Apply database migration**
- ⏳ **Then: Test through UI**

**The robotic vacuum is ready to start mapping! 🤖🗺️**

Just apply the migration and test - you're one step away from seeing it in action!
