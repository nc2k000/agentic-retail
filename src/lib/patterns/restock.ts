/**
 * Restock Prediction System
 *
 * Predicts when users need to repurchase frequently bought items using:
 * 1. Actual purchase frequency (when available)
 * 2. Household size inference (from purchase volumes)
 * 3. Product quantity/size
 * 4. Standard consumption rates (intelligent defaults)
 */

export interface RestockItem {
  sku: string
  name: string
  category: string
  image: string
  price: number

  // Purchase history stats
  totalPurchases: number
  lastPurchased: string
  daysSinceLastPurchase: number

  // Frequency analysis
  averageDaysBetweenPurchases: number
  standardConsumptionDays: number // Default consumption rate
  predictedDaysUntilRestock: number // Blended prediction
  predictedNextPurchase: string

  // Lead time consideration
  leadTimeDays: number // Days to order + deliver
  suggestedOrderDate: string // When to order (accounting for lead time)
  daysUntilSuggestedOrder: number // Days until we suggest ordering

  // Restock status
  daysUntilRestock: number // Days until you'd typically run out
  restockUrgency: 'order_now' | 'order_soon' | 'order_this_week' | 'plan_ahead' | 'well_stocked'
  confidenceScore: number // 0-1, based on data quality
  predictionMethod: 'historical' | 'blended' | 'standard' // How we predicted
}

export interface HouseholdContext {
  estimatedSize: number // 1-6+ people
  confidence: number
  indicators: string[] // What we used to infer
}

/**
 * Lead time: Days from order to delivery + purchase decision time
 * This ensures we suggest ordering BEFORE you run out
 */
const LEAD_TIME_DAYS = 2 // 1 day to decide + 1 day delivery (adjust per region/service)

/**
 * Lead time by category (some items need more planning)
 */
const CATEGORY_LEAD_TIME: Record<string, number> = {
  'Fresh Produce': 1, // Faster delivery, less planning needed
  'Dairy & Eggs': 1,
  'Meat & Seafood': 2, // Need more planning for freshness
  'Baby Food & Formula': 2, // Don't run out of critical items
  'Pet Food': 3, // Bulk items, plan ahead
}

/**
 * Standard consumption rates (days) by product type
 * Based on typical household consumption for common sizes
 */
const STANDARD_CONSUMPTION_RATES: Record<string, number> = {
  // Dairy & Eggs
  'milk-gallon': 7, // 1 gallon milk
  'milk-half-gallon': 4,
  'eggs-dozen': 10, // 12 eggs
  'eggs-18': 14,
  'yogurt': 7,
  'butter': 14,
  'cheese': 14,

  // Bakery
  'bread': 5, // Standard loaf
  'bagels': 7,
  'tortillas': 10,

  // Beverages
  'coffee': 14, // 12oz bag
  'juice': 7,
  'soda-12pack': 10,

  // Produce (perishable)
  'bananas': 5,
  'apples': 10,
  'lettuce': 7,
  'tomatoes': 7,

  // Baby
  'diapers': 7, // Size dependent
  'formula': 7,
  'baby-food': 5,

  // Pet
  'dog-food': 14,
  'cat-food': 14,
}

/**
 * Infer household size from purchase patterns
 */
export function inferHouseholdSize(purchaseHistory: Array<{
  sku: string
  name: string
  quantity?: number
}>): HouseholdContext {
  const indicators: string[] = []
  let sizeEstimate = 2 // Default to 2-person household

  // Count milk purchases (good indicator)
  const milkPurchases = purchaseHistory.filter(p =>
    p.name.toLowerCase().includes('milk') && p.name.toLowerCase().includes('gallon')
  )
  if (milkPurchases.length >= 3) {
    const avgQuantity = milkPurchases.reduce((sum, p) => sum + (p.quantity || 1), 0) / milkPurchases.length
    if (avgQuantity >= 2) {
      sizeEstimate = 4
      indicators.push('Buying multiple gallons of milk')
    }
  }

  // Check for baby products
  const babyProducts = purchaseHistory.filter(p =>
    p.name.toLowerCase().includes('diaper') ||
    p.name.toLowerCase().includes('formula') ||
    p.name.toLowerCase().includes('baby')
  )
  if (babyProducts.length >= 3) {
    sizeEstimate = Math.max(sizeEstimate, 3)
    indicators.push('Has baby/toddler')
  }

  // Check for bulk purchases
  const bulkPurchases = purchaseHistory.filter(p => {
    const qty = p.quantity || 1
    return qty >= 3 || p.name.toLowerCase().includes('pack')
  })
  if (bulkPurchases.length > purchaseHistory.length * 0.3) {
    sizeEstimate = Math.max(sizeEstimate, 3)
    indicators.push('Frequent bulk purchases')
  }

  // Check for kid products
  const kidProducts = purchaseHistory.filter(p =>
    p.name.toLowerCase().includes('juice box') ||
    p.name.toLowerCase().includes('lunch') ||
    p.name.toLowerCase().includes('snack')
  )
  if (kidProducts.length >= 5) {
    sizeEstimate = Math.max(sizeEstimate, 4)
    indicators.push('Has school-age children')
  }

  const confidence = indicators.length >= 2 ? 0.8 : indicators.length === 1 ? 0.6 : 0.4

  return {
    estimatedSize: sizeEstimate,
    confidence,
    indicators: indicators.length > 0 ? indicators : ['Default 2-person household'],
  }
}

