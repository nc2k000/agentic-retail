# Phase 1.5: Hybrid Implementation Plan

**Approach:** Hardcoded Trees MVP → AI Tree Pilot → Data-Driven Decision

**Total Timeline:** 6-8 weeks (2 weeks MVP + 4-6 weeks AI pilot in parallel with production)

**Last Updated:** December 7, 2025

---

## Overview

This hybrid approach allows us to:
1. **Ship quickly** with proven hardcoded trees (4 verticals)
2. **Learn from real users** before committing to AI architecture
3. **Test AI trees** on new categories without risking existing ones
4. **Make data-driven decisions** about long-term architecture

---

## Phase 1.5A: Production MVP with Hardcoded Trees

**Timeline:** 2 weeks
**Goal:** Ship decision intelligence to production with 4 proven verticals

### Week 1: Core Production Features

#### Task 1.1: Mission Home Screen (High Priority)
**Estimated:** 6-8 hours

**What to Build:**
- Replace `/` redirect with mission dashboard
- Display active missions (in-progress trees)
- Display completed missions (trees with cached products)
- "Continue Mission" and "View Results" CTAs

**Files to Create:**
```
src/app/page.tsx - Replace redirect with home screen
src/components/missions/MissionCard.tsx - Individual mission card
src/components/missions/MissionGrid.tsx - Grid layout
src/app/api/missions/route.ts - Already exists, verify GET works
```

**UI Mockup:**
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

**Success Criteria:**
- [ ] Active missions display with progress
- [ ] Completed missions show product count and price range
- [ ] "Continue Mission" navigates to `/chat` and resumes tree
- [ ] "View Results" navigates to `/chat` and shows cached products
- [ ] Empty state when no missions

**API Required:**
```typescript
GET /api/missions?status=active
GET /api/missions?status=completed
```

---

#### Task 1.2: Basic Checkout Flow (High Priority)
**Estimated:** 8-12 hours

**What to Build:**
- Simple checkout page (no payment processing yet)
- Order completion trigger
- Integration with `discoverFromPurchase()`

**Files to Create/Modify:**
```
src/app/checkout/page.tsx - Checkout UI
src/app/api/orders/complete/route.ts - Order completion
src/lib/household/discovery.ts - Already exists, just call it
```

**Flow:**
```
Cart → Checkout → Click "Complete Order" → Order saved → Discovery triggered
```

**Discovery Examples:**
```typescript
// User buys diapers + formula
discoverFromPurchase(userId, [
  { sku: 'diaper-pampers-size3', name: 'Pampers Size 3', category: 'baby' },
  { sku: 'formula-enfamil-infant', name: 'Enfamil Infant Formula', category: 'baby' }
], timestamp)
→ Saves: { has_baby: true, life_stage: 'young_family' }

// User completes coffee machine tree → Buys espresso machine
discoverFromPurchase(userId, [
  { sku: 'coffee-breville-barista', name: 'Breville Barista Express', category: 'coffee-machines' }
], timestamp)
→ Saves: { drinks_espresso: true, has_coffee_machine: true }
```

**Success Criteria:**
- [ ] Checkout page displays cart items
- [ ] "Complete Order" saves order to database
- [ ] `discoverFromPurchase()` called on completion
- [ ] Household facts saved to `household_facts` table
- [ ] User maturity updated
- [ ] Order confirmation shown

**Out of Scope (for now):**
- ❌ Payment processing (Stripe/etc.)
- ❌ Shipping address collection
- ❌ Order fulfillment
- ❌ Email confirmations

---

#### Task 1.3: Tree Answer Extraction (Optional - Nice to Have)
**Estimated:** 4-6 hours

**What to Build:**
- Intercept tree answers in chat flow
- Extract implicit preferences from selections
- Call discovery API incrementally

**Files to Create:**
```
src/lib/decisions/tree-discovery.ts - Tree answer extraction logic
src/app/api/household/discover/route.ts - Handle tree answer type
```

**Example Extraction:**
```typescript
// Paint Tree - User selects "Gray & Neutral"
→ Extract: { color_preference: 'gray' }

// Mattress Tree - User selects "Side sleeper"
→ Extract: { sleeping_position: 'side' }

// Coffee Tree - User selects "6-10 cups (Family)"
→ Extract: { household_size: 'medium_family', daily_coffee_consumption: '6-10' }
```

