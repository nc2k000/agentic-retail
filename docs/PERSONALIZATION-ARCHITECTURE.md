# Personalization & Memory Architecture

**Date:** December 4, 2024
**Status:** 🚧 In Development
**Owner:** AI Shopping Assistant Platform

---

## 🎯 Core Principles

### 1. Cumulative Memory
Memory is **never forgotten** but weighted by confidence, recency, and reinforcement. Every interaction adds evidence to the system.

### 2. Adaptive Personalization
Recommendations adapt based on user maturity—cold start users get relevant popular items, established users get highly personalized suggestions.

### 3. Deterministic Learning
The system builds a predictable, explainable model of each customer that evolves over time.

---

## 📊 System Architecture

### High-Level Flow

```
User Interaction
    ↓
[User Maturity Scoring] ← Orders, Preferences, Patterns
    ↓
[Recommendation Strategy Selection]
    ↓ (Cold Start)        ↓ (Onboarding)      ↓ (Established)
Popular Items       Hybrid Learning      Personalized
    ↓                      ↓                    ↓
[Adaptive Ranking Engine]
    ↓
[AI Prompt with Context]
    ↓
Personalized Response
    ↓
[Memory Update] → Preferences, Patterns, Cycles
```

---

## 🧠 Memory Components

### 1. Customer Preferences
**Table:** `customer_preferences`

```typescript
interface CustomerPreference {
  id: string
  user_id: string
  preference_type: 'dietary' | 'brand' | 'favorite' | 'dislike' | 'allergy' | 'communication_style'
  preference_key: string          // e.g., "organic", "vegan", "Organic Valley"
  preference_value?: string       // Optional additional data
  confidence: number              // 0.0 - 1.0
  reason?: string                 // Why we think this
  source: 'explicit' | 'inferred' | 'pattern'
  member_id?: string              // Household member attribution
  member_name?: string
  created_at: string
  updated_at: string
  last_confirmed_at?: string
  times_confirmed: number         // Reinforcement count
}
```

**Confidence Levels:**
- `1.0`: User explicitly confirmed ("I'm vegan")
- `0.7-0.9`: Strong pattern detected (5+ consistent purchases)
- `0.5-0.7`: Medium pattern (3-4 purchases)
- `0.3-0.5`: Weak inference (1-2 purchases)

**Sources:**
- `explicit`: User told us directly
- `pattern`: Detected from consistent behavior
- `inferred`: AI-generated hypothesis

---

### 2. Shopping Patterns
**Table:** `shopping_patterns`

```typescript
interface ShoppingPattern {
  id: string
  user_id: string
  pattern_type: 'time_of_day' | 'day_of_week' | 'frequency' | 'basket_size' | 'category_preference'
  pattern_key?: string
  pattern_value?: Record<string, any>
  confidence: number
  occurrence_count: number
  last_occurrence: string
  member_id?: string
  member_name?: string
  created_at: string
  updated_at: string
}
```

**Example Patterns:**
```json
{
  "pattern_type": "frequency",
  "pattern_key": "milk",
  "pattern_value": { "days": 7, "variance": 1 },
  "confidence": 0.85,
  "occurrence_count": 12
}
```

---

### 3. Replenishment Cycles
Calculated from order history:

```typescript
interface ReplenishmentCycle {
  sku: string
  product_name: string
  avg_cycle_days: number
  last_purchased: Date
  days_since_last: number
  percentage_of_cycle: number     // 0.0-1.0+ (1.0 = due now)
  confidence: number
}
```

---

## 👤 User Maturity System

### Maturity Levels

```typescript
enum UserMaturityLevel {
  COLD_START = "cold_start",        // 0 purchases, no preferences
  ONBOARDING = "onboarding",        // 1-5 purchases, minimal data
  EMERGING = "emerging",            // 6-20 purchases, patterns forming
  ESTABLISHED = "established",      // 20-50 purchases, strong patterns
  POWER_USER = "power_user"         // 50+ purchases, rich history
}
```

### Scoring Algorithm

