import { getReplenishmentSuggestions, getTopReplenishmentSuggestions } from '../replenishment'
import { Order, Product } from '@/types'

describe('Replenishment', () => {
  const mockProduct: Product = {
    sku: 'MILK123',
    name: 'Whole Milk',
    price: 4.99,
    category: 'Dairy',
    image: '/milk.jpg'
  }

  const mockCatalog: Product[] = [mockProduct]

  // Helper to create order at specific date
  const createOrder = (daysAgo: number, sku: string): Order => ({
    id: `order-${Date.now()}-${Math.random()}`,
    userId: 'user123',
    items: [{ sku, name: 'Product', price: 4.99, quantity: 1 }],
    total: 4.99,
    createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
  })

  describe('getReplenishmentSuggestions', () => {
    it('should return empty array for no orders', () => {
      const suggestions = getReplenishmentSuggestions([], mockCatalog)
      expect(suggestions).toHaveLength(0)
    })

    it('should return empty array for single purchase (no cycle)', () => {
      const orders = [createOrder(5, 'MILK123')]
      const suggestions = getReplenishmentSuggestions(orders, mockCatalog)
      expect(suggestions).toHaveLength(0)
    })

    it('should suggest replenishment when 90% of cycle elapsed', () => {
      // Cycle: 10 days (purchases at day 0, 10, 20)
      // Last purchase 9 days ago = 90% of cycle
      const orders = [
        createOrder(29, 'MILK123'), // 30 days ago
        createOrder(19, 'MILK123'), // 20 days ago (10 day cycle established)
        createOrder(9, 'MILK123')   // 9 days ago (90% of 10 day cycle)
      ]
      const suggestions = getReplenishmentSuggestions(orders, mockCatalog, 0.9)

      expect(suggestions).toHaveLength(1)
      expect(suggestions[0].item.sku).toBe('MILK123')
      expect(suggestions[0].avgCycleDays).toBe(10)
      expect(suggestions[0].daysSinceLast).toBe(9)
    })

    it('should not suggest replenishment when below threshold', () => {
      // Cycle: 10 days, last purchase 5 days ago (50% of cycle)
      const orders = [
        createOrder(25, 'MILK123'),
        createOrder(15, 'MILK123'),
        createOrder(5, 'MILK123')
      ]
      const suggestions = getReplenishmentSuggestions(orders, mockCatalog, 0.9)

      expect(suggestions).toHaveLength(0)
    })

    it('should show overdue message when past 100% of cycle', () => {
      // Cycle: 10 days, last purchase 15 days ago (150% of cycle)
      const orders = [
        createOrder(35, 'MILK123'),
        createOrder(25, 'MILK123'),
        createOrder(15, 'MILK123')
      ]
      const suggestions = getReplenishmentSuggestions(orders, mockCatalog, 0.9)

      expect(suggestions).toHaveLength(1)
      expect(suggestions[0].percentageOfCycle).toBeGreaterThan(1.0)
      expect(suggestions[0].message).toContain("It's been 15 days")
    })

    it('should show restock message when near but not past cycle', () => {
      // Cycle: 10 days, last purchase 9 days ago (90%)
      const orders = [
        createOrder(29, 'MILK123'),
        createOrder(19, 'MILK123'),
        createOrder(9, 'MILK123')
      ]
      const suggestions = getReplenishmentSuggestions(orders, mockCatalog, 0.9)

      expect(suggestions[0].message).toContain('Time to restock?')
    })

    it('should sort suggestions by percentage (most overdue first)', () => {
      const product2: Product = { sku: 'BREAD123', name: 'Bread', price: 3.99, category: 'Bakery', image: '/bread.jpg' }
      const catalog = [mockProduct, product2]

      const orders = [
        // Milk: 10 day cycle, 15 days since last (150% overdue)
        createOrder(35, 'MILK123'),
        createOrder(25, 'MILK123'),
        createOrder(15, 'MILK123'),

        // Bread: 7 day cycle, 8 days since last (114% overdue)
        createOrder(22, 'BREAD123'),
        createOrder(15, 'BREAD123'),
        createOrder(8, 'BREAD123')
      ]

      const suggestions = getReplenishmentSuggestions(orders, catalog, 0.9)

      expect(suggestions).toHaveLength(2)
      expect(suggestions[0].item.sku).toBe('MILK123') // 150% most overdue
      expect(suggestions[1].item.sku).toBe('BREAD123') // 114%
    })

    it('should skip items not in catalog', () => {
      const orders = [
        createOrder(20, 'UNKNOWN_SKU'),
        createOrder(10, 'UNKNOWN_SKU')
      ]
      const suggestions = getReplenishmentSuggestions(orders, mockCatalog, 0.9)

      expect(suggestions).toHaveLength(0)
    })

    it('should allow custom threshold', () => {
      // Cycle: 10 days, last purchase 7 days ago (70%)
      const orders = [
        createOrder(27, 'MILK123'),
        createOrder(17, 'MILK123'),
        createOrder(7, 'MILK123')
      ]

      // Should not suggest at 90% threshold
      const suggestions90 = getReplenishmentSuggestions(orders, mockCatalog, 0.9)
      expect(suggestions90).toHaveLength(0)

      // Should suggest at 70% threshold
      const suggestions70 = getReplenishmentSuggestions(orders, mockCatalog, 0.7)
      expect(suggestions70).toHaveLength(1)
    })
  })

  describe('getTopReplenishmentSuggestions', () => {
    it('should limit results to specified number', () => {
      const catalog: Product[] = [
        { sku: 'SKU1', name: 'Product 1', price: 5, category: 'A', image: '1.jpg' },
        { sku: 'SKU2', name: 'Product 2', price: 5, category: 'A', image: '2.jpg' },
        { sku: 'SKU3', name: 'Product 3', price: 5, category: 'A', image: '3.jpg' },
      ]

      const orders = [
        // All with 10 day cycles, all overdue
        ...['SKU1', 'SKU2', 'SKU3'].flatMap(sku => [
          createOrder(30, sku),
          createOrder(20, sku),
          createOrder(11, sku)
        ])
      ]

      const suggestions = getTopReplenishmentSuggestions(orders, catalog, 2)
      expect(suggestions).toHaveLength(2)
    })

    it('should default to 5 items if no limit specified', () => {
      const catalog: Product[] = Array.from({ length: 10 }, (_, i) => ({
        sku: `SKU${i}`,
        name: `Product ${i}`,
        price: 5,
        category: 'A',
        image: `${i}.jpg`
      }))

      const orders = catalog.flatMap(p => [
        createOrder(30, p.sku),
        createOrder(20, p.sku),
        createOrder(11, p.sku)
      ])

      const suggestions = getTopReplenishmentSuggestions(orders, catalog)
      expect(suggestions).toHaveLength(5)
    })

    it('should return fewer than limit if not enough suggestions', () => {
      const orders = [
        createOrder(20, 'MILK123'),
        createOrder(11, 'MILK123')
      ]

      const suggestions = getTopReplenishmentSuggestions(orders, mockCatalog, 10)
      expect(suggestions).toHaveLength(1)
    })
  })
})
