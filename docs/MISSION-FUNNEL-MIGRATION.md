# Mission-Based Funnel Migration Guide

**Date:** December 4, 2024
**Migration:** `003_mission_funnels.sql`

---

## Overview

This migration refactors the funnel system from **session-based** to **mission-based**, enabling:
- **Persistent missions** across sessions
- **Auto-detection** of shopping goals after 1-2 turns
- **Context-aware pausing** when user switches topics
- **Time-based abandonment** by mission type
- **Smart resuming** when user returns to topic

---

## Step 1: Apply Database Migration

### Option A: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create new query
4. Copy contents of `supabase/migrations/003_mission_funnels.sql`
5. Run the query
6. Verify success (should show "Success. No rows returned")

### Option B: Via Supabase CLI

```bash
# Make sure you're logged in
supabase login

# Link to your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push
```

---

## Step 2: Verify Migration

Run these queries in Supabase SQL Editor to verify:

```sql
-- 1. Check missions table has new columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'missions'
ORDER BY ordinal_position;

-- Expected new columns:
-- - funnel_stage
-- - items_viewed
-- - items_added
-- - questions_asked
-- - expected_next_action
-- - last_active_at
-- - paused_at
-- - abandoned_at
-- - abandon_threshold_hours
-- - detected_at
-- - detection_confidence
-- - items

-- 2. Check interaction_history constraint updated
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'interaction_history_interaction_type_check';

-- Expected: check_clause should include 'funnel_transition'

-- 3. Check helper functions exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'is_mission_abandoned',
  'get_active_missions',
  'get_missions_for_nudge'
);

-- Expected: 3 rows returned
```

---

## Step 3: Update Existing Missions (if any)

If you have existing missions in the database, they need default values:

```sql
-- Set default funnel stage
UPDATE missions
SET funnel_stage = 'arriving'
WHERE funnel_stage IS NULL;

-- Set default counters
UPDATE missions
SET
  items_viewed = 0,
  items_added = 0,
  questions_asked = 0
WHERE items_viewed IS NULL;

-- Set abandon thresholds
UPDATE missions
SET abandon_threshold_hours = CASE
  WHEN type = 'essentials' THEN 12
  WHEN type IN ('recipe', 'event') THEN 168
  WHEN type IN ('research', 'precision') THEN 168
  ELSE 72
END
WHERE abandon_threshold_hours IS NULL;

-- Set last_active_at to started_at if missing
UPDATE missions
SET last_active_at = started_at
WHERE last_active_at IS NULL;
```

---

## Architecture Changes

### Before (Session-Based):
```
User Session → Funnel State (sessionStorage)
├─ arriving
├─ browsing
├─ comparing
├─ decided
└─ checkout

❌ Issues:
- Lost on page refresh
- No context about WHAT they're shopping for
- Can't resume abandoned missions
- No multi-mission support
```

### After (Mission-Based):
```
User → Multiple Missions (Database)
│
├─ Mission 1: "Buy milk" (essentials)
│  ├─ Funnel: decided
│  ├─ Items added: 1
│  └─ Status: active
│
├─ Mission 2: "Plan birthday party" (event)
│  ├─ Funnel: browsing
│  ├─ Items added: 0
│  ├─ Paused: true (context switched)
│  └─ Status: active
│
└─ Mission 3: "Research TV" (research)
   ├─ Funnel: comparing
   ├─ Items viewed: 15
   ├─ Questions asked: 8
   └─ Status: active

✅ Benefits:
- Persists across sessions
- Context-aware (knows what they're shopping for)
- Can pause/resume
- Supports multiple concurrent missions
- Time-based abandonment
```

---

## New Functions & Usage

### 1. Mission Detection
```typescript
import { detectMissionType } from '@/lib/missions'

// After 1-2 turns, detect mission
const detection = detectMissionType("I need to plan a birthday party", 2)
// Returns: { type: 'event', confidence: 0.90 }
```

### 2. Find or Create Mission
```typescript
import { findOrCreateMission } from '@/lib/missions'

// Auto-detects if new mission or continues existing
const mission = await findOrCreateMission(
  userId,
  "What decorations should I get?",
  messageCount
)
```

### 3. Context Deviation Detection
```typescript
import { detectContextDeviation } from '@/lib/missions'

// Check if user switched topics
const isDeviation = detectContextDeviation(
  currentMission,
  "Actually, I need milk"
)
// Returns: true (switched from party to milk)
```

### 4. Get Active Mission
```typescript
import { getActiveMission } from '@/lib/missions'

// Get currently active (not paused) mission
const mission = await getActiveMission(userId)
```

### 5. Get Paused Missions for Nudging
```typescript
import { getMissionsForNudge } from '@/lib/missions'

// On login, get missions to nudge user about
const missionsToNudge = await getMissionsForNudge(userId)
// Returns missions that are paused but not abandoned
```

### 6. Track Mission Actions
```typescript
import { trackMissionAction } from '@/lib/missions'

// Track user action on mission
await trackMissionAction(missionId, 'add_to_cart', userId)
// Updates counters and may trigger funnel transitions
```

---

## Mission Lifecycle

### Creation (Auto-detected):
```
User: "I need to plan a birthday party"
       ↓
After 1-2 turns → detectMissionType()
       ↓
Mission created:
- query: "plan a birthday party"
- type: event
- funnel_stage: arriving
- abandon_threshold: 168 hours (7 days)
```

