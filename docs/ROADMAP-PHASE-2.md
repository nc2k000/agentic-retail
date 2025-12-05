# Phase 2 Roadmap: AI Integration & Real-World Connection

**Last Updated:** December 4, 2024
**Status:** Ready to Begin
**Estimated Duration:** 2-3 weeks

---

## 🎯 Overview

Phase 1 built the **foundation**—user maturity scoring, preference generation, ranking algorithm, and carousel UI. Phase 2 focuses on **connecting these systems to the AI** and making them work with real data in production.

**Goal:** Transform the personalization system from standalone components into a fully integrated, AI-driven shopping experience.

---

## 📋 Phase 2 Objectives

### 1. AI-Driven Product Ranking
**Current State:** Ranking algorithm exists but isn't called by AI
**Goal:** AI responses use ranked products in carousels and lists

**Tasks:**
- [ ] Create `/api/products/rank` endpoint
  - Accepts category/query + userId
  - Returns ranked products using algorithm
  - Caches results for performance
- [ ] Add ranking to chat API route
  - Detect when AI needs product recommendations
  - Call ranking endpoint with context
  - Include ranked products in AI context
- [ ] Update AI prompt with ranking instructions
  - Explain how to request ranked products
  - Show examples of carousel responses
  - Define when to use carousel vs list

**Files to Modify:**
- `src/app/api/products/rank/route.ts` (new)
- `src/app/api/chat/route.ts`
- `src/lib/prompts.ts`

**Success Criteria:**
- User asks "I need milk" → AI returns carousel with ranked milk products
- Rankings reflect user's actual preferences from database
- Top pick matches user's purchase history

---

### 2. Mission Detection & Response Patterns
**Current State:** AI treats all requests the same way
**Goal:** AI detects mission type and responds appropriately

**Mission Types:**
1. **Precision** - User needs ONE item (e.g., "I need milk")
   - Response: **Carousel** with ranked options
   - Format: 3-5 products, top pick highlighted
2. **Essentials** - User needs MULTIPLE items (e.g., "Restock my fridge")
   - Response: **Shopping List** with top picks auto-selected
   - Format: List grouped by category
3. **Recipe** - User wants meal ingredients (e.g., "Pasta dinner for 4")
   - Response: **Recipe Block** + shopping list
   - Format: Ingredients with products
4. **Research** - User asks questions (e.g., "What's organic?")
   - Response: **Text explanation** + optional suggestions
   - Format: No products, just info

**Tasks:**
- [ ] Build mission classifier
  - Analyze user query patterns
  - Detect mission type from keywords
  - Consider conversation context
- [ ] Update AI prompt with mission logic
  - Define each mission type
  - Provide response templates
  - Show format examples
- [ ] Add mission tracking to messages
  - Store detected mission type
  - Track mission lifecycle (active → completed)
  - Use for analytics

**Files to Modify:**
- `src/lib/missions/classifier.ts` (new)
- `src/lib/prompts.ts`
- `src/types/index.ts`

**Success Criteria:**
- "I need milk" → Precision mission → Carousel
- "Restock my essentials" → Essentials mission → List
- "How do I cook pasta?" → Research mission → Text only

---

### 3. Real-Time Preference Updates
**Current State:** Preferences only update from CSV ingestion
**Goal:** Preferences update immediately when user adds to cart

**Behavior:**
- User adds "Organic Valley Milk" to cart
- System increments purchase count for:
  - Product (favorite tracking)
  - Brand "Organic Valley"
  - Category "Dairy"
- Confidence scores automatically adjust
- Next recommendation reflects new preference

**Tasks:**
- [ ] Create preference update function
  - Triggered on cart addition
  - Updates purchase counts
  - Recalculates confidence scores
- [ ] Hook into cart actions
  - Call update function from CartContext
  - Fire-and-forget (async, no blocking)
  - Log updates for debugging
- [ ] Invalidate maturity cache
  - Clear user maturity cache on purchase
  - Force recalculation on next chat load
  - Ensure fresh recommendations

**Files to Modify:**
- `src/lib/personalization/preferences.ts` (new)
- `src/contexts/CartContext.tsx`
- `src/lib/personalization/maturity.ts`

**Success Criteria:**
- User adds product → preference confidence increases
- Next query shows updated preference
- Maturity score reflects new purchase

---

### 4. Category-Based Product Filtering
**Current State:** Ranking works on any product array
**Goal:** Smart category detection and filtering

**Features:**
- **Automatic Category Detection:**
  - "I need milk" → Dairy category
  - "Show me snacks" → Snacks category
  - "What bread do you have?" → Bakery category
- **Multi-Category Support:**
  - "Breakfast items" → Dairy + Bakery + Produce
  - "Dinner ingredients" → Meat + Produce + Pantry
- **Fallback to All Products:**
  - "Show me popular items" → All categories

**Tasks:**
- [ ] Build category detector
  - Map keywords to categories
  - Support multi-category queries
  - Handle ambiguous cases
- [ ] Add category filtering to ranking
  - Filter products before ranking
  - Maintain category context in response
  - Include category in suggestions
- [ ] Update AI prompt with category logic
  - Explain category detection
  - Show multi-category examples
  - Define category grouping rules

**Files to Modify:**
- `src/lib/products/categories.ts` (new)
- `src/lib/personalization/ranking.ts`
- `src/lib/prompts.ts`