```typescript
function calculateUserMaturity(user: User): {
  level: UserMaturityLevel
  score: number  // 0-100
} {
  const purchaseCount = user.orders.length
  const preferenceCount = user.preferences.length
  const avgConfidence = calculateAvgConfidence(user.preferences)
  const daysSinceFirstPurchase = getDaysSince(user.first_order_date)

  // Weighted scoring
  const purchaseScore = Math.min(purchaseCount * 2, 50)        // Max 50 points
  const preferenceScore = Math.min(preferenceCount * 3, 30)    // Max 30 points
  const confidenceScore = avgConfidence * 15                   // Max 15 points
  const tenureScore = Math.min(daysSinceFirstPurchase / 3, 5) // Max 5 points

  const totalScore = purchaseScore + preferenceScore + confidenceScore + tenureScore

  // Determine level
  if (totalScore < 10) return { level: COLD_START, score: totalScore }
  if (totalScore < 30) return { level: ONBOARDING, score: totalScore }
  if (totalScore < 60) return { level: EMERGING, score: totalScore }
  if (totalScore < 85) return { level: ESTABLISHED, score: totalScore }
  return { level: POWER_USER, score: totalScore }
}
```

---

## 🎯 Recommendation Strategy

### Strategy Matrix

| Maturity Level | Accuracy Weight | Relevancy Weight | Primary Data Source | Ask Frequency |
|---------------|-----------------|------------------|---------------------|---------------|
| Cold Start    | 20%             | 80%              | Popular items       | High          |
| Onboarding    | 50%             | 50%              | Weak patterns + Popular | Medium   |
| Emerging      | 70%             | 30%              | Patterns + Collaborative | Low    |
| Established   | 85%             | 15%              | Strong preferences  | Minimal       |
| Power User    | 95%             | 5%               | Rich history + Predictive | Minimal |

### Ranking Formula

```typescript
function calculateProductScore(
  product: Product,
  user: User,
  strategy: RecommendationStrategy
): number {
  // Base scores
  const personalScore = calculatePersonalizedScore(product, user)
  const popularityScore = product.popularity_rank
  const collaborativeScore = getCollaborativeScore(product, user)

  // Weighted combination based on maturity
  const score =
    (personalScore × strategy.accuracy_weight) +
    (popularityScore × strategy.relevancy_weight) +
    (collaborativeScore × 0.1)

  return score
}

function calculatePersonalizedScore(product: Product, user: User): number {
  let score = 1.0

  // Preference multipliers
  for (const pref of user.preferences) {
    if (productMatchesPreference(product, pref)) {
      score *= (1 + pref.confidence * 0.5)  // Up to 1.5x boost
    }
  }

  // Brand match
  const brandPref = user.preferences.find(p =>
    p.preference_type === 'brand' && p.preference_key === product.brand
  )
  if (brandPref) {
    score *= (1 + brandPref.confidence * 0.3)  // Up to 1.3x boost
  }

  // Replenishment boost (item is due)
  const cycle = getReplenishmentCycle(product.sku, user)
  if (cycle && cycle.percentage_of_cycle >= 0.9) {
    score *= 1.4  // 40% boost for items due now
  }

  // Past purchase boost
  const purchaseCount = user.orders.filter(o =>
    o.items.some(i => i.sku === product.sku)
  ).length
  if (purchaseCount > 0) {
    score *= (1 + Math.log(purchaseCount + 1) * 0.2)  // Logarithmic boost
  }

  // Allergy penalty (CRITICAL)
  for (const allergy of user.allergies) {
    if (productContains(product, allergy.preference_key)) {
      score = 0  // NEVER recommend allergens
    }
  }

  return score
}
```

---

## 🔄 Cumulative Learning

### How Memory Updates on Purchase

