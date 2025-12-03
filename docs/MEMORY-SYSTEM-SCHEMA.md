# Customer Memory System - Database Schema Design

**Version:** 1.0
**Date:** December 3, 2024
**Status:** Design Phase

---

## Overview

The Customer Memory System enables the AI to provide personalized, context-aware shopping assistance by learning from user behavior over time. This document defines the database schema and data collection strategy.

---

## Design Principles

1. **Passive Learning** - Collect data from natural interactions (no forms)
2. **Privacy-First** - User can view and delete all memories
3. **Contextual Relevance** - Only inject relevant memories into prompts
4. **Incremental Accuracy** - Memory improves over time
5. **Explainability** - User can see why AI made suggestions

---

## Database Tables

### 1. `customer_preferences` Table

Stores explicit and inferred preferences about products, brands, and dietary needs.

```sql
CREATE TABLE customer_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Preference details
  preference_type VARCHAR(50) NOT NULL, -- 'dietary', 'brand', 'favorite', 'dislike', 'allergy'
  preference_key VARCHAR(255) NOT NULL, -- 'vegetarian', 'great-value', 'milk-whole-gal'
  preference_value TEXT, -- Optional additional context
  confidence DECIMAL(3,2) DEFAULT 0.50, -- 0.00 to 1.00

  -- Context
  reason TEXT, -- Why this was inferred
  source VARCHAR(50), -- 'explicit', 'inferred', 'pattern'

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_confirmed_at TIMESTAMP WITH TIME ZONE,
  times_confirmed INTEGER DEFAULT 0,

  UNIQUE(user_id, preference_type, preference_key)
);

CREATE INDEX idx_customer_preferences_user ON customer_preferences(user_id);
CREATE INDEX idx_customer_preferences_type ON customer_preferences(user_id, preference_type);
```

**Example Rows:**

| user_id | preference_type | preference_key | confidence | reason | source |
|---------|-----------------|----------------|------------|--------|--------|
| user123 | dietary | vegetarian | 0.95 | Never orders meat products | inferred |
| user123 | brand | great-value | 0.75 | Chooses GV 80% of time | pattern |
| user123 | favorite | milk-whole-gal | 0.90 | Purchased 15 times | pattern |
| user123 | dislike | avocado | 1.00 | User said "I hate avocados" | explicit |
| user123 | allergy | peanuts | 1.00 | User said "allergic to peanuts" | explicit |

---

### 2. `shopping_patterns` Table

Tracks behavioral patterns for timing, frequency, and basket composition.

```sql
CREATE TABLE shopping_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Pattern details
  pattern_type VARCHAR(50) NOT NULL, -- 'time_of_day', 'day_of_week', 'frequency', 'basket_size', 'category_preference'
  pattern_key VARCHAR(255), -- '18:00-21:00', 'saturday', 'weekly', 'large', 'dairy'
  pattern_value JSONB, -- Flexible storage for complex patterns
  confidence DECIMAL(3,2) DEFAULT 0.50,

  -- Statistics
  occurrence_count INTEGER DEFAULT 1,
  last_occurrence TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, pattern_type, pattern_key)
);

CREATE INDEX idx_shopping_patterns_user ON shopping_patterns(user_id);
CREATE INDEX idx_shopping_patterns_type ON shopping_patterns(user_id, pattern_type);
```

**Example Rows:**

| user_id | pattern_type | pattern_key | pattern_value | confidence | occurrence_count |
|---------|--------------|-------------|---------------|------------|------------------|
| user123 | time_of_day | evening | {"range": "18:00-21:00", "orders": 24} | 0.85 | 24 |
| user123 | day_of_week | saturday | {"orders": 18, "total_orders": 30} | 0.60 | 18 |
| user123 | frequency | weekly | {"avg_days": 7.2, "orders": 30} | 0.75 | 30 |
| user123 | basket_size | medium | {"avg_items": 15, "avg_total": 85.50} | 0.70 | 30 |
| user123 | category_preference | dairy | {"percentage": 0.35, "orders": 28} | 0.80 | 28 |

---

### 3. `interaction_history` Table

Logs specific interactions to understand user intent and improve responses.

```sql
CREATE TABLE interaction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Interaction details
  interaction_type VARCHAR(50) NOT NULL, -- 'question', 'search', 'view_item', 'swap', 'reject_swap', 'voice_used'
  interaction_key VARCHAR(255), -- 'recipe_request', 'sku:milk-whole-gal', 'swap_accepted'
  interaction_value JSONB, -- Full context

  -- Context
  session_id UUID, -- Group interactions in same session
  message_id VARCHAR(255), -- Link to message if applicable

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_interaction_history_user ON interaction_history(user_id, created_at DESC);
CREATE INDEX idx_interaction_history_type ON interaction_history(user_id, interaction_type);
CREATE INDEX idx_interaction_history_session ON interaction_history(session_id);
```

**Example Rows:**

