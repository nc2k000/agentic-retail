# Profile & Household Management - Technical Specification

**Phase:** 1.5 (Profile UI + Household Members)
**Priority:** High - Core personalization feature
**Created:** December 3, 2024

---

## Overview

Enable users to view and manage their shopping profile, including household members with individual preferences and shopping patterns.

---

## Requirements

### 1. Profile Viewing ✅ Priority
**User Story:** As a user, I want to see what the AI knows about me so I can understand personalization.

**UI Components:**
- Profile page (`/profile` or `/settings`)
- Profile summary card (name, household size, shopping frequency)
- Preferences breakdown (dietary, allergies, favorites, brands)
- Shopping patterns visualization (time preferences, basket size, categories)
- Confidence indicators for each preference
- Last updated timestamps

**Data Sources:**
- `profiles` table (name, email, household)
- `customer_preferences` table (all preference types)
- `shopping_patterns` table (behavioral patterns)
- `memory_insights` table (high-level personas)

### 2. Profile Evolution Over Time ✅ Priority
**User Story:** As a user, my profile should get smarter as I shop more.

**Already Implemented:**
- ✅ Passive learning from cart, checkout, swaps, messages
- ✅ Confidence scores increase with repeated behavior
- ✅ `times_confirmed` counter tracks reinforcement

**Additional Features Needed:**
- **Profile Maturity Score** (0-100%)
  - Based on: # of orders, # of preferences, avg confidence, data age
  - Formula: `(orders * 10 + preferences * 5 + avg_confidence * 50) / 100`
  - Display: "Your profile is 65% complete - keep shopping to improve recommendations!"

- **Profile Timeline** (optional, future)
  - Show when preferences were learned
  - Show how confidence has changed over time
  - "You started buying organic products 2 weeks ago"

### 3. Sub-Accounts / Household Members 🎯 NEW FEATURE
**User Story:** As a parent, I want to track what my kids like so the AI can suggest appropriate items for each family member.

**Architecture Decision:**

**Option A: Soft Attribution (Recommended for MVP)**
- Store household members in existing `profiles.household.members` array
- Add `for_member` field to interactions and preferences
- Prompt user: "Who is this for?" during shopping
- Example: `{"name": "Emma", "age": 8, "preferences": {...}}`

**Option B: Hard Multi-User Accounts (Future)**
- Separate `household_members` table with foreign key to user
- Each member has their own preferences table rows
- More complex but more scalable

**MVP: Go with Option A (Soft Attribution)**

#### Database Schema Changes

**Update `profiles` table structure:**
```typescript
// Current: household.members is just strings
household: {
  size: number
  members: string[] // ["Emma", "Jake"]
  pets: string[]
}

// New: household.members with metadata
household: {
  size: number
  members: Array<{
    id: string // unique ID for attribution
    name: string
    age?: number
    relationship?: 'self' | 'partner' | 'child' | 'parent' | 'other'
    dietary?: string[] // quick reference
    allergies?: string[] // critical reference
  }>
  pets: Array<{
    name: string
    type: string
  }>
}
```

**Add `member_id` to existing tables:**
```sql
-- Add nullable member_id to customer_preferences
ALTER TABLE customer_preferences
ADD COLUMN member_id VARCHAR(50) NULL;

-- Add nullable member_id to shopping_patterns
ALTER TABLE shopping_patterns
ADD COLUMN member_id VARCHAR(50) NULL;

-- Add nullable member_id to interaction_history
ALTER TABLE interaction_history
ADD COLUMN member_id VARCHAR(50) NULL;

-- Index for performance
CREATE INDEX idx_preferences_member ON customer_preferences(user_id, member_id);
CREATE INDEX idx_patterns_member ON shopping_patterns(user_id, member_id);
CREATE INDEX idx_interactions_member ON interaction_history(user_id, member_id);
```

**NULL `member_id` = primary user**
**Populated `member_id` = specific household member**

### 4. Household Verification Flow ✅ Priority
**User Story:** As a user, I want to confirm who lives in my house so recommendations are accurate.

**UI Flow:**

