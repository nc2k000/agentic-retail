/**
 * Progressive Discovery Engine
 *
 * Discovers household facts from purchases, messages, and behaviors.
 * Implements the "robotic vacuum" approach - gradual, systematic discovery.
 */

import {
  HouseholdFact,
  Evidence,
  DiscoveryInput,
  DiscoveryResult,
  FactConflict,
  ConfirmationQuestion,
} from './types'

// ============================================================================
// Discovery from Purchases
// ============================================================================

export interface PurchaseItem {
  sku: string
  name: string
  category: string
  quantity: number
  price: number
}

/**
 * Discover household facts from a purchase
 */
export function discoverFromPurchase(
  userId: string,
  items: PurchaseItem[],
  timestamp: string = new Date().toISOString()
): Partial<HouseholdFact>[] {
  const discoveries: Partial<HouseholdFact>[] = []

  // Baby detection
  const babyProducts = items.filter(
    item =>
      item.category === 'Baby Food & Formula' ||
      item.name.toLowerCase().includes('diaper') ||
      item.name.toLowerCase().includes('formula') ||
      item.name.toLowerCase().includes('wipes')
  )

  if (babyProducts.length > 0) {
    discoveries.push({
      userId,
      category: 'people',
      subcategory: 'household_member',
      factKey: 'has_baby',
      factValue: true,
      confidence: 0.9,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'purchase',
          timestamp,
          details: {
            products: babyProducts.map(p => p.name),
            count: babyProducts.length,
          },
          weight: 0.9,
        },
      ],
    })

    // Infer life stage
    discoveries.push({
      userId,
      category: 'people',
      subcategory: 'life_stage',
      factKey: 'life_stage',
      factValue: 'young_family',
      confidence: 0.85,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'inference',
          timestamp,
          details: { reason: 'Baby products indicate young family' },
          weight: 0.85,
        },
      ],
    })
  }

  // Toddler detection
  const toddlerProducts = items.filter(
    item =>
      item.name.toLowerCase().includes('toddler') ||
      item.name.toLowerCase().includes('sippy') ||
      item.name.toLowerCase().includes('pull-ups')
  )

  if (toddlerProducts.length > 0) {
    discoveries.push({
      userId,
      category: 'people',
      subcategory: 'household_member',
      factKey: 'has_toddler',
      factValue: true,
      confidence: 0.85,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'purchase',
          timestamp,
          details: { products: toddlerProducts.map(p => p.name) },
          weight: 0.85,
        },
      ],
    })
  }

  // School-age children detection
  const schoolProducts = items.filter(
    item =>
      item.name.toLowerCase().includes('juice box') ||
      item.name.toLowerCase().includes('lunchable') ||
      item.name.toLowerCase().includes('snack pack') ||
      item.name.toLowerCase().includes('capri sun')
  )

  if (schoolProducts.length >= 2) {
    discoveries.push({
      userId,
      category: 'people',
      subcategory: 'household_member',
      factKey: 'has_school_age_children',
      factValue: true,
      confidence: 0.8,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'purchase',
          timestamp,
          details: { products: schoolProducts.map(p => p.name) },
          weight: 0.8,
        },
      ],
    })
  }

  // Pet detection
  const petProducts = items.filter(
    item =>
      item.category === 'Pet Food' ||
      item.name.toLowerCase().includes('dog') ||
      item.name.toLowerCase().includes('cat')
  )

  if (petProducts.length > 0) {
    const hasDog = petProducts.some(p => p.name.toLowerCase().includes('dog'))
    const hasCat = petProducts.some(p => p.name.toLowerCase().includes('cat'))

    discoveries.push({
      userId,
      category: 'pets',
      subcategory: 'pet',
      factKey: 'has_pets',
      factValue: true,
      confidence: 0.9,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'purchase',
          timestamp,
          details: { products: petProducts.map(p => p.name) },
          weight: 0.9,
        },
      ],
    })

    if (hasDog) {
      discoveries.push({
        userId,
        category: 'pets',
        subcategory: 'pet',
        factKey: 'has_dog',
        factValue: true,
        confidence: 0.95,
        discoveredFrom: 'purchase_pattern',
        supportingEvidence: [
          {
            type: 'purchase',
            timestamp,
            details: { products: petProducts.filter(p => p.name.includes('dog')) },
            weight: 0.95,
          },
        ],
      })
    }

    if (hasCat) {
      discoveries.push({
        userId,
        category: 'pets',
        subcategory: 'pet',
        factKey: 'has_cat',
        factValue: true,
        confidence: 0.95,
        discoveredFrom: 'purchase_pattern',
        supportingEvidence: [
          {
            type: 'purchase',
            timestamp,
            details: { products: petProducts.filter(p => p.name.includes('cat')) },
            weight: 0.95,
          },
        ],
      })
    }
  }

  // Dietary preferences (organic)
  const organicProducts = items.filter(item => item.name.toLowerCase().includes('organic'))

  if (organicProducts.length >= 3) {
    discoveries.push({
      userId,
      category: 'lifestyle',
      subcategory: 'dietary_preference',
      factKey: 'prefers_organic',
      factValue: true,
      confidence: 0.7,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'purchase',
          timestamp,
          details: {
            organicCount: organicProducts.length,
            totalCount: items.length,
            percentage: (organicProducts.length / items.length) * 100,
          },
          weight: 0.7,
        },
      ],
    })
  }

  // Bulk buying (indicates larger household or meal prep)
  const bulkItems = items.filter(item => item.quantity >= 3)

  if (bulkItems.length > items.length * 0.3) {
    discoveries.push({
      userId,
      category: 'lifestyle',
      subcategory: 'shopping_style',
      factKey: 'bulk_buyer',
      factValue: true,
      confidence: 0.75,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'behavior',
          timestamp,
          details: {
            bulkItems: bulkItems.length,
            totalItems: items.length,
            percentage: (bulkItems.length / items.length) * 100,
          },
          weight: 0.75,
        },
      ],
    })

    // Bulk buying suggests larger household
    discoveries.push({
      userId,
      category: 'people',
      subcategory: 'household_size',
      factKey: 'household_size_large',
      factValue: true,
      confidence: 0.6,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'inference',
          timestamp,
          details: { reason: 'Frequent bulk purchases suggest larger household' },
          weight: 0.6,
        },
      ],
    })
  }

  // Fitness-oriented
  const fitnessProducts = items.filter(
    item =>
      item.name.toLowerCase().includes('protein') ||
      item.name.toLowerCase().includes('energy') ||
      item.name.toLowerCase().includes('sports drink') ||
      item.name.toLowerCase().includes('vitamin')
  )

  if (fitnessProducts.length >= 2) {
    discoveries.push({
      userId,
      category: 'lifestyle',
      subcategory: 'fitness_level',
      factKey: 'fitness_oriented',
      factValue: true,
      confidence: 0.7,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'purchase',
          timestamp,
          details: { products: fitnessProducts.map(p => p.name) },
          weight: 0.7,
        },
      ],
    })
  }

  // Cooking frequency (fresh ingredients)
  const freshIngredients = items.filter(
    item =>
      item.category === 'Fresh Produce' ||
      item.category === 'Meat & Seafood' ||
      item.category === 'Dairy & Eggs'
  )

  if (freshIngredients.length >= 5) {
    discoveries.push({
      userId,
      category: 'lifestyle',
      subcategory: 'cooking_frequency',
      factKey: 'cooks_frequently',
      factValue: true,
      confidence: 0.65,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'purchase',
          timestamp,
          details: {
            freshIngredients: freshIngredients.length,
            categories: [...new Set(freshIngredients.map(i => i.category))],
          },
          weight: 0.65,
        },
      ],
    })
  }

  // ============================================================================
  // Property Type Inference
  // ============================================================================
  // Infer property type from purchase patterns - NEVER assume features like yards/garages

  // Outdoor/Yard indicators (BBQ supplies, lawn care, gardening)
  const outdoorProducts = items.filter(
    item =>
      item.name.toLowerCase().includes('bbq') ||
      item.name.toLowerCase().includes('grill') ||
      item.name.toLowerCase().includes('charcoal') ||
      item.name.toLowerCase().includes('lawn') ||
      item.name.toLowerCase().includes('garden') ||
      item.name.toLowerCase().includes('hose') ||
      item.name.toLowerCase().includes('fertilizer') ||
      item.name.toLowerCase().includes('mulch')
  )

  if (outdoorProducts.length >= 2) {
    // Has outdoor space (likely house or townhouse, NOT apartment)
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_features',
      factKey: 'has_outdoor_space',
      factValue: true,
      confidence: 0.8,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'purchase',
          timestamp,
          details: { products: outdoorProducts.map(p => p.name) },
          weight: 0.8,
        },
      ],
    })

    // Likely house or townhouse (medium confidence - could be condo with patio)
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_type',
      factKey: 'property_type',
      factValue: 'house_or_townhouse',
      confidence: 0.65,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'inference',
          timestamp,
          details: { reason: 'Outdoor/yard products suggest house or townhouse with outdoor space' },
          weight: 0.65,
        },
      ],
    })
  }

  // Apartment indicators (storage solutions, compact items, no yard products)
  const apartmentIndicators = items.filter(
    item =>
      item.name.toLowerCase().includes('storage bin') ||
      item.name.toLowerCase().includes('organizer') ||
      item.name.toLowerCase().includes('space saver') ||
      item.name.toLowerCase().includes('compact') ||
      item.name.toLowerCase().includes('small space')
  )

  // Only infer apartment if NO outdoor products and has space-saving items
  if (apartmentIndicators.length >= 2 && outdoorProducts.length === 0) {
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_type',
      factKey: 'property_type',
      factValue: 'apartment',
      confidence: 0.6,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'inference',
          timestamp,
          details: { reason: 'Space-saving products and no yard items suggest apartment' },
          weight: 0.6,
        },
      ],
    })

    // Limited storage space
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_features',
      factKey: 'limited_storage',
      factValue: true,
      confidence: 0.7,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'purchase',
          timestamp,
          details: { products: apartmentIndicators.map(p => p.name) },
          weight: 0.7,
        },
      ],
    })
  }

  // Garage indicators (car care, tools, bulk storage)
  const garageIndicators = items.filter(
    item =>
      item.name.toLowerCase().includes('car wash') ||
      item.name.toLowerCase().includes('motor oil') ||
      item.name.toLowerCase().includes('garage') ||
      item.name.toLowerCase().includes('tool')
  )

  if (garageIndicators.length >= 2) {
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_features',
      factKey: 'has_garage',
      factValue: true,
      confidence: 0.75,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'purchase',
          timestamp,
          details: { products: garageIndicators.map(p => p.name) },
          weight: 0.75,
        },
      ],
    })
  }

  // Pool indicators
  const poolProducts = items.filter(
    item =>
      item.name.toLowerCase().includes('pool') ||
      item.name.toLowerCase().includes('chlorine')
  )

  if (poolProducts.length >= 1) {
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_features',
      factKey: 'has_pool',
      factValue: true,
      confidence: 0.9,
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'purchase',
          timestamp,
          details: { products: poolProducts.map(p => p.name) },
          weight: 0.9,
        },
      ],
    })
  }

  // Urban vs Suburban context (very low confidence - needs more signals)
  // Urban: quick meals, single-serve items, delivery-friendly
  const urbanIndicators = items.filter(
    item =>
      item.name.toLowerCase().includes('ready to eat') ||
      item.name.toLowerCase().includes('single serve') ||
      item.name.toLowerCase().includes('instant')
  )

  if (urbanIndicators.length >= 4 && outdoorProducts.length === 0 && bulkItems.length < 2) {
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'location_context',
      factKey: 'location_context',
      factValue: 'urban',
      confidence: 0.5, // Very low confidence - just a hint
      discoveredFrom: 'purchase_pattern',
      supportingEvidence: [
        {
          type: 'inference',
          timestamp,
          details: { reason: 'Quick meals, single-serve items, no bulk/outdoor products suggest urban context' },
          weight: 0.5,
        },
      ],
    })
  }

  return discoveries
}