/**
 * Get standard consumption days for a product
 * Adjusted for household size
 */
function getStandardConsumptionDays(
  productName: string,
  category: string,
  householdSize: number
): number {
  const name = productName.toLowerCase()

  // Try specific product matches first
  for (const [key, baseDays] of Object.entries(STANDARD_CONSUMPTION_RATES)) {
    if (name.includes(key.replace('-', ' '))) {
      // Adjust for household size
      // Larger households consume faster, but not linearly (economies of scale)
      const sizeMultiplier = Math.pow(householdSize / 2, 0.7) // Sublinear scaling
      return Math.round(baseDays / sizeMultiplier)
    }
  }

  // Category-level defaults
  if (category === 'Dairy & Eggs') {
    return Math.round(10 / Math.pow(householdSize / 2, 0.7))
  } else if (category === 'Bakery & Bread') {
    return Math.round(7 / Math.pow(householdSize / 2, 0.7))
  } else if (category === 'Fresh Produce') {
    return Math.round(7 / Math.pow(householdSize / 2, 0.7))
  } else if (category === 'Beverages') {
    return Math.round(10 / Math.pow(householdSize / 2, 0.7))
  }

  // Generic replenishable default
  return 14
}

/**
 * Calculate restock predictions with intelligent defaults
 */
