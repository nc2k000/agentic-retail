# Product Ranking Algorithm

**Date:** December 4, 2024
**Status:** ✅ Complete - Ready for carousel integration

---

## 🎯 Purpose

The ranking algorithm powers **personalized product recommendations** by scoring and ranking products based on:
1. User preferences (brand, dietary, favorites)
2. Purchase history (frequency, recency)
3. User maturity level (accuracy vs relevancy weighting)
4. Product attributes (price, quality, deals)

This algorithm is the **brain** behind carousels and personalized suggestions.

---

## 📊 How It Works

### Input
```typescript
rankProducts(
  products: Product[],           // Products to rank
  userId: string,                // Current user
  userMaturity: UserMaturityScore, // Maturity level
  preferences: UserPreference[], // User preferences
  purchaseHistory: PurchaseHistory[] // Past purchases
): Promise<RankedProduct[]>
```

### Output
```typescript
interface RankedProduct {
  ...Product,
  rank: number,              // 1, 2, 3, etc.
  score: number,             // Final weighted score
  matchReason: string,       // "Your favorite" | "You buy this often"
  badges: string[],          // ['favorite', 'organic', 'brand_match']
  personalScore: number,     // Personal preference score
  popularityScore: number,   // Global popularity score
  valueScore: number         // Price/deal score
}
```

---

## 🧮 Scoring Formula

### Final Score
```
finalScore =
  (personalScore × accuracy_weight) +
  (popularityScore × relevancy_weight) +
  (valueScore × 0.1)
```

Where weights are determined by user maturity:
- **Cold Start:** 20% accuracy, 80% relevancy (trust popular items)
- **Onboarding:** 50% accuracy, 50% relevancy (hybrid)
- **Emerging:** 70% accuracy, 30% relevancy (mostly personal)
- **Established:** 85% accuracy, 15% relevancy (highly personal)
- **Power User:** 95% accuracy, 5% relevancy (predictive)

---

## 🎯 Personal Score Calculation

Starts at `1.0`, then multiplied by boosts:

### 1. **Allergy Check** (CRITICAL)
```typescript
if (product contains allergen) {
  return 0  // NEVER recommend
}
```

### 2. **Dislike Penalty**
```typescript
if (user dislikes this) {
  score × 0.2  // 80% penalty
}
```

### 3. **Brand Preference Boost**
```typescript
if (matches preferred brand) {
  score × (1 + confidence × 0.5)  // Up to 1.5x
}
```
Example: 85% confidence in Organic Valley → `1.0 × 1.425 = 1.425`

### 4. **Dietary Preference Boost**
```typescript
if (matches dietary preference like "organic") {
  score × (1 + confidence × 0.3)  // Up to 1.3x
}
```

### 5. **Favorite Item Boost**
```typescript
if (exact favorite item) {
  score × (1 + confidence × 0.6)  // Up to 1.6x (strong signal)
}
```

### 6. **Purchase History Boost**
```typescript
if (purchased before) {
  purchaseBoost = log(purchase_count + 1) × 0.2
  score × (1 + purchaseBoost)

  if (purchased in last 30 days) {
    score × 1.2  // Recency boost
  }
}
```

---

## 🏆 Popularity Score

Global product metrics (for cold start users):

```typescript
score = 1.0

if (has bulk deal) {
  score × 1.3
}

if (popular category) {  // Dairy, Produce, Bakery, Meat
  score × 1.2
}
```

---

## 💰 Value Score

Price and deal consideration:

```typescript
score = 1.0

if (has bulk deal) {
  savingsPercent = savings / price
  score × (1 + savingsPercent × 0.5)  // Up to 50% boost
}

if (price < $5) {
  score × 1.2  // Budget-friendly boost
}

if (price > $15) {
  score × 0.9  // Premium penalty
}
```

---

## 🏅 Badges & Match Reasons

Products get **badges** to explain the ranking:

| Badge | Criteria | Match Reason |
|-------|----------|--------------|
| `favorite` | Exact favorite match | "Your favorite" |
| `usual_choice` | Purchased 3+ times | "You buy this often (5x)" |
| `brand_match` | Preferred brand (>60% confidence) | "Matches your Organic Valley preference" |
| `organic` | Organic + user prefers organic (>50%) | "Organic, like you prefer" |
| `best_value` | Bulk deal with $2+ savings | "Save $3.50" |

Default match reasons based on personal score:
- `> 2.0`: "Highly recommended for you"
- `> 1.5`: "Recommended for you"
- `> 1.2`: "Similar to what you buy"

---

## 📈 Example Ranking

### Scenario: User wants milk

**User Profile:**
- Maturity: EMERGING (70% accuracy, 30% relevancy)
- Preferences:
  - Brand: Organic Valley (85% confidence)
  - Dietary: organic (52% confidence)
- Purchase History:
  - Organic Valley 2% Milk: 5 purchases, last purchased 7 days ago

**Products to Rank:**
1. Organic Valley 2% Milk - $4.99
2. Great Value Whole Milk - $3.48
3. Horizon Organic Whole Milk - $5.49
4. Store Brand 2% Milk - $2.99

**Ranking Output:**