**Step 1: Profile Setup (FTUX or Settings)**
```
┌─────────────────────────────────────┐
│  Who lives in your household?      │
│                                      │
│  👤 You (Nicholas)                  │
│                                      │
│  [+ Add household member]           │
│                                      │
│  Already added:                     │
│  👧 Emma (8 years old)              │
│  👦 Jake (5 years old)              │
│                                      │
│  [ Continue ]                       │
└─────────────────────────────────────┘
```

**Step 2: Add Member Modal**
```
┌─────────────────────────────────────┐
│  Add household member               │
│                                      │
│  Name: [_______________]            │
│  Age: [___] (optional)              │
│  Relationship:                      │
│    ( ) Partner                      │
│    (•) Child                        │
│    ( ) Parent                       │
│    ( ) Other                        │
│                                      │
│  Dietary restrictions: (optional)   │
│    [ ] Vegetarian                   │
│    [ ] Vegan                        │
│    [ ] Gluten-free                  │
│    [+ Add custom]                   │
│                                      │
│  Allergies: (optional)              │
│    [ ] Peanuts                      │
│    [ ] Dairy                        │
│    [ ] Shellfish                    │
│    [+ Add custom]                   │
│                                      │
│  [ Cancel ]  [ Add Member ]         │
└─────────────────────────────────────┘
```

**Step 3: Attribution During Shopping**
```
┌─────────────────────────────────────┐
│  Who is this for?                   │
│                                      │
│  [ 👤 Me (Nicholas) ]               │
│  [ 👧 Emma ]                        │
│  [ 👦 Jake ]                        │
│  [ 👨‍👩‍👧‍👦 Whole family ]              │
│                                      │
│  Don't ask again this session       │
└─────────────────────────────────────┘
```

**Verification Triggers:**
- Initial profile setup (FTUX)
- Every 3 months: "Is your household info still correct?"
- When AI detects new preferences that don't match user profile: "This seems like it might be for someone else. Who?"

### 5. Profile Editing (Future Phase) 🔮
**User Story:** As a user, I want to correct wrong preferences or remove items I don't like anymore.

**UI Components:**
- Edit mode on profile page
- Delete preference button (with confirmation)
- Adjust confidence slider (advanced)
- Add manual preferences (dropdown + form)

**Implementation Notes:**
- Use existing `deletePreference()` function from memory system
- Add `updatePreference()` function to modify confidence/reason
- Track source='explicit' when user manually adds
- Sync changes to AI context immediately

### 6. FTUX Profile Builder (Future Phase) 🔮
**User Story:** As a new user, I want a quick onboarding to set up my profile so recommendations are good from day 1.

**Onboarding Flow:**

**Screen 1: Welcome**
```
Welcome to Agentic Retail! 👋

Let's personalize your shopping experience.
This will take about 2 minutes.

[ Get Started ]
```

**Screen 2: Basic Info**
```
Tell us about yourself

Name: [Nicholas]
Household size: [4] people

[ Next ]
```

**Screen 3: Household Members**
```
Who lives with you? (optional but recommended)

[Use UI from Verification Flow Step 1]

[ Skip ]  [ Next ]
```

**Screen 4: Dietary Preferences**
```
Any dietary preferences?

[ ] Vegetarian    [ ] Vegan
[ ] Gluten-free   [ ] Dairy-free
[ ] Keto          [ ] Paleo
[ ] None

[ Back ]  [ Next ]
```

**Screen 5: Allergies (Critical)**
```
⚠️ Do you or anyone in your household have allergies?

Common allergens:
[ ] Peanuts       [ ] Tree nuts
[ ] Dairy         [ ] Eggs
[ ] Soy           [ ] Wheat
[ ] Fish          [ ] Shellfish

[+ Add custom allergy]

This is critical for safety. We'll never suggest these items.

[ Back ]  [ Finish Setup ]
```

**Screen 6: Confirmation**
```
✅ Profile created!

You can always update this in Settings.

The AI will learn more about your preferences as you shop.

[ Start Shopping ]
```

---

## Database Migration: Household Members

### Migration 002: Household Members Support

