# Synthesized Roadmap: Phase 2 Intelligence

**Last Updated:** December 4, 2024
**Status:** Ready to Begin
**Philosophy:** Build on what exists, connect the dots, add missing pieces

---

## 🎯 Current State Analysis

### ✅ Already Built (Phase 1)
- **Personalization Foundation**
  - User maturity scoring (5 tiers)
  - Preference generation from purchases
  - Product ranking algorithm
  - Carousel UI for ranked products

- **Intelligence Infrastructure**
  - Mission detection system (`missions.ts`)
  - Funnel tracking (`funnel.ts`)
  - Memory system with DB layer (`memory/index.ts`)
  - Replenishment suggestions (`replenishment.ts`)
  - Adaptive verbosity (`verbosity.ts`)

### 🔌 Not Connected Yet
- Ranking algorithm exists but **AI doesn't use it**
- Mission detection exists but **not integrated with AI**
- Memory system exists but **no UI to view/edit**
- Replenishment exists but **not proactive**
- Funnel tracking exists but **no analytics dashboard**

### 🎯 Missing Pieces
- Decision trees for high-consideration purchases
- Life stage detection and transitions
- Cyclical pattern recognition
- Predictive restocking
- Memory visualization UI

---

## 📋 Phase 2: Connect + Enhance

### Sprint 1: Connect the Foundation (Week 1)
**Goal:** Make existing systems work together

#### 1.1 AI-Driven Ranking Integration
**What:** Connect ranking algorithm to AI responses

**Tasks:**
- [x] Ranking algorithm built (`ranking.ts`) ✅
- [ ] Create `/api/products/rank` endpoint
- [ ] Integrate with chat API route
- [ ] Update AI prompt to request ranked products
- [ ] Add carousel block generation to AI responses

**Why This First:** Quick win - makes the carousel actually work with real preferences

**Files:**
```
src/app/api/products/rank/route.ts        (new)
src/app/api/chat/route.ts                 (modify)
src/lib/prompts.ts                        (modify)
```

**Success:** User asks "I need milk" → AI returns carousel with personalized rankings

---

#### 1.2 Mission-Aware AI Responses
**What:** AI adapts response format based on detected mission

**Tasks:**
- [x] Mission detection built (`missions.ts`) ✅
- [ ] Integrate mission detection in chat flow
- [ ] Update AI prompt with mission-specific instructions
- [ ] Add mission context to AI requests
- [ ] Track mission lifecycle in database

**Why This First:** Makes the AI "understand" what type of shopping trip this is

**Files:**
```
src/app/api/chat/route.ts                 (modify)
src/lib/prompts.ts                        (modify)
src/lib/missions.ts                       (enhance)
```

**Mission Types & Responses:**
- **Precision** ("I need milk") → Carousel with ranked options
- **Essentials** ("Weekly groceries") → Shopping list with favorites
- **Recipe** ("Pasta dinner") → Recipe block + ingredients
- **Event** ("Birthday party") → Multi-category list + suggestions
- **Research** ("What's organic?") → Educational response

**Success:** Different query types get appropriate response formats

---

#### 1.3 Memory-Powered Suggestions
**What:** Use memory system to power proactive suggestions

**Tasks:**
- [x] Memory system built (`memory/index.ts`) ✅
- [x] Replenishment system built (`replenishment.ts`) ✅
- [ ] Surface replenishment suggestions on welcome screen
- [ ] Add "based on your history" context to suggestions
- [ ] Use memory patterns in AI responses

**Why This First:** Shows value of memory system to users immediately

**Files:**
```
src/components/chat/WelcomeScreen.tsx     (enhance)
src/app/api/chat/route.ts                 (modify)
```

**Success:** Welcome screen shows "Time to restock: Milk (you buy every 7 days)"

---

### Sprint 2: Decision Intelligence (Week 2)
**Goal:** Add structured guidance for complex purchases

#### 2.1 High-Consideration Detection
**What:** Identify when user needs guided decision flow

**Tasks:**
- [ ] Build category classifier for high-consideration items
- [ ] Define decision trees for key categories:
  - Furniture (size, style, material, budget)
  - Electronics (use case, specs, brand, budget)
  - Baby gear (age, safety, budget)
- [ ] Integrate detection into mission system

**Files:**
```
src/lib/decisions/classifier.ts           (new)
src/lib/decisions/trees.ts                (new)
src/types/index.ts                        (add DecisionTree types)
```

