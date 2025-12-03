# Agentic Retail - Enhanced Product Roadmap

**Last Updated:** December 2, 2024
**Version:** Production v1.0
**Status:** Post-Sprint 2 (68% feature parity)

---

## Executive Summary

This roadmap integrates core AI shopping principles with practical implementation milestones. Focus is on **memory, personalization, and intelligent inference** before external integrations.

**Guiding Principles:**
1. **Memory First** - Build deterministic customer understanding
2. **Intelligence Over UI** - Prove the AI works before polishing interface
3. **Catalog Before Walmart** - Expand mock catalog to 570+ items first
4. **Operator Model for V1** - App guides user actions vs direct API transactions

---

## Current State (Sprint 2 Complete)

### ✅ What We Have
- Conversational shopping interface
- Claude-powered AI assistant
- Shop blocks, savings blocks, recipe blocks
- Cart management with editing
- Voice input (STT) and output (TTS)
- Image upload for recipe analysis
- Shopping list persistence
- Order history
- Mobile-responsive design
- Source badges and tooltips

### ❌ What's Missing (Sprint 2)
- Bulk deal detection (45 min)
- Replenishment reminders (45 min)

---

## Phase 0: Foundation & Intelligence (Weeks 1-4)

**Goal:** Build core AI capabilities before integrations

### 1. Customer Memory System
**Priority:** P0 - Critical for personalization
**Effort:** 2-3 weeks
**Status:** ❌ Not Started

**Current Gap:**
- No persistent memory of customer preferences
- No shopping cycle tracking
- No brand/product affinity learning
- Memory resets each session

**Features to Build:**

#### A. Deterministic Memory Store
```typescript
interface CustomerMemory {
  // Identity & Household
  household: {
    size: number
    members: Array<{
      name: string
      age?: number
      dietaryRestrictions: string[]
    }>
    pets: Array<{ type: string, name?: string }>
  }

  // Shopping Behaviors
  preferences: {
    brands: Map<string, number>  // brand -> affinity score
    categories: Map<string, number>  // category -> frequency
    pricePoints: Map<string, 'budget' | 'moderate' | 'premium'>
    avoidList: string[]  // items to never suggest
  }

  // Temporal Patterns
  cycles: {
    weeklyEssentials: Array<{ sku: string, dayOfWeek: number }>
    monthlyStaples: Array<{ sku: string, dayOfMonth: number }>
    seasonalItems: Array<{ sku: string, season: string }>
  }

  // Purchase History
  orders: Array<{
    date: string
    items: CartItem[]
    total: number
    fulfillment: 'delivery' | 'pickup'
  }>

  // Behavioral Preferences
  shoppingStyle: {
    verbosity: 'concise' | 'detailed'  // how much explanation user wants
    listFirst: boolean  // show list immediately vs chat first
    priceAware: boolean  // always show savings vs only when asked
    adventurous: number  // 0-100, willingness to try new products
  }

  // Lifecycle Stage
  lifecycle: {
    stage: 'new-parent' | 'family' | 'empty-nester' | 'single' | null
    inferredDate: string
    confidence: number
  }
}
```

#### B. Memory Building Mechanisms

**Passive Learning:**
- Track every purchase → build frequency maps
- Note rejected suggestions → avoid list
- Observe price sensitivity → budget tier inference
- Monitor substitution acceptance → brand flexibility

**Active Confirmation:**
```
Claude: "I notice you buy milk every 7 days. Should I remind you when you're running low?"
User: "Yes"
→ Store: cycles.weeklyEssentials.push({ sku: 'milk-whole-gal', dayOfWeek: 0 })
```

**Import Historical Data:**
- Upload CSV of past Walmart orders
- Parse and initialize memory
- Claude confirms patterns: "Looks like you shop for a family of 4?"

#### C. Memory-Powered Features