| user_id | interaction_type | interaction_key | interaction_value |
|---------|------------------|------------------|-------------------|
| user123 | question | recipe_request | {"query": "recipes with chicken", "timestamp": "..."} |
| user123 | view_item | milk-whole-gal | {"sku": "milk-whole-gal", "context": "browsing dairy"} |
| user123 | swap | accepted | {"original": "tide", "replacement": "great-value-detergent"} |
| user123 | swap | rejected | {"original": "heinz-ketchup", "replacement": "gv-ketchup", "reason": null} |
| user123 | voice_used | stt_input | {"duration_seconds": 8, "success": true} |

---

### 4. `memory_insights` Table

High-level insights derived from analyzing multiple data points.

```sql
CREATE TABLE memory_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Insight details
  insight_type VARCHAR(50) NOT NULL, -- 'persona', 'goal', 'context', 'constraint'
  insight_key VARCHAR(255) NOT NULL,
  insight_value TEXT NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 0.50,

  -- Evidence
  supporting_data JSONB, -- References to source data

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiry for time-sensitive insights

  UNIQUE(user_id, insight_type, insight_key)
);

CREATE INDEX idx_memory_insights_user ON memory_insights(user_id);
CREATE INDEX idx_memory_insights_type ON memory_insights(user_id, insight_type);
CREATE INDEX idx_memory_insights_expires ON memory_insights(expires_at) WHERE expires_at IS NOT NULL;
```

**Example Rows:**

| user_id | insight_type | insight_key | insight_value | confidence | supporting_data |
|---------|--------------|-------------|---------------|------------|-----------------|
| user123 | persona | budget_conscious | Consistently chooses store brands | 0.85 | {"swaps_accepted": 12, "gv_percentage": 0.75} |
| user123 | persona | health_focused | Prioritizes organic, low-sugar items | 0.70 | {"organic_count": 24, "rejection_of_sugary": 8} |
| user123 | goal | meal_prep | Large orders on Sundays with recipe ingredients | 0.80 | {"sunday_orders": 8, "avg_items": 35} |
| user123 | context | family_of_four | Basket size and quantities suggest family | 0.65 | {"bulk_deals": 18, "avg_dairy_qty": 3} |
| user123 | constraint | lactose_intolerant | Never orders dairy with lactose | 0.90 | {"lactose_free_percentage": 1.0, "orders": 30} |

---

## Row-Level Security (RLS) Policies

All tables require RLS to ensure users can only access their own data.

```sql
-- Enable RLS
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_insights ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own memories
CREATE POLICY "Users can view own preferences"
  ON customer_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON customer_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON customer_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON customer_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Repeat for other tables...
```

---

## Data Collection Hooks

### Passive Learning Triggers

**1. On Add to Cart:**
```typescript
// Track item views and preferences
await recordInteraction({
  type: 'view_item',
  key: item.sku,
  value: { name: item.name, category: item.category, price: item.price }
})

// If repeatedly added, mark as favorite
if (addCount > 5) {
  await upsertPreference({
    type: 'favorite',
    key: item.sku,
    confidence: Math.min(0.95, 0.5 + (addCount * 0.05))
  })
}
```

**2. On Checkout:**
```typescript
// Update shopping patterns
await updatePattern({
  type: 'time_of_day',
  key: getCurrentPeriod(), // 'morning', 'afternoon', 'evening'
  value: { timestamp: now, order_id: orderId }
})

await updatePattern({
  type: 'basket_size',
  key: getBasketSizeCategory(itemCount), // 'small', 'medium', 'large'
  value: { item_count: itemCount, total: orderTotal }
})

// Track category preferences
cart.forEach(item => {
  await updatePattern({
    type: 'category_preference',
    key: item.category,
    value: { quantity: item.quantity, price: item.price }
  })
})
```

**3. On Savings Swap:**
```typescript
// Learn brand preferences
if (swap_accepted) {
  await upsertPreference({
    type: 'brand',
    key: replacement.brand,
    confidence: confidence + 0.10,
    reason: 'Accepted savings swap'
  })
} else if (swap_rejected) {
  await upsertPreference({
    type: 'brand',
    key: original.brand,
    confidence: confidence + 0.15,
    reason: 'Rejected swap - brand loyalty'
  })
}
```

**4. On User Message:**
```typescript
// Detect explicit preferences
if (message.includes("I don't eat") || message.includes("I'm allergic")) {
  await upsertPreference({
    type: 'dietary',
    key: extractDietaryRestriction(message),
    confidence: 1.0,
    source: 'explicit',
    reason: `User said: "${message}"`
  })
}

// Track recipe requests
if (message.includes("recipe") || message.includes("meal")) {
  await recordInteraction({
    type: 'question',
    key: 'recipe_request',
    value: { query: message }
  })
}
```

---

## Memory Context Injection

### Prompt Engineering

When sending a message to Claude, inject relevant memories into the system prompt:

