# Quick Start - Phase 2 AI Trees (Tomorrow)

**Date:** December 8, 2024
**Goal:** Build catalog analyzer (Day 1 of AI trees implementation)

---

## Context Refresh

### What's Live in Production Today
✅ 4 hardcoded decision trees (coffee, paint, mattress, power tools)
✅ Product caching working perfectly
✅ Mission persistence across sessions
✅ All TypeScript errors fixed, build clean

### What We're Building Tomorrow
🔨 AI system to generate decision trees from product catalog
🔨 Start with catalog analyzer (analyzes products by category)

---

## Day 1 Task: Build Catalog Analyzer

### File to Create
`src/lib/ai/catalog-analyzer.ts`

### What It Does
1. Takes a category (e.g., "tvs", "coffee_machine")
2. Queries all products in that category
3. Analyzes product attributes (size, color, features, etc.)
4. Calculates which attributes are most useful for filtering
5. Returns analysis + suggested questions

### Key Function
```typescript
async function analyzeCatalog(category: string): Promise<CatalogAnalysis>
```

### Expected Output Example
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

---

## Testing Plan for Day 1

### Test Category 1: Coffee Machines
- Run analyzer on coffee_machine category
- Compare suggested questions to our hardcoded tree
- Should suggest: capacity, brew type, features

### Test Category 2: TVs (New Category)
- Run analyzer on tvs category
- Should suggest: screen size, resolution, smart features
- Validate attribute coverage

### Test Category 3: Paint (Complex)
- Run analyzer on paint category
- Should handle color attributes properly
- Check discrimination power calculations

---

## Technical Approach

### Step 1: Query Products
```typescript
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('category', category)
```

### Step 2: Extract Attributes
Loop through products, extract:
- Tags (array of strings)
- Specifications (JSON object)
- Name/description (parse for attributes)

### Step 3: Calculate Metrics
For each attribute:
- **Coverage:** % of products with this attribute
- **Discrimination Power:** How well it splits the product set
- **Priority:** Coverage × Discrimination

### Step 4: Generate Suggestions
Create question suggestions from top attributes:
- Natural language text
- Options derived from attribute values
- Priority score for ordering

---

## Success Criteria for Day 1

✅ Function exists: `analyzeCatalog(category: string)`
✅ Returns structured analysis object
✅ Tested on 3 categories (coffee, tvs, paint)
✅ Attribute coverage calculated correctly
✅ Discrimination power makes sense
✅ Question suggestions are logical
✅ No runtime errors

---

## Next Steps (Day 2+)

**Day 2:** Question generator (use Claude to create questions)
**Day 3:** Tree cache + integration
**Day 4-5:** Testing + refinement

---

## Questions to Answer Tomorrow

1. **Attribute Extraction Strategy:**
   - Parse from product tags? ✓
   - Parse from specifications? ✓
   - Parse from name/description? (optional)

2. **Discrimination Power Formula:**
   - Simple: count unique values
   - Advanced: calculate information gain
   - Start simple, refine later ✓

3. **Minimum Product Count:**
   - If category has < 10 products, skip tree generation
   - Fall back to standard search

4. **Attribute Types:**
   - Categorical: distinct values (size, color)
   - Numeric: ranges (price, weight)
   - Boolean: yes/no (has feature)

---

## Files to Reference

**Existing Code:**
- `src/lib/decisions/trees/coffee.ts` - Example hardcoded tree
- `src/lib/catalog/index.ts` - Product data structures
- `src/types/index.ts` - Type definitions

**New Implementation:**
- `src/lib/ai/catalog-analyzer.ts` - CREATE THIS
- `src/lib/ai/types.ts` - CREATE THIS (type definitions)

**Documentation:**
- `docs/PHASE-2-AI-TREES-PLAN.md` - Full implementation plan
- `docs/AI-TREE-IMPLEMENTATION.md` - Original architecture doc

---

## Environment Setup

**No new dependencies needed for Day 1!**

Just need:
- Supabase client (already have)
- TypeScript (already have)
- Product database (already populated)

**New dependencies for Day 2:**
- Claude SDK (for question generation)

---

## Development Workflow

1. **Create branch:**
   ```bash
   git checkout -b feature/ai-decision-trees
   ```

2. **Create files:**
   ```bash
   mkdir -p src/lib/ai
   touch src/lib/ai/catalog-analyzer.ts
   touch src/lib/ai/types.ts
   ```

3. **Implement analyzer**

4. **Test manually:**
   - Create test script: `tests/catalog-analyzer.test.ts`
   - Or test via Node REPL

5. **Commit progress:**
   ```bash
   git add .
   git commit -m "Day 1: Implement catalog analyzer"
   ```

6. **Deploy to staging:**
   ```bash
   vercel --preview
   ```

---

## Expected Time Breakdown

- **Setup (30 mins):** Create files, define types
- **Core Logic (2 hours):** Implement analyzer function
- **Testing (1 hour):** Test on 3 categories
- **Refinement (1 hour):** Fix bugs, improve logic
- **Documentation (30 mins):** Add comments, update docs

**Total:** ~5 hours for Day 1

---

## Potential Blockers & Solutions

### Blocker 1: Product data structure inconsistent
**Solution:** Start with tags, ignore specifications for v1

### Blocker 2: Attribute extraction unclear
**Solution:** Hardcode attribute mappings for first few categories

### Blocker 3: Discrimination power formula complex
**Solution:** Start with simple formula: `uniqueValues / totalProducts`

### Blocker 4: No test data
**Solution:** Use production database (read-only queries)

---

## Ready for Tomorrow! 🚀

**First action:** Create `src/lib/ai/catalog-analyzer.ts`

**First test:** Run on coffee_machine category, compare to hardcoded tree

**Goal:** Analyzer working by end of Day 1

See you tomorrow!