**Smart Replenishment:**
```typescript
// Check if essentials are "due"
function getDueItems(memory: CustomerMemory): CartItem[] {
  const today = new Date()
  const due: CartItem[] = []

  memory.cycles.weeklyEssentials.forEach(item => {
    const lastPurchase = getLastPurchase(item.sku)
    const daysSince = daysBetween(lastPurchase, today)
    const avgCycle = getAverageCycle(item.sku) // e.g., 7 days

    if (daysSince >= avgCycle * 0.9) {
      due.push(catalogLookup(item.sku))
    }
  })

  return due
}

// On welcome screen or new chat:
"Hi Nick! Time to restock? You usually buy milk, eggs, and bread around now."
```

**Brand Affinity:**
```typescript
// When suggesting replacements
function getSavingsSwaps(cart: CartItem[], memory: CustomerMemory) {
  return cart.map(item => {
    const brandAffinity = memory.preferences.brands.get(item.brand)

    // Don't suggest swapping high-affinity brands
    if (brandAffinity > 80) return null

    // Find alternatives
    const alternatives = findAlternatives(item)
    return alternatives.filter(alt => alt.price < item.price * 0.85)
  })
}
```

**Lifecycle Awareness:**
```typescript
// Detect life stage transitions
if (userBuysItem('baby-formula') && !memory.lifecycle.stage === 'new-parent') {
  memory.lifecycle = {
    stage: 'new-parent',
    inferredDate: new Date(),
    confidence: 0.95
  }

  // Trigger proactive suggestions
  suggestBabyEssentials()
  remindDiaperRestocking()
}

// Age-based adaptation (macro cycles)
// Baby (0-1yr) → Toddler (1-3yr) → Child (3-12yr)
function updateLifecycleStage(memory: CustomerMemory) {
  if (memory.lifecycle.stage === 'new-parent') {
    const monthsSince = monthsBetween(memory.lifecycle.inferredDate, new Date())

    if (monthsSince > 12) {
      memory.lifecycle.stage = 'toddler-parent'
      suggestToddlerTransition() // solid foods, sippy cups, etc.
    }
  }
}
```

**Technical Implementation:**
- Store in Supabase `customer_memory` table (JSONB column)
- Update memory after every interaction
- Claude system prompt includes relevant memory context
- Nightly job to analyze patterns and update cycles

---

### 2. Intelligent Funnel Detection
**Priority:** P0 - Critical for UX
**Effort:** 1-2 weeks
**Status:** ❌ Not Started

**Current Gap:**
- Treats all interactions the same
- No awareness of customer's current stage
- Can't distinguish browsing vs ready-to-buy

**Features to Build:**

#### A. Funnel Stage Detection
```typescript
type FunnelStage =
  | 'discovery'      // "I need dinner ideas"
  | 'research'       // "What's the best TV for gaming?"
  | 'consideration'  // "Compare LG vs Samsung 65\" TVs"
  | 'intent'         // "I want the LG C3 65\""
  | 'transaction'    // "Add to cart"

interface CustomerIntent {
  stage: FunnelStage
  mission: 'essentials' | 'recipe' | 'event' | 'research' | 'precision'
  confidence: number
  signals: string[]  // what led to this inference
}
```

**Detection Logic:**
```typescript
function detectIntent(message: string, memory: CustomerMemory): CustomerIntent {
  // Precision signals (high intent)
  if (message.match(/add|buy|purchase|checkout/i)) {
    return { stage: 'transaction', mission: 'precision', confidence: 0.95 }
  }

  // Research signals (consideration)
  if (message.match(/compare|vs|difference|better|best/i)) {
    return { stage: 'consideration', mission: 'research', confidence: 0.9 }
  }

  // Discovery signals (top of funnel)
  if (message.match(/ideas|inspiration|what should|suggest/i)) {
    return { stage: 'discovery', mission: 'essentials', confidence: 0.85 }
  }

  // Intent signals (middle funnel)
  if (message.match(/I need|I want|looking for/i)) {
    return { stage: 'intent', mission: 'essentials', confidence: 0.8 }
  }

  // Contextual: Day of week + memory
  if (isDayOfWeek(0) && memory.cycles.weeklyEssentials.length > 0) {
    return { stage: 'intent', mission: 'essentials', confidence: 0.7 }
  }

  return { stage: 'discovery', mission: 'essentials', confidence: 0.5 }
}
```