**Success Criteria:**
- [ ] Tree answers parsed during quiz
- [ ] Preferences extracted and saved
- [ ] Household profile enriched progressively
- [ ] No impact on tree completion flow

**Priority:** Medium (enhances personalization but not blocking)

---

### Week 2: Polish & Production Prep

#### Task 2.1: Production Cleanup
**Estimated:** 4-6 hours

**Checklist:**
- [ ] Remove verbose console logs (keep critical ones)
- [ ] Add user-facing error messages
- [ ] Fix TypeScript `any` types in mission mapping
- [ ] Add loading states for mission queries
- [ ] Add empty states for no missions
- [ ] Test all flows end-to-end

---

#### Task 2.2: Mission Cleanup Logic
**Estimated:** 2-3 hours

**Problems to Fix:**
1. Users can create duplicate missions for same tree
2. Paused missions accumulate indefinitely

**Solutions:**
```typescript
// Option A: Prevent duplicates
// Before creating new mission, check for existing active mission with same tree_id
// Resume existing instead of creating duplicate

// Option B: Cleanup job
// Delete paused missions older than 30 days
// Archive completed missions older than 90 days
```

**Implementation:**
```typescript
// In findOrCreateMission():
const existingMission = await supabase
  .from('missions')
  .select('*')
  .eq('user_id', userId)
  .eq('tree_id', requestedTreeId)
  .eq('status', 'active')
  .single()

if (existingMission.data) {
  console.log('♻️ Resuming existing mission instead of creating duplicate')
  return existingMission.data
}
```

---

#### Task 2.3: Documentation Updates
**Estimated:** 2 hours

**Updates Needed:**
- [ ] Update `PHASE-1-DECISION-INTELLIGENCE.md` with checkout flow
- [ ] Update `PHASE-1-TEST-CRITERIA.md` with new verticals
- [ ] Create deployment guide
- [ ] Create user guide for mission home screen

---

#### Task 2.4: Testing & QA
**Estimated:** 4-6 hours

**Test Checklist:**
- [ ] All 4 verticals (coffee, paint, mattress, power tools)
- [ ] Mission home screen displays correctly
- [ ] Mission resumption from home screen
- [ ] Tree switching (abandon coffee, start paint)
- [ ] Checkout flow triggers discovery
- [ ] No restock notifications during trees
- [ ] Hard refresh doesn't break state
- [ ] Mobile responsive

---

### Week 2 End: Deploy to Production ✅

**Pre-Deployment Checklist:**
- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Error tracking enabled (Sentry/etc.)
- [ ] Analytics configured
- [ ] Performance monitoring active

**Deployment:**
```bash
# Vercel deployment
npm run build
vercel --prod

# Or manual
git push origin main
# (Vercel auto-deploys)
```

**Post-Deployment Monitoring:**
- [ ] Check error rates
- [ ] Monitor mission completion rates
- [ ] Track tree abandonment by vertical
- [ ] Measure time-to-resumption
- [ ] Analyze which verticals convert best

---

## Phase 1.5B: AI Tree Pilot (Parallel Development)

**Timeline:** 4-6 weeks (starts after Week 1 of MVP)
**Goal:** Test AI-generated trees on 2 new categories

### Week 3-4: AI Tree Architecture

#### Task 3.1: Design AI Tree System
**Estimated:** 8-12 hours

**Core Components:**

**1. Catalog Attribute Analyzer**
```typescript
// src/lib/decisions/ai/analyze-catalog.ts

interface CategoryAttributes {
  category: string
  attributes: Array<{
    key: string
    type: 'string' | 'number' | 'boolean' | 'range'
    values: string[] | { min: number, max: number }
    importance: number // 0-1, for prioritizing questions
  }>
}

async function analyzeCategoryAttributes(category: string): Promise<CategoryAttributes> {
  // 1. Get all products in category
  const products = getAllProducts().filter(p => p.category === category)

  // 2. Extract unique attributes
  // Example: For coffee machines → brew_type, capacity, price, brand

  // 3. Rank by variance (high variance = good question)
  // Example: If all coffee machines are "black", skip color question

  // 4. Return structured attributes for question generation
}
```

