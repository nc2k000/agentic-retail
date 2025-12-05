# Phase 2: Intelligence - Advanced Personalization

**Last Updated:** December 4, 2024
**Status:** Ready to Begin
**Estimated Duration:** 2-3 weeks

---

## 🎯 Overview

Phase 1 built the foundation (maturity scoring, preferences, ranking). **Phase 2: Intelligence** focuses on making the AI truly smart about shopping patterns, life stages, and high-consideration purchases.

**Goal:** Move beyond simple product recommendations to understanding **when**, **why**, and **how** users shop.

---

## 📋 Phase 2 Objectives

### 1. Decision Tree Architecture (Week 1)
**Current State:** All shopping treated equally (milk = mattress)
**Goal:** Structured flow for high-consideration purchases

#### What is High-Consideration?
Items that require multiple steps, comparisons, and decisions:
- **Furniture** - "I need a couch" requires size, style, material, budget
- **Electronics** - "I need a laptop" requires specs, brand, price range
- **Baby gear** - "I need a car seat" requires safety, age, budget
- **Appliances** - "I need a dishwasher" requires dimensions, features

#### Decision Tree Structure
```
User: "I need a couch"
├─ Step 1: Size
│  ├─ "What size room?" → Sectional vs 3-seater vs loveseat
│  └─ Follow-up: "How many people typically sit?"
├─ Step 2: Style
│  ├─ "What's your decor style?" → Modern, Traditional, Mid-century
│  └─ Show carousel of style examples
├─ Step 3: Material
│  ├─ "Do you have pets/kids?" → Durable fabric vs leather
│  └─ "Budget range?" → Filter options
└─ Final: Ranked recommendations
   └─ Carousel with top 3-5 options
   └─ Comparison chart
```

#### Implementation Tasks

**1.1 High-Consideration Detection**
- [ ] Create category classifier for high-consideration items
- [ ] Map categories to decision trees:
  - Furniture → Size, Style, Material, Budget
  - Electronics → Use case, Specs, Brand preference, Budget
  - Baby gear → Age/weight, Safety features, Budget
- [ ] Detect high-consideration from user query

**Files to Create:**
- `src/lib/decisions/classifier.ts` - Detect high-consideration categories
- `src/lib/decisions/trees.ts` - Decision tree definitions
- `src/types/index.ts` - Add DecisionTree types

**1.2 Progressive Question Flow**
- [ ] Build question step system
- [ ] Track user's progress through decision tree
- [ ] Store partial answers in conversation context
- [ ] Allow users to go back and change answers

**Files to Create:**
- `src/lib/decisions/flow.ts` - Decision flow engine
- `src/components/blocks/DecisionStep.tsx` - Question UI component

**1.3 Multi-Option Selection UI**
- [ ] Build visual selection component (not just text chips)
- [ ] Image-based choices (show couch styles, not just names)
- [ ] Multi-select where appropriate (features, colors)
- [ ] Budget slider component

**Files to Create:**
- `src/components/blocks/VisualChoice.tsx` - Image selection
- `src/components/blocks/RangeSelector.tsx` - Budget/size slider
- `src/components/blocks/FeatureSelector.tsx` - Multi-select features

**Success Criteria:**
- User asks "I need a couch" → AI starts decision tree
- AI asks 3-4 progressive questions
- Final recommendations are highly relevant
- User can review/change answers
- Feels guided, not interrogated

---

### 2. Cyclical Shopping Patterns (Week 2)
**Current State:** No memory of life stage or macro patterns
**Goal:** Understand and predict life stage transitions

#### What Are Cyclical Patterns?

**Life Stages:**
- **New parent** (0-6 months) → Diapers, formula, infant toys
- **Baby** (6-12 months) → Solid food, high chair, sippy cups
- **Toddler** (1-3 years) → Snacks, pull-ups, learning toys
- **Preschool** (3-5 years) → Lunch boxes, backpacks, school supplies
- **School age** (5-12 years) → After-school snacks, sports gear

