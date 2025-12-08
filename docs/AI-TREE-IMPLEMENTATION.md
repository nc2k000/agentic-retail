# AI-Generated Decision Trees - Implementation Plan

**Goal:** Build a system where Claude dynamically generates decision tree questions based on product catalog analysis, eliminating the need for hardcoded tree definitions.

**Timeline:** 4-6 weeks
**Status:** Planning
**Date:** December 7, 2025

---

## Overview

Instead of manually defining trees like `coffee.ts`, `paint.ts`, etc., the system will:

1. **Analyze the catalog** for a given category to find meaningful attributes
2. **Generate questions** dynamically via Claude based on available product variance
3. **Build filters** from user answers to rank products
4. **Cache results** using the same mission system (no changes needed)

---

## Architecture

### Current Flow (Hardcoded Trees)
```
User: "I need a coffee machine"
       ↓
detectTreeQuery() matches "coffee machine" → coffee-machine-purchase
       ↓
Load COFFEE_MACHINE_DECISION_TREE from coffee.ts (hardcoded questions)
       ↓
User answers questions → Filters applied
       ↓
rank_products with filters → Products returned
       ↓
Products cached to mission
```

### New Flow (AI-Generated Trees)
```
User: "I need a coffee machine"
       ↓
detectTreeQuery() matches "coffee machine" → coffee-machine-purchase
       ↓
NEW: analyzeCatalog('coffee-machines') → Extract attributes from products
       ↓
NEW: generateQuestions(attributes, userContext) → Claude creates questions
       ↓
User answers questions → Filters applied
       ↓
rank_products with filters → Products returned
       ↓
Products cached to mission (SAME as before)
```

**Key Insight:** The caching/resumption logic stays exactly the same! We're only changing how questions are generated.

---

## Implementation Phases

### Phase 1: Catalog Analysis Engine (Week 1)
Build a system to analyze product attributes and determine what makes good questions.

### Phase 2: Question Generation (Week 2)
Use Claude to generate questions based on catalog analysis and user context.

### Phase 3: Integration & Testing (Week 3)
Connect AI trees to existing chat flow and test alongside hardcoded trees.

### Phase 4: Pilot & Validation (Week 4+)
Run A/B test on new categories, collect data, make architecture decision.

---

## Phase 1: Catalog Analysis Engine

### Goal
Extract meaningful attributes from product catalog that can become decision tree questions.

### File: `src/lib/decisions/ai/analyze-catalog.ts`

