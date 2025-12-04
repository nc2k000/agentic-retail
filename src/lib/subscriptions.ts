import { Order, Product, SubscriptionSuggestion } from '@/types'

/**
 * Long-lasting items eligible for subscriptions
 * Only items that are used regularly and don't spoil quickly
 */
const SUBSCRIPTION_ELIGIBLE_KEYWORDS = [
  // Dairy - long-lasting only
  'milk',
  'almond milk',
  'oat milk',
  'soy milk',
  'coconut milk',

  // Household & Cleaning - long-lasting items
  'laundry detergent',
  'dish soap',
  'dishwasher',
  'paper towel',
  'toilet paper',
  'trash bag',
  'cleaning spray',
  'all-purpose cleaner',
  'fabric softener',
  'bleach',

  // Pantry - very long-lasting staples
  'coffee',
  'tea',
  'olive oil',
  'vegetable oil',
  'rice',
  'pasta',
  'cereal',
  'oatmeal',
  'flour',
  'sugar',

  // Baby & Kids - essentials
  'diapers',
  'wipes',
  'formula',

  // Pet Care
  'dog food',
  'cat food',
  'pet food',
  'cat litter',
]

/**
 * Check if a product is eligible for subscription
 * Only long-lasting, regularly used items
 */
export function isProductEligibleForSubscription(product: Product): boolean {
  const productName = product.name.toLowerCase()

  // Check if product name contains any eligible keyword
  const isEligible = SUBSCRIPTION_ELIGIBLE_KEYWORDS.some(keyword =>
    productName.includes(keyword.toLowerCase())
  )

  if (!isEligible) {
    return false
  }

  // Exclude fresh/perishable items even if they match keywords
  const excludeKeywords = ['fresh', 'organic produce', 'bakery', 'deli', 'prepared', 'frozen']
  const hasExcludedKeyword = excludeKeywords.some(keyword =>
    productName.includes(keyword)
  )

  if (hasExcludedKeyword) {
    return false
  }

  return true
}

/**
 * Analyze order history and suggest products that are good subscription candidates
 */
export function getSubscriptionSuggestions(
  orders: Order[],
  allProducts: Product[],
  limit: number = 5
): SubscriptionSuggestion[] {
  if (orders.length === 0) return []

  // Count frequency of each product across orders
  const productFrequency = new Map<string, { count: number; product: Product; lastOrdered: string }>()

  orders.forEach(order => {
    order.items.forEach(item => {
      const existing = productFrequency.get(item.sku)
      if (existing) {
        existing.count++
        // Update last ordered if this order is more recent
        if (new Date(order.createdAt) > new Date(existing.lastOrdered)) {
          existing.lastOrdered = order.createdAt
        }
      } else {
        productFrequency.set(item.sku, {
          count: 1,
          product: item,
          lastOrdered: order.createdAt,
        })
      }
    })
  })

  // Filter for recurring items (ordered 2+ times) AND eligible for subscription
  const recurringProducts = Array.from(productFrequency.entries())
    .filter(([_, data]) => data.count >= 2 && isProductEligibleForSubscription(data.product))
    .map(([sku, data]) => {
      const { count, product, lastOrdered } = data

      // Calculate suggested frequency based on order pattern
      const daysSinceLastOrder = Math.floor(
        (Date.now() - new Date(lastOrdered).getTime()) / (1000 * 60 * 60 * 24)
      )
      const avgDaysBetweenOrders = daysSinceLastOrder / count

      let suggestedFrequency: 'weekly' | 'biweekly' | 'monthly' = 'monthly'
      if (avgDaysBetweenOrders <= 10) {
        suggestedFrequency = 'weekly'
      } else if (avgDaysBetweenOrders <= 20) {
        suggestedFrequency = 'biweekly'
      }

      // Calculate confidence based on order frequency
      let confidence: 'high' | 'medium' | 'low' = 'low'
      if (count >= 4) confidence = 'high'
      else if (count >= 3) confidence = 'medium'

      // Calculate potential monthly savings (10% discount)
      const monthlyOrders = suggestedFrequency === 'weekly' ? 4 : suggestedFrequency === 'biweekly' ? 2 : 1
      const potentialSavings = (product.price * 0.1) * monthlyOrders

      // Generate reason
      const reason = `You've ordered this ${count} times. Save 10% with ${suggestedFrequency} delivery.`

      return {
        product,
        reason,
        suggestedFrequency,
        potentialSavings,
        confidence,
        orderCount: count,
      }
    })

  // Sort by order count (most frequent first), then by price (higher value first)
  return recurringProducts
    .sort((a, b) => {
      if (b.orderCount !== a.orderCount) {
        return b.orderCount - a.orderCount
      }
      return b.product.price - a.product.price
    })
    .slice(0, limit)
}