#### B. Funnel-Adapted Responses

**Discovery Stage:**
- Show inspiration, suggestions, recipes
- More verbose, educational
- Use upsell blocks, recipe blocks
- "Here are some ideas for this week..."

**Research Stage:**
- Show comparisons, decision trees
- Detailed explanations
- Use comparison blocks (not yet built)
- "Let's compare the top options..."

**Consideration Stage:**
- Narrow options based on preferences
- Ask clarifying questions
- Use decision tree logic
- "What's most important: price, quality, or brand?"

**Intent Stage:**
- Show specific products
- Quick add-to-cart
- Concise responses
- "Got it! Adding to your cart..."

**Transaction Stage:**
- Minimal friction
- Immediate confirmation
- Order block
- "Done! Your order is confirmed."

**Example Adaptation:**
```typescript
// System prompt injection based on funnel stage
function buildSystemPrompt(memory: CustomerMemory, intent: CustomerIntent) {
  const base = SYSTEM_PROMPT(memory)

  if (intent.stage === 'discovery') {
    return base + `
      User is exploring ideas. Be inspirational and suggest multiple options.
      Use recipe blocks and upsell blocks liberally.
      Explain why you're suggesting these items.
    `
  }

  if (intent.stage === 'transaction') {
    return base + `
      User is ready to buy. Be concise and fast.
      Don't explain unless asked. Just add to cart.
      Use order confirmation block immediately.
    `
  }

  // ... other stages
}
```

---

### 3. Decision Tree Architecture
**Priority:** P1 - Important for high-consideration
**Effort:** 2-3 weeks
**Status:** ❌ Not Started

**Current Gap:**
- No structured questioning for complex purchases
- Can't narrow down efficiently (e.g., TVs, appliances)
- No merchant/buyer input mechanism

**Features to Build:**

#### A. LLM-Powered Decision Trees
```typescript
interface DecisionNode {
  question: string
  options: Array<{
    label: string
    value: string
    nextNode?: string  // null = leaf node
    filter: ProductFilter
  }>
}

interface ProductFilter {
  category?: string
  priceRange?: { min: number, max: number }
  attributes?: Record<string, string>  // { size: '65"', brand: 'LG' }
}

// Example: TV Purchase Decision Tree
const tvDecisionTree: Record<string, DecisionNode> = {
  start: {
    question: "What size TV are you looking for?",
    options: [
      { label: '43-55"', value: 'medium', nextNode: 'purpose', filter: { attributes: { size: '50"' } } },
      { label: '55-65"', value: 'large', nextNode: 'purpose', filter: { attributes: { size: '60"' } } },
      { label: '65"+', value: 'xlarge', nextNode: 'purpose', filter: { attributes: { size: '70"' } } },
    ]
  },
  purpose: {
    question: "What will you primarily use it for?",
    options: [
      { label: 'Gaming', value: 'gaming', nextNode: 'budget', filter: { attributes: { refreshRate: '120Hz' } } },
      { label: 'Movies/TV', value: 'movies', nextNode: 'budget', filter: { attributes: { hdr: 'yes' } } },
      { label: 'General use', value: 'general', nextNode: 'budget', filter: {} },
    ]
  },
  budget: {
    question: "What's your budget?",
    options: [
      { label: 'Under $500', value: 'budget', nextNode: null, filter: { priceRange: { min: 0, max: 500 } } },
      { label: '$500-$1000', value: 'mid', nextNode: null, filter: { priceRange: { min: 500, max: 1000 } } },
      { label: '$1000+', value: 'premium', nextNode: null, filter: { priceRange: { min: 1000, max: 5000 } } },
    ]
  }
}
```

