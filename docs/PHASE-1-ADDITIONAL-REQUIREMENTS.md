# Phase 1: Additional Requirements (Post-Testing)

**Created:** 2025-12-07
**Status:** Logged for implementation after decision tree testing
**Context:** Requirements identified during Phase 1 vertical expansion

---

## Overview

After implementing hardcoded decision trees for testing, we identified 3 critical data flows that need to be added to Phase 1 before production:

1. **Explicit Data Extraction from Checkout**
2. **Implicit Data Extraction from Tree Responses**
3. **Mission Status Display on Home Screen**

These are **NOT blockers** for initial decision tree testing, but are **required** before Phase 1 can be considered production-ready.

---

## 1. Explicit Data Extraction from Checkout

### Current State
- ✅ `discoverFromPurchase()` exists in `src/lib/household/discovery.ts:33`
- ✅ CSV ingestion works via `/api/admin/ingest-purchases`
- ❌ No live checkout flow
- ❌ No real-time purchase completion trigger

### Requirements

**A. Checkout Flow**
- Build `/checkout` page
- Cart → Checkout → Order completion
- Trigger discovery on order completion

**B. Purchase Discovery Hook**
```typescript
// On order completion:
POST /api/orders/complete
→ Trigger discoverFromPurchase(userId, items, timestamp)
→ Save discovered facts to household_facts table
→ Update user maturity
```

**C. Test Cases**
1. **Baby Products**
   - User buys: Diapers, Formula, Baby Wipes
   - Expected: Discover `has_baby: true`, `life_stage: young_family`

2. **Dietary Preferences**
   - User buys: Oat Milk, Almond Butter, Vegan Cheese
   - Expected: Discover `dietary_preference: vegan` or `dairy_free`

3. **Coffee Machine Purchase**
   - User completes tree → Buys espresso machine
   - Expected: Discover `drinks_espresso: true`

**D. Files to Create/Modify**
- `src/app/checkout/page.tsx` - Checkout UI
- `src/app/api/orders/complete/route.ts` - Order completion API
- `src/lib/household/discovery.ts` - Already exists, just needs to be called

---

## 2. Implicit Data Extraction from Tree Responses

### Current State
- ✅ `discoverFromMessage()` exists - extracts from chat messages
- ❌ No tree-specific answer extraction
- ❌ Tree selections don't update household profile

### Requirements

**A. Tree Answer Interception**
When user answers a tree question, extract implicit preferences:

```typescript
// Example: Coffee Machine Tree
User selects: "Espresso-based drinks (lattes, cappuccinos)"
→ Extract: { drinks_espresso: true, coffee_preference: "espresso" }

User selects: "6-10 cups (Family)"
→ Extract: { household_size: "medium_family", daily_coffee_consumption: "6-10" }
```

**B. Implementation Strategy**

Option 1: **Extract on tree completion**
- When tree reaches recommendation node
- Parse all user answers
- Call discovery API with answers

Option 2: **Extract on each answer** (preferred)
- Intercept each tree answer in chat flow
- Call discovery API incrementally
- Build profile progressively

**C. Test Cases**

1. **Mattress Tree**
   - Q1: "Side sleeper" → Extract `sleeping_position: side`
   - Q2: "Soft / Plush" → Extract `mattress_firmness_pref: soft`
   - Q3: "Queen" → Extract `mattress_size: queen`
   - Q4: "$1000-$2000" → Extract `mattress_budget: premium`

2. **Paint Tree**
   - Q1: "Interior walls" → Extract `project_type: interior_painting`
   - Q3: "Gray & Neutral" → Extract `color_preference: gray` (critical for SKU precision)

3. **Power Tool Tree**
   - Q1: "Drill / Driver" → Extract `tool_needed: drill`
   - Q2: "Regular DIY" → Extract `diy_skill_level: regular`, `tool_usage: prosumer`

**D. Files to Create/Modify**
- `src/lib/decisions/tree-discovery.ts` - New file for tree answer extraction
- `src/app/api/chat/route.ts` - Intercept tree answers, call discovery
- `src/app/api/household/discover/route.ts` - Handle tree answer type

---

## 3. Mission Status Display on Home Screen

### Current State
- ✅ Missions stored in `decision_tree_missions` table
- ✅ Mission state tracked (status, cached products, etc.)
- ❌ Home page redirects straight to `/chat`
- ❌ No mission cards UI
- ❌ No mission query API

### Requirements

**A. Home Screen UI** (`/` or `/home`)

Display mission cards showing:
- **Active missions**: Decision trees in progress
- **Completed missions**: Decision trees with cached products
- **Nudges**: Incomplete missions user should resume

