import {
  getCurrentTimePeriod,
  getCurrentDayOfWeek,
  getBasketSizeCategory,
  extractDietaryRestriction,
  extractAllergy,
} from '../index'

describe('Memory System', () => {
  describe('Helper Functions', () => {
    describe('getCurrentTimePeriod', () => {
      it('should return morning for 5 AM', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getHours() {
            return 5
          }
        } as any

        expect(getCurrentTimePeriod()).toBe('morning')
        global.Date = originalDate
      })

      it('should return morning for 11 AM', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getHours() {
            return 11
          }
        } as any

        expect(getCurrentTimePeriod()).toBe('morning')
        global.Date = originalDate
      })

      it('should return afternoon for 12 PM', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getHours() {
            return 12
          }
        } as any

        expect(getCurrentTimePeriod()).toBe('afternoon')
        global.Date = originalDate
      })

      it('should return afternoon for 4 PM', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getHours() {
            return 16
          }
        } as any

        expect(getCurrentTimePeriod()).toBe('afternoon')
        global.Date = originalDate
      })

      it('should return evening for 5 PM', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getHours() {
            return 17
          }
        } as any

        expect(getCurrentTimePeriod()).toBe('evening')
        global.Date = originalDate
      })

      it('should return evening for 9 PM', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getHours() {
            return 21
          }
        } as any

        expect(getCurrentTimePeriod()).toBe('evening')
        global.Date = originalDate
      })

      it('should return night for 10 PM', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getHours() {
            return 22
          }
        } as any

        expect(getCurrentTimePeriod()).toBe('night')
        global.Date = originalDate
      })

      it('should return night for 2 AM', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getHours() {
            return 2
          }
        } as any

        expect(getCurrentTimePeriod()).toBe('night')
        global.Date = originalDate
      })
    })

    describe('getCurrentDayOfWeek', () => {
      it('should return sunday for day 0', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getDay() {
            return 0
          }
        } as any

        expect(getCurrentDayOfWeek()).toBe('sunday')
        global.Date = originalDate
      })

      it('should return monday for day 1', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getDay() {
            return 1
          }
        } as any

        expect(getCurrentDayOfWeek()).toBe('monday')
        global.Date = originalDate
      })

      it('should return friday for day 5', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getDay() {
            return 5
          }
        } as any

        expect(getCurrentDayOfWeek()).toBe('friday')
        global.Date = originalDate
      })

      it('should return saturday for day 6', () => {
        const originalDate = Date
        global.Date = class extends Date {
          getDay() {
            return 6
          }
        } as any

        expect(getCurrentDayOfWeek()).toBe('saturday')
        global.Date = originalDate
      })
    })

    describe('getBasketSizeCategory', () => {
      it('should return small for 1 item', () => {
        expect(getBasketSizeCategory(1)).toBe('small')
      })

      it('should return small for 5 items', () => {
        expect(getBasketSizeCategory(5)).toBe('small')
      })

      it('should return medium for 6 items', () => {
        expect(getBasketSizeCategory(6)).toBe('medium')
      })

      it('should return medium for 15 items', () => {
        expect(getBasketSizeCategory(15)).toBe('medium')
      })

      it('should return large for 16 items', () => {
        expect(getBasketSizeCategory(16)).toBe('large')
      })

      it('should return large for 30 items', () => {
        expect(getBasketSizeCategory(30)).toBe('large')
      })

      it('should return bulk for 31 items', () => {
        expect(getBasketSizeCategory(31)).toBe('bulk')
      })

      it('should return bulk for 100 items', () => {
        expect(getBasketSizeCategory(100)).toBe('bulk')
      })
    })
  })

  describe('Dietary Restriction Extraction', () => {
    it('should extract vegetarian from message', () => {
      expect(extractDietaryRestriction("I'm vegetarian")).toBe('vegetarian')
      expect(extractDietaryRestriction('I am a vegetarian')).toBe('vegetarian')
      expect(extractDietaryRestriction('VEGETARIAN diet')).toBe('vegetarian')
    })

    it('should extract vegan from message', () => {
      expect(extractDietaryRestriction("I'm vegan")).toBe('vegan')
      expect(extractDietaryRestriction('I follow a vegan lifestyle')).toBe('vegan')
    })

    it('should extract gluten free from message', () => {
      expect(extractDietaryRestriction("I'm gluten free")).toBe('gluten_free')
      expect(extractDietaryRestriction('I need gluten-free options')).toBe('gluten_free')
    })

    it('should extract dairy free from message', () => {
      expect(extractDietaryRestriction('I am dairy free')).toBe('dairy_free')
      expect(extractDietaryRestriction('dairy-free diet')).toBe('dairy_free')
    })

    it('should extract nut free from message', () => {
      expect(extractDietaryRestriction('I need nut free food')).toBe('nut_free')
      expect(extractDietaryRestriction('nut-free options')).toBe('nut_free')
    })

    it('should extract keto from message', () => {
      expect(extractDietaryRestriction("I'm on keto")).toBe('keto')
      expect(extractDietaryRestriction('keto diet')).toBe('keto')
    })

    it('should extract paleo from message', () => {
      expect(extractDietaryRestriction('I follow paleo')).toBe('paleo')
      expect(extractDietaryRestriction('PALEO lifestyle')).toBe('paleo')
    })

    it('should extract halal from message', () => {
      expect(extractDietaryRestriction('I need halal food')).toBe('halal')
      expect(extractDietaryRestriction('HALAL only')).toBe('halal')
    })

    it('should extract kosher from message', () => {
      expect(extractDietaryRestriction('I keep kosher')).toBe('kosher')
      expect(extractDietaryRestriction('KOSHER products')).toBe('kosher')
    })

    it('should return null for no dietary restriction', () => {
      expect(extractDietaryRestriction('I like pizza')).toBeNull()
      expect(extractDietaryRestriction('I need milk')).toBeNull()
      expect(extractDietaryRestriction('Shopping for groceries')).toBeNull()
    })

    it('should handle multiple mentions and return first match', () => {
      expect(extractDietaryRestriction("I'm vegan and also gluten free")).toBe('vegan')
    })
  })

  describe('Allergy Extraction', () => {
    it('should extract peanut allergy', () => {
      expect(extractAllergy('I have a peanut allergy')).toBe('peanuts')
      expect(extractAllergy('allergic to peanuts')).toBe('peanuts')
      expect(extractAllergy('I am allergic to peanut butter')).toBe('peanuts')
    })

    it('should extract tree nut allergy', () => {
      expect(extractAllergy('I have a tree nut allergy')).toBe('tree_nuts')
      expect(extractAllergy('allergic to tree nuts')).toBe('tree_nuts')
    })

    it('should extract dairy allergy', () => {
      expect(extractAllergy('I have a dairy allergy')).toBe('dairy')
      expect(extractAllergy('allergic to milk')).toBe('dairy')
      expect(extractAllergy('lactose allergy')).toBe('dairy')
    })

    it('should extract egg allergy', () => {
      expect(extractAllergy('I have an egg allergy')).toBe('eggs')
      expect(extractAllergy('allergic to eggs')).toBe('eggs')
    })

    it('should extract soy allergy', () => {
      expect(extractAllergy('I have a soy allergy')).toBe('soy')
      expect(extractAllergy('allergic to soy products')).toBe('soy')
    })

    it('should extract wheat allergy', () => {
      expect(extractAllergy('I have a wheat allergy')).toBe('wheat')
      expect(extractAllergy('allergic to gluten')).toBe('wheat')
    })

    it('should extract fish allergy', () => {
      expect(extractAllergy('I have a fish allergy')).toBe('fish')
      expect(extractAllergy('allergic to fish')).toBe('fish')
    })

    it('should extract shellfish allergy', () => {
      expect(extractAllergy('I have a shellfish allergy')).toBe('shellfish')
      expect(extractAllergy('allergic to shellfish')).toBe('shellfish')
    })

    it('should return null when no allergy keyword present', () => {
      expect(extractAllergy('I like peanuts')).toBeNull()
      expect(extractAllergy('I need milk')).toBeNull()
      expect(extractAllergy('Dairy products are good')).toBeNull()
    })

    it('should require allergy keyword to detect allergen', () => {
      expect(extractAllergy('I have peanuts')).toBeNull()
      expect(extractAllergy('Give me soy milk')).toBeNull()
    })

    it('should handle various allergy phrasings', () => {
      expect(extractAllergy('I am allergic to peanuts')).toBe('peanuts')
      expect(extractAllergy('peanut allergies run in my family')).toBe('peanuts')
      expect(extractAllergy('severe allergic reaction to peanuts')).toBe('peanuts')
    })
  })
})