**Success Criteria:**
- "I need milk" → Only Dairy products ranked
- "Breakfast essentials" → Dairy + Bakery + Produce
- Irrelevant products never appear in results

---

### 5. Actual Product Catalog Integration
**Current State:** Mock products in `products.ts`
**Goal:** Load products from database or external catalog

**Options:**
1. **Database Products:**
   - Store products in `products` table
   - Load via Supabase queries
   - Cache in-memory for performance
2. **External API:**
   - Fetch from retailer API
   - Transform to our Product type
   - Cache with TTL
3. **Hybrid:**
   - Core products in DB
   - Extended catalog from API
   - Merge and deduplicate

**Tasks:**
- [ ] Choose integration approach
  - Evaluate data sources
  - Consider performance/caching
  - Plan data sync strategy
- [ ] Build product loader
  - Fetch from source
  - Transform to Product type
  - Handle errors gracefully
- [ ] Add product search
  - Search by name, SKU, category
  - Support fuzzy matching
  - Return ranked results

**Files to Create:**
- `src/lib/products/loader.ts`
- `src/lib/products/search.ts`
- `src/app/api/products/route.ts`

**Success Criteria:**
- All real products available
- Search returns accurate results
- Performance <200ms for queries

---

### 6. Analytics & Tracking
**Current State:** No tracking of user behavior
**Goal:** Track key personalization metrics

**Events to Track:**
- **Product Ranking:**
  - Which products were ranked
  - Final scores and positions
  - User maturity level at time
- **User Actions:**
  - Which ranked product was chosen
  - Position in carousel (1st, 2nd, 3rd?)
  - Time to decision
- **Mission Outcomes:**
  - Mission type detected
  - Products recommended
  - Cart conversion rate

**Tasks:**
- [ ] Create analytics event system
  - Define event schema
  - Build logging function
  - Choose storage (DB, analytics service)
- [ ] Add tracking to key points
  - Product ranking complete
  - Carousel rendered
  - Product added to cart
  - Mission completed/abandoned
- [ ] Build analytics dashboard (future)
  - Ranking accuracy metrics
  - Conversion by maturity level
  - Top/bottom performing products

**Files to Create:**
- `src/lib/analytics/events.ts`
- `src/lib/analytics/logger.ts`
- Database migration for analytics table

**Success Criteria:**
- All ranking events logged
- User actions tracked
- Data available for analysis

---

## 🔄 Implementation Order

### Week 1: Core AI Integration
1. AI-driven product ranking endpoint
2. Mission detection classifier
3. Update AI prompts with ranking logic

**Deliverable:** AI responds with carousels for precision missions

---

### Week 2: Real-Time Learning
1. Real-time preference updates
2. Category-based filtering
3. Mission lifecycle tracking

**Deliverable:** System learns from cart additions in real-time

---

### Week 3: Production Ready
1. Actual product catalog integration
2. Analytics tracking
3. Performance optimization
4. Testing & QA

**Deliverable:** Fully integrated system ready for production

---

## 🎯 Success Metrics

### Technical Metrics:
- [ ] API response time <200ms for ranking
- [ ] Carousel renders <50ms after AI response
- [ ] 95%+ uptime for ranking endpoint

### User Experience Metrics:
- [ ] Top pick selected 60%+ of time
- [ ] Mission detection accuracy >90%
- [ ] Preference updates reflected within 1 query

### Business Metrics:
- [ ] Conversion rate from carousel >40%
- [ ] Cart size increases with personalization
- [ ] User maturity scores increase over time

---

## 📂 New Files to Create

```
src/
├── app/
│   └── api/
│       └── products/
│           ├── route.ts              # Product search/list
│           └── rank/
│               └── route.ts          # Ranking endpoint
├── lib/
│   ├── missions/
│   │   ├── classifier.ts            # Mission type detection
│   │   └── tracker.ts               # Mission lifecycle
│   ├── products/
│   │   ├── loader.ts                # Product catalog loader
│   │   ├── search.ts                # Product search
│   │   └── categories.ts            # Category detection
│   ├── analytics/
│   │   ├── events.ts                # Event definitions
│   │   └── logger.ts                # Event logging
│   └── personalization/
│       └── preferences.ts           # Real-time updates
```

---

## 🚨 Risks & Mitigation

### Risk: Poor ranking performance
- **Impact:** Slow AI responses
- **Mitigation:** Aggressive caching, pre-compute rankings for popular categories

### Risk: Mission detection accuracy
- **Impact:** Wrong response format (carousel vs list)
- **Mitigation:** Extensive testing, user feedback loop, fallback to safe defaults

### Risk: Preference update conflicts
- **Impact:** Race conditions, inconsistent state
- **Mitigation:** Optimistic locking, eventual consistency, transaction isolation

---

## 🎉 Phase 2 End State

At the end of Phase 2, the system will:

✅ **AI-Driven:** All product recommendations come from ranking algorithm
✅ **Mission-Aware:** Responds appropriately to precision/essentials/recipe/research
✅ **Real-Time Learning:** Preferences update immediately from cart actions
✅ **Production-Ready:** Integrated with actual product catalog
✅ **Observable:** Full analytics tracking for optimization

**Next:** Phase 3 will focus on advanced features (progressive profiling, replenishment cycles, collaborative filtering)

---

**Ready to begin?** Start with creating the `/api/products/rank` endpoint and updating the AI prompt.