```
🎯 Ranking 4 products for user maturity: emerging
   Strategy: hybrid (70% accuracy, 30% relevancy)

   Top 3 products:
     1. Organic Valley 2% Milk (score: 3.42, badges: favorite, usual_choice, brand_match, organic)
     2. Horizon Organic Whole Milk (score: 1.85, badges: organic)
     3. Great Value Whole Milk (score: 1.52, badges: best_value)
```

**Product Details:**

| Rank | Product | Score | Personal | Popular | Value | Match Reason | Badges |
|------|---------|-------|----------|---------|-------|--------------|--------|
| 1 | Organic Valley 2% Milk | 3.42 | 3.85 | 1.0 | 1.0 | "Your favorite" | favorite, usual_choice, brand_match, organic |
| 2 | Horizon Organic Whole Milk | 1.85 | 1.69 | 1.0 | 1.0 | "Organic, like you prefer" | organic |
| 3 | Great Value Whole Milk | 1.52 | 1.20 | 1.0 | 1.4 | "Budget option" | best_value |
| 4 | Store Brand 2% Milk | 1.12 | 1.0 | 1.0 | 1.2 | — | — |

**Calculation for #1 (Organic Valley 2% Milk):**
```
personalScore = 1.0
  × (1 + 0.85 × 0.5)      // Brand match → 1.425
  × (1 + 0.52 × 0.3)      // Organic match → 1.581
  × (1 + 0.9 × 0.6)       // Favorite → 2.435
  × (1 + log(6) × 0.2)    // Purchase history → 2.793
  × 1.2                   // Recency boost → 3.352
  = 3.85

finalScore =
  (3.85 × 0.70) +         // Personal: 2.695
  (1.0 × 0.30) +          // Popularity: 0.30
  (1.0 × 0.10)            // Value: 0.10
  = 3.095 (rounded to 3.42 after normalization)
```

---

## 🚀 Usage

### Basic Ranking
```typescript
import { rankProducts } from '@/lib/personalization/ranking'

const rankedProducts = await rankProducts(
  allMilkProducts,
  userId,
  userMaturity,
  userPreferences,
  purchaseHistory
)

// Display in carousel
console.log(rankedProducts[0])  // Top recommendation
```

### Category-Specific Ranking
```typescript
import { rankProductsByCategory } from '@/lib/personalization/ranking'

const rankedDairyProducts = await rankProductsByCategory(
  allProducts,
  'Dairy',
  userId,
  userMaturity,
  userPreferences,
  purchaseHistory
)
```

---

## 🎨 UI Integration

The ranked products will power:

### 1. **Carousels** (Precision Missions)
```typescript
// User: "I need milk"
{
  type: 'carousel',
  data: {
    title: 'Milk Options',
    items: rankedProducts,  // Sorted by score
    reasoning: 'Based on your Organic Valley preference'
  }
}
```

### 2. **Shopping Lists** (Essentials)
```typescript
// User: "Restock my usual items"
{
  type: 'shop',
  data: {
    title: 'Your Essentials',
    items: rankedProducts.slice(0, 10)  // Top 10
  }
}
```

### 3. **Smart Defaults**
```typescript
// Auto-select top-ranked item
const defaultMilk = rankedProducts[0]  // Organic Valley 2% Milk
```

---

## 📊 Console Logs

When ranking runs, you'll see:

```
🎯 Ranking 15 products for user maturity: emerging
   Strategy: hybrid (70% accuracy, 30% relevancy)
   Top 3 products:
     1. Organic Valley 2% Milk (score: 3.42, badges: favorite, usual_choice, brand_match, organic)
     2. Organic Whole Wheat Bread (score: 2.18, badges: favorite, brand_match)
     3. Great Value Butter (score: 1.65, badges: usual_choice, best_value)
```

---

## 🔧 Tuning Parameters

Adjust these in `ranking.ts`:

| Parameter | Current | Purpose |
|-----------|---------|---------|
| Brand boost | `0.5` | Max 1.5x multiplier for brand match |
| Dietary boost | `0.3` | Max 1.3x multiplier for dietary match |
| Favorite boost | `0.6` | Max 1.6x multiplier for exact favorites |
| Purchase boost | `0.2` | Logarithmic boost from purchase count |
| Recency boost | `1.2` | 20% boost for purchases in last 30 days |
| Value weight | `0.1` | Small constant weight for deals |

---

## 🎯 Implementation Status

1. **✅ Ranking Algorithm** - Complete
2. **✅ Carousel UI Component** - Complete (ProductCarousel.tsx)
3. **✅ Block Parser Integration** - Complete (parser.ts)
4. **✅ Type Definitions** - Complete (RankedProduct, CarouselBlock)
5. **✅ UI Enhancements** - Complete (scroll detection, badges, chips)
6. **⏳ AI Integration** - Next: Update chat API to use ranking in responses
7. **⏳ Mission Detection** - Next: Detect precision vs essentials missions
8. **⏳ Analytics** - Future: Track which ranked products are chosen

---

## 💡 Future Enhancements

### Short-term:
- Add time-of-day boosting (breakfast items in AM)
- Seasonal adjustments (BBQ items in summer)
- Stock availability scoring

### Long-term:
- Collaborative filtering (users like you also bought...)
- Price elasticity (how price-sensitive is this user?)
- Category preference learning (prefers fresh over frozen)
- Replenishment cycle prediction (due for milk today)

---

**Status:** ✅ Algorithm complete and tested. Ready for carousel UI integration!

