import { Order, CartItem, Product } from '@/types'

export interface ReplenishmentSuggestion {
  item: Product
  lastPurchased: Date
  daysSinceLast: number
  avgCycleDays: number
  percentageOfCycle: number
  message: string
}

/**
 * Calculate the average number of days between purchases for a specific SKU
 */
function getAveragePurchaseCycle(sku: string, orders: Order[]): number | null {
  // Find all orders containing this SKU
  const purchases = orders
    .filter(order => order.items.some(item => item.sku === sku))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  if (purchases.length < 2) {
    return null // Need at least 2 purchases to calculate cycle
  }

  // Calculate intervals between consecutive purchases
  const intervals: number[] = []
  for (let i = 1; i < purchases.length; i++) {
    const prevDate = new Date(purchases[i - 1].createdAt)
    const currDate = new Date(purchases[i].createdAt)
    const daysBetween = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
    intervals.push(daysBetween)
  }

  // Return average interval
  return intervals.reduce((sum, days) => sum + days, 0) / intervals.length
}

/**
 * Get items that are due or almost due for replenishment
 * @param orders - User's order history
 * @param catalog - Full product catalog
 * @param threshold - Percentage of cycle to trigger reminder (default 0.9 = 90%)
 */
export function getReplenishmentSuggestions(
  orders: Order[],
  catalog: Product[],
  threshold: number = 0.9
): ReplenishmentSuggestion[] {
  if (orders.length === 0) {
    return []
  }

  const suggestions: ReplenishmentSuggestion[] = []
  const today = new Date()

  // Get all unique SKUs from order history
  const uniqueSkus = new Set<string>()
  orders.forEach(order => {
    order.items.forEach(item => uniqueSkus.add(item.sku))
  })

  // Check each SKU for replenishment
  uniqueSkus.forEach(sku => {
    const avgCycle = getAveragePurchaseCycle(sku, orders)
    if (!avgCycle) return // Skip if we can't calculate cycle

    // Find most recent purchase of this item
    const lastOrder = orders
      .filter(order => order.items.some(item => item.sku === sku))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    if (!lastOrder) return

    const lastPurchased = new Date(lastOrder.createdAt)
    const daysSince = Math.floor((today.getTime() - lastPurchased.getTime()) / (1000 * 60 * 60 * 24))
    const percentageOfCycle = daysSince / avgCycle

    // Only suggest if we're at or past the threshold
    if (percentageOfCycle >= threshold) {
      const product = catalog.find(p => p.sku === sku)
      if (!product) return

      let message = ''
      if (percentageOfCycle >= 1.0) {
        const daysOverdue = Math.floor(daysSince - avgCycle)
        message = `You usually buy this every ${Math.round(avgCycle)} days. It's been ${daysSince} days!`
      } else {
        message = `You usually buy this every ${Math.round(avgCycle)} days. Time to restock?`
      }

      suggestions.push({
        item: product,
        lastPurchased,
        daysSinceLast: daysSince,
        avgCycleDays: Math.round(avgCycle),
        percentageOfCycle,
        message
      })
    }
  })

  // Sort by percentage of cycle (most overdue first)
  return suggestions.sort((a, b) => b.percentageOfCycle - a.percentageOfCycle)
}

/**
 * Get top N replenishment suggestions
 */
export function getTopReplenishmentSuggestions(
  orders: Order[],
  catalog: Product[],
  limit: number = 5
): ReplenishmentSuggestion[] {
  const allSuggestions = getReplenishmentSuggestions(orders, catalog)
  return allSuggestions.slice(0, limit)
}