**2. AI Question Generator**
```typescript
// src/lib/decisions/ai/generate-questions.ts

interface GeneratedQuestion {
  id: string
  text: string
  options: Array<{ label: string, value: string, filters: Record<string, any> }>
  attributeKey: string
}

async function generateTreeQuestions(
  category: string,
  userContext: HouseholdMap,
  catalogAttributes: CategoryAttributes
): Promise<GeneratedQuestion[]> {
  // Use Claude to generate 3-5 questions based on:
  // - Available product attributes
  // - User's household profile (maturity, preferences)
  // - Conversation context

  const prompt = `
  You are a product recommendation expert for ${category}.

  Available product attributes:
  ${JSON.stringify(catalogAttributes, null, 2)}

  User profile:
  ${JSON.stringify(userContext, null, 2)}

  Generate 3-5 questions to help narrow down the best ${category} for this user.
  Each question should:
  - Be clear and concise
  - Have 3-4 distinct options
  - Map to specific product filters

  Return JSON format:
  {
    "questions": [
      {
        "id": "q1",
        "text": "What's most important to you?",
        "attributeKey": "priority",
        "options": [
          { "label": "Low price", "value": "budget", "filters": { "price_max": 500 } },
          { "label": "Best quality", "value": "quality", "filters": { "rating_min": 4.5 } }
        ]
      }
    ]
  }
  `

  const response = await callClaude(prompt)
  return response.questions
}
```

**3. Dynamic Filter Builder**
```typescript
// src/lib/decisions/ai/build-filters.ts

function buildFiltersFromAnswers(
  questions: GeneratedQuestion[],
  answers: Record<string, string>
): ProductFilters {
  // Combine filters from all selected options
  // Example:
  // User answered q1: "budget" → { price_max: 500 }
  // User answered q2: "large" → { capacity_min: 10 }
  // Combined: { price_max: 500, capacity_min: 10 }
}
```

---

#### Task 3.2: Implement AI Tree Flow
**Estimated:** 12-16 hours

**New API Route:**
```typescript
// src/app/api/decisions/ai-tree/route.ts

export async function POST(req: Request) {
  const { category, userContext } = await req.json()

  // 1. Analyze catalog for this category
  const attributes = await analyzeCategoryAttributes(category)

  // 2. Generate questions via Claude
  const questions = await generateTreeQuestions(category, userContext, attributes)

  // 3. Return decision tree structure
  return NextResponse.json({
    treeId: `ai-${category}-purchase`,
    treeName: `Find Your Perfect ${category}`,
    questions
  })
}
```

**Modified Chat Route:**
```typescript
// In src/app/api/chat/route.ts

// Detect AI tree categories
const aiTreeCategories = ['small-appliance', 'outdoor-furniture']
const isAiTree = aiTreeCategories.some(cat => lower.includes(cat))

if (isAiTree) {
  // Generate tree dynamically instead of using hardcoded definition
  const aiTree = await fetch('/api/decisions/ai-tree', {
    method: 'POST',
    body: JSON.stringify({ category, userContext: householdMap })
  })

  // Proceed with same interception flow
}
```

---

### Week 5-6: AI Tree Pilot Testing

#### Task 4.1: Choose Pilot Categories
**Recommended:**
1. **Small Appliances** (blenders, toasters, air fryers)
   - Medium complexity
   - Good attribute variance
   - High purchase intent

2. **Outdoor Furniture** (patio sets, grills, planters)
   - Seasonal
   - Different from existing verticals
   - Tests adaptability

#### Task 4.2: Run A/B Test
**Setup:**
- 50% users → AI-generated tree
- 50% users → Redirect to manual browse (control)

**Metrics to Track:**
1. **Completion Rate**
   - AI Tree: ____%
   - Control: ____%

2. **Time to Complete**
   - AI Tree: ___ seconds
   - Control: ___ seconds

3. **Product View Rate**
   - AI Tree: ____%
   - Control: ____%

4. **Conversion Rate (if checkout live)**
   - AI Tree: ____%
   - Control: ____%

5. **Resumption Rate**
   - AI Tree: ____%
   - Control: N/A

#### Task 4.3: Qualitative Analysis
**Questions to Answer:**
- Are AI-generated questions clear and relevant?
- Do users understand the options?
- Are product recommendations accurate?
- Any confusion or drop-off points?

**Data Collection:**
- Session recordings (Hotjar/FullStory)
- User feedback surveys
- Support ticket analysis