```typescript
async function buildSystemPrompt(userId: string, currentContext: string): Promise<string> {
  // Fetch relevant memories
  const preferences = await fetchPreferences(userId, minConfidence: 0.70)
  const patterns = await fetchPatterns(userId, recentOnly: true)
  const insights = await fetchInsights(userId, unexpired: true)

  // Build context
  let memoryContext = "\n\n## CUSTOMER MEMORY\n"

  if (preferences.dietary.length > 0) {
    memoryContext += "\nDietary Restrictions:\n"
    preferences.dietary.forEach(p => {
      memoryContext += `- ${p.key}: ${p.reason} (confidence: ${p.confidence})\n`
    })
  }

  if (preferences.favorites.length > 0) {
    memoryContext += "\nFavorite Items:\n"
    preferences.favorites.forEach(p => {
      memoryContext += `- ${p.key} (purchased ${p.times_confirmed} times)\n`
    })
  }

  if (insights.length > 0) {
    memoryContext += "\nCustomer Insights:\n"
    insights.forEach(i => {
      memoryContext += `- ${i.insight_type}: ${i.insight_value}\n`
    })
  }

  // Add to system prompt
  return BASE_SYSTEM_PROMPT + memoryContext
}
```

### Example Injected Context

```
## CUSTOMER MEMORY

Dietary Restrictions:
- vegetarian: Never orders meat products (confidence: 0.95)
- lactose_intolerant: Only orders lactose-free dairy (confidence: 0.90)

Favorite Items:
- milk-whole-gal (purchased 15 times)
- gv-organic-eggs (purchased 12 times)
- chobani-greek-yogurt (purchased 10 times)

Brand Preferences:
- great-value: Chooses GV 75% of the time (confidence: 0.75)
- chobani: Strong preference for Chobani yogurt (confidence: 0.85)

Customer Insights:
- persona: Budget-conscious but health-focused
- goal: Weekly meal prep on Sundays
- context: Family of four with young children
```

---

## Privacy & Transparency

### User Control

**View Memories:**
```typescript
// GET /api/user/memories
// Returns all stored memories for the user
```

**Delete Specific Memory:**
```typescript
// DELETE /api/user/memories/:id
// Removes a specific preference or insight
```

**Clear All Memories:**
```typescript
// DELETE /api/user/memories
// Wipes all memory data (CASCADE handles related rows)
```

**Export Memories:**
```typescript
// GET /api/user/memories/export
// Downloads JSON of all user memories
```

### Memory Explainability

Each AI suggestion should reference the memory that influenced it:

```
💭 I suggested organic milk because you usually prefer organic dairy products.
[View memory details]
```

---

## Performance Considerations

### Indexing Strategy
- Index on `user_id` for all tables (primary lookup)
- Index on `preference_type` and `pattern_type` for filtered queries
- Index on `created_at DESC` for recent interactions
- Partial index on `expires_at` for insight cleanup

### Query Optimization
- Limit memory injection to high-confidence items (> 0.70)
- Fetch only recent patterns (last 90 days)
- Cache frequently accessed memories in Redis
- Batch insert interactions (don't block user flow)

### Data Retention
- Keep `interaction_history` for 12 months, then archive
- Keep `preferences` and `patterns` indefinitely (or until user deletes)
- Auto-expire `memory_insights` with `expires_at` set
- Periodic cleanup job for stale data

---

## Implementation Phases

### Phase 1: Core Schema (This Week)
- [x] Design schema (this document)
- [ ] Create migration files
- [ ] Set up RLS policies
- [ ] Test with seed data

### Phase 2: Data Collection (Next Week)
- [ ] Implement passive learning hooks
- [ ] Add interaction logging
- [ ] Build confidence calculation logic
- [ ] Test data flows

### Phase 3: Memory Injection (Week 3)
- [ ] Build memory query functions
- [ ] Integrate into system prompt
- [ ] Test AI responses with memory
- [ ] Measure relevance improvement

### Phase 4: User Interface (Week 4)
- [ ] Memory settings page
- [ ] View/delete memories UI
- [ ] Memory explainability tooltips
- [ ] Export functionality

---

## Success Metrics

### Data Quality
- **Accuracy:** >90% of inferred preferences validated by user behavior
- **Coverage:** >80% of active users have at least 5 preferences
- **Confidence:** Average confidence > 0.75 for inferred preferences

### AI Improvement
- **Relevance:** +20% increase in first-response accuracy
- **Personalization:** 50%+ of suggestions reference user memory
- **Satisfaction:** User feedback indicates "AI understands me"

### Privacy Compliance
- **Transparency:** 100% of memories accessible to users
- **Control:** Users can delete any memory
- **Security:** Zero unauthorized access incidents

---

## Conclusion

The Customer Memory System transforms the AI from a stateless assistant into a personalized shopping companion. By passively learning from every interaction and transparently showing what it knows, the AI can provide increasingly relevant, context-aware assistance that feels natural and helpful.

**Next Step:** Implement Phase 1 (Core Schema) with Supabase migrations.

---

**Document Version:** 1.0
**Last Updated:** December 3, 2024
**Status:** Ready for Implementation