**Decision Tree Structure:**
```typescript
interface DecisionTree {
  category: string
  steps: DecisionStep[]
}

interface DecisionStep {
  id: string
  question: string
  type: 'single' | 'multiple' | 'range' | 'visual'
  options: DecisionOption[]
  impact: string  // What this filters/sorts
}
```

---

#### 2.2 Progressive Question Flow
**What:** Multi-turn conversation for complex decisions

**Tasks:**
- [ ] Build question flow engine
- [ ] Track user answers in conversation context
- [ ] Allow back/forward navigation
- [ ] Generate final recommendations from answers

**Files:**
```
src/lib/decisions/flow.ts                 (new)
src/app/api/chat/route.ts                 (modify)
```

**Example Flow:**
```
User: "I need a couch"
AI: Detects furniture/high-consideration

Step 1: "What size room is this for?"
→ User: "Large living room"
→ AI stores: { room_size: 'large' }

Step 2: "What's your style preference?" [shows visual options]
→ User selects: Modern
→ AI stores: { style: 'modern' }

Step 3: "Do you have pets or kids?"
→ User: "2 dogs"
→ AI stores: { has_pets: true, durability_required: true }

Step 4: "What's your budget range?"
→ User: "$1000-$1500"
→ AI stores: { budget_min: 1000, budget_max: 1500 }

Final: Generate carousel with:
- Size: Large (90"+ sectional)
- Style: Modern
- Material: Durable fabric (pet-friendly)
- Price: $1000-$1500
- Ranked by user's past furniture preferences
```

---

#### 2.3 Visual Selection UI
**What:** Rich UI for decision steps

**Tasks:**
- [ ] Build VisualChoice component (image-based selection)
- [ ] Build RangeSelector component (budget/size sliders)
- [ ] Build FeatureSelector component (multi-select)
- [ ] Add to block parser

**Files:**
```
src/components/blocks/VisualChoice.tsx    (new)
src/components/blocks/RangeSelector.tsx   (new)
src/components/blocks/FeatureSelector.tsx (new)
src/lib/parser.ts                         (modify)
```

**Visual Choice Example:**
```
┌─────────────────────────────────────┐
│ What's your style preference?       │
├─────────────────────────────────────┤
│  ┌───────┐  ┌───────┐  ┌───────┐  │
│  │ [IMG] │  │ [IMG] │  │ [IMG] │  │
│  │Modern │  │Classic│  │Rustic │  │
│  └───────┘  └───────┘  └───────┘  │
└─────────────────────────────────────┘
```

**Success:** User can visually select preferences, feels guided not interrogated

---

### Sprint 3: Lifecycle Intelligence (Week 3)
**Goal:** Understand and predict life stage transitions

#### 3.1 Life Stage Detection
**What:** Infer life stage from purchase patterns

**Tasks:**
- [ ] Build life stage classifier from purchase history
- [ ] Define lifecycle calendars for key categories:
  - Baby/toddler (0-3 years): diaper sizes, food transitions
  - School age (3-12 years): lunch items, school supplies
  - Pet ownership: food type, toy age-appropriateness
- [ ] Detect transitions (newborn → baby → toddler)
- [ ] Store life stage in user profile

**Files:**
```
src/lib/patterns/lifecycle.ts             (new)
src/lib/patterns/transitions.ts           (new)
src/types/index.ts                        (add LifeStage types)
```

**Example Detection:**
```javascript
// User purchases
purchases = [
  { product: "Newborn diapers size 1", date: "2024-06-01" },
  { product: "Newborn diapers size 1", date: "2024-06-15" },
  { product: "Infant formula 0-6mo", date: "2024-06-20" },
  { product: "Infant diapers size 2", date: "2024-08-01" },  // Transition!
]

// Detected lifecycle
lifecycle = {
  category: "baby",
  stage: "infant_6mo",
  started: "2024-06-01",
  transitions: [
    { from: "newborn", to: "infant_6mo", date: "2024-08-01" }
  ],
  predicted_next: {
    stage: "baby_12mo",
    date: "2024-12-01",
    confidence: 0.85
  }
}
```

---

#### 3.2 Predictive Restocking with Context
**What:** Predict restocking needs with lifecycle awareness

**Tasks:**
- [x] Basic replenishment built (`replenishment.ts`) ✅
- [ ] Add consumption rate tracking per product
- [ ] Adjust predictions for lifecycle transitions
- [ ] Proactive "due soon" suggestions
- [ ] Smart bundling (suggest related items together)

