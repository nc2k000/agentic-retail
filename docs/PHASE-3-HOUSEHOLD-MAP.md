# Phase 3: Household Map - Progressive Discovery System

**Status:** 🚧 In Progress
**Started:** December 5, 2024
**Goal:** Build a deterministic memory map of the customer, their family, their house, and their life

---

## 🎯 Vision: The Robotic Vacuum Approach

Like a robotic vacuum that progressively maps a house, this system:
- **Discovers gradually**: Every interaction reveals new household facts
- **Builds a complete map**: Physical space, people, pets, lifestyle, habits
- **Uses the map**: All search and mission types benefit from household knowledge
- **Confirms strategically**: Ask clarifying questions when confidence < 70%
- **Expands over time**: The map becomes more detailed with each shopping journey

### Future State: Persona Golden Pathways
- **Cluster customers** into persona types (busy parent, health enthusiast, pet lover)
- **Build golden pathways** for each persona's lifecycle
- **Enrich early customers** with persona datasets to accelerate personalization
- **Mission fulfillment** tailored to persona-specific needs

---

## 🗺️ What is the Household Map?

The Household Map is a comprehensive, deterministic knowledge graph containing:

### 1. Physical Space
- Property type (house, apartment, condo)
- Size (bedrooms, bathrooms, square footage)
- Features (backyard, pool, garage, home office)
- Location context (urban, suburban, rural)

### 2. People & Pets
- Household members (adults, children, babies)
- Ages and life stages
- Dietary restrictions and allergies
- Health conditions and preferences
- Pets (type, breed, age, dietary needs)

### 3. Lifestyle & Habits
- Cooking frequency (daily chef, occasional cook, meal prep warrior)
- Entertaining style (frequent host, intimate gatherings, never hosts)
- Fitness level (gym regular, weekend warrior, sedentary)
- Work style (WFH full-time, hybrid, office-based)
- Hobbies and interests

### 4. Discovered Patterns
- Meal rotation (Taco Tuesday, Pizza Friday)
- Seasonal habits (BBQ season, holiday baking)
- Event preparation (birthdays, school lunches)
- Replenishment cycles (weekly milk, monthly cleaning supplies)

### 5. Confidence Tracking
- Each fact has a confidence score (0-100%)
- Facts below 70% trigger strategic confirmation questions
- Multiple data points increase confidence
- Contradictions trigger re-confirmation

---

## 🏗️ System Architecture

### Database Schema: `household_facts`

```sql
CREATE TABLE household_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Fact categorization
  category TEXT NOT NULL, -- 'physical_space', 'people', 'pets', 'lifestyle', 'patterns'
  subcategory TEXT NOT NULL, -- 'property_type', 'household_member', 'cooking_frequency', etc.

  -- Fact content
  fact_key TEXT NOT NULL, -- 'property_type', 'has_baby', 'cooking_frequency'
  fact_value JSONB NOT NULL, -- Flexible: string, number, object, array

  -- Confidence & provenance
  confidence REAL NOT NULL DEFAULT 0.5, -- 0.0 to 1.0
  data_points INTEGER NOT NULL DEFAULT 1, -- Number of supporting observations
  last_confirmed_at TIMESTAMPTZ, -- When user explicitly confirmed

  -- Source tracking
  discovered_from TEXT, -- 'purchase_pattern', 'explicit_answer', 'life_stage_detection', etc.
  supporting_evidence JSONB[], -- Array of evidence objects

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, fact_key)
);

CREATE INDEX idx_household_facts_user_id ON household_facts(user_id);
CREATE INDEX idx_household_facts_category ON household_facts(category);
CREATE INDEX idx_household_facts_confidence ON household_facts(confidence);
```

### TypeScript Types

```typescript
export interface HouseholdFact {
  id: string
  userId: string
  category: 'physical_space' | 'people' | 'pets' | 'lifestyle' | 'patterns'
  subcategory: string
  factKey: string
  factValue: any
  confidence: number
  dataPoints: number
  lastConfirmedAt?: string
  discoveredFrom: string
  supportingEvidence: Evidence[]
  createdAt: string
  updatedAt: string
}

export interface Evidence {
  type: 'purchase' | 'answer' | 'behavior' | 'inference'
  timestamp: string
  details: any
  weight: number // How much this evidence contributes to confidence
}

export interface HouseholdMap {
  userId: string
  completeness: number // 0-100% - how much of the map is filled
  facts: HouseholdFact[]

  // Aggregated views
  physicalSpace: PhysicalSpaceMap
  people: PersonProfile[]
  pets: PetProfile[]
  lifestyle: LifestyleProfile
  patterns: DiscoveredPattern[]

  // Strategic gaps
  lowConfidenceFacts: HouseholdFact[] // confidence < 70%
  suggestedQuestions: ConfirmationQuestion[] // What to ask next
}
```

