# Mission Types & Completion Strategies

**Last Updated:** December 4, 2024

---

## Overview

The mission system categorizes customer shopping journeys into 5 distinct types, each with tailored completion strategies and abandonment thresholds. This document defines the logic and behavior for each mission type.

---

## Mission Type Definitions

### 1. 🎯 PRECISION (Single Item → Basket Expansion)

**Goal:** Fast add to cart, then expand to essentials basket

#### Detection Triggers:
```
"I need milk"
"Get me bread"
"Buy eggs"
"Need dish soap"
```

#### Detection Logic:
```typescript
// Single item request
(query.includes('need') || query.includes('get') || query.includes('buy'))
&& messageCount <= 2
&& !query.includes('list')
&& !query.includes('groceries')
&& !query.includes('weekly')
&& !query.includes('stock up')
```

#### Strategy:
1. **Immediately suggest 1-2 options** for the requested item
2. **Add to cart ASAP** (no questions, minimal friction)
3. **Then expand:** "Anything else while you're here?"
4. **Convert to essentials** if they continue adding items

#### Time Window:
- **6 hours** - Very short, they want it NOW
- After 6 hours of inactivity → abandoned

#### AI Behavior:
- ⚡ **Speed is priority**
- Suggest top 1-2 items immediately
- No questions about preferences initially
- After first item added: "Got it! Anything else?"
- Suggest complementary items: "Since you're getting milk, need eggs or bread?"

#### Example Flow:
```
User: "I need milk"
AI: "Here's Great Value Whole Milk ($3.48)" [shop block with 1 item]
User: [adds to cart]
AI: "Perfect! Anything else while you're here? Eggs, bread, or other essentials?"
User: "Yeah, eggs too"
→ Mission continues, may convert to essentials basket
```

---

### 2. 🛒 ESSENTIALS (Grocery Basket Building)

**Goal:** Complete grocery list with helpful suggestions

#### Detection Triggers:
```
"Weekly groceries"
"Build a shopping list"
"Stock up for the week"
"Need groceries"
"Help me shop"
```

#### Detection Logic:
```typescript
// Basket/list building
query.includes('groceries')
|| query.includes('list')
|| query.includes('weekly')
|| query.includes('stock up')
|| query.includes('shopping')
|| messageCount >= 2  // Default after 2 turns
```

#### Strategy:
1. **Allow browsing freedom** - not rushed
2. **Suggest complementary items** as they build list
3. **Help complete categories** (dairy, produce, pantry, etc.)
4. **Encourage basket growth** with smart suggestions

#### Time Window:
- **24 hours** - More time to browse and decide
- After 24 hours of inactivity → abandoned

#### AI Behavior:
- 🛒 **Helpful and exploratory**
- Ask about household needs: "What are your essentials this week?"
- Suggest complementary items: "Since you're getting pasta, want marinara sauce?"
- Check category coverage: "I have dairy and pantry items. Need any produce?"
- Allow time for browsing and decisions

#### Example Flow:
```
User: "Help me with weekly groceries"
AI: "I'd be happy to help! What are your essentials this week?"
User: "Milk, eggs, bread, and some snacks"
AI: [shop block with milk, eggs, bread, and 2-3 snack options]
AI: "Great start! I also added butter since you're getting bread. Need any produce or pantry items?"
→ Browsing continues with helpful suggestions
```

---

### 3. 🍳 RECIPE (Ingredient Completion)

**Goal:** Ensure all recipe ingredients are covered

#### Detection Triggers:
```
"Recipe for lasagna"
"How to make chicken stir fry"
"I want to cook [dish]"
"Ingredients for [recipe]"
```

#### Detection Logic:
```typescript
query.includes('recipe')
|| query.includes('cook')
|| query.includes('make')
|| query.includes('ingredients')
```

#### Strategy:
1. **Extract all ingredients** from recipe
2. **Match to catalog** and create shop block
3. **Suggest missing ingredients** if incomplete
4. **Provide recipe instructions** with ingredients