```sql
-- Migration: 002_household_members.sql
-- Add member attribution to memory tables

BEGIN;

-- Add member_id to customer_preferences
ALTER TABLE customer_preferences
ADD COLUMN member_id VARCHAR(50) NULL,
ADD COLUMN member_name VARCHAR(100) NULL; -- Denormalized for quick display

-- Add member_id to shopping_patterns
ALTER TABLE shopping_patterns
ADD COLUMN member_id VARCHAR(50) NULL,
ADD COLUMN member_name VARCHAR(100) NULL;

-- Add member_id to interaction_history
ALTER TABLE interaction_history
ADD COLUMN member_id VARCHAR(50) NULL,
ADD COLUMN member_name VARCHAR(100) NULL;

-- Add member_id to memory_insights
ALTER TABLE memory_insights
ADD COLUMN member_id VARCHAR(50) NULL,
ADD COLUMN member_name VARCHAR(100) NULL;

-- Create indexes for member queries
CREATE INDEX idx_preferences_member ON customer_preferences(user_id, member_id);
CREATE INDEX idx_patterns_member ON shopping_patterns(user_id, member_id);
CREATE INDEX idx_interactions_member ON interaction_history(user_id, member_id);
CREATE INDEX idx_insights_member ON memory_insights(user_id, member_id);

-- Update existing RLS policies to include member_id
-- (Policies already check user_id, member_id inherits that protection)

COMMENT ON COLUMN customer_preferences.member_id IS 'NULL = primary user, populated = household member ID';
COMMENT ON COLUMN customer_preferences.member_name IS 'Denormalized member name for quick display';

COMMIT;
```

### Helper Function: Fetch Member Context

```sql
-- Fetch memory context for a specific household member
CREATE OR REPLACE FUNCTION fetch_member_context(
  p_user_id UUID,
  p_member_id VARCHAR DEFAULT NULL,
  p_min_confidence DECIMAL DEFAULT 0.70
)
RETURNS TABLE (
  category TEXT,
  items JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH preferences AS (
    SELECT
      preference_type,
      jsonb_agg(
        jsonb_build_object(
          'key', preference_key,
          'confidence', confidence,
          'reason', reason,
          'times_confirmed', times_confirmed,
          'member_id', member_id,
          'member_name', member_name
        )
        ORDER BY confidence DESC, times_confirmed DESC
      ) as items
    FROM customer_preferences
    WHERE user_id = p_user_id
      AND (p_member_id IS NULL OR member_id = p_member_id OR member_id IS NULL)
      AND confidence >= p_min_confidence
    GROUP BY preference_type
  )
  SELECT preference_type::TEXT as category, items FROM preferences;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## TypeScript Types

### Update Profile Type

```typescript
// src/types/profile.ts

export interface HouseholdMember {
  id: string // UUID or nanoid
  name: string
  age?: number
  relationship?: 'self' | 'partner' | 'child' | 'parent' | 'other'
  dietary?: string[]
  allergies?: string[]
  avatar?: string // emoji or image URL
}

export interface Pet {
  name: string
  type: string // 'dog', 'cat', etc.
}

export interface Household {
  size: number
  members: HouseholdMember[]
  pets: Pet[]
}

export interface Profile {
  id: string
  user_id: string
  email: string
  name: string
  household: Household
  preferences: {
    brands?: string[]
    dietary?: string[]
    budget?: 'tight' | 'moderate' | 'flexible'
  }
  created_at: string
  updated_at: string
}

// Profile maturity/completeness
export interface ProfileStats {
  maturityScore: number // 0-100
  ordersCount: number
  preferencesCount: number
  avgConfidence: number
  accountAge: number // days
  lastOrderDate?: string
  dataFreshness: 'fresh' | 'stale' | 'outdated' // < 7 days, < 30 days, > 30 days
}
```

### Update Memory Types

```typescript
// src/types/memory.ts (additions)

export interface CustomerPreference {
  // ... existing fields ...
  member_id?: string | null
  member_name?: string | null
}

export interface ShoppingPattern {
  // ... existing fields ...
  member_id?: string | null
  member_name?: string | null
}

export interface InteractionHistory {
  // ... existing fields ...
  member_id?: string | null
  member_name?: string | null
}