export function calculateRestockPredictions(
  purchaseHistory: Array<{
    sku: string
    name: string
    category: string
    image: string
    price: number
    quantity?: number
    purchasedAt: string
  }>,
  householdContext?: HouseholdContext
): RestockItem[] {
  // Infer household size if not provided
  const household = householdContext || inferHouseholdSize(purchaseHistory)

  console.log(`🏠 Household context: ${household.estimatedSize} people (${(household.confidence * 100).toFixed(0)}% confidence)`)
  console.log(`   Indicators: ${household.indicators.join(', ')}`)

  // Group purchases by SKU
  const purchasesBySku = new Map<string, Array<{ purchasedAt: string; quantity: number }>>()
  const productInfo = new Map<string, { name: string; category: string; image: string; price: number }>()

  for (const purchase of purchaseHistory) {
    if (!purchasesBySku.has(purchase.sku)) {
      purchasesBySku.set(purchase.sku, [])
      productInfo.set(purchase.sku, {
        name: purchase.name,
        category: purchase.category,
        image: purchase.image,
        price: purchase.price,
      })
    }
    purchasesBySku.get(purchase.sku)!.push({
      purchasedAt: purchase.purchasedAt,
      quantity: purchase.quantity || 1,
    })
  }

  const restockItems: RestockItem[] = []

  for (const [sku, purchases] of purchasesBySku.entries()) {
    const info = productInfo.get(sku)!

    // Skip non-replenishable categories
    const replenishableCategories = [
      'Dairy & Eggs',
      'Bakery & Bread',
      'Fresh Produce',
      'Beverages',
      'Meat & Seafood',
      'Baby Food & Formula',
      'Pet Food',
      'Coffee & Tea',
    ]
    if (!replenishableCategories.includes(info.category)) {
      continue
    }

    // Get standard consumption rate for this product
    const standardDays = getStandardConsumptionDays(info.name, info.category, household.estimatedSize)

    // Sort purchases by date
    const sortedPurchases = purchases
      .map(p => ({ ...p, date: new Date(p.purchasedAt) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    const lastPurchaseDate = sortedPurchases[sortedPurchases.length - 1].date
    const daysSinceLastPurchase = Math.floor(
      (Date.now() - lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    let averageDaysBetweenPurchases = standardDays
    let confidenceScore = 0.4 // Low confidence for standard-only
    let predictionMethod: RestockItem['predictionMethod'] = 'standard'

    // If we have multiple purchases, calculate actual frequency
    if (purchases.length >= 2) {
      const intervals: number[] = []
      for (let i = 1; i < sortedPurchases.length; i++) {
        const daysBetween = Math.floor(
          (sortedPurchases[i].date.getTime() - sortedPurchases[i - 1].date.getTime()) /
            (1000 * 60 * 60 * 24)
        )
        intervals.push(daysBetween)
      }

      const actualAverage = Math.round(
        intervals.reduce((sum, days) => sum + days, 0) / intervals.length
      )

      // Calculate consistency
      const mean = actualAverage
      const variance =
        intervals.reduce((sum, days) => sum + Math.pow(days - mean, 2), 0) / intervals.length
      const stdDev = Math.sqrt(variance)
      const coefficientOfVariation = stdDev / mean

      // Confidence based on consistency and sample size
      let dataConfidence = 0.7
      if (purchases.length >= 5 && coefficientOfVariation < 0.3) {
        dataConfidence = 0.95 // High confidence: lots of data, consistent
        predictionMethod = 'historical'
        averageDaysBetweenPurchases = actualAverage
      } else if (purchases.length >= 3 && coefficientOfVariation < 0.5) {
        dataConfidence = 0.75 // Medium-high confidence: some data, fairly consistent
        predictionMethod = 'blended'
        // Blend actual and standard (60/40)
        averageDaysBetweenPurchases = Math.round(actualAverage * 0.6 + standardDays * 0.4)
      } else if (purchases.length >= 2) {
        dataConfidence = 0.6 // Medium confidence: limited data or inconsistent
        predictionMethod = 'blended'
        // Blend actual and standard (40/60 - trust standard more)
        averageDaysBetweenPurchases = Math.round(actualAverage * 0.4 + standardDays * 0.6)
      }

      confidenceScore = dataConfidence
    }

    // Get lead time for this category
    const leadTimeDays = CATEGORY_LEAD_TIME[info.category] || LEAD_TIME_DAYS

    // Predict when you'll run out (consumption-based)
    const predictedRunOutDate = new Date(
      lastPurchaseDate.getTime() + averageDaysBetweenPurchases * 24 * 60 * 60 * 1000
    )

    const daysUntilRunOut = Math.floor(
      (predictedRunOutDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )

    // Suggest ordering BEFORE you run out (accounting for lead time)
    const suggestedOrderDate = new Date(
      predictedRunOutDate.getTime() - leadTimeDays * 24 * 60 * 60 * 1000
    )

    const daysUntilSuggestedOrder = Math.floor(
      (suggestedOrderDate.getTime() - Date.now()) / (1000 * 60 * 60 * 1000)
    )

    // Determine urgency based on when to ORDER (not when you run out)
    let restockUrgency: RestockItem['restockUrgency']
    if (daysUntilSuggestedOrder <= 0) {
      restockUrgency = 'order_now' // Should order now or already past suggested date
    } else if (daysUntilSuggestedOrder <= 1) {
      restockUrgency = 'order_soon' // Order within 1 day
    } else if (daysUntilSuggestedOrder <= 3) {
      restockUrgency = 'order_this_week' // Order within 3 days
    } else if (daysUntilSuggestedOrder <= 7) {
      restockUrgency = 'plan_ahead' // Order within a week
    } else {
      restockUrgency = 'well_stocked' // Don't need to think about it yet
    }

    restockItems.push({
      sku,
      name: info.name,
      category: info.category,
      image: info.image,
      price: info.price,
      totalPurchases: purchases.length,
      lastPurchased: lastPurchaseDate.toISOString(),
      daysSinceLastPurchase,
      averageDaysBetweenPurchases,
      standardConsumptionDays: standardDays,
      predictedDaysUntilRestock: averageDaysBetweenPurchases,
      predictedNextPurchase: predictedRunOutDate.toISOString(),
      leadTimeDays,
      suggestedOrderDate: suggestedOrderDate.toISOString(),
      daysUntilSuggestedOrder,
      daysUntilRestock: daysUntilRunOut,
      restockUrgency,
      confidenceScore,
      predictionMethod,
    })
  }

  // Sort by urgency
  const urgencyOrder = { order_now: 0, order_soon: 1, order_this_week: 2, plan_ahead: 3, well_stocked: 4 }
  restockItems.sort((a, b) => {
    const urgencyDiff = urgencyOrder[a.restockUrgency] - urgencyOrder[b.restockUrgency]
    if (urgencyDiff !== 0) return urgencyDiff
    return b.confidenceScore - a.confidenceScore
  })

  return restockItems
}

/**
 * Get items that need ordering soon (proactive suggestions)
 */
export function getRestockSuggestions(restockItems: RestockItem[]): RestockItem[] {
  return restockItems.filter(
    item =>
      item.restockUrgency === 'order_now' ||
      item.restockUrgency === 'order_soon' ||
      item.restockUrgency === 'order_this_week'
  )
}

/**
 * Format restock message for AI assistant (conversational, no math)
 */
export function formatRestockMessage(item: RestockItem): string {
  // Past due - push subscriptions
  if (item.daysUntilSuggestedOrder <= 0) {
    return `🔴 **${item.name}** ($${item.price.toFixed(2)})\nTime to restock! Consider setting up a subscription so you never run out.`
  }

  // Order today
  if (item.restockUrgency === 'order_now' || item.restockUrgency === 'order_soon') {
    return `🟡 **${item.name}** ($${item.price.toFixed(2)})\nRunning low - order today!`
  }

  // Order this week
  if (item.restockUrgency === 'order_this_week') {
    return `🟢 **${item.name}** ($${item.price.toFixed(2)})\nYou'll need this soon.`
  }

  // Well stocked - minimal message
  return `✅ **${item.name}** - You're all set!`
}