```typescript
/**
 * Analyzes products in a category to find attributes suitable for questions
 */

import { getAllProducts } from '@/lib/catalog'

export interface AttributeAnalysis {
  key: string                    // e.g., 'brew_type', 'capacity', 'price'
  type: 'enum' | 'range' | 'boolean'
  values?: string[]              // For enum: ['drip', 'espresso', 'pod']
  range?: { min: number, max: number }  // For range: { min: 50, max: 800 }
  variance: number               // 0-1: How much this varies across products
  importance: number             // 0-1: How useful for filtering
  sampleProducts: string[]       // Example SKUs showing this attribute
}

export interface CategoryAnalysis {
  category: string
  totalProducts: number
  attributes: AttributeAnalysis[]
  priceRange: { min: number, max: number }
  brands: string[]
  topAttributes: AttributeAnalysis[]  // Sorted by importance
}

export async function analyzeCatalog(category: string): Promise<CategoryAnalysis> {
  const products = getAllProducts().filter(p =>
    p.category === category ||
    p.category?.toLowerCase().includes(category.toLowerCase())
  )

  if (products.length === 0) {
    throw new Error(`No products found for category: ${category}`)
  }

  console.log(`📊 Analyzing ${products.length} products in category: ${category}`)

  // Extract all unique attributes from products
  const attributeMap = new Map<string, Set<any>>()

  products.forEach(product => {
    // Check common attribute fields
    const attrs = {
      brand: product.brand,
      price: product.price,
      ...product.attributes // Custom attributes from catalog
    }

    Object.entries(attrs).forEach(([key, value]) => {
      if (!attributeMap.has(key)) {
        attributeMap.set(key, new Set())
      }
      attributeMap.get(key)!.add(value)
    })
  })

  // Analyze each attribute for variance and importance
  const attributes: AttributeAnalysis[] = []

  attributeMap.forEach((values, key) => {
    const uniqueValues = Array.from(values)

    // Skip attributes with no variance (all products same)
    if (uniqueValues.length === 1) return

    // Calculate variance (0-1)
    const variance = uniqueValues.length / products.length

    // Determine type
    let type: 'enum' | 'range' | 'boolean' = 'enum'
    let range: { min: number, max: number } | undefined
    let enumValues: string[] | undefined

    if (typeof uniqueValues[0] === 'number') {
      type = 'range'
      range = {
        min: Math.min(...uniqueValues as number[]),
        max: Math.max(...uniqueValues as number[])
      }
    } else if (typeof uniqueValues[0] === 'boolean') {
      type = 'boolean'
    } else {
      type = 'enum'
      enumValues = uniqueValues.map(v => String(v)).slice(0, 10) // Limit to 10 options
    }

    // Calculate importance (heuristic)
    let importance = variance

    // Boost importance for known high-value attributes
    if (key === 'price') importance *= 1.5
    if (key.includes('type') || key.includes('style')) importance *= 1.3
    if (key === 'brand' && uniqueValues.length > 3) importance *= 1.2

    // Reduce importance for low-variance attributes
    if (variance < 0.2) importance *= 0.5

    // Get sample products showing this attribute
    const sampleProducts = products
      .filter(p => p.attributes?.[key] !== undefined)
      .slice(0, 3)
      .map(p => p.sku)

    attributes.push({
      key,
      type,
      values: enumValues,
      range,
      variance: Math.min(variance, 1),
      importance: Math.min(importance, 1),
      sampleProducts
    })
  })

  // Sort by importance
  attributes.sort((a, b) => b.importance - a.importance)

  // Get top 5 most important attributes
  const topAttributes = attributes.slice(0, 5)

  // Price range
  const prices = products.map(p => p.price)
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }

  // Unique brands
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]

  const analysis: CategoryAnalysis = {
    category,
    totalProducts: products.length,
    attributes,
    priceRange,
    brands,
    topAttributes
  }

  console.log(`✅ Analysis complete:`, {
    totalProducts: analysis.totalProducts,
    attributeCount: attributes.length,
    topAttributes: topAttributes.map(a => a.key)
  })

  return analysis
}
```

### Example Output

```typescript
// For category: "coffee-machines"
{
  category: "coffee-machines",
  totalProducts: 24,
  priceRange: { min: 79.99, max: 899.99 },
  brands: ["Keurig", "Breville", "Nespresso", "Mr. Coffee"],
  topAttributes: [
    {
      key: "brew_type",
      type: "enum",
      values: ["drip", "espresso", "pod", "french-press"],
      variance: 0.85,
      importance: 1.0,
      sampleProducts: ["coffee-keurig-k55", "coffee-breville-barista"]
    },
    {
      key: "capacity",
      type: "range",
      range: { min: 4, max: 14 },
      variance: 0.7,
      importance: 0.7
    },
    {
      key: "price",
      type: "range",
      range: { min: 79.99, max: 899.99 },
      variance: 0.9,
      importance: 1.35  // Boosted because price is high-value
    }
  ]
}
```

---

## Phase 2: Question Generation

### Goal
Use Claude to generate 3-5 conversational questions based on catalog analysis.

### File: `src/lib/decisions/ai/generate-questions.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CategoryAnalysis } from './analyze-catalog'
import type { HouseholdMap } from '@/lib/household/types'

export interface GeneratedQuestion {
  id: string
  text: string
  helperText?: string
  options: Array<{
    label: string
    value: string
    description?: string
    filters: Record<string, any>
  }>
  attributeKey: string
}