```
┌─────────────────────────────────────────┐
│  Welcome back, Nick!                    │
├─────────────────────────────────────────┤
│  📋 Active Missions                      │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ 🛏️  Find Your Perfect Mattress      │ │
│  │ In progress • 2/4 questions         │ │
│  │ [Continue Mission]                  │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ✅ Completed Missions                   │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ ☕ Coffee Machine Recommendations    │ │
│  │ 3 products matched • $299-$799      │ │
│  │ [View Results]                      │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**B. Mission Query API**

```typescript
GET /api/missions?status=active
GET /api/missions?status=completed

Response:
{
  active: [
    {
      id: "uuid",
      treeId: "mattress-purchase",
      treeName: "Find Your Perfect Mattress",
      status: "in_progress",
      currentNodeId: "firmness",
      progress: { current: 2, total: 4 },
      createdAt: "2025-12-07T10:00:00Z"
    }
  ],
  completed: [
    {
      id: "uuid",
      treeId: "coffee-machine-purchase",
      treeName: "Find Your Perfect Coffee Machine",
      status: "completed",
      cachedProducts: ["SKU-CM-001", "SKU-CM-007", "SKU-CM-012"],
      completedAt: "2025-12-06T15:30:00Z"
    }
  ]
}
```

**C. Mission Card Component**

```tsx
// src/components/missions/MissionCard.tsx
<MissionCard
  mission={mission}
  onContinue={() => router.push('/chat')}
  onViewResults={() => router.push('/chat')}
/>
```

**D. Test Cases**

1. **Active Mission Display**
   - Start coffee machine tree, answer 2/4 questions
   - Navigate to home
   - Expected: See "Coffee Machine" mission card with "2/4 questions" progress

2. **Completed Mission Display**
   - Complete paint tree, cache 5 products
   - Navigate to home
   - Expected: See "Paint Recommendations" card with "5 products matched"

3. **Resume Mission**
   - Click "Continue Mission" on active card
   - Expected: Chat opens with tree at correct question

4. **View Cached Products**
   - Click "View Results" on completed card
   - Expected: Chat opens with cached carousel block

**E. Files to Create/Modify**
- `src/app/page.tsx` - Replace redirect with home screen
- `src/components/missions/MissionCard.tsx` - Mission card component
- `src/app/api/missions/route.ts` - Already exists, verify query params work

---

## Implementation Priority

**After decision tree testing passes:**

1. **Phase 1.1: Tree Answer Extraction** (Highest priority)
   - Quick win, enhances profile building
   - Critical for paint color variance testing
   - Estimated: 2-3 hours

2. **Phase 1.2: Mission Home Screen** (High priority)
   - User-facing value
   - Demonstrates mission resumption clearly
   - Estimated: 4-6 hours

3. **Phase 1.3: Checkout Flow** (Medium priority)
   - More complex, requires cart/payment UI
   - Can simulate with CSV ingestion for now
   - Estimated: 8-12 hours

---

## Phase 2 Consideration: AI-Generated Trees

**Current Issue:** Hardcoded tree definitions (coffee.ts, paint.ts, etc.) don't scale.

**Proposed Solution:** AI-generated decision trees on-demand:
- User asks "I need a coffee machine"
- Claude generates relevant questions dynamically based on:
  - Product category
  - Available product attributes in catalog
  - User's maturity level
  - Conversation context
- No hardcoded tree files needed

**Benefits:**
- ✅ Works for ANY product category (no manual tree creation)
- ✅ Questions adapt to available inventory
- ✅ More intelligent (considers user context)
- ✅ Less maintenance

**Tradeoffs:**
- ❌ More complex to implement
- ❌ Harder to test (dynamic vs static)
- ❌ Requires careful prompt engineering

**Recommendation:** Implement in Phase 2 after validating the core caching/resumption logic with hardcoded trees.

---

## Success Criteria (Before Production)

Phase 1 is production-ready when:

- ✅ Decision tree caching works (current testing focus)
- ✅ Mission resumption works (current testing focus)
- ✅ Tree answers update household profile (Phase 1.1)
- ✅ Home screen displays active/completed missions (Phase 1.2)
- ✅ Checkout flow triggers discovery (Phase 1.3 or simulated)
- ✅ All test cases pass in `PHASE-1-TEST-CRITERIA.md`
- ✅ Paint color variance testing passes (SKU precision)

---

## Notes

- These requirements emerged during vertical expansion for testing
- NOT blockers for initial decision tree testing
- Can be implemented incrementally after core caching is validated
- Phase 2 (AI-generated trees) is a separate, larger architectural change