---

## 🔍 Progressive Discovery Engine

### Discovery Sources

1. **Purchase Pattern Analysis** (automatic)
   - Detect baby products → `has_baby: true, baby_age: "0-12 months"`
   - Bulk purchases → `household_size: 4+`
   - Organic preference → `dietary_preference: "organic"`
   - Pet food → `has_pets: true, pet_types: ["dog"]`

2. **Life Stage Detection** (automatic)
   - Young family → `life_stage: "young_family"`
   - School-age kids → `has_school_age_children: true`

3. **Explicit Answers** (high confidence)
   - User answers decision tree questions
   - Direct statements in chat ("I have a baby")
   - Profile form submissions

4. **Behavioral Inference** (medium confidence)
   - Shopping time patterns → `work_schedule: "WFH"`
   - Category exploration → `interests: ["cooking", "fitness"]`
   - Order frequency → `cooking_frequency: "daily"`

5. **Cross-Reference Validation** (increases confidence)
   - Multiple purchases of same type
   - Consistent patterns over time
   - Non-contradictory signals

### Discovery Algorithm

```typescript
async function discoverFactsFromPurchase(userId: string, orderItems: any[]) {
  const discoveries: HouseholdFact[] = []

  // Baby detection
  const babyProducts = orderItems.filter(item =>
    item.category === 'Baby Food & Formula' ||
    item.name.includes('diaper')
  )
  if (babyProducts.length > 0) {
    discoveries.push({
      category: 'people',
      subcategory: 'household_member',
      factKey: 'has_baby',
      factValue: true,
      confidence: 0.9,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [{
        type: 'purchase',
        details: { products: babyProducts },
        weight: 0.9
      }]
    })
  }

  // ... more detection logic

  return discoveries
}
```

### Confidence Calculation

```typescript
function calculateConfidence(fact: HouseholdFact, newEvidence: Evidence): number {
  let confidence = fact.confidence

  // Explicit confirmation = max confidence
  if (newEvidence.type === 'answer' && newEvidence.details.explicit) {
    return 1.0
  }

  // Multiple consistent observations increase confidence
  const consistentEvidence = fact.supportingEvidence.filter(e =>
    e.details.consistent === true
  )
  confidence = Math.min(1.0, confidence + (consistentEvidence.length * 0.1))

  // Recent confirmation maintains confidence
  if (fact.lastConfirmedAt) {
    const daysSince = daysSince(fact.lastConfirmedAt)
    if (daysSince < 30) {
      confidence = Math.max(confidence, 0.8)
    }
  }

  return confidence
}
```

---

## 🌲 Decision Tree Framework

Decision trees are **data-driven question flows** for high-consideration purchases and household discovery.

### Decision Tree Structure

```typescript
export interface DecisionTree {
  id: string
  name: string
  trigger: TreeTrigger
  purpose: 'purchase_guidance' | 'household_discovery' | 'subscription_setup'
  questions: DecisionQuestion[]
  outcomes: TreeOutcome[]
}

export interface TreeTrigger {
  type: 'product_category' | 'low_confidence_fact' | 'mission_start'
  condition: any
}

export interface DecisionQuestion {
  id: string
  question: string
  answerType: 'single_choice' | 'multiple_choice' | 'number' | 'text'
  options?: QuestionOption[]

  // What facts this question discovers
  discovers: {
    factKey: string
    valueMapping: Record<string, any> // Maps answer → fact value
    confidence: number
  }[]

  // Conditional logic
  showIf?: (householdMap: HouseholdMap) => boolean
  nextQuestion?: (answer: any) => string | null
}

export interface TreeOutcome {
  condition: (answers: Record<string, any>) => boolean
  factsToSave: Partial<HouseholdFact>[]
  recommendations?: string[]
  productFilters?: any
}
```

### Example: Baby Product Decision Tree