export interface GeneratedTree {
  treeId: string
  treeName: string
  questions: GeneratedQuestion[]
  fallbackFilters: Record<string, any>
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

export async function generateQuestions(
  categoryAnalysis: CategoryAnalysis,
  userContext?: HouseholdMap
): Promise<GeneratedTree> {

  const { category, topAttributes, priceRange, brands, totalProducts } = categoryAnalysis

  const prompt = `You are an expert product recommendation assistant. Generate a decision tree for helping users find the perfect ${category}.

# Available Product Data

**Total Products:** ${totalProducts}
**Price Range:** $${priceRange.min} - $${priceRange.max}
**Brands Available:** ${brands.join(', ')}

**Top Attributes** (sorted by importance):
${topAttributes.map((attr, i) => `
${i + 1}. **${attr.key}** (${attr.type})
   - Variance: ${(attr.variance * 100).toFixed(0)}%
   - Importance: ${(attr.importance * 100).toFixed(0)}%
   ${attr.type === 'enum' ? `- Options: ${attr.values?.join(', ')}` : ''}
   ${attr.type === 'range' ? `- Range: ${attr.range?.min} to ${attr.range?.max}` : ''}
`).join('\n')}

${userContext ? `
# User Context
${JSON.stringify(userContext, null, 2)}
` : ''}

# Your Task

Generate 3-5 questions to help narrow down the best ${category} for this user.

**Requirements:**
1. Questions should be in priority order (most important first)
2. Each question must have 3-4 distinct options
3. Options should map to specific product filters
4. Use conversational, friendly language
5. Consider user context if available
6. Focus on attributes with high importance scores

**Output Format (JSON):**

\`\`\`json
{
  "questions": [
    {
      "id": "q1",
      "text": "What type of coffee do you prefer?",
      "helperText": "This helps us match your brewing style",
      "attributeKey": "brew_type",
      "options": [
        {
          "label": "Espresso drinks (lattes, cappuccinos)",
          "value": "espresso",
          "description": "Rich, concentrated shots",
          "filters": { "brew_type": "espresso" }
        },
        {
          "label": "Regular drip coffee",
          "value": "drip",
          "description": "Classic coffee maker style",
          "filters": { "brew_type": "drip" }
        },
        {
          "label": "Single-serve pods",
          "value": "pod",
          "description": "Quick and convenient",
          "filters": { "brew_type": "pod" }
        }
      ]
    }
  ]
}
\`\`\`

Generate the questions now:`

  console.log('🤖 Asking Claude to generate questions...')

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Expected text response from Claude')
  }

  // Extract JSON from response (Claude might wrap in ```json)
  const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/) ||
                    content.text.match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    console.error('❌ Failed to extract JSON from Claude response:', content.text)
    throw new Error('Claude did not return valid JSON')
  }

  const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0])

  console.log('✅ Generated questions:', {
    count: parsed.questions.length,
    attributes: parsed.questions.map((q: GeneratedQuestion) => q.attributeKey)
  })

  return {
    treeId: `ai-${category.toLowerCase().replace(/\s+/g, '-')}`,
    treeName: `Find Your Perfect ${category}`,
    questions: parsed.questions,
    fallbackFilters: {} // Can add category-wide filters here
  }
}
```

---

## Phase 3: Integration

### Goal
Connect AI tree generation to existing chat flow with minimal disruption.

### File: `src/app/api/decisions/ai-tree/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { analyzeCatalog } from '@/lib/decisions/ai/analyze-catalog'
import { generateQuestions } from '@/lib/decisions/ai/generate-questions'

export async function POST(req: Request) {
  try {
    const { category, userContext } = await req.json()

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    console.log(`🌲 Generating AI tree for category: ${category}`)

    // 1. Analyze catalog
    const analysis = await analyzeCatalog(category)

    // 2. Generate questions via Claude
    const tree = await generateQuestions(analysis, userContext)

    return NextResponse.json(tree)

  } catch (error: any) {
    console.error('❌ AI tree generation failed:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### Modified: `src/app/api/chat/route.ts`

Add AI tree support alongside hardcoded trees:

```typescript
// Add to detectTreeQuery function
function detectTreeQuery(text: string): { treeId: string; treeName: string; isAI?: boolean } | null {
  const lower = text.toLowerCase()

  // Hardcoded trees (existing)
  if (lower.includes('coffee') || lower.includes('espresso')) {
    return { treeId: 'coffee-machine-purchase', treeName: 'Find Your Perfect Coffee Machine' }
  }
  if (lower.includes('paint')) {
    return { treeId: 'paint-purchase', treeName: 'Find Your Perfect Paint' }
  }
  // ... other hardcoded trees

  // AI trees for new categories
  if (lower.includes('blender') || lower.includes('food processor')) {
    return { treeId: 'ai-small-appliances', treeName: 'Find Your Perfect Small Appliance', isAI: true }
  }
  if (lower.includes('patio') || lower.includes('outdoor furniture')) {
    return { treeId: 'ai-outdoor-furniture', treeName: 'Find Your Perfect Outdoor Furniture', isAI: true }
  }

  return null
}

// In tree interception block:
if (treeMatch && !hasCompletedTreeMission) {
  console.log('✅ TREE MATCH FOUND! Intercepting request')

  let treeDefinition

  if (treeMatch.isAI) {
    // Generate AI tree dynamically
    console.log('🤖 Generating AI tree...')
    const aiTreeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/decisions/ai-tree`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: treeMatch.treeId.replace('ai-', ''),
        userContext: householdMap
      })
    })

    if (!aiTreeResponse.ok) {
      console.error('❌ AI tree generation failed')
      // Fall back to normal chat
      treeDefinition = null
    } else {
      treeDefinition = await aiTreeResponse.json()
    }
  } else {
    // Use hardcoded tree (existing flow)
    treeDefinition = getTreeById(treeMatch.treeId)
  }

  if (treeDefinition) {
    // Rest of existing tree interception logic...
  }
}
```

---

## Phase 4: Testing Strategy

### A/B Test Setup

**Test 1: Small Appliances**
- Control Group: Manual browse (no tree)
- Treatment Group: AI-generated tree
- Traffic: 50/50 split
- Duration: 2 weeks

**Test 2: Outdoor Furniture**
- Control Group: Manual browse
- Treatment Group: AI-generated tree
- Traffic: 50/50 split
- Duration: 2 weeks

### Metrics to Track

```typescript
// Track in analytics
{
  event: 'ai_tree_start',
  category: 'small-appliances',
  treeId: 'ai-small-appliances',
  questionsGenerated: 4,
  userId: 'xxx'
}