```typescript
async function onPurchaseComplete(order: Order, userId: string) {
  for (const item of order.items) {
    // 1. Update or create brand preference
    await updateBrandPreference(userId, item.brand, item.category)

    // 2. Detect dietary patterns
    if (isOrganic(item)) {
      await updateDietaryPreference(userId, 'organic')
    }

    // 3. Update replenishment cycle
    await updateReplenishmentCycle(userId, item.sku)

    // 4. Update shopping patterns
    await updateShoppingPatterns(userId, {
      time_of_day: order.created_at.getHours(),
      day_of_week: order.created_at.getDay(),
      basket_size: order.items.length,
      categories: order.items.map(i => i.category)
    })

    // 5. Increment favorite if frequently purchased
    const purchaseCount = await getPurchaseCount(userId, item.sku)
    if (purchaseCount >= 3) {
      await upsertPreference({
        userId,
        type: 'favorite',
        key: item.name,
        confidence: Math.min(0.5 + (purchaseCount * 0.1), 0.95),
        source: 'pattern'
      })
    }
  }
}
```

### Preference Confidence Evolution

```typescript
// Example: User buying organic products

Purchase 1: Organic bananas
  → CREATE: { type: 'dietary', key: 'organic', confidence: 0.3, source: 'inferred' }

Purchase 2: Organic milk
  → UPDATE: { confidence: 0.5, source: 'pattern', times_confirmed: 2 }

Purchase 3: Organic bread
  → UPDATE: { confidence: 0.7, source: 'pattern', times_confirmed: 3 }
  → TRIGGER: Memory confirmation toast

User confirms: "Yes, I prefer organic"
  → UPDATE: { confidence: 1.0, source: 'explicit', last_confirmed_at: NOW }

Purchase 4-10: Various organic items
  → UPDATE: { times_confirmed: 10 }  // Reinforcement

// 60 days pass, no organic purchases
  → DECAY: { confidence: 0.9 }  // Slight decay

User buys non-organic item
  → CONFLICT DETECTED
  → ASK: "I noticed you usually prefer organic. Is this a special case?"
```

---

## ⏱️ Preference Decay

Preferences decay if not reinforced to handle preference changes.

```typescript
function calculateDecayedConfidence(
  preference: CustomerPreference,
  daysSinceLastConfirmation: number
): number {
  const baseConfidence = preference.confidence

  // Decay rate based on preference type
  const decayRates = {
    allergy: 0.0,              // Never decay (safety)
    dietary: 0.005,            // Very slow decay
    favorite: 0.01,            // Slow decay
    brand: 0.015,              // Medium decay
    dislike: 0.02,             // Faster decay
    communication_style: 0.01  // Slow decay
  }

  const decayRate = decayRates[preference.preference_type]
  const decayAmount = decayRate * daysSinceLastConfirmation

  // Explicit preferences decay slower
  const sourceMultiplier = preference.source === 'explicit' ? 0.5 : 1.0

  const newConfidence = baseConfidence - (decayAmount * sourceMultiplier)

  // Floor at 0.3 for patterns (don't fully forget)
  return Math.max(newConfidence, preference.source === 'pattern' ? 0.3 : 0.1)
}
```

**Decay Schedule:**
- Run daily via cron job
- Update all preferences where `last_confirmed_at > 30 days ago`
- Remove preferences with confidence < 0.2

---

## 📥 Data Ingestion

### CSV Format for Past Purchases

```csv
order_id,order_date,item_sku,item_name,category,brand,price,quantity
ORD001,2024-06-01,milk-org-2p,Organic Valley 2% Milk,Dairy,Organic Valley,4.99,1
ORD001,2024-06-01,banana-org,Organic Bananas,Produce,,2.99,1
ORD002,2024-06-08,milk-org-2p,Organic Valley 2% Milk,Dairy,Organic Valley,4.99,1
ORD002,2024-06-08,eggs-org,Organic Eggs,Dairy,Happy Egg Co,5.99,1
```

### Auto-Generation Algorithm