**Seasonal:**
- **Back to school** (July-Aug) → Supplies, lunch items, clothes
- **Holiday season** (Nov-Dec) → Baking, gifts, party supplies
- **Summer** (May-Aug) → BBQ, sunscreen, outdoor toys
- **Football season** (Sep-Jan) → Game day snacks

**Event-Driven:**
- **Moving** → Cleaning supplies, storage, basics
- **New pet** → Food, toys, training supplies
- **Diet change** → New product categories

#### Implementation Tasks

**2.1 Life Stage Detection**
- [ ] Infer life stage from purchase patterns
- [ ] Detect transitions (buying diapers size 1 → predict size 2 soon)
- [ ] Create lifecycle calendars per category
- [ ] Proactive suggestions before transition

**Files to Create:**
- `src/lib/patterns/lifecycle.ts` - Life stage detection
- `src/lib/patterns/transitions.ts` - Predict next stage
- `src/types/index.ts` - Add LifeStage types

**2.2 Predictive Restocking**
- [ ] Calculate consumption rate per product
- [ ] Predict "due for restock" dates
- [ ] Suggest reorder before running out
- [ ] Adjust for seasonal changes

**Example:**
```
User buys milk every 7 days
→ Last purchase: Nov 28
→ Predicted next: Dec 5
→ Proactive message on Dec 4: "Running low on milk?"
```

**Files to Create:**
- `src/lib/patterns/consumption.ts` - Consumption rate calculator
- `src/lib/patterns/restock.ts` - Restock prediction

**2.3 Macro-Scale Memory**
- [ ] Build timeline view of user's shopping history
- [ ] Detect major life events from purchase shifts
- [ ] Create "memory cards" for major transitions
- [ ] Use lifecycle context in recommendations

**Example Memory Card:**
```
🍼 New Parent (Detected: Jun 2024)
- First diaper purchase: June 15
- Formula started: June 18
- Current stage: 6-month baby
- Predicted transition to solids: Dec 2024
- Upcoming needs: High chair, sippy cups, baby food
```

**Files to Create:**
- `src/lib/patterns/timeline.ts` - Shopping timeline builder
- `src/lib/patterns/events.ts` - Life event detection

**Success Criteria:**
- System detects user is new parent from purchases
- Proactively suggests next-stage items before asked
- Predicts restocking needs accurately (±2 days)
- Shows "You started buying X 3 months ago" context
- Feels like it "knows" your family

---

### 3. Memory Map Visualization (Week 3)
**Current State:** Preferences are invisible to users
**Goal:** Transparency and control over what AI knows

#### What Is a Memory Map?

A visual interface showing:
1. **What we know** - Brands, dietary, favorites
2. **How we learned it** - "Bought 5x", "You told us"
3. **Confidence level** - 95% sure vs 60% guess
4. **Edit controls** - Correct, remove, or confirm

#### Implementation Tasks

**3.1 Memory Visualization UI**
- [ ] Build memory map page (`/memory`)
- [ ] Show all preferences with confidence scores
- [ ] Group by category (Brands, Dietary, Products, Life Stage)
- [ ] Visual confidence indicators (progress bars, badges)

**Files to Create:**
- `src/app/memory/page.tsx` - Memory map UI
- `src/components/memory/PreferenceCard.tsx` - Individual preference
- `src/components/memory/LifeStageCard.tsx` - Life stage timeline

**Example UI:**
```
┌─────────────────────────────────────┐
│ 🏷️  Brand Preferences               │
├─────────────────────────────────────┤
│ Organic Valley        ████████ 95%  │
│ You bought 12 times                  │
│ [✓ Confirmed] [✗ Not my preference] │
├─────────────────────────────────────┤
│ Dave's Killer Bread   ██████░░ 78%  │
│ You bought 5 times                   │
│ [✓ Confirm] [✗ Remove]              │
└─────────────────────────────────────┘
```