#### Time Window:
- **7 days** (168 hours) - Event-driven but flexible

#### AI Behavior:
- 🍳 **Focus on completeness**
- Parse recipe ingredients thoroughly
- Match each ingredient to catalog items
- Suggest alternatives if exact match not available
- Check for common missing items (oil, salt, spices)

---

### 4. 🎉 EVENT (Category Coverage)

**Goal:** Complete event coverage across all categories

#### Detection Triggers:
```
"Planning a birthday party"
"Need stuff for a wedding"
"Hosting a dinner party"
"Game day supplies"
```

#### Detection Logic:
```typescript
query.includes('party')
|| query.includes('event')
|| query.includes('celebration')
|| query.includes('gathering')
|| query.includes('birthday')
|| query.includes('wedding')
```

#### Strategy:
1. **Identify event type** (birthday, wedding, game day, etc.)
2. **Determine categories needed** (food, decorations, tableware, etc.)
3. **Ask sequential questions** (age, attendees, budget, theme)
4. **Fill each category** with appropriate items
5. **Check for gaps** - "You have food and decorations. What about tableware?"

#### Time Window:
- **7 days** (168 hours) - Planning ahead, time-sensitive

#### AI Behavior:
- 🎉 **Category-focused**
- Ask key questions: attendees, budget, theme
- Suggest items by category
- Proactively check for missing categories
- Example: "For an 8-year-old's party, I have decorations and snacks. Want to add party favors and tableware?"

---

### 5. 🔍 RESEARCH (High-Consideration Purchase)

**Goal:** Build confidence through comparisons

#### Detection Triggers:
```
"I need a TV"
"Looking for a laptop"
"Best headphones"
"Compare [product] options"
```

#### Detection Logic:
```typescript
query.includes('tv')
|| query.includes('laptop')
|| query.includes('phone')
|| query.includes('appliance')
|| query.includes('compare')
|| query.includes('best')
```

#### Strategy:
1. **Ask sequential questions** about needs (room size, budget, features)
2. **Show 3-4 options** in comparison format
3. **Provide specific recommendation** with reasoning
4. **Address concerns** to build confidence
5. **Suggest accessories** after decision (cables, mounts, etc.)

#### Time Window:
- **7 days** (168 hours) - High-consideration, not rushed

#### AI Behavior:
- 🔍 **Comparison-focused**
- Ask ONE question at a time (room size → budget → features)
- Use compare blocks to show options side-by-side
- Make specific recommendation: "For your medium room and $500 budget, I'd recommend the Samsung 50""
- Provide reasoning: "Best balance of size and features for your needs"
- After decision: suggest complementary items (HDMI cable, wall mount)

---

## Abandonment Thresholds

| Mission Type | Threshold | Rationale |
|-------------|-----------|-----------|
| **Precision** | 6 hours | Single item - want it NOW, fast transaction |
| **Essentials** | 24 hours | Grocery basket - need browsing time |
| **Recipe** | 7 days | Event-driven, flexible timing |
| **Event** | 7 days | Planning ahead, time-sensitive |
| **Research** | 7 days | High-consideration, thoughtful decision |

---

## Mission Completion Signals

### Success Signals:
- **Precision:** Item added to cart → "Anything else?" → checkout or expand
- **Essentials:** Multiple items in cart → category coverage → checkout
- **Recipe:** All ingredients matched → in cart → checkout
- **Event:** All categories covered → in cart → checkout
- **Research:** Product selected → accessories added → checkout

### Warning Signals:

#### 🚨 Stuck Detection:
```
questionsAsked >= 3 && itemsAdded === 0 && funnelStage === 'browsing'
```
**Action:** Proactively suggest specific items instead of answering more questions

#### ⚠️ Near Abandonment:
```
hoursActive >= 75% of abandonThreshold
```
**Action:** Show urgency warning to AI: "Only X hours until mission abandons"

