import { CartItem, BulkDeal } from '@/types'

export interface BulkDealOpportunity {
  item: CartItem
  bulkDeal: BulkDeal
  currentTotal: number
  bulkTotal: number
  additionalSavings: number
  quantityNeeded: number
  message: string
}

/**
 * Find bulk deal opportunities in the cart
 * Returns items where user has some quantity but not enough for the bulk deal
 */
export function findBulkDealOpportunities(cart: CartItem[]): BulkDealOpportunity[] {
  const opportunities: BulkDealOpportunity[] = []

  cart.forEach(item => {
    // Check if item has a bulk deal and user hasn't reached the threshold
    if (item.bulkDeal && item.quantity < item.bulkDeal.qty) {
      const currentTotal = item.price * item.quantity
      const bulkTotal = item.bulkDeal.price
      const quantityNeeded = item.bulkDeal.qty - item.quantity

      // Calculate actual savings vs buying individually
      const individualCostForBulkQty = item.price * item.bulkDeal.qty
      const additionalSavings = individualCostForBulkQty - bulkTotal

      // Only suggest if there's meaningful savings (at least $0.50)
      if (additionalSavings >= 0.50) {
        opportunities.push({
          item,
          bulkDeal: item.bulkDeal,
          currentTotal,
          bulkTotal,
          additionalSavings,
          quantityNeeded,
          message: quantityNeeded === 1
            ? `Buy 1 more and save $${additionalSavings.toFixed(2)}!`
            : `Buy ${quantityNeeded} more and save $${additionalSavings.toFixed(2)}!`
        })
      }
    }
  })

  // Sort by savings amount (highest first)
  return opportunities.sort((a, b) => b.additionalSavings - a.additionalSavings)
}

/**
 * Check if a specific cart item has a bulk deal opportunity
 */
export function getBulkDealForItem(item: CartItem): BulkDealOpportunity | null {
  if (!item.bulkDeal || item.quantity >= item.bulkDeal.qty) {
    return null
  }

  const currentTotal = item.price * item.quantity
  const bulkTotal = item.bulkDeal.price
  const quantityNeeded = item.bulkDeal.qty - item.quantity

  const individualCostForBulkQty = item.price * item.bulkDeal.qty
  const additionalSavings = individualCostForBulkQty - bulkTotal

  if (additionalSavings < 0.50) {
    return null
  }

  return {
    item,
    bulkDeal: item.bulkDeal,
    currentTotal,
    bulkTotal,
    additionalSavings,
    quantityNeeded,
    message: quantityNeeded === 1
      ? `Buy 1 more and save $${additionalSavings.toFixed(2)}!`
      : `Buy ${quantityNeeded} more and save $${additionalSavings.toFixed(2)}!`
  }
}