/**
 * Get essential items that are commonly subscribed to
 * (use when no order history available)
 */
export function getEssentialSubscriptionSuggestions(allProducts: Product[], limit: number = 5): SubscriptionSuggestion[] {
  // Common essentials people subscribe to
  const essentialKeywords = ['milk', 'eggs', 'bread', 'coffee', 'diapers', 'wipes', 'paper towel', 'toilet paper', 'laundry', 'dish soap']

  const essentials = allProducts.filter(product => {
    // Must be eligible first
    if (!isProductEligibleForSubscription(product)) {
      return false
    }

    // Then check if it's an essential item
    const hasEssentialKeyword = essentialKeywords.some(keyword =>
      product.name.toLowerCase().includes(keyword)
    )
    return hasEssentialKeyword
  })

  return essentials.slice(0, limit).map(product => ({
    product,
    reason: 'Essential item - never run out and save 10%',
    suggestedFrequency: 'biweekly' as const,
    potentialSavings: product.price * 0.1 * 2, // bi-weekly = 2x per month
    confidence: 'medium' as const,
  }))
}

/**
 * Check if a product should be suggested for subscription based on cart contents
 */
export function shouldSuggestSubscription(product: Product, quantity: number): { suggest: boolean; reason?: string } {
  // First check eligibility
  if (!isProductEligibleForSubscription(product)) {
    return { suggest: false }
  }

  // High quantity suggests regular use
  if (quantity >= 3) {
    return {
      suggest: true,
      reason: `You're buying ${quantity} - subscribe and save 10% on regular deliveries`,
    }
  }

  // Otherwise, suggest for eligible categories
  return {
    suggest: true,
    reason: `Save 10% by subscribing to ${product.name}`,
  }
}

/**
 * Get complementary products to upsell when subscribing to an item
 * Returns products that pair well with the subscribed item
 */
export function getSubscriptionUpsells(
  subscribedProduct: Product,
  allProducts: Product[],
  limit: number = 3
): Product[] {
  const upsells: Product[] = []

  // Category-based complementary products
  const complementaryMap: Record<string, string[]> = {
    'Dairy & Eggs': ['Beverages', 'Pantry & Dry Goods'],
    'Beverages': ['Pantry & Dry Goods', 'Snacks'],
    'Baby & Kids': ['Baby & Kids', 'Household & Cleaning'],
    'Pet Care': ['Pet Care'],
    'Household & Cleaning': ['Household & Cleaning', 'Paper & Plastic'],
    'Pantry & Dry Goods': ['Dairy & Eggs', 'Beverages'],
  }

  // Get complementary categories
  const complementaryCategories = complementaryMap[subscribedProduct.category] || []

  // Find products in complementary categories that are also subscription-eligible
  const complementaryProducts = allProducts.filter(product => {
    // Skip the subscribed product itself
    if (product.sku === subscribedProduct.sku) return false

    // Must be in a complementary category
    if (!complementaryCategories.includes(product.category)) return false

    // Must be subscription eligible
    if (!isProductEligibleForSubscription(product)) return false

    return true
  })

  // Sort by price (show similar or slightly cheaper items)
  const sorted = complementaryProducts.sort((a, b) => {
    const aDiff = Math.abs(a.price - subscribedProduct.price)
    const bDiff = Math.abs(b.price - subscribedProduct.price)
    return aDiff - bDiff
  })

  return sorted.slice(0, limit)
}

/**
 * Simulate auto-cart for upcoming delivery date
 * Returns items that would be automatically added to cart on the given date
 */
export function simulateAutoCart(
  subscriptions: import('@/types').Subscription[],
  simulationDate: Date = new Date()
): Array<{
  subscription: import('@/types').Subscription
  deliveryDate: string
  totalBeforeDiscount: number
  discount: number
  totalAfterDiscount: number
}> {
  const simulationDateStr = simulationDate.toISOString().split('T')[0]

  return subscriptions
    .filter(sub => {
      if (sub.status !== 'active') return false

      // Check if delivery is due on or before simulation date
      const nextDeliveryDate = sub.nextDelivery.split('T')[0]
      return nextDeliveryDate <= simulationDateStr
    })
    .map(sub => {
      const totalBeforeDiscount = sub.product.price * sub.quantity
      const discount = totalBeforeDiscount * (sub.discount / 100)
      const totalAfterDiscount = totalBeforeDiscount - discount

      return {
        subscription: sub,
        deliveryDate: sub.nextDelivery,
        totalBeforeDiscount,
        discount,
        totalAfterDiscount,
      }
    })
    .sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))
}
