import { findBulkDealOpportunities, getBulkDealForItem } from '../bulkDeals'
import { CartItem } from '@/types'

describe('Bulk Deals', () => {
  const mockItemWithBulkDeal: CartItem = {
    sku: '123',
    name: 'Test Product',
    price: 10.00,
    quantity: 2,
    bulkDeal: {
      qty: 5,
      price: 40.00 // $10/unit individually vs $8/unit in bulk = $10 savings
    }
  }

  const mockItemNoBulkDeal: CartItem = {
    sku: '456',
    name: 'Regular Product',
    price: 5.00,
    quantity: 3
  }

  const mockItemBulkThresholdMet: CartItem = {
    sku: '789',
    name: 'Already Bulk',
    price: 10.00,
    quantity: 5,
    bulkDeal: {
      qty: 5,
      price: 40.00
    }
  }

  const mockItemLowSavings: CartItem = {
    sku: '999',
    name: 'Low Savings Item',
    price: 1.00,
    quantity: 1,
    bulkDeal: {
      qty: 3,
      price: 2.50 // Only $0.50 savings (3×$1 - $2.50)
    }
  }

  describe('findBulkDealOpportunities', () => {
    it('should find bulk deal opportunities for eligible items', () => {
      const cart = [mockItemWithBulkDeal, mockItemNoBulkDeal]
      const opportunities = findBulkDealOpportunities(cart)

      expect(opportunities).toHaveLength(1)
      expect(opportunities[0].item.sku).toBe('123')
      expect(opportunities[0].quantityNeeded).toBe(3)
      expect(opportunities[0].additionalSavings).toBe(10.00)
    })

    it('should not include items without bulk deals', () => {
      const cart = [mockItemNoBulkDeal]
      const opportunities = findBulkDealOpportunities(cart)

      expect(opportunities).toHaveLength(0)
    })

    it('should not include items that already meet bulk threshold', () => {
      const cart = [mockItemBulkThresholdMet]
      const opportunities = findBulkDealOpportunities(cart)

      expect(opportunities).toHaveLength(0)
    })

    it('should include items where savings meet minimum threshold ($0.50)', () => {
      const cart = [mockItemLowSavings]
      const opportunities = findBulkDealOpportunities(cart)

      expect(opportunities).toHaveLength(1)
      expect(opportunities[0].additionalSavings).toBe(0.50)
    })

    it('should exclude items with savings below minimum threshold', () => {
      const lowSavingsItem: CartItem = {
        sku: '888',
        name: 'Very Low Savings',
        price: 1.00,
        quantity: 2,
        bulkDeal: {
          qty: 3,
          price: 2.60 // Only $0.40 savings (below threshold)
        }
      }
      const cart = [lowSavingsItem]
      const opportunities = findBulkDealOpportunities(cart)

      expect(opportunities).toHaveLength(0)
    })

    it('should sort opportunities by savings amount (highest first)', () => {
      const highSavingsItem: CartItem = {
        sku: '111',
        name: 'High Savings',
        price: 20.00,
        quantity: 1,
        bulkDeal: {
          qty: 3,
          price: 45.00 // $15 savings
        }
      }
      const cart = [mockItemWithBulkDeal, highSavingsItem, mockItemLowSavings]
      const opportunities = findBulkDealOpportunities(cart)

      expect(opportunities).toHaveLength(3)
      expect(opportunities[0].item.sku).toBe('111') // $15 savings
      expect(opportunities[1].item.sku).toBe('123') // $10 savings
      expect(opportunities[2].item.sku).toBe('999') // $0.50 savings
    })

    it('should generate correct message for 1 item needed', () => {
      const oneMoreItem: CartItem = {
        sku: '222',
        name: 'One More',
        price: 10.00,
        quantity: 4,
        bulkDeal: {
          qty: 5,
          price: 40.00 // $10 savings
        }
      }
      const cart = [oneMoreItem]
      const opportunities = findBulkDealOpportunities(cart)

      expect(opportunities[0].message).toBe('Buy 1 more and save $10.00!')
    })

    it('should generate correct message for multiple items needed', () => {
      const cart = [mockItemWithBulkDeal]
      const opportunities = findBulkDealOpportunities(cart)

      expect(opportunities[0].message).toBe('Buy 3 more and save $10.00!')
    })

    it('should handle empty cart', () => {
      const opportunities = findBulkDealOpportunities([])
      expect(opportunities).toHaveLength(0)
    })
  })

  describe('getBulkDealForItem', () => {
    it('should return bulk deal opportunity for eligible item', () => {
      const opportunity = getBulkDealForItem(mockItemWithBulkDeal)

      expect(opportunity).not.toBeNull()
      expect(opportunity?.quantityNeeded).toBe(3)
      expect(opportunity?.additionalSavings).toBe(10.00)
    })

    it('should return null for item without bulk deal', () => {
      const opportunity = getBulkDealForItem(mockItemNoBulkDeal)
      expect(opportunity).toBeNull()
    })

    it('should return null for item that already meets threshold', () => {
      const opportunity = getBulkDealForItem(mockItemBulkThresholdMet)
      expect(opportunity).toBeNull()
    })

    it('should return null for savings below minimum threshold', () => {
      const lowSavingsItem: CartItem = {
        sku: '888',
        name: 'Very Low Savings',
        price: 1.00,
        quantity: 2,
        bulkDeal: {
          qty: 3,
          price: 2.60 // Only $0.40 savings
        }
      }
      const opportunity = getBulkDealForItem(lowSavingsItem)
      expect(opportunity).toBeNull()
    })

    it('should calculate correct savings and totals', () => {
      const opportunity = getBulkDealForItem(mockItemWithBulkDeal)

      expect(opportunity?.currentTotal).toBe(20.00) // 2 × $10
      expect(opportunity?.bulkTotal).toBe(40.00)
      expect(opportunity?.additionalSavings).toBe(10.00) // (5 × $10) - $40
    })
  })
})