{
  event: 'ai_tree_complete',
  category: 'small-appliances',
  treeId: 'ai-small-appliances',
  completionTime: 45, // seconds
  questionsAnswered: 4,
  productsShown: 5,
  userId: 'xxx'
}

{
  event: 'ai_tree_abandon',
  category: 'small-appliances',
  questionNumber: 2,
  userId: 'xxx'
}
```

### Success Metrics

**Primary:**
- Tree completion rate > 60%
- Product view rate > 80%
- User satisfaction score > 4/5

**Secondary:**
- Time to complete < 60 seconds
- Question clarity score > 4/5
- Product relevance score > 4/5

---

## Migration Decision Matrix

After 2-4 weeks of data:

| Metric | AI Trees | Hardcoded Trees | Winner |
|--------|----------|----------------|--------|
| Completion Rate | ___% | ___% | ? |
| Time to Complete | ___s | ___s | ? |
| Product Views | ___% | ___% | ? |
| Conversion (if checkout live) | ___% | ___% | ? |
| User Feedback Score | ___/5 | ___/5 | ? |

**Decision Rules:**
- If AI wins 4/5 metrics → Migrate all trees to AI
- If Hardcoded wins 4/5 → Keep hardcoded, expand manually
- If mixed (2-3 each) → Hybrid: AI for new, hardcoded for proven

---

## Next Steps

**Week 1:**
- [ ] Implement `analyzeCatalog()` function
- [ ] Test catalog analysis on coffee machines
- [ ] Verify attribute extraction is accurate
- [ ] Add unit tests

**Week 2:**
- [ ] Implement `generateQuestions()` function
- [ ] Test question generation with Claude
- [ ] Refine prompt based on output quality
- [ ] Add caching for generated trees

**Week 3:**
- [ ] Create `/api/decisions/ai-tree` route
- [ ] Integrate with chat route
- [ ] Add AI tree categories (small appliances, outdoor furniture)
- [ ] Test full flow end-to-end

**Week 4+:**
- [ ] Deploy to production with feature flag
- [ ] Run A/B test
- [ ] Collect metrics
- [ ] Make architecture decision

---

## Open Questions

1. **Caching Generated Trees**: Should we cache generated questions or regenerate each time?
   - Pro cache: Consistent experience, faster, cheaper
   - Pro regenerate: Adapts to catalog changes, considers user context

2. **Question Count**: Fixed (always 4) or dynamic (3-5 based on attributes)?

3. **Fallback Strategy**: What if AI generation fails?
   - Option A: Fall back to manual browse
   - Option B: Show generic tree with price/brand only

4. **Question Validation**: How do we ensure generated questions are high quality?
   - Option A: Manual review before launch
   - Option B: Automated quality checks
   - Option C: User feedback loop

---

## Summary

This plan lets you:
- ✅ Keep existing hardcoded trees working (coffee, paint, mattress, power tools)
- ✅ Test AI trees on new categories without risk
- ✅ Collect real data before committing to architecture
- ✅ Make informed decision based on metrics
- ✅ Keep option to use both approaches (hybrid)

**Ready to start building?** I recommend starting with Phase 1 (Catalog Analysis) - it's foundational and can be built/tested independently.