**Implementation Flow:**
```
User: "I need a TV"
Claude: *Detects high-consideration purchase*
        *Initiates decision tree*

        "Great! To find the perfect TV, I have a few quick questions:

        1. What size are you looking for?

        ```suggestions
        { chips: [
          { label: '43-55"', prompt: 'Medium size (43-55")' },
          { label: '55-65"', prompt: 'Large size (55-65")' },
          { label: '65"+', prompt: 'Extra large (65"+)' }
        ]}
        ```"

User: "55-65\""
Claude: *Applies filter, moves to next node*

        "Perfect! What will you use it for?

        ```suggestions
        { chips: [
          { label: 'Gaming', prompt: 'Primarily for gaming' },
          { label: 'Movies/TV', prompt: 'Movies and TV shows' },
          { label: 'General', prompt: 'General use' }
        ]}
        ```"

User: "Gaming"
Claude: *Applies filter (120Hz required)*

        "Great! What's your budget?

        ```suggestions
        { chips: [
          { label: 'Under $500', prompt: 'Budget: Under $500' },
          { label: '$500-$1000', prompt: 'Budget: $500-$1000' },
          { label: '$1000+', prompt: 'Budget: Premium ($1000+)' }
        ]}
        ```"

User: "$500-$1000"
Claude: *Leaf node reached, applies all filters*
        *Queries catalog: size=60", refreshRate=120Hz, price=$500-1000*

        "Perfect! Here are the best gaming TVs in your size and budget:

        ```shop
        {
          title: "Gaming TVs (55-65\", 120Hz, $500-1000)",
          items: [
            { sku: 'lg-55-gaming', name: 'LG 55" 120Hz', price: 699, reason: 'Best for PS5/Xbox' },
            { sku: 'samsung-60-qled', name: 'Samsung 60" QLED', price: 899, reason: 'Excellent picture quality' }
          ]
        }
        ```"
```

#### B. Merchant-Defined Decision Trees

**Future Enhancement:**
- Allow Walmart buyers to define decision trees per category
- Upload as JSON or via UI
- Override LLM defaults with expert knowledge

```json
{
  "category": "televisions",
  "createdBy": "walmart-buyer-electronics",
  "nodes": {
    "start": { "question": "...", "options": [...] }
  },
  "metadata": {
    "seasonalOverride": {
      "blackFriday": { "emphasize": "deals", "skipBudget": true }
    }
  }
}
```

#### C. Hybrid Model: RAG + LLM

**Long-term Vision:**
- Train LLM on thousands of past decision trees
- RAG retrieval of similar purchases
- LLM generates custom decision tree on-the-fly

```typescript
async function generateDecisionTree(category: string, userIntent: string) {
  // Retrieve similar decision trees from vector DB
  const similar = await vectorSearch(category, userIntent)

  // LLM generates custom tree based on patterns
  const tree = await claude.generate({
    prompt: `Generate a 5-question decision tree for ${category}.
             User intent: ${userIntent}
             Similar trees: ${JSON.stringify(similar)}

             Keep it to maximum 5 questions.
             Each question should filter products by at least 30%.`,
    format: 'json'
  })

  return tree
}
```

---

### 4. Advanced Verbosity Control
**Priority:** P1 - Important for UX
**Effort:** 1 week
**Status:** ⚠️ Partial (TTS has summaries)

**Current Gap:**
- No user preference for conciseness
- Can't adapt to rushed vs leisurely shopping

**Features to Build:**

**User Preference:**
```typescript
// Let user control verbosity
memory.shoppingStyle.verbosity = 'concise' | 'balanced' | 'detailed'

// System prompt adaptation
if (memory.shoppingStyle.verbosity === 'concise') {
  systemPrompt += `
    Be extremely concise. One sentence responses.
    Show blocks immediately. Don't explain unless asked.
  `
} else if (memory.shoppingStyle.verbosity === 'detailed') {
  systemPrompt += `
    Provide detailed explanations.
    Explain your reasoning for suggestions.
    Offer context and alternatives.
  `
}
```