### Active State:
```
User: "What decorations do I need?"
       ↓
trackMissionAction('message')
       ↓
- funnel_stage: browsing
- questions_asked: 1
- last_active_at: NOW()
```

### Pause (Context Switch):
```
User: "Actually, I need milk"
       ↓
detectContextDeviation() = true
       ↓
Current mission paused:
- paused_at: NOW()

New mission created:
- query: "I need milk"
- type: essentials
```

### Resume:
```
User (next day): "Let's continue planning the party"
       ↓
findOrCreateMission() → matches paused mission
       ↓
resumeMission()
       ↓
- paused_at: NULL
- last_active_at: NOW()
```

### Abandonment:
```
Time passes beyond threshold:
- Essentials: 12 hours
- Events/Recipes: 7 days
- Research: 7 days
       ↓
is_mission_abandoned() = true
       ↓
Mission marked abandoned:
- abandoned_at: NOW()
- No longer appears in active missions
- Won't be nudged
```

---

## Time-Based Abandonment Rules

| Mission Type | Threshold | Rationale |
|-------------|-----------|-----------|
| **precision** | 6 hours | Single item ("I need milk") - fast add to cart, then expand basket |
| **essentials** | 24 hours | Grocery baskets ("weekly groceries") - more browsing freedom |
| **recipe** | 7 days | Event-driven but flexible timing |
| **event** | 7 days | Planning ahead, but still time-sensitive |
| **research** | 7 days | High-consideration, but not indefinite |

**After abandonment:**
- Stop nudging user about mission
- Remove from active missions list
- Can still resume if user explicitly searches for related items

---

## Nudging Strategy

### On Login:
```typescript
// Check for paused missions
const missionsForNudge = await getMissionsForNudge(userId)

if (missionsForNudge.length > 0) {
  // AI welcomes back: "You were planning a birthday party. Continue?"
}
```

### During Lulls:
```typescript
// If user idle for 2+ minutes with paused missions
if (idleTime > 120 && pausedMissions.length > 0) {
  // AI suggests: "Want to finish planning that party?"
}
```

### After Mission Completion:
```typescript
// User completes "Buy milk" mission
await completeMission(milkMission.id)

// Check for other paused missions
const otherMissions = await getAllActiveMissions(userId)

if (otherMissions.length > 0) {
  // AI: "Great! You also have a party to plan. Want to work on that?"
}
```

---

## AI Prompt Context

### Old (Session-Based):
```
## CUSTOMER JOURNEY STAGE

Current Stage: BROWSING
- User is exploring options, provide inspiration
- Items viewed: 3
- Items added: 0
```

### New (Mission-Based):
```
## ACTIVE SHOPPING MISSION

**Mission:** Plan birthday party for 8 year old
**Type:** event (7-day window)
**Status:** ACTIVE

### Funnel Stage: BROWSING
- Exploring options for this mission, provide inspiration

### Mission Progress:
- Items viewed: 12
- Items added: 3
- Questions asked: 5
- Last active: 2 days ago

**Expected Next Action:** User will likely ask about decorations or cake options
```

---

## Testing Checklist

### 1. Mission Creation
- [ ] Send "I need milk" → Mission created (type: essentials)
- [ ] Send "Plan a party" → Mission created (type: event)
- [ ] Send "Looking for a TV" → Mission created (type: research)

### 2. Context Switching
- [ ] Start "party" mission
- [ ] Say "Actually, I need milk" → Party mission paused
- [ ] New "milk" mission created

### 3. Mission Resuming
- [ ] Have paused "party" mission
- [ ] Say "Back to the party" → Mission resumed
- [ ] Verify paused_at is NULL

### 4. Funnel Transitions
- [ ] Add item to cart → Funnel becomes "decided"
- [ ] Ask question while browsing → Funnel becomes "comparing"
- [ ] Click checkout → Funnel becomes "checkout"

### 5. Abandonment
- [ ] Create essentials mission
- [ ] Wait 12 hours (or manually update timestamp)
- [ ] Verify mission no longer in active list
- [ ] Check is_mission_abandoned() returns true

### 6. Database Queries
```sql
-- Get all active missions for user
SELECT * FROM get_active_missions('USER_ID');

-- Get missions needing nudge
SELECT * FROM get_missions_for_nudge('USER_ID');

-- Check if specific mission is abandoned
SELECT is_mission_abandoned(missions.*)
FROM missions
WHERE id = 'MISSION_ID';
```

---

## Troubleshooting

### Issue: "interaction_type check constraint failed"
**Cause:** Old constraint doesn't include 'funnel_transition'
**Fix:** Run migration 003_mission_funnels.sql

### Issue: Missions table missing columns
**Cause:** Migration not applied
**Fix:** Apply migration via SQL Editor

### Issue: All missions showing as abandoned
**Cause:** abandon_threshold_hours not set correctly
**Fix:** Run update query from Step 3

### Issue: Context deviation not detecting
**Cause:** expected_next_action not set
**Fix:** This is set by AI in prompts - check mission detection logic

---

## Next Steps

1. ✅ Apply migration to Supabase
2. ⏳ Update ChatInterface to use missions (next task)
3. ⏳ Test mission detection
4. ⏳ Test context switching
5. ⏳ Test resuming across sessions

---

**Status:** Ready to apply migration
**Risk:** Low (additive changes, no data loss)
**Rollback:** Can remove columns if needed, but keep them for future phases