**3.2 Preference Editing**
- [ ] Allow users to confirm preferences (boost confidence)
- [ ] Allow users to remove preferences
- [ ] Allow users to manually add preferences
- [ ] Show impact: "This will affect X recommendations"

**Files to Modify:**
- `src/app/api/preferences/route.ts` - CRUD operations
- `src/lib/personalization/preferences.ts` - Manual updates

**3.3 Learning Explanation**
- [ ] Show "How did we learn this?" for each preference
- [ ] Timeline of evidence (purchase history)
- [ ] Explain confidence score calculation
- [ ] Link to orders that influenced learning

**Example:**
```
🌱 Organic preference (87% confidence)

We learned this from:
• 15 of 20 produce items were organic (75%)
• 8 of 10 dairy items were organic (80%)
• You bought organic milk 12 times

[View orders] [This is correct ✓] [Not my preference ✗]
```

**Files to Create:**
- `src/components/memory/LearningExplanation.tsx` - Evidence display

**3.4 Privacy Controls**
- [ ] Export all data (GDPR compliance)
- [ ] Delete all preferences
- [ ] Pause learning temporarily
- [ ] See what data is stored

**Files to Create:**
- `src/app/api/data-export/route.ts` - JSON export
- `src/components/memory/PrivacyControls.tsx` - Settings

**Success Criteria:**
- User can see all learned preferences
- Confidence scores are clear and accurate
- Users can easily correct mistakes
- Transparency builds trust
- Data export works correctly

---

## 🗓️ Implementation Timeline

### Week 1: Decision Trees
**Goal:** High-consideration purchases feel guided

- Day 1-2: Build classifier and decision tree definitions
- Day 3-4: Create progressive question flow
- Day 5: Build visual selection UI components
- Test: "I need a couch" flows through full decision tree

---

### Week 2: Cyclical Patterns
**Goal:** Proactive suggestions based on life stage

- Day 1-2: Life stage detection from purchases
- Day 3-4: Consumption rate and restock prediction
- Day 5: Macro-scale memory and timeline
- Test: System predicts next-stage baby items

---

### Week 3: Memory Visualization
**Goal:** Users understand and control their data

- Day 1-2: Build memory map UI
- Day 3-4: Preference editing and explanations
- Day 5: Privacy controls and data export
- Test: User can review, edit, and export all data

---

## 📊 Success Metrics

### User Experience
- **Decision Tree Completion Rate:** 70%+ of high-consideration flows complete
- **Restock Prediction Accuracy:** Within ±3 days of actual purchase
- **Memory Map Engagement:** 40%+ of users visit memory page
- **Preference Corrections:** <10% of preferences marked as incorrect

### Business Impact
- **Average Order Value:** +25% on guided high-consideration purchases
- **Repeat Purchase Rate:** +30% with predictive restocking
- **User Trust Score:** >80% feel system understands their needs

### Technical
- **Decision Tree Performance:** <200ms to determine next question
- **Pattern Detection Latency:** Updates within 1 hour of purchase
- **Memory Map Load Time:** <500ms for full preference list

---

## 🚀 Quick Wins

Start with these for immediate impact:

1. **Basic Decision Tree** - Just one category (couches)
   - Validate the UX before building all categories
   - Get user feedback on question flow

2. **Simple Restock Prediction** - Milk/eggs/bread only
   - High-frequency items are easiest to predict
   - Quick win that users immediately notice

3. **Minimal Memory Map** - Just show brand preferences
   - Build trust with transparency
   - Iterate based on user feedback

---

## 🎯 Phase 2 End Goal

By the end of Phase 2, the system should:

✅ **Understand complex purchases** - Guide users through multi-step decisions
✅ **Predict lifecycle needs** - Suggest next-stage items proactively
✅ **Be transparent** - Users can see and control what you know
✅ **Feel intelligent** - Not just recommendations, but understanding

**Next:** Phase 3 will focus on Operations (Walmart API, multi-store, advanced cart features)

---

**Ready to start?** I recommend beginning with a **basic decision tree for one category** (furniture/couches) to validate the UX before building the full system.