---

## Decision Point: Week 6-7

After 4+ weeks of production data + AI pilot results:

### Scenario A: AI Trees Perform Better
**Metrics:**
- ✅ Higher completion rate
- ✅ Better user feedback
- ✅ Comparable or better conversion

**Action:**
- Migrate existing hardcoded trees to AI system
- Expand AI trees to all categories
- Phase out hardcoded tree files

**Timeline:** 2-3 weeks to migrate

---

### Scenario B: Hardcoded Trees Perform Better
**Metrics:**
- ✅ Higher completion rate
- ✅ Better conversion
- ✅ More predictable user flow

**Action:**
- Keep hardcoded trees for high-value verticals
- Manually expand to new categories
- Use AI trees only for long-tail/seasonal categories

**Timeline:** Ongoing as needed

---

### Scenario C: Mixed Results (Most Likely)
**Findings:**
- AI trees work well for simple categories (small appliances)
- Hardcoded trees better for complex categories (mattresses, paint)

**Action:**
- **Hybrid Strategy:**
  - Keep hardcoded for: Coffee, Paint, Mattresses, Power Tools, TVs, Appliances
  - Use AI for: Small Appliances, Seasonal, Long-tail, New categories

**Benefits:**
- ✅ Best UX for high-value categories
- ✅ Scalability for expanding catalog
- ✅ Flexibility to optimize per vertical

**Timeline:** Ongoing development

---

## Success Metrics

### Phase 1.5A Success (Week 2)
- [ ] 4 verticals live in production
- [ ] Mission home screen functional
- [ ] Basic checkout flow working
- [ ] Discovery integration active
- [ ] No critical bugs

### Phase 1.5B Success (Week 6)
- [ ] AI tree system functional
- [ ] 2 pilot categories tested
- [ ] A/B test data collected
- [ ] Clear performance comparison
- [ ] Architecture decision made

### Overall Success (Week 8)
- [ ] Production system stable
- [ ] User engagement metrics positive
- [ ] Clear path forward on architecture
- [ ] Foundation for scaling to 20+ categories

---

## Risk Mitigation

### Risk 1: MVP Takes Longer Than 2 Weeks
**Mitigation:**
- Cut Tree Answer Extraction (move to Phase 2)
- Simplify checkout flow (just order completion, no UI polish)
- Ship with 2 verticals instead of 4 if needed

### Risk 2: AI Trees Don't Work Well
**Mitigation:**
- Pilot only 1 category first
- Have fallback to manual browse
- Low user exposure (10-20% traffic)
- Easy rollback to hardcoded approach

### Risk 3: User Data Insufficient for Decision
**Mitigation:**
- Extend testing period to 6-8 weeks
- Supplement with user interviews
- Test with higher traffic categories
- Make conservative decision (keep hardcoded)

---

## Next Steps (Immediate)

**This Week:**
1. [ ] Start Task 1.1 - Mission Home Screen
2. [ ] Design checkout flow mockups
3. [ ] Set up analytics tracking
4. [ ] Create feature flags for AI tree pilot

**Next Week:**
1. [ ] Complete Mission Home Screen
2. [ ] Build basic checkout flow
3. [ ] Test end-to-end
4. [ ] Prepare for production deployment

**Week 3+:**
1. [ ] Deploy MVP to production
2. [ ] Start AI tree architecture design
3. [ ] Monitor production metrics
4. [ ] Begin AI tree development

---

## Open Questions

1. **Analytics Platform**: Which tool? (PostHog, Mixpanel, Amplitude?)
2. **Feature Flags**: LaunchDarkly, Vercel, or custom?
3. **Error Tracking**: Sentry already set up?
4. **User Feedback**: How to collect? (Surveys, in-app widget?)
5. **A/B Testing**: Vercel Edge Config, Optimizely, or custom?

---

## Summary

This hybrid plan gives you:
- ✅ **Fast production deployment** (2 weeks)
- ✅ **Real user data** before committing to architecture
- ✅ **Low risk testing** of AI approach
- ✅ **Flexibility** to choose best path
- ✅ **Scalability** for future growth

**Total Investment:**
- 2 weeks → Production MVP
- 4-6 weeks → AI pilot + data collection
- 1 week → Decision & planning
- **7-9 weeks total** → Clear architectural direction with production validation