// ============================================================================
// Discovery from Messages
// ============================================================================

/**
 * Discover household facts from user messages
 */
export function discoverFromMessage(
  userId: string,
  message: string,
  timestamp: string = new Date().toISOString()
): Partial<HouseholdFact>[] {
  const discoveries: Partial<HouseholdFact>[] = []
  const lowerMessage = message.toLowerCase()

  // Baby mentions
  if (
    lowerMessage.includes('my baby') ||
    lowerMessage.includes('our baby') ||
    lowerMessage.includes('the baby')
  ) {
    discoveries.push({
      userId,
      category: 'people',
      subcategory: 'household_member',
      factKey: 'has_baby',
      factValue: true,
      confidence: 0.95,
      discoveredFrom: 'explicit_mention',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100) },
          weight: 0.95,
        },
      ],
    })
  }

  // Children mentions
  if (
    lowerMessage.includes('my kids') ||
    lowerMessage.includes('my children') ||
    lowerMessage.includes('the kids')
  ) {
    discoveries.push({
      userId,
      category: 'people',
      subcategory: 'household_member',
      factKey: 'has_children',
      factValue: true,
      confidence: 0.95,
      discoveredFrom: 'explicit_mention',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100) },
          weight: 0.95,
        },
      ],
    })
  }

  // Pet mentions
  if (lowerMessage.includes('my dog') || lowerMessage.includes('our dog')) {
    discoveries.push({
      userId,
      category: 'pets',
      subcategory: 'pet',
      factKey: 'has_dog',
      factValue: true,
      confidence: 0.95,
      discoveredFrom: 'explicit_mention',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100) },
          weight: 0.95,
        },
      ],
    })
  }

  if (lowerMessage.includes('my cat') || lowerMessage.includes('our cat')) {
    discoveries.push({
      userId,
      category: 'pets',
      subcategory: 'pet',
      factKey: 'has_cat',
      factValue: true,
      confidence: 0.95,
      discoveredFrom: 'explicit_mention',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100) },
          weight: 0.95,
        },
      ],
    })
  }

  // Dietary preferences
  if (lowerMessage.includes('i am vegan') || lowerMessage.includes("i'm vegan")) {
    discoveries.push({
      userId,
      category: 'lifestyle',
      subcategory: 'dietary_preference',
      factKey: 'dietary_vegan',
      factValue: true,
      confidence: 1.0,
      discoveredFrom: 'explicit_statement',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100), explicit: true },
          weight: 1.0,
        },
      ],
    })
  }

  if (lowerMessage.includes('gluten free') || lowerMessage.includes('celiac')) {
    discoveries.push({
      userId,
      category: 'lifestyle',
      subcategory: 'dietary_restriction',
      factKey: 'dietary_gluten_free',
      factValue: true,
      confidence: 0.95,
      discoveredFrom: 'explicit_statement',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100) },
          weight: 0.95,
        },
      ],
    })
  }

  // Allergies
  if (lowerMessage.includes('allergic to') || lowerMessage.includes('allergy to')) {
    const allergyMatch = message.match(/allergic to (\w+)/i)
    if (allergyMatch) {
      discoveries.push({
        userId,
        category: 'people',
        subcategory: 'health_condition',
        factKey: `allergy_${allergyMatch[1].toLowerCase()}`,
        factValue: true,
        confidence: 1.0,
        discoveredFrom: 'explicit_statement',
        supportingEvidence: [
          {
            type: 'answer',
            timestamp,
            details: { message: message.substring(0, 100), explicit: true },
            weight: 1.0,
          },
        ],
      })
    }
  }

  // Property type mentions
  if (lowerMessage.includes('my apartment') || lowerMessage.includes('our apartment')) {
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_type',
      factKey: 'property_type',
      factValue: 'apartment',
      confidence: 1.0,
      discoveredFrom: 'explicit_statement',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100), explicit: true },
          weight: 1.0,
        },
      ],
    })
  }

  if (lowerMessage.includes('my house') || lowerMessage.includes('our house')) {
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_type',
      factKey: 'property_type',
      factValue: 'house',
      confidence: 1.0,
      discoveredFrom: 'explicit_statement',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100), explicit: true },
          weight: 1.0,
        },
      ],
    })
  }

  if (lowerMessage.includes('my condo') || lowerMessage.includes('our condo')) {
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_type',
      factKey: 'property_type',
      factValue: 'condo',
      confidence: 1.0,
      discoveredFrom: 'explicit_statement',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100), explicit: true },
          weight: 1.0,
        },
      ],
    })
  }

  if (lowerMessage.includes('townhouse') || lowerMessage.includes('town house')) {
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_type',
      factKey: 'property_type',
      factValue: 'townhouse',
      confidence: 1.0,
      discoveredFrom: 'explicit_statement',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100), explicit: true },
          weight: 1.0,
        },
      ],
    })
  }

  // Outdoor space mentions
  if (
    lowerMessage.includes('my yard') ||
    lowerMessage.includes('our yard') ||
    lowerMessage.includes('my backyard') ||
    lowerMessage.includes('our backyard')
  ) {
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_features',
      factKey: 'has_outdoor_space',
      factValue: true,
      confidence: 1.0,
      discoveredFrom: 'explicit_mention',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100), explicit: true },
          weight: 1.0,
        },
      ],
    })
  }

  // Garage mentions
  if (lowerMessage.includes('my garage') || lowerMessage.includes('our garage')) {
    discoveries.push({
      userId,
      category: 'physical_space',
      subcategory: 'property_features',
      factKey: 'has_garage',
      factValue: true,
      confidence: 1.0,
      discoveredFrom: 'explicit_mention',
      supportingEvidence: [
        {
          type: 'answer',
          timestamp,
          details: { message: message.substring(0, 100), explicit: true },
          weight: 1.0,
        },
      ],
    })
  }

  return discoveries
}