```typescript
const babyProductTree: DecisionTree = {
  id: 'baby_discovery',
  name: 'Baby Product Guidance',
  trigger: {
    type: 'product_category',
    condition: { category: 'Baby Food & Formula' }
  },
  purpose: 'household_discovery',
  questions: [
    {
      id: 'has_baby',
      question: 'Are you shopping for a baby?',
      answerType: 'single_choice',
      options: [
        { value: 'yes_my_baby', label: 'Yes, my baby' },
        { value: 'yes_gift', label: 'Yes, as a gift' },
        { value: 'expecting', label: 'I\'m expecting' },
        { value: 'no', label: 'No, just browsing' }
      ],
      discovers: [{
        factKey: 'has_baby',
        valueMapping: {
          'yes_my_baby': true,
          'yes_gift': false,
          'expecting': false,
          'no': false
        },
        confidence: 1.0
      }],
      nextQuestion: (answer) => {
        if (answer === 'yes_my_baby') return 'baby_age'
        if (answer === 'expecting') return 'due_date'
        return null
      }
    },
    {
      id: 'baby_age',
      question: 'How old is your baby?',
      answerType: 'single_choice',
      options: [
        { value: '0-3mo', label: '0-3 months (newborn)' },
        { value: '3-6mo', label: '3-6 months' },
        { value: '6-12mo', label: '6-12 months' },
        { value: '12-24mo', label: '12-24 months (toddler)' }
      ],
      discovers: [{
        factKey: 'baby_age',
        valueMapping: {
          '0-3mo': '0-3 months',
          '3-6mo': '3-6 months',
          '6-12mo': '6-12 months',
          '12-24mo': '12-24 months'
        },
        confidence: 1.0
      }]
    }
  ],
  outcomes: [
    {
      condition: (answers) => answers.has_baby === 'yes_my_baby',
      factsToSave: [
        { factKey: 'has_baby', factValue: true, confidence: 1.0 },
        { factKey: 'life_stage', factValue: 'young_family', confidence: 0.9 }
      ],
      recommendations: [
        'Subscribe to diapers and formula for 15% savings',
        'Set up auto-delivery based on your baby\'s age'
      ]
    }
  ]
}
```

---

## 🔄 Integration Points

### 1. Chat API Integration

When a user message comes in:
1. **Discover facts** from message content
2. **Check household map** for context
3. **Decide if decision tree needed** (low confidence fact, high-consideration category)
4. **Provide household context** to AI for better responses

```typescript
// In chat API route
const householdMap = await getHouseholdMap(userId)

// Add household context to system prompt
const householdContext = `
## Household Context
- Life stage: ${householdMap.lifeStage}
- Has baby: ${householdMap.facts.find(f => f.factKey === 'has_baby')?.factValue}
- Household size: ${householdMap.facts.find(f => f.factKey === 'household_size')?.factValue}
- Dietary preferences: ${householdMap.lifestyle.dietaryPreferences}
`
```

### 2. Purchase Pattern Integration

After each order:
1. **Run discovery engine** on order items
2. **Update or create facts** in household_facts table
3. **Increase confidence** for existing facts
4. **Trigger confirmation questions** if new contradictory evidence

### 3. Product Ranking Integration

Use household map to personalize search results:
- Baby in house → boost baby products
- Organic preference → boost organic products
- Large household → boost bulk sizes
- Pet owner → show pet food prominently

### 4. Memory Map UI Integration

Expand Memory Map dashboard to show:
- **Household Overview**: Physical space, people, pets
- **Lifestyle Profile**: Cooking, entertaining, fitness
- **Discovered Patterns**: Shopping habits, meal rotation
- **Map Completeness**: Visual progress bar (0-100%)
- **Confirm Facts**: Cards for low-confidence facts needing confirmation

---

## 📊 Strategic Confirmation System

### When to Ask Confirmation Questions

```typescript
function shouldAskConfirmation(fact: HouseholdFact): boolean {
  // Ask if confidence is low
  if (fact.confidence < 0.7) return true

  // Ask if contradictory evidence
  if (hasContradictoryEvidence(fact)) return true

  // Ask if fact is stale (not confirmed in 90 days)
  if (fact.lastConfirmedAt && daysSince(fact.lastConfirmedAt) > 90) return true

  // Don't ask too frequently (max 1 confirmation per conversation)
  if (confirmedThisSession(fact)) return false

  return false
}
```

### Confirmation Question Types

1. **Casual conversational** ("I noticed you buy diapers - do you have a baby?")
2. **Decision tree flow** (structured questions for complex topics)
3. **Memory Map UI** (user reviews and confirms facts directly)
4. **Profile form** (dedicated household setup form)

---

## 🎯 Success Metrics

### Map Completeness
- **0-20%**: Cold start (new customer, basic preferences)
- **20-40%**: Warming up (life stage detected, some patterns)
- **40-60%**: Good coverage (household size, main preferences, key patterns)
- **60-80%**: Comprehensive (detailed lifestyle, dietary needs, seasonal habits)
- **80-100%**: Complete map (full household graph, persona classification ready)

### Confidence Distribution
- **High confidence (>80%)**: Facts explicitly confirmed or heavily supported
- **Medium confidence (50-80%)**: Inferred from patterns, needs confirmation
- **Low confidence (<50%)**: Single observation, speculative

### Business Impact
- **Personalization accuracy**: % of recommendations that resonate
- **Conversion rate**: Higher for customers with complete maps
- **Subscription adoption**: Easier to suggest subscriptions with household data
- **Retention**: Customers with complete maps are stickier

---

## 🚀 Implementation Plan