**Files:**
```
src/lib/patterns/consumption.ts           (new)
src/lib/replenishment.ts                  (enhance)
```

**Example Prediction:**
```javascript
// Milk consumption
pattern = {
  product: "Organic Valley 2% Milk",
  avg_frequency_days: 7,
  last_purchase: "2024-11-28",
  predicted_next: "2024-12-05",
  confidence: 0.92
}

// Lifecycle-aware adjustment
lifecycle_context = {
  baby_age_months: 8,
  transitioning_to_whole_milk: true  // Detected from research queries
}

// Proactive suggestion on Dec 4
suggestion = {
  message: "Running low on milk? You might want to try whole milk now that baby is 8 months.",
  items: [
    { sku: "milk-org-2p", name: "Organic Valley 2%" },        // Usual
    { sku: "milk-org-whole", name: "Organic Valley Whole" }  // Lifecycle suggestion
  ]
}
```

---

#### 3.3 Macro-Scale Memory Timeline
**What:** Visual timeline of shopping history and life events

**Tasks:**
- [ ] Build timeline from order history
- [ ] Detect major life events from purchase shifts
- [ ] Create "memory cards" for transitions
- [ ] Use in AI responses for context

**Files:**
```
src/lib/patterns/timeline.ts              (new)
src/lib/patterns/events.ts                (new)
```

**Example Timeline:**
```
2024 Shopping Timeline
├─ June: New parent detected 🍼
│  └─ First purchases: diapers, formula, infant items
├─ August: Baby growth transition
│  └─ Size 1 → Size 2 diapers, 0-6mo → 6-12mo formula
├─ October: Solid foods started
│  └─ First baby food pouches, sippy cups
└─ December: Approaching whole milk transition
   └─ Predicted need: whole milk, toddler snacks
```

**AI Context:**
```
"You started buying baby items 6 months ago. Based on typical growth
patterns, your little one is probably ready for whole milk soon. Want
me to add that to your next order?"
```

**Success:** AI references user's shopping journey naturally

---

### Sprint 4: Transparency & Control (Week 4)
**Goal:** Let users see and manage what AI knows

#### 4.1 Memory Map UI
**What:** Visual interface for all learned preferences

**Tasks:**
- [x] Memory DB system built ✅
- [ ] Create `/memory` page
- [ ] Show all preferences with confidence scores
- [ ] Group by category (Brands, Dietary, Products, Life Stage)
- [ ] Visual confidence indicators

**Files:**
```
src/app/memory/page.tsx                   (new)
src/components/memory/PreferenceCard.tsx  (new)
src/components/memory/LifeStageCard.tsx   (new)
```

