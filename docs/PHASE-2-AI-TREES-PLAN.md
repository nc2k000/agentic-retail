# Phase 2: AI-Generated Decision Trees - Implementation Plan

**Start Date:** December 8, 2024
**Goal:** Build AI system to generate decision trees dynamically from product catalog
**Production Status:** Hardcoded trees (Phase 1) running in production while we build this

---

## Overview

Replace hardcoded decision trees with AI-generated trees that:
1. Analyze product catalog by category
2. Generate relevant questions based on product attributes
3. Dynamically adapt as catalog changes
4. Personalize based on household profile (future)

---

## Architecture

### High-Level Flow

```
User Query → Tree Detection → Catalog Analysis → Question Generation → Tree Execution
```

**What Stays (From Phase 1):**
- Tree executor (`src/lib/decisions/executor.ts`)
- Mission management (`src/lib/missions.ts`)
- Tree UI components (`TreeBlock`, `TreeQuestion`)
- Mission persistence (database schema)
- Product caching system

**What's New (Phase 2):**
- Catalog analyzer (analyzes products by category)
- Question generator (creates questions from catalog)
- Tree builder (converts analysis → tree definition)
- Cache layer (caches generated trees)

---

## Implementation Phases

### Week 1: Core AI Engine (Days 1-3)

#### Day 1: Catalog Analyzer
**File:** `src/lib/ai/catalog-analyzer.ts`

**Purpose:** Analyze products in a category to understand what questions to ask

**Key Functions:**
```typescript
interface CatalogAnalysis {
  category: string
  totalProducts: number
  attributes: AttributeAnalysis[]
  suggestedQuestions: QuestionSuggestion[]
}

interface AttributeAnalysis {
  name: string // e.g., "size", "color", "capacity"
  type: 'categorical' | 'numeric' | 'boolean'
  values: string[] // unique values found
  coverage: number // % of products with this attribute
  discriminationPower: number // how well it splits products
}

interface QuestionSuggestion {
  text: string
  attribute: string
  options: string[]
  priority: number // 1-10, higher = ask earlier
}

// Main analyzer function
async function analyzeCatalog(category: string): Promise<CatalogAnalysis>
```

**Implementation Steps:**
1. Query all products in category from database
2. Extract all attributes (from product metadata, tags, specifications)
3. Calculate attribute coverage (% of products with attribute)
4. Calculate discrimination power (how many products does each value filter?)
5. Score attributes by usefulness (coverage × discrimination)
6. Generate question suggestions
7. Return analysis

**Example Output:**
```json
{
  "category": "tvs",
  "totalProducts": 127,
  "attributes": [
    {
      "name": "screen_size",
      "type": "categorical",
      "values": ["43\"", "50\"", "55\"", "65\"", "75\""],
      "coverage": 0.98,
      "discriminationPower": 0.85
    },
    {
      "name": "resolution",
      "type": "categorical",
      "values": ["1080p", "4K", "8K"],
      "coverage": 1.0,
      "discriminationPower": 0.72
    }
  ],
  "suggestedQuestions": [
    {
      "text": "What screen size are you looking for?",
      "attribute": "screen_size",
      "options": ["43\"", "50\"", "55\"", "65\"", "75\""],
      "priority": 9
    }
  ]
}
```

**Testing:**
- Test on coffee machines (compare to hardcoded tree)
- Test on TVs (new category)
- Test on paint (complex attributes like color)

---

#### Day 2: Question Generator (Claude Integration)
**File:** `src/lib/ai/question-generator.ts`

**Purpose:** Use Claude to generate natural, contextual questions from catalog analysis

**Key Functions:**
```typescript
interface GeneratedTree {
  treeId: string
  category: string
  questions: TreeQuestion[]
  metadata: {
    generatedAt: string
    catalogSize: number
    confidenceScore: number
  }
}

async function generateTreeQuestions(
  analysis: CatalogAnalysis,
  householdContext?: HouseholdProfile
): Promise<GeneratedTree>
```

**Claude Prompt Strategy:**
```typescript
const prompt = `
You are a product expert helping customers find the perfect product.

CATALOG ANALYSIS:
- Category: ${category}
- Total Products: ${totalProducts}
- Key Attributes: ${attributes.map(a => a.name).join(', ')}

TASK:
Generate 3-5 questions to help narrow down products.