export interface MemoryInsight {
  // ... existing fields ...
  member_id?: string | null
  member_name?: string | null
}

// Member context (filtered by member_id)
export interface MemberMemoryContext extends MemoryContext {
  memberId?: string
  memberName?: string
}
```

---

## Implementation Plan

### Phase 1.5: Profile UI (Week 1-2)

**Sprint Goal:** Users can view their profile and preferences

**Tasks:**
1. Create `/profile` page with navigation
2. Build ProfileCard component (summary)
3. Build PreferencesList component (dietary, allergies, favorites, brands)
4. Build ShoppingPatternsList component (time, day, categories)
5. Calculate and display profile maturity score
6. Add "Last updated" timestamps
7. Show confidence indicators (progress bars or badges)

**Files to Create:**
- `src/app/profile/page.tsx`
- `src/components/profile/ProfileCard.tsx`
- `src/components/profile/PreferencesList.tsx`
- `src/components/profile/ShoppingPatterns.tsx`
- `src/lib/profile-stats.ts` (calculate maturity score)

### Phase 1.6: Household Members (Week 2-3)

**Sprint Goal:** Users can add/manage household members

**Tasks:**
1. Run database migration 002 (add member_id columns)
2. Update Profile types to include household members
3. Build HouseholdManager component (view/add/edit members)
4. Build AddMemberModal component
5. Implement member attribution UI ("Who is this for?")
6. Update memory functions to accept optional memberId
7. Update AI prompt to include member context
8. Add household verification flow

**Files to Create:**
- `supabase/migrations/002_household_members.sql`
- `src/components/profile/HouseholdManager.tsx`
- `src/components/profile/AddMemberModal.tsx`
- `src/components/chat/MemberSelector.tsx` (attribution UI)

**Files to Update:**
- `src/lib/memory/index.ts` (add memberId params)
- `src/lib/prompts.ts` (include member context)
- `src/components/chat/ChatInterface.tsx` (member attribution)

### Phase 1.7: Profile Editing (Week 4)

**Sprint Goal:** Users can manually edit preferences

**Tasks:**
1. Add edit mode toggle to profile page
2. Build PreferenceEditor component (add/delete/modify)
3. Add confirmation dialogs for deletions
4. Implement manual preference addition form
5. Update memory functions with edit operations
6. Sync changes to AI context immediately

**Files to Create:**
- `src/components/profile/PreferenceEditor.tsx`
- `src/components/profile/AddPreferenceModal.tsx`
- `src/lib/memory/edit.ts` (edit operations)

### Phase 1.8: FTUX Profile Builder (Week 5-6)

**Sprint Goal:** New users complete profile during onboarding

**Tasks:**
1. Create onboarding flow with 6 screens
2. Build OnboardingLayout component
3. Build individual screen components
4. Implement progressive disclosure (skip options)
5. Save profile data on completion
6. Set session flag to skip on subsequent visits
7. Add "Redo onboarding" option in settings

**Files to Create:**
- `src/app/onboarding/page.tsx`
- `src/components/onboarding/WelcomeScreen.tsx`
- `src/components/onboarding/BasicInfoScreen.tsx`
- `src/components/onboarding/HouseholdScreen.tsx`
- `src/components/onboarding/DietaryScreen.tsx`
- `src/components/onboarding/AllergyScreen.tsx`
- `src/components/onboarding/ConfirmationScreen.tsx`

---

## UI/UX Mockups

### Profile Page Layout

```
┌────────────────────────────────────────────────────────┐
│ [← Back]                     Profile          [Edit]   │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 👤 Nicholas Cooke                                 │ │
│  │ nicholas@example.com                             │ │
│  │                                                   │ │
│  │ 👨‍👩‍👧‍👦 Household: 4 people                          │ │
│  │ 📦 Orders: 12                                     │ │
│  │ 📊 Profile: 73% complete ████████░░               │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Household Members                    [+ Add]     │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ 👤 You (Nicholas)                                │ │
│  │ 👧 Emma (8) - Vegetarian                         │ │
│  │ 👦 Jake (5) - Dairy allergy                      │ │
│  │ 👩 Sarah - Partner                               │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Dietary Preferences               Confidence     │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ 🥬 Vegetarian (Emma)               ████████░ 95% │ │
│  │ 🥗 Organic preferred               ███████░░ 82% │ │
│  │ Added 2 weeks ago                               │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ ⚠️ Allergies (Critical)                          │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ 🥛 Dairy (Jake)                    █████████ 100% │ │
│  │ Confirmed 5 times                                │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Favorite Items                                   │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ 🥛 Great Value Whole Milk          Bought 8×    │ │
│  │ 🍞 Wheat Bread                     Bought 6×    │ │
│  │ 🍌 Organic Bananas                 Bought 5×    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Brand Preferences                                │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ Great Value                        ████████░ 87% │ │
│  │ Organic Valley                     ███████░░ 76% │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Shopping Patterns                                │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ 🕐 Preferred time: Evening (5-10pm)              │ │
│  │ 📅 Preferred days: Tuesday, Saturday             │ │
│  │ 🛒 Typical basket: Medium (10-15 items)          │ │
│  │ 🏷️ Top categories: Dairy, Produce, Bakery        │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  [View Full History]  [Clear All Data]                │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Member Attribution UI (During Shopping)

