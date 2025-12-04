import {
  formatPrice,
  generateId,
  debounce,
  classifyMission,
  stripEmojis,
  truncate,
  formatRelativeTime
} from '../utils'

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format whole numbers with two decimals', () => {
      expect(formatPrice(10)).toBe('$10.00')
      expect(formatPrice(0)).toBe('$0.00')
    })

    it('should format decimal numbers', () => {
      expect(formatPrice(10.5)).toBe('$10.50')
      expect(formatPrice(10.99)).toBe('$10.99')
      expect(formatPrice(10.999)).toBe('$11.00') // rounds
    })

    it('should handle negative numbers', () => {
      expect(formatPrice(-10.50)).toBe('$-10.50')
    })

    it('should handle very small numbers', () => {
      expect(formatPrice(0.01)).toBe('$0.01')
      expect(formatPrice(0.001)).toBe('$0.00') // rounds down
    })

    it('should handle large numbers', () => {
      expect(formatPrice(1000000)).toBe('$1000000.00')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()

      expect(id1).not.toBe(id2)
    })

    it('should generate string IDs', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
    })

    it('should include timestamp', () => {
      const id = generateId()
      const timestamp = id.split('-')[0]
      expect(parseInt(timestamp)).toBeGreaterThan(0)
    })

    it('should include random component', () => {
      const id = generateId()
      const parts = id.split('-')
      expect(parts.length).toBeGreaterThanOrEqual(2)
      expect(parts[1]).toBeTruthy()
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('should delay function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1) // Only last call
    })

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('test', 123)
      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('test', 123)
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })

  describe('classifyMission', () => {
    it('should classify recipe missions', () => {
      expect(classifyMission('I want to make pasta')).toBe('recipe')
      expect(classifyMission('recipe for cookies')).toBe('recipe')
      expect(classifyMission('cook dinner')).toBe('recipe')
    })

    it('should classify event missions', () => {
      expect(classifyMission('party supplies')).toBe('event')
      expect(classifyMission('birthday celebration')).toBe('event')
      expect(classifyMission('game day snacks')).toBe('event')
      expect(classifyMission('holiday shopping')).toBe('event')
    })

    it('should classify research missions', () => {
      expect(classifyMission('compare laptops')).toBe('research')
      expect(classifyMission('research TVs')).toBe('research')
      expect(classifyMission('baby products')).toBe('research')
      expect(classifyMission('which one is better')).toBe('research')
    })

    it('should classify precision missions', () => {
      expect(classifyMission('add milk to cart')).toBe('precision')
      expect(classifyMission('get me bread')).toBe('precision')
      expect(classifyMission('I need eggs')).toBe('precision')
    })

    it('should default to essentials', () => {
      expect(classifyMission('weekly groceries')).toBe('essentials')
      expect(classifyMission('shopping list')).toBe('essentials')
      expect(classifyMission('random query')).toBe('essentials')
    })

    it('should be case insensitive', () => {
      expect(classifyMission('RECIPE for pasta')).toBe('recipe')
      expect(classifyMission('Add Milk')).toBe('precision')
    })

    it('should handle first match priority', () => {
      expect(classifyMission('recipe for party')).toBe('recipe') // recipe comes first
    })
  })

  describe('stripEmojis', () => {
    it('should remove emojis from text', () => {
      expect(stripEmojis('Hello 👋 World 🌍')).toBe('Hello World')
      expect(stripEmojis('🎉 Party time! 🎊')).toBe('Party time!')
    })

    it('should preserve regular text', () => {
      expect(stripEmojis('No emojis here')).toBe('No emojis here')
    })

    it('should collapse multiple spaces', () => {
      expect(stripEmojis('Hello    World')).toBe('Hello World')
    })

    it('should trim whitespace', () => {
      expect(stripEmojis('  Hello World  ')).toBe('Hello World')
    })

    it('should handle empty string', () => {
      expect(stripEmojis('')).toBe('')
    })

    it('should handle only emojis', () => {
      expect(stripEmojis('👋🌍🎉')).toBe('')
    })
  })

  describe('truncate', () => {
    it('should not truncate short text', () => {
      expect(truncate('Hello', 10)).toBe('Hello')
      expect(truncate('Hello World', 11)).toBe('Hello World')
    })

    it('should truncate long text', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...')
      expect(truncate('This is a long sentence', 10)).toBe('This is...')
    })

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello')
    })

    it('should handle maxLength of 3 (minimum)', () => {
      expect(truncate('Hello', 3)).toBe('...')
    })

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('')
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-15T12:00:00'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should show "just now" for very recent times', () => {
      const now = new Date()
      expect(formatRelativeTime(now)).toBe('just now')
    })

    it('should show minutes ago', () => {
      const date = new Date('2024-01-15T11:45:00') // 15 mins ago
      expect(formatRelativeTime(date)).toBe('15m ago')
    })

    it('should show hours ago', () => {
      const date = new Date('2024-01-15T09:00:00') // 3 hours ago
      expect(formatRelativeTime(date)).toBe('3h ago')
    })

    it('should show days ago', () => {
      const date = new Date('2024-01-12T12:00:00') // 3 days ago
      expect(formatRelativeTime(date)).toBe('3d ago')
    })

    it('should show full date for > 7 days', () => {
      const date = new Date('2024-01-01T12:00:00') // 14 days ago
      const result = formatRelativeTime(date)
      expect(result).toContain('/') // Should be a formatted date
    })

    it('should handle string dates', () => {
      expect(formatRelativeTime('2024-01-15T11:45:00')).toBe('15m ago')
    })

    it('should handle Date objects', () => {
      const date = new Date('2024-01-15T11:45:00')
      expect(formatRelativeTime(date)).toBe('15m ago')
    })
  })
})