REQUIREMENTS:
1. Questions must be clear and conversational
2. Each question should significantly reduce product set
3. Order questions by importance (most discriminating first)
4. Provide 3-5 options per question
5. Include an "I'm not sure" or "Any" option

${householdContext ? `
HOUSEHOLD CONTEXT:
${JSON.stringify(householdContext)}
Adapt questions to this household's needs.
` : ''}

OUTPUT FORMAT:
{
  "questions": [
    {
      "id": "q1",
      "text": "Question text?",
      "options": [
        { "id": "opt1", "label": "Option 1", "filters": {...} }
      ]
    }
  ]
}
`
```

**Implementation:**
1. Take catalog analysis as input
2. Build Claude prompt with analysis data
3. Include household context if available
4. Call Claude API
5. Parse response into tree structure
6. Validate question quality
7. Return generated tree

**Quality Checks:**
- Each question has 3-5 options ✓
- Questions map to actual product attributes ✓
- Filters are valid for product ranking ✓
- Questions flow logically ✓

---

#### Day 3: Tree Cache & Integration
**File:** `src/lib/ai/tree-cache.ts`

**Purpose:** Cache generated trees to avoid regenerating on every request

**Database Schema:**
```sql
CREATE TABLE generated_trees (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category text NOT NULL,
  tree_definition jsonb NOT NULL, -- Full tree with questions
  catalog_snapshot jsonb, -- Products analyzed
  generated_at timestamptz DEFAULT now(),
  expires_at timestamptz, -- Auto-expire after 7 days
  generation_metadata jsonb, -- Stats about generation
  UNIQUE(category)
);
```

**Key Functions:**
```typescript
async function getCachedTree(category: string): Promise<GeneratedTree | null>
async function cacheTree(category: string, tree: GeneratedTree): Promise<void>
async function invalidateTree(category: string): Promise<void>
```

**Cache Strategy:**
- Trees cached for 7 days
- Regenerate if catalog changes significantly (>10% product count change)
- Manual invalidation via admin endpoint
- Background job regenerates expired trees

**Integration Point:**
```typescript
// src/lib/decisions/triggers.ts (modify existing)
async function detectDecisionTree(query: string): Promise<string | null> {
  // ... existing category detection ...

  // NEW: Check if we have a cached AI tree
  const cachedTree = await getCachedTree(category)
  if (cachedTree) {
    return cachedTree.treeId
  }

  // NEW: Generate tree if not cached
  const analysis = await analyzeCatalog(category)
  const tree = await generateTreeQuestions(analysis)
  await cacheTree(category, tree)

  return tree.treeId
}
```

---

### Week 1: Testing & Refinement (Days 4-5)

#### Day 4: End-to-End Testing

**Test Categories:**
1. **TVs** (new category, never had hardcoded tree)
   - Generate tree from catalog
   - Walk through questions
   - Verify product recommendations
   - Check caching works

2. **Coffee Machines** (compare to hardcoded)
   - Generate AI tree
   - Compare questions to hardcoded version
   - Verify similar quality
   - Test Run 1 & Run 2 caching

3. **Complex Category** (e.g., laptops, smartphones)
   - Many attributes
   - Verify question quality
   - Check attribute prioritization

**Success Criteria:**
- ✅ Trees generate in < 5 seconds
- ✅ Questions make sense to humans
- ✅ Product filtering works correctly
- ✅ Cache hit rate > 90%
- ✅ No errors in tree execution

---

#### Day 5: Refinement & Edge Cases

**Edge Cases to Handle:**
1. **Small Catalog** (< 10 products)
   - Don't generate tree, fall back to standard search
   - Or generate 1-2 questions max

2. **Missing Attributes**
   - Products lack structured data
   - Fall back to text-based questions
   - Use Claude to infer questions from descriptions

3. **Category Not Recognized**
   - Fall back to standard chat
   - Log for future tree creation

4. **Claude API Errors**
   - Retry logic (3 attempts)
   - Fall back to cached tree from previous generation
   - Fall back to standard chat if no cache

**Monitoring:**
- Log tree generation time
- Track Claude token usage
- Monitor cache hit rates
- Alert on generation failures

---

## Gradual Rollout Strategy

### Option A: Feature Flag (Recommended)

Add environment variable to control AI trees:

```typescript
// .env
ENABLE_AI_TREES=false  # production (hardcoded trees)
ENABLE_AI_TREES=true   # staging (AI trees)

// src/lib/decisions/triggers.ts
const USE_AI_TREES = process.env.ENABLE_AI_TREES === 'true'

async function detectDecisionTree(query: string): Promise<string | null> {
  if (USE_AI_TREES) {
    return detectAITree(query) // New AI system
  } else {
    return detectHardcodedTree(query) // Phase 1 system
  }
}
```

**Rollout Plan:**
1. Week 1: Build & test on staging with `ENABLE_AI_TREES=true`
2. Week 2: Deploy to production with flag `false` (no change to prod)
3. Week 2: Test AI trees thoroughly on staging
4. Week 3: Flip flag to `true` in production (gradual, monitor)
5. Week 3: Remove hardcoded trees after AI trees stable

### Option B: Category-by-Category

Start with one new category (TVs), keep hardcoded for existing:

```typescript
const AI_CATEGORIES = ['tvs', 'smartphones'] // Start small
const HARDCODED_CATEGORIES = ['coffee_machine', 'paint', 'mattress', 'power_tool']

async function detectDecisionTree(query: string): Promise<string | null> {
  const category = detectCategory(query)

  if (AI_CATEGORIES.includes(category)) {
    return generateAITree(category)
  } else if (HARDCODED_CATEGORIES.includes(category)) {
    return getHardcodedTree(category)
  }

  return null // Fall back to chat
}
```

**Rollout Plan:**
1. Week 1: Add TVs (new category)
2. Week 2: Add smartphones (new category)
3. Week 3: Replace coffee_machine (first migration)
4. Week 4: Replace remaining hardcoded trees

---

## File Structure

```
src/lib/ai/
├── catalog-analyzer.ts      # Analyzes product catalog
├── question-generator.ts    # Uses Claude to generate questions
├── tree-cache.ts            # Caches generated trees
└── types.ts                 # Shared types

src/lib/decisions/
├── executor.ts              # (UNCHANGED) Executes trees
├── triggers.ts              # (MODIFIED) Detects + generates trees
├── trees/
│   ├── index.ts            # (MODIFIED) Routes to AI or hardcoded
│   ├── hardcoded/          # (NEW) Move existing trees here
│   │   ├── coffee.ts
│   │   ├── paint.ts
│   │   ├── mattress.ts
│   │   └── power-tool.ts
│   └── ai/                 # (NEW) AI-generated tree logic
│       └── dynamic.ts      # Tree generator wrapper

supabase/migrations/
└── 005_generated_trees_cache.sql  # New table for caching

docs/
├── PHASE-2-AI-TREES-PLAN.md      # This document
└── AI-TREE-ARCHITECTURE.md       # (NEW) Technical architecture
```

---

## API Endpoints

### New Endpoints

**`POST /api/admin/regenerate-tree`**
- Manually regenerate tree for a category
- Invalidates cache
- Returns new tree definition
- Admin only

**`GET /api/admin/tree-cache`**
- View all cached trees
- See generation metadata
- Check expiry dates
- Admin only

**`DELETE /api/admin/tree-cache/:category`**
- Invalidate specific tree cache
- Admin only

---

## Testing Strategy

### Unit Tests

**Catalog Analyzer:**
```typescript
describe('analyzeCatalog', () => {
  it('should identify key attributes', async () => {
    const analysis = await analyzeCatalog('tvs')
    expect(analysis.attributes).toContainEqual(
      expect.objectContaining({ name: 'screen_size' })
    )
  })

  it('should calculate discrimination power', async () => {
    const analysis = await analyzeCatalog('tvs')
    const screenSize = analysis.attributes.find(a => a.name === 'screen_size')
    expect(screenSize?.discriminationPower).toBeGreaterThan(0.7)
  })
})
```

**Question Generator:**
```typescript
describe('generateTreeQuestions', () => {
  it('should generate 3-5 questions', async () => {
    const analysis = await analyzeCatalog('tvs')
    const tree = await generateTreeQuestions(analysis)
    expect(tree.questions.length).toBeGreaterThanOrEqual(3)
    expect(tree.questions.length).toBeLessThanOrEqual(5)
  })

  it('should map questions to attributes', async () => {
    const analysis = await analyzeCatalog('tvs')
    const tree = await generateTreeQuestions(analysis)
    tree.questions.forEach(q => {
      expect(q.options.every(opt => opt.filters)).toBe(true)
    })
  })
})
```

### Integration Tests