#### 💤 Paused Mission:
```
pausedAt !== null
```
**Action:** Welcome back: "You were planning a birthday party. Ready to continue?"

---

## Funnel Stage Progression

All missions progress through these stages:

```
arriving → browsing → comparing → decided → checkout
   ↓          ↓           ↓          ↓         ↓
Start    Exploring   Asking      Added    Checkout
         options     questions   to cart   clicked
```

### Stage Transitions:
- **arriving → browsing:** First message after mission detected
- **browsing → comparing:** User asks questions (3+ questions)
- **browsing/comparing → decided:** Item added to cart
- **decided → checkout:** Checkout initiated

---

## AI Prompt Context

The AI receives this context for each active mission:

```
## ACTIVE SHOPPING MISSION

**Mission:** I need milk
**Type:** precision (6hr window)
**Status:** ACTIVE

### Funnel Stage: BROWSING
- Exploring options for this mission, provide inspiration and suggestions
- Be informative but not overwhelming

### Mission Progress:
- Items viewed: 0
- Items added to cart: 0
- Questions asked: 0
- Last active: just now

### MISSION COMPLETION STRATEGY:
🎯 QUICK ADD → EXPAND BASKET - (1) Add requested item to cart ASAP, (2) Then ask: "Anything else while you're here?" to expand to essentials basket

**Your Goal:** Help complete this mission by guiding them to find suitable items

**Expected Next Action:** Not set - infer from context and guide them forward
```

---

## Mission Conversion Flows

### Precision → Essentials:
```
User: "I need milk"           [precision mission created]
AI: [adds milk to cart]
AI: "Anything else?"
User: "Yeah, eggs and bread"  [continues adding items]
→ Mission stays precision but behaves like essentials (basket building)
```

### Research → Precision:
```
User: "I need a TV"           [research mission created]
AI: [asks questions, shows comparisons]
User: "Actually, just get me the cheapest one"
→ Mission stays research but shifts to quick decision
```

---

## Best Practices

### DO:
✅ Detect mission type early (1-2 turns)
✅ Adapt behavior to mission type
✅ Track progress metrics (items viewed, added, questions)
✅ Provide clear completion signals
✅ Nudge when approaching abandonment
✅ Welcome back paused missions

### DON'T:
❌ Ask multiple questions at once (sequential only)
❌ Overwhelm precision missions with options
❌ Rush essentials missions to checkout
❌ Ignore category gaps in event missions
❌ Skip comparisons in research missions
❌ Abandon missions without time-based logic

---

## Testing Checklist

### Precision Mission:
- [ ] "I need milk" creates precision mission
- [ ] AI suggests 1-2 options immediately
- [ ] Item added to cart within 1-2 turns
- [ ] AI asks "Anything else?" after first item
- [ ] Abandons after 6 hours of inactivity

### Essentials Mission:
- [ ] "Weekly groceries" creates essentials mission
- [ ] AI allows browsing and asks helpful questions
- [ ] Suggests complementary items
- [ ] Checks category coverage
- [ ] Abandons after 24 hours of inactivity

### Recipe Mission:
- [ ] "Recipe for lasagna" creates recipe mission
- [ ] AI extracts all ingredients
- [ ] Matches ingredients to catalog
- [ ] Suggests missing ingredients
- [ ] Abandons after 7 days

### Event Mission:
- [ ] "Birthday party" creates event mission
- [ ] AI asks sequential questions (age, attendees, budget)
- [ ] Suggests items by category
- [ ] Checks for missing categories
- [ ] Abandons after 7 days

### Research Mission:
- [ ] "I need a TV" creates research mission
- [ ] AI asks sequential questions (ONE at a time)
- [ ] Shows 3-4 options in compare block
- [ ] Makes specific recommendation
- [ ] Suggests accessories after decision
- [ ] Abandons after 7 days

---

**Implementation:** `src/lib/missions.ts`
**Database Migration:** `supabase/migrations/003_mission_funnels.sql`
**AI Prompt Integration:** `src/lib/prompts.ts`