```typescript
async function generatePreferencesFromHistory(orders: Order[], userId: string) {
  const preferences: Map<string, PreferenceData> = new Map()

  // 1. Analyze brand patterns
  const brandCounts = countByBrand(orders)
  for (const [brand, count] of brandCounts) {
    if (count >= 3) {
      preferences.set(`brand:${brand}`, {
        type: 'brand',
        key: brand,
        confidence: Math.min(0.5 + (count * 0.05), 0.9),
        times_confirmed: count,
        source: 'pattern'
      })
    }
  }

  // 2. Detect dietary patterns
  const organicCount = countOrganicItems(orders)
  const totalItems = countTotalItems(orders)
  const organicRatio = organicCount / totalItems

  if (organicRatio > 0.6) {
    preferences.set('dietary:organic', {
      type: 'dietary',
      key: 'organic',
      confidence: Math.min(organicRatio, 0.9),
      times_confirmed: organicCount,
      source: 'pattern',
      reason: `${organicCount} of ${totalItems} items were organic`
    })
  }

  // 3. Detect favorites (frequently purchased items)
  const itemFrequency = countItemFrequency(orders)
  for (const [itemName, count] of itemFrequency) {
    if (count >= 3) {
      preferences.set(`favorite:${itemName}`, {
        type: 'favorite',
        key: itemName,
        confidence: Math.min(0.5 + (count * 0.08), 0.9),
        times_confirmed: count,
        source: 'pattern'
      })
    }
  }

  // 4. Calculate replenishment cycles
  const cycles = calculateReplenishmentCycles(orders)

  // 5. Bulk upsert to database
  await bulkUpsertPreferences(userId, Array.from(preferences.values()))
  await bulkUpsertReplenishmentCycles(userId, cycles)
}
```

---

## 🎨 Progressive Profiling

### Question Triggers

```typescript
interface ProfilingQuestion {
  id: string
  trigger: 'onboarding' | 'category_entry' | 'inference_validation'
  timing: 'immediate' | 'after_2_items' | 'after_checkout'
  question: string
  options: string[]
  preference_type: PreferenceType
}

const PROFILING_QUESTIONS: ProfilingQuestion[] = [
  {
    id: 'budget_preference',
    trigger: 'onboarding',
    timing: 'immediate',
    question: 'What's your shopping style?',
    options: ['Value-focused', 'Balanced', 'Premium brands'],
    preference_type: 'brand'
  },
  {
    id: 'dietary_check',
    trigger: 'category_entry',
    timing: 'immediate',
    question: 'Any dietary preferences?',
    options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Organic'],
    preference_type: 'dietary'
  },
  {
    id: 'organic_validation',
    trigger: 'inference_validation',
    timing: 'after_2_items',
    question: 'I noticed you bought organic items. Should I prioritize organic?',
    options: ['Yes, always', 'Sometimes', 'No'],
    preference_type: 'dietary'
  }
]
```

---

## 📈 Success Metrics

### Key Performance Indicators

1. **Recommendation Accuracy**
   - Click-through rate on first suggestion
   - Add-to-cart rate for recommended items
   - Target: >40% for established users, >20% for cold start

2. **Personalization Effectiveness**
   - Average preference confidence by user maturity
   - Time to reach "established" status
   - Target: <10 orders to reach 0.7+ avg confidence

3. **Learning Velocity**
   - Preference detection rate (% of purchases that update preferences)
   - Memory confirmation acceptance rate
   - Target: >70% acceptance rate

4. **User Satisfaction**
   - "Recommendations feel personal" rating
   - Repeat usage rate
   - Target: >4/5 stars, >60% weekly return rate

---

## 🛠️ Implementation Checklist

### Phase 1: Foundation (Week 1)
- [ ] User maturity scoring function
- [ ] Recommendation strategy selector
- [ ] CSV ingestion endpoint
- [ ] Auto-preference generation from history
- [ ] Replenishment cycle calculation

### Phase 2: Intelligence (Week 2)
- [ ] Adaptive ranking engine
- [ ] Personalized score calculation
- [ ] Collaborative filtering
- [ ] Preference decay system
- [ ] Conflict detection

### Phase 3: Learning (Week 3)
- [ ] Progressive profiling questions
- [ ] Purchase-based learning
- [ ] Memory confirmation flow (✅ DONE)
- [ ] Household member attribution
- [ ] Memory map visualization

---

## 🔗 Related Documentation

- [Memory System Schema](./MEMORY-SYSTEM-SCHEMA.md)
- [Mission System](./PHASE-1-COMPLETE-DEC-4.md)
- [API Documentation](./API-SPEC.md)

---

**Last Updated:** December 4, 2024
**Next Review:** December 11, 2024