**Context-Aware Verbosity:**
```typescript
// Detect rushed shopping (mobile, short messages)
if (isMobile && message.length < 10 && timeOfDay === 'morning') {
  // User is probably in a hurry
  overrideVerbosity = 'concise'
}

// Detect leisurely browsing (desktop, long messages, evening)
if (isDesktop && message.length > 50 && timeOfDay === 'evening') {
  overrideVerbosity = 'detailed'
}
```

---

### 5. Discovery Mechanisms
**Priority:** P1 - Important for engagement
**Effort:** 2 weeks
**Status:** ⚠️ Partial (quick actions on welcome)

**Current Gap:**
- No inspiration beyond quick actions
- Can't browse or explore without knowing what to ask
- No "featured" or "trending" concepts

**Features to Build:**

#### A. Discovery Modes on Welcome

```typescript
// Enhanced welcome screen
<WelcomeScreen>
  {/* Current: Quick Actions */}
  <QuickActions />

  {/* NEW: Inspired Shopping */}
  <DiscoveryCarousel>
    <DiscoveryCard
      title="🎃 Fall Favorites"
      prompt="Show me seasonal fall recipes and ingredients"
    />
    <DiscoveryCard
      title="🏈 Game Day Prep"
      prompt="Help me plan a Super Bowl party"
    />
    <DiscoveryCard
      title="💡 New Products"
      prompt="What's new this week?"
    />
    <DiscoveryCard
      title="🍽️ Meal Prep Sunday"
      prompt="Plan 5 dinners for the week"
    />
  </DiscoveryCarousel>

  {/* NEW: Personalized Suggestions */}
  <PersonalizedPrompts memory={memory}>
    {getDueItems(memory).length > 0 && (
      <Prompt>
        "🔔 Time to restock {itemCount} essentials?"
      </Prompt>
    )}
    {isSeasonTransition() && (
      <Prompt>
        "🍂 Update your essentials for fall?"
      </Prompt>
    )}
  </PersonalizedPrompts>
</WelcomeScreen>
```

#### B. Browse Mode