**Context: User adds "Fruit snacks" to cart**

```
┌────────────────────────────────────────┐
│  Who is this for?                      │
│                                         │
│  ┌────────────────────────────────┐   │
│  │ 👤 Me (Nicholas)                │   │
│  └────────────────────────────────┘   │
│                                         │
│  ┌────────────────────────────────┐   │
│  │ 👧 Emma                         │   │
│  │    Vegetarian                   │   │
│  └────────────────────────────────┘   │
│                                         │
│  ┌────────────────────────────────┐   │
│  │ 👦 Jake                         │   │
│  │    ⚠️ Dairy allergy              │   │
│  └────────────────────────────────┘   │
│                                         │
│  ┌────────────────────────────────┐   │
│  │ 👨‍👩‍👧‍👦 Whole family               │   │
│  └────────────────────────────────┘   │
│                                         │
│  [ ] Don't ask again this session     │
│                                         │
│  [Cancel]                              │
└────────────────────────────────────────┘
```

---

## Testing Checklist

### Profile Viewing
- [ ] Profile page loads with user data
- [ ] Maturity score calculates correctly
- [ ] All preferences display with confidence bars
- [ ] Allergies have warning styling
- [ ] Shopping patterns show correct data
- [ ] Timestamps are accurate
- [ ] Empty states show helpful messages

### Household Members
- [ ] Can add household member with form
- [ ] Member appears in household list
- [ ] Can add dietary restrictions to member
- [ ] Can add allergies to member
- [ ] Member attribution UI appears during shopping
- [ ] Selecting member stores correct member_id
- [ ] AI context includes member preferences
- [ ] Can edit member details
- [ ] Can delete member (with confirmation)

### Profile Evolution
- [ ] Maturity score increases with orders
- [ ] Confidence increases with repeated behavior
- [ ] New preferences appear automatically
- [ ] Old preferences update (not duplicate)
- [ ] Data freshness indicator is accurate

### Profile Editing
- [ ] Edit mode activates
- [ ] Can delete preference
- [ ] Deletion requires confirmation
- [ ] Can add manual preference
- [ ] Manual preference has source='explicit'
- [ ] Changes sync to AI immediately
- [ ] Changes persist on page reload

### FTUX Onboarding
- [ ] Onboarding shows on first login
- [ ] Can skip optional steps
- [ ] Data saves correctly
- [ ] Onboarding doesn't repeat
- [ ] Can restart onboarding from settings
- [ ] Critical allergies are emphasized
- [ ] Profile is populated after completion

---

## Privacy & Security Considerations

### Data Access
- ✅ RLS policies already protect user data
- ✅ Member data inherits user-level protection
- ⚠️ Ensure member_id can't be used to access other users' members

### Data Deletion
- ✅ "Clear All Data" should delete all memory tables
- ✅ Deleting member should cascade to their preferences
- ⚠️ Consider "archive" instead of hard delete for analytics