### Phase 3A: Core Infrastructure (Days 1-2)
- [x] Create documentation
- [ ] Database migration for household_facts table
- [ ] TypeScript types for household map
- [ ] GET /api/household endpoint (fetch map)
- [ ] POST /api/household/discover endpoint (record facts)

### Phase 3B: Discovery Engine (Days 3-4)
- [ ] Build discovery logic from purchases
- [ ] Confidence calculation algorithm
- [ ] Conflict detection and resolution
- [ ] Integration with life stage detection

### Phase 3C: Decision Tree Framework (Days 5-6)
- [ ] Decision tree data structure
- [ ] Tree execution engine
- [ ] Baby products tree (first example)
- [ ] Chat integration for tree triggering

### Phase 3D: UI & Confirmation (Days 7-8)
- [ ] Expand Memory Map UI with household facts
- [ ] Map completeness visualization
- [ ] Confirmation cards for low-confidence facts
- [ ] Household profile editor

### Phase 3E: AI Integration (Day 9)
- [ ] Add household context to AI prompts
- [ ] Tool for triggering decision trees
- [ ] Casual confirmation questions in chat
- [ ] Fact discovery from user messages

### Phase 3F: Testing & Polish (Day 10)
- [ ] Test full discovery flow
- [ ] Test decision tree execution
- [ ] Test confirmation system
- [ ] Documentation and deployment

---

## 📝 Example: Full Discovery Journey

### Day 1: First Order
**Purchase**: Diapers, formula, baby wipes

**Facts Discovered**:
- `has_baby: true` (confidence: 0.9)
- `life_stage: young_family` (confidence: 0.9)
- `household_size: 3` (confidence: 0.7 - inferred)

**Map Completeness**: 15%

### Day 7: Second Order
**Purchase**: Organic milk, organic eggs, organic baby food

**Facts Updated**:
- `has_baby: true` (confidence: 0.95 - confirmed again)
- `dietary_preference: organic` (confidence: 0.85 - new)
- `household_size: 3` (confidence: 0.75 - consistent)

**Map Completeness**: 22%

### Day 14: AI Asks Confirmation
**AI**: "I noticed you prefer organic products - should I prioritize organic options in your recommendations?"

**User**: "Yes please!"

**Facts Updated**:
- `dietary_preference: organic` (confidence: 1.0 - explicitly confirmed)

### Day 30: Decision Tree Triggered
**User**: "I need a high chair"

**System**: Triggers furniture decision tree
- "What's your baby's age?" → "6 months"
- "Do you have a dining table or eat at a counter?" → "Dining table"
- "Storage space?" → "Limited"

**Facts Discovered**:
- `baby_age: 6-12 months` (confidence: 1.0)
- `has_dining_table: true` (confidence: 1.0)
- `storage_constraint: limited` (confidence: 1.0)

**Map Completeness**: 38%

### Day 90: Comprehensive Map
**Total Facts**: 45 facts across all categories
**Map Completeness**: 67%
**Persona**: "Health-Conscious Young Parent"

**System Impact**:
- Personalized recommendations hit 85% relevance
- Subscription suggestions accepted 3x more
- Order frequency increased 40%

---

## 🔮 Future: Persona Golden Pathways

Once we have rich household maps:

### 1. Cluster into Personas
- Busy Young Parent
- Health Enthusiast
- Pet Parent
- Entertaining Host
- Meal Prep Warrior
- Budget-Conscious Family

### 2. Build Golden Pathways
Each persona has a "golden path" lifecycle:
- **New parent**: Pregnancy → newborn → infant → toddler
- **Fitness journey**: Beginner → intermediate → advanced
- **Cooking evolution**: Basic → adventurous → expert

### 3. Predict Next Stage
Use persona pathways to predict what customers need next:
- Baby formula buyer → suggest toddler foods in 6 months
- Gym beginner → suggest protein powder after 3 months

### 4. Enrich Early Customers
New customers with partial maps can be enriched with persona templates:
- Detected baby → apply "Young Parent" template
- Fill in likely facts with medium confidence
- Confirm over time

---

## 📖 Summary

Phase 3 builds the **Household Map** - a comprehensive, deterministic knowledge graph that progressively discovers everything about a customer's household through their shopping journeys.

**Key Innovations**:
- 🗺️ **Robotic vacuum approach**: Gradual, systematic discovery
- 🎯 **Confidence-based**: Track certainty and confirm strategically
- 🌲 **Decision trees**: Structured guidance for complex topics
- 🔄 **Always learning**: Every interaction expands the map
- 🎨 **Transparent**: Users see and control their household map

**Business Value**:
- Better personalization from day one
- Higher conversion on recommendations
- Easier subscription adoption
- Stronger customer retention
- Foundation for persona clustering and golden pathways

Let's build it!