**Future Enhancement:**
```
User: "Just browsing"
Claude: "No problem! What are you in the mood for?

        ```suggestions
        { chips: [
          { label: '🍳 Recipes', prompt: 'Show me dinner recipes' },
          { label: '🎉 Events', prompt: 'Plan a party' },
          { label: '🏷️ Deals', prompt: 'What's on sale?' },
          { label: '✨ New', prompt: 'Show me new products' },
        ]}
        ```"
```

---

### 6. Latency Management
**Priority:** P0 - Critical for UX
**Effort:** Ongoing
**Status:** ⚠️ Partial (streaming works)

**Current Implementation:**
- ✅ Streaming responses (reduces perceived latency)
- ✅ Skeleton loaders for shop blocks
- ❌ No preloading
- ❌ No request debouncing
- ❌ No caching

**Improvements Needed:**

**A. Predictive Preloading**
```typescript
// Preload likely next responses
if (userTyping.includes('recipe')) {
  // Prefetch recipe catalog in background
  prefetchRecipes()
}

if (isDayOfWeek(0) && hasWeeklyRoutine(memory)) {
  // Preload weekly essentials on Sunday mornings
  prefetchEssentials(memory.cycles.weeklyEssentials)
}
```

**B. Response Caching**
```typescript
// Cache common queries
const cache = new Map<string, CachedResponse>()

async function getCachedOrFetch(query: string) {
  const cached = cache.get(normalizeQuery(query))

  if (cached && !isStale(cached)) {
    return cached.response
  }

  const response = await claude.ask(query)
  cache.set(normalizeQuery(query), { response, timestamp: Date.now() })

  return response
}
```

**C. Optimistic UI**
```typescript
// Show skeleton while loading
<MessageBubble isStreaming={true}>
  {hasListIntent(message) && <SkeletonShopBlock />}
  {hasRecipeIntent(message) && <SkeletonRecipeBlock />}
</MessageBubble>
```

---

### 7. Onboarding (FTUX)
**Priority:** P1 - Important for adoption
**Effort:** 1 week
**Status:** ❌ Not Started

**Current Gap:**
- No introduction to conversational shopping
- Users don't know what's possible
- No guided first experience

**Features to Build:**

```typescript
// First-time user experience
if (isFirstVisit(user)) {
  return <OnboardingFlow />
}

<OnboardingFlow>
  <Step1>
    <h2>👋 Welcome to Agentic Retail</h2>
    <p>Shopping, powered by AI. Just tell me what you need.</p>

    <ExamplePrompts>
      "Plan dinner for 4"
      "I need weekly groceries"
      "Find me a TV under $500"
    </ExamplePrompts>

    <Button onClick={next}>Let's shop!</Button>
  </Step1>

  <Step2>
    <h2>🛒 I'll build your cart</h2>
    <p>I'll suggest products based on your needs. You can:</p>
    <ul>
      <li>✏️ Edit quantities</li>
      <li>❌ Remove items</li>
      <li>💰 Find savings</li>
    </ul>

    <InteractiveDemo>
      {/* Show a sample shop block with editable items */}
    </InteractiveDemo>
  </Step2>

  <Step3>
    <h2>🧠 I'll learn your preferences</h2>
    <p>The more you shop, the better I get at:</p>
    <ul>
      <li>Remembering your favorite brands</li>
      <li>Suggesting when to restock</li>
      <li>Finding deals you'll love</li>
    </ul>

    <OptionalProfileSetup>
      "Want to tell me about your household now?"
      <Button>Yes, let's personalize</Button>
      <Button variant="secondary">Skip for now</Button>
    </OptionalProfileSetup>
  </Step3>
</OnboardingFlow>
```

---

## Phase 1: Scale Catalog (Week 5)

**Goal:** Expand to 570+ items before Walmart integration

### Catalog Expansion
**Priority:** P1 - Before external APIs
**Effort:** 1 week
**Status:** ❌ Not Started (currently 100 items)

**Task:**
1. Copy full catalog from prototype (470 more items)
2. Ensure all have correct fields:
   - SKU, name, price, category, image
   - Add bulkDeal where applicable
   - Add tags for searchability
3. Update `src/lib/catalog/index.ts`
4. Test Claude can find items correctly

**Categories to Expand:**
- Dairy & Eggs: 15 → 25 items
- Produce: 16 → 25 items
- Meat & Seafood: 10 → 18 items
- Bakery: 6 → 15 items
- Pantry: 10 → 40 items
- Snacks: 8 → 30 items
- Beverages: 8 → 25 items
- Frozen: 6 → 20 items
- Household: 7 → 30 items
- Baby: 5 → 20 items
- Party: 9 → 25 items
- **New:** Electronics (TVs, appliances)
- **New:** Health & Beauty
- **New:** Pet Supplies

---

## Phase 2: External Integrations (Weeks 6-10)

### Weather & Events API (Week 6-7)
- OpenWeather integration
- SportsData or Ticketmaster
- Context-aware suggestions

### Recipe Web Scraping (Week 8-9)
- AllRecipes, Food Network parsing
- Ingredient extraction and mapping

### Social Media Import (Week 10)
- Instagram recipe parsing
- Optional, nice-to-have

---

## Phase 3: Commerce (Weeks 11-14)

### Payment Processing (Week 11-12)
- Stripe integration
- Secure checkout

### Order Fulfillment Options Research (Week 13-14)
- Evaluate: Walmart API, Instacart, DoorDash
- Decision: Operator model vs Direct API

---

## Phase 4: Walmart Integration (Weeks 15-20)

**Moved to END of roadmap per your feedback**

### Why Last?
1. Need proven intelligence first
2. Catalog expansion validates approach
3. Memory & personalization must work
4. Avoids dependency on external API during development

### Walmart API Features (When Ready)
- Real catalog (replace mock)
- Live pricing & availability
- Product images
- Inventory lookup
- Order placement
- Fulfillment

---

## Feature Status Matrix

| Feature | Status | Phase | Priority |
|---------|--------|-------|----------|
| Customer Memory System | ❌ | 0 | P0 |
| Funnel Detection | ❌ | 0 | P0 |
| Decision Trees | ❌ | 0 | P1 |
| Verbosity Control | ⚠️ | 0 | P1 |
| Discovery Modes | ⚠️ | 0 | P1 |
| Latency Optimization | ⚠️ | 0 | P0 |
| Onboarding (FTUX) | ❌ | 0 | P1 |
| Bulk Deal Detection | ❌ | 0 | P1 |
| Replenishment Reminders | ❌ | 0 | P2 |
| Catalog Expansion | ❌ | 1 | P1 |
| Weather API | ❌ | 2 | P2 |
| Sports/Events API | ❌ | 2 | P2 |
| Recipe Scraping | ❌ | 2 | P1 |
| Social Import | ❌ | 2 | P2 |
| Payment Processing | ❌ | 3 | P0 |
| Order Fulfillment | ❌ | 3 | P0 |
| Walmart API | ❌ | 4 | P1 |

**Legend:**
- ✅ Complete
- ⚠️ Partial
- ❌ Not Started

---

## Next Immediate Steps (This Week)

1. ✅ Complete Sprint 2 bug fixes (DONE!)
2. ⏭️ Implement bulk deal detection (45 min)
3. ⏭️ Implement replenishment reminders (45 min)
4. ⏭️ Start Customer Memory System design
5. ⏭️ Expand catalog to 570 items

---

## Open Questions

1. **Memory Storage:** Supabase JSONB or separate tables?
2. **Decision Tree Format:** JSON files or database?
3. **Operator vs API:** V1 guides user actions or executes directly?
4. **Historical Import:** CSV upload or manual entry?
5. **Lifecycle Detection:** Explicit confirmation or silent inference?
6. **Deployment:** Deploy current build now or wait for Phase 0?

---

## Success Metrics

### Phase 0 (Intelligence)
- Memory recall accuracy: >90%
- Replenishment suggestions accepted: >60%
- Decision tree completion rate: >70%
- Average questions to purchase: <5

### Phase 1 (Catalog)
- Catalog coverage: 570 items
- SKU match rate: >95%
- Product suggestions relevance: >80%

### Phase 2 (Integrations)
- Recipe parse success: >85%
- Weather suggestion lift: >10% basket size
- API uptime: >99.5%

### Phase 3 (Commerce)
- Payment success rate: >95%
- Checkout abandonment: <15%
- Order fulfillment success: >90%

---

## Technical Debt & Improvements

### Code Quality
- [ ] Add unit tests (shopping cart logic)
- [ ] Add integration tests (API routes)
- [ ] Error boundary components
- [ ] Logging & monitoring (Sentry)

### Performance
- [ ] Image optimization (Cloudinary)
- [ ] Bundle size reduction
- [ ] Database query optimization
- [ ] CDN for static assets

### Security
- [ ] Rate limiting on API routes
- [ ] Input validation & sanitization
- [ ] CSRF protection
- [ ] Content Security Policy

---

## Roadmap Summary Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 0 | 4 weeks | Memory, Intelligence, Inference |
| Phase 1 | 1 week | Catalog Expansion |
| Phase 2 | 5 weeks | External APIs (Weather, Recipes) |
| Phase 3 | 4 weeks | Commerce & Payments |
| Phase 4 | 6 weeks | Walmart Integration |
| **Total** | **~20 weeks** | **5 months to full production** |

**MVP Launch Target:** End of Phase 1 (5 weeks)
**Revenue-Ready:** End of Phase 3 (14 weeks)
**Full Feature Parity:** End of Phase 4 (20 weeks)