### GDPR Compliance
- ✅ User can view all data we have
- ✅ User can delete all data
- ✅ User can export data (future: add JSON export)
- ✅ Clear consent for data collection

### Children's Privacy (COPPA)
- ⚠️ If age < 13, extra protections needed
- ⚠️ Consider parental consent flow for children
- ⚠️ Limit data collection for children
- ⚠️ Consider "kids mode" with restricted features

---

## API Endpoints Needed

### Profile Management

**GET `/api/profile`**
- Returns user profile with stats
- Response: `{ profile, stats: ProfileStats }`

**PATCH `/api/profile`**
- Updates profile fields
- Body: `{ household?: Household, preferences?: Preferences }`

**GET `/api/profile/members`**
- Returns household members list
- Response: `{ members: HouseholdMember[] }`

**POST `/api/profile/members`**
- Adds household member
- Body: `{ name, age, relationship, dietary, allergies }`
- Response: `{ member: HouseholdMember }`

**PATCH `/api/profile/members/:memberId`**
- Updates household member
- Body: `{ name?, age?, dietary?, allergies? }`

**DELETE `/api/profile/members/:memberId`**
- Deletes household member
- Cascades to preferences (or archives)

### Memory Management

**GET `/api/memory/context`**
- Current: `?userId=xxx`
- New: `?userId=xxx&memberId=xxx` (optional)

**DELETE `/api/memory/preferences/:id`**
- Deletes specific preference
- Already implemented in memory system

**POST `/api/memory/preferences`**
- Manually add preference
- Body: `{ type, key, confidence, reason, memberId? }`

**DELETE `/api/memory/clear`**
- Deletes all user memory data
- Requires confirmation token

---

## Questions to Resolve

1. **Member Attribution UX:**
   - Should we ask "Who is this for?" every time? (annoying)
   - Or infer based on product type? (less accurate)
   - Or ask once per session? (good balance)
   - **Recommendation:** Ask once per session, with option to change

2. **Children's Ages:**
   - Store exact age or age range?
   - Update automatically each year?
   - **Recommendation:** Store birthdate, calculate age dynamically

3. **Shared Items:**
   - What if item is for "whole family"?
   - Store as member_id=NULL or member_id='family'?
   - **Recommendation:** NULL = primary user, 'family' = shared

4. **Member Deletion:**
   - Hard delete or soft delete (archive)?
   - What happens to their preferences?
   - **Recommendation:** Soft delete with cascade to preferences

5. **Onboarding Timing:**
   - Force onboarding or allow skip?
   - When to trigger re-verification?
   - **Recommendation:** Allow skip, re-verify every 3 months

---

## Success Metrics

### Phase 1.5 (Profile UI)
- [ ] 80%+ users visit profile page in first week
- [ ] Average session time on profile: 30+ seconds
- [ ] Profile completion rate: 60%+

### Phase 1.6 (Household Members)
- [ ] 40%+ users add at least one household member
- [ ] Average household size: 2.5+ members
- [ ] Member attribution usage: 30%+ of shopping sessions

### Phase 1.7 (Profile Editing)
- [ ] 20%+ users manually edit preferences
- [ ] Preference deletion rate: <5% (indicates accurate learning)
- [ ] Manual additions: 10%+ of preferences

### Phase 1.8 (FTUX)
- [ ] 90%+ new users complete onboarding
- [ ] Skip rate: <20%
- [ ] Time to complete: <3 minutes average

---

## Next Steps

1. **Immediate (While User Tests Phase 0):**
   - Review and refine this spec
   - Create UI mockups in Figma (optional)
   - Prepare database migration 002

2. **Week 1:**
   - Build profile UI (Phase 1.5)
   - Test profile viewing

3. **Week 2:**
   - Run migration 002
   - Build household member features (Phase 1.6)
   - Test member attribution

4. **Week 3-4:**
   - Add profile editing (Phase 1.7)
   - Build FTUX onboarding (Phase 1.8)

---

**Status:** 📋 Spec Ready for Review
**Estimated Effort:** 4-6 weeks (1.5 developer)
**Dependencies:** Phase 0 Memory System (✅ Complete)
**Blocking:** None