**End-to-End Tree Generation:**
```typescript
describe('AI Tree Generation E2E', () => {
  it('should generate, cache, and execute tree', async () => {
    // 1. Generate tree
    const tree = await detectDecisionTree('I need a TV')
    expect(tree).toBeDefined()

    // 2. Check cache
    const cached = await getCachedTree('tvs')
    expect(cached).toBeDefined()

    // 3. Execute tree
    const question = await getNextQuestion(tree, {})
    expect(question).toBeDefined()

    // 4. Complete tree
    const answers = { q1: 'opt1', q2: 'opt2', q3: 'opt3' }
    const products = await getRecommendations(tree, answers)
    expect(products.length).toBeGreaterThan(0)
  })
})
```

---

## Success Metrics

### Technical Metrics

**Performance:**
- Tree generation: < 5 seconds (cold)
- Tree retrieval: < 100ms (cached)
- Question execution: < 500ms
- Product filtering: < 1 second

**Quality:**
- Cache hit rate: > 90%
- Tree generation success rate: > 95%
- Claude API error rate: < 1%
- Question relevance score: > 8/10 (manual review)

### User Experience Metrics

**Engagement:**
- Tree completion rate: > 70%
- Question abandonment rate: < 30%
- Product match satisfaction: > 80%

**Coverage:**
- Categories with AI trees: > 20 (by end of month)
- % of queries triggering trees: > 40%

---

## Risks & Mitigations

### Risk 1: Claude API Costs
**Impact:** High token usage for tree generation
**Mitigation:**
- Cache trees for 7 days
- Batch analyze catalogs
- Monitor token usage
- Set budget alerts

### Risk 2: Poor Question Quality
**Impact:** Users confused by AI questions
**Mitigation:**
- Manual review of first 10 categories
- A/B test against hardcoded trees
- Collect user feedback
- Fallback to hardcoded if quality drops

### Risk 3: Catalog Changes Breaking Trees
**Impact:** Cached trees become stale
**Mitigation:**
- Auto-invalidate on significant catalog changes
- Background job monitors catalog
- Manual regeneration endpoint
- Expiry after 7 days

### Risk 4: Performance Degradation
**Impact:** Slow tree generation
**Mitigation:**
- Cache aggressively
- Pre-generate trees for popular categories
- Async generation with fallback
- Monitor generation time

---

## Future Enhancements (Phase 3+)

### Personalization
- Use household profile to adapt questions
- Skip questions if we know the answer
- Recommend based on past purchases

### Multi-Step Trees
- Complex products need > 5 questions
- Tree branching based on answers
- Hybrid approach (some hardcoded logic + AI)

### Answer Learning
- Track which answers lead to purchases
- Optimize question order
- Improve filtering logic

### Cross-Category Trees
- "Home office setup" → desk + chair + monitor
- Multi-product bundles
- Compatibility checking

---

## Development Timeline

### Week 1 (Dec 8-14)
- **Day 1:** Build catalog analyzer
- **Day 2:** Build question generator
- **Day 3:** Add caching + integration
- **Day 4:** End-to-end testing
- **Day 5:** Refinement + edge cases

### Week 2 (Dec 15-21)
- **Day 1-2:** Deploy to staging, test thoroughly
- **Day 3-4:** Add new categories (TVs, smartphones)
- **Day 5:** Code review, documentation

### Week 3 (Dec 22-28)
- **Day 1:** Deploy to production (feature flag OFF)
- **Day 2-3:** Final staging tests
- **Day 4:** Enable AI trees in production (gradual)
- **Day 5:** Monitor, iterate

---

## Decision Points

### To Decide Before Starting:

1. **Rollout Strategy:**
   - Feature flag (recommended) OR
   - Category-by-category OR
   - Hard cutover

2. **Cache Duration:**
   - 7 days (recommended) OR
   - 30 days (stable catalogs) OR
   - Manual invalidation only

3. **Fallback Strategy:**
   - Keep hardcoded trees as fallback OR
   - Remove hardcoded trees completely OR
   - Hybrid (AI for new, hardcoded for existing)

4. **Quality Threshold:**
   - Manual review every tree OR
   - Automated quality checks OR
   - Sample review (10%)

---

## Ready to Start Tomorrow! 🚀

**First task tomorrow:**
Build the catalog analyzer in `src/lib/ai/catalog-analyzer.ts`

**Expected outcome by end of Day 1:**
- Function that analyzes product catalog
- Returns attributes + suggested questions
- Tested on coffee machines & TVs

**Let's build this!**