// ============================================================================
// Confidence Calculation
// ============================================================================

/**
 * Calculate updated confidence when new evidence is added
 */
export function calculateUpdatedConfidence(
  currentConfidence: number,
  newEvidence: Evidence,
  dataPoints: number
): number {
  // Explicit confirmation = max confidence
  if (newEvidence.type === 'answer' && (newEvidence.details as any).explicit) {
    return 1.0
  }

  // Blend old confidence with new evidence weight
  // More data points = slower confidence change (more stable)
  const blendFactor = Math.min(0.3, 1.0 / Math.sqrt(dataPoints))
  const newConfidence = currentConfidence + (newEvidence.weight - currentConfidence) * blendFactor

  return Math.max(0.0, Math.min(1.0, newConfidence))
}

/**
 * Detect conflicts between existing fact and new evidence
 */
export function detectConflict(
  existingFact: HouseholdFact,
  newFactValue: any,
  newEvidence: Evidence
): FactConflict | null {
  // Check for contradictions
  if (typeof existingFact.factValue === 'boolean' && typeof newFactValue === 'boolean') {
    if (existingFact.factValue !== newFactValue) {
      return {
        existingFact,
        newEvidence,
        conflictType: 'contradiction',
        resolutionStrategy: 'confirm',
      }
    }
  }

  // Check for staleness (not confirmed in 90 days)
  if (existingFact.lastConfirmedAt) {
    const daysSince =
      (Date.now() - new Date(existingFact.lastConfirmedAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince > 90 && existingFact.confidence < 0.8) {
      return {
        existingFact,
        newEvidence,
        conflictType: 'staleness',
        resolutionStrategy: 'confirm',
      }
    }
  }

  // Check for uncertainty (low confidence)
  if (existingFact.confidence < 0.5 && newEvidence.weight < 0.6) {
    return {
      existingFact,
      newEvidence,
      conflictType: 'uncertainty',
      resolutionStrategy: 'update',
    }
  }

  return null
}

// ============================================================================
// Confirmation Questions
// ============================================================================

/**
 * Generate confirmation questions for low confidence facts
 */
export function generateConfirmationQuestions(facts: HouseholdFact[]): ConfirmationQuestion[] {
  const questions: ConfirmationQuestion[] = []

  for (const fact of facts) {
    // Skip high confidence facts
    if (fact.confidence >= 0.7) continue

    // Skip recently confirmed facts
    if (fact.lastConfirmedAt) {
      const hoursSince =
        (Date.now() - new Date(fact.lastConfirmedAt).getTime()) / (1000 * 60 * 60)
      if (hoursSince < 24) continue
    }

    // Generate question based on fact type
    switch (fact.factKey) {
      case 'has_baby':
        questions.push({
          factKey: fact.factKey,
          question: 'I noticed you buy baby products - do you have a baby?',
          answerType: 'yes_no',
          priority: 'high',
          reason: 'Baby in household significantly affects product recommendations',
        })
        break

      case 'has_dog':
        questions.push({
          factKey: fact.factKey,
          question: 'Do you have a dog?',
          answerType: 'yes_no',
          priority: 'medium',
          reason: 'Pet ownership affects product suggestions',
        })
        break

      case 'prefers_organic':
        questions.push({
          factKey: fact.factKey,
          question: 'Should I prioritize organic products in your recommendations?',
          answerType: 'yes_no',
          priority: 'medium',
          reason: 'Dietary preferences guide product selection',
        })
        break

      case 'cooks_frequently':
        questions.push({
          factKey: fact.factKey,
          question: 'How often do you cook at home?',
          answerType: 'single_choice',
          options: [
            { value: 'daily', label: 'Daily or almost daily' },
            { value: 'frequent', label: 'A few times a week' },
            { value: 'occasional', label: 'Once a week or less' },
            { value: 'rarely', label: 'Rarely cook at home' },
          ],
          priority: 'low',
          reason: 'Cooking frequency affects ingredient vs. prepared food recommendations',
        })
        break
    }
  }

  // Sort by priority
  return questions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

// ============================================================================
// Map Completeness
// ============================================================================

/**
 * Calculate household map completeness (0-100%)
 */
export function calculateMapCompleteness(facts: HouseholdFact[]): number {
  // Completeness based on number of facts
  // 0 facts = 0%, 10 facts = 20%, 25 facts = 50%, 50+ facts = 100%
  const factCount = facts.length
  const baseCompleteness = Math.min(100, (factCount / 50) * 100)

  // Bonus for high confidence facts
  const highConfidenceFacts = facts.filter(f => f.confidence >= 0.8).length
  const confidenceBonus = (highConfidenceFacts / Math.max(factCount, 1)) * 10

  // Bonus for diverse categories
  const categories = new Set(facts.map(f => f.category))
  const categoryBonus = (categories.size / 5) * 10

  return Math.min(100, baseCompleteness + confidenceBonus + categoryBonus)
}