**UI Design:**
```
┌──────────────────────────────────────────┐
│ Your Shopping Memory                     │
├──────────────────────────────────────────┤
│ 🏷️  Brand Preferences                    │
│ ┌────────────────────────────────────┐  │
│ │ Organic Valley         ████████ 95%│  │
│ │ Bought 12 times • Last: Nov 28     │  │
│ │ [✓ This is correct] [✗ Remove]     │  │
│ └────────────────────────────────────┘  │
│ ┌────────────────────────────────────┐  │
│ │ Dave's Killer Bread    ██████░░ 78%│  │
│ │ Bought 5 times • Last: Nov 20      │  │
│ │ [✓ Confirm] [✗ Not my preference]  │  │
│ └────────────────────────────────────┘  │
├──────────────────────────────────────────┤
│ 🍼 Life Stage                            │
│ ┌────────────────────────────────────┐  │
│ │ New Parent (8 months)              │  │
│ │ Started: June 2024                 │  │
│ │ Predicted transition: Whole milk   │  │
│ │ [View timeline] [Edit]             │  │
│ └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

#### 4.2 Preference Editing
**What:** Let users correct, confirm, or remove preferences

**Tasks:**
- [ ] Build preference CRUD API
- [ ] Add confirm/remove actions
- [ ] Allow manual preference addition
- [ ] Show impact of changes
- [ ] Sync with AI context immediately

**Files:**
```
src/app/api/preferences/route.ts          (new)
src/lib/personalization/preferences.ts    (enhance)
```

**User Flow:**
```
User clicks "Remove" on "Dave's Killer Bread 78%"
→ Confirmation: "This will affect bread recommendations"
→ User confirms
→ Preference deleted from DB
→ Next AI response: bread recommendations don't prioritize DKB
```

---

#### 4.3 Learning Transparency
**What:** Explain how AI learned each preference

**Tasks:**
- [ ] Show evidence for each preference
- [ ] Link to orders that contributed
- [ ] Explain confidence calculation
- [ ] Timeline of learning

**Files:**
```
src/components/memory/LearningExplanation.tsx  (new)
src/app/api/memory/evidence/route.ts           (new)
```

**Example:**
```
┌────────────────────────────────────────┐
│ Organic Valley (95% confidence)       │
├────────────────────────────────────────┤
│ How did we learn this?                 │
│                                         │
│ 📅 Purchase History (12 purchases)     │
│ • Jun 15: Organic Valley 2% Milk       │
│ • Jun 22: Organic Valley 2% Milk       │
│ • Jun 29: Organic Valley Butter        │
│ ... 9 more                             │
│                                         │
│ 🧮 Confidence Breakdown                │
│ • Frequency: 12 purchases = +70%       │
│ • Recency: Last week = +10%            │
│ • Consistency: Never bought alt = +15% │
│ • Total: 95%                           │
│                                         │
│ [View all orders] [This is correct ✓]  │
└────────────────────────────────────────┘
```

---

#### 4.4 Privacy Controls
**What:** GDPR compliance and user control

**Tasks:**
- [ ] Data export (JSON download)
- [ ] Delete all preferences
- [ ] Pause learning temporarily
- [ ] Clear conversation history
- [ ] Download order history

**Files:**
```
src/app/api/data-export/route.ts          (new)
src/components/memory/PrivacyControls.tsx (new)
```

**Success:** User feels in control, trusts the system

---

## 🎯 Key Architectural Decisions

### 1. Decision Trees vs AI Generation
**Decision:** Use **hybrid approach**
- Pre-defined decision trees for common categories (furniture, electronics)
- AI-generated follow-ups for edge cases
- **Why:** Structured flow is more reliable, AI adds flexibility

### 2. Life Stage Storage
**Decision:** Store in **user profile + memory tables**
- Profile: Current life stage (fast access)
- Memory tables: Full lifecycle timeline (analytics)
- **Why:** Fast queries for AI context, rich data for insights

### 3. Memory UI Architecture
**Decision:** **Server components + client interactivity**
- Memory map: Server-rendered for SEO/speed
- Editing: Client-side for responsiveness
- **Why:** Best of both worlds

### 4. Real-time vs Batch Updates
**Decision:** **Hybrid**
- Cart additions: Real-time preference updates
- Pattern detection: Nightly batch job
- **Why:** Balance freshness with performance

---

## 📊 Success Metrics

### Sprint 1: Foundation Connection
- [ ] 80%+ of queries use ranked products
- [ ] Mission detection accuracy >85%
- [ ] Replenishment suggestions shown on 50%+ of welcome screens

### Sprint 2: Decision Intelligence
- [ ] 60%+ completion rate on decision trees
- [ ] Average 3.5 questions before recommendation
- [ ] User satisfaction with guided flow >4/5

### Sprint 3: Lifecycle Intelligence
- [ ] Life stage detected for 70%+ of parents
- [ ] Restock predictions within ±3 days
- [ ] Lifecycle suggestions clicked 40%+ of time

### Sprint 4: Transparency
- [ ] 50%+ of users visit memory map
- [ ] <5% of preferences marked incorrect
- [ ] Trust score >80% ("AI understands me")

---

## 🚀 Quick Start (First 3 Days)

### Day 1: AI Ranking Integration
- Create `/api/products/rank` endpoint
- Integrate with chat API
- Test: "I need milk" returns personalized carousel

### Day 2: Mission Detection Integration
- Add mission detection to chat flow
- Update AI prompts for mission-aware responses
- Test: Different missions get different response formats

### Day 3: Memory-Powered Welcome Screen
- Surface replenishment suggestions
- Add "based on your history" context
- Test: Welcome screen shows personalized suggestions

**Result:** By end of Day 3, the system feels significantly smarter!

---

## 💡 Philosophy

This roadmap follows three principles:

1. **Connect First** - Use what's already built before building new
2. **Quick Wins** - Start with highest-impact, lowest-effort items
3. **User Value** - Every sprint delivers something users notice

**Next Action:** Start with Sprint 1, Task 1.1 (AI Ranking Integration) - the foundation for everything else.
