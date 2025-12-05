/**
 * Life Stage Detection
 *
 * Infers customer life stage and household composition from purchase patterns.
 * Used for personalized recommendations and insights.
 */

export interface LifeStageInsight {
  stage: 'single' | 'couple' | 'young_family' | 'established_family' | 'empty_nester' | 'unknown'
  confidence: number
  indicators: string[]
  householdSize: number
  hasBaby: boolean
  hasToddler: boolean
  hasSchoolAge: boolean
  hasTeen: boolean
  hasPets: boolean
  petTypes?: string[]
}

export interface PurchaseItem {
  sku: string
  name: string
  category: string
  quantity?: number
}

/**
 * Detect life stage from purchase history
 */
export function detectLifeStage(purchases: PurchaseItem[]): LifeStageInsight {
  const indicators: string[] = []
  let householdSize = 1
  let confidence = 0.5

  // Baby detection (0-12 months)
  const babyProducts = purchases.filter(p =>
    p.name.toLowerCase().includes('diaper') ||
    p.name.toLowerCase().includes('formula') ||
    p.name.toLowerCase().includes('baby food') ||
    p.name.toLowerCase().includes('wipes') ||
    p.category === 'Baby Food & Formula'
  )
  const hasBaby = babyProducts.length >= 3

  // Toddler detection (1-3 years)
  const toddlerProducts = purchases.filter(p =>
    p.name.toLowerCase().includes('toddler') ||
    p.name.toLowerCase().includes('sippy') ||
    p.name.toLowerCase().includes('pull-ups') ||
    (p.name.toLowerCase().includes('diaper') && p.name.toLowerCase().includes('size 4'))
  )
  const hasToddler = toddlerProducts.length >= 2

  // School-age detection (4-12 years)
  const schoolProducts = purchases.filter(p =>
    p.name.toLowerCase().includes('juice box') ||
    p.name.toLowerCase().includes('lunch') ||
    p.name.toLowerCase().includes('snack pack') ||
    p.name.toLowerCase().includes('lunchable') ||
    p.name.toLowerCase().includes('capri sun') ||
    p.name.toLowerCase().includes('go-gurt')
  )
  const hasSchoolAge = schoolProducts.length >= 4

  // Teen detection (13-17 years)
  const teenProducts = purchases.filter(p =>
    p.name.toLowerCase().includes('energy drink') ||
    p.name.toLowerCase().includes('hot pocket') ||
    p.name.toLowerCase().includes('ramen') ||
    (p.name.toLowerCase().includes('pizza') && (p.quantity || 1) >= 3)
  )
  const hasTeen = teenProducts.length >= 3

  // Pet detection
  const petProducts = purchases.filter(p =>
    p.category === 'Pet Food' ||
    p.name.toLowerCase().includes('dog') ||
    p.name.toLowerCase().includes('cat') ||
    p.name.toLowerCase().includes('pet')
  )
  const hasPets = petProducts.length >= 2

  // Determine pet types
  const petTypes: string[] = []
  if (petProducts.some(p => p.name.toLowerCase().includes('dog'))) {
    petTypes.push('dog')
  }
  if (petProducts.some(p => p.name.toLowerCase().includes('cat'))) {
    petTypes.push('cat')
  }

  // Calculate household size
  if (hasBaby || hasToddler) {
    householdSize = Math.max(householdSize, 3)
    indicators.push(hasBaby ? 'Has baby (0-12 months)' : 'Has toddler (1-3 years)')
    confidence = 0.9
  }

  if (hasSchoolAge) {
    householdSize = Math.max(householdSize, 4)
    indicators.push('Has school-age children (4-12 years)')
    confidence = Math.max(confidence, 0.85)
  }

  if (hasTeen) {
    householdSize = Math.max(householdSize, 4)
    indicators.push('Has teenagers (13-17 years)')
    confidence = Math.max(confidence, 0.8)
  }

  if (hasPets) {
    indicators.push(`Has pets: ${petTypes.join(', ') || 'unknown type'}`)
    confidence = Math.max(confidence, 0.7)
  }

  // Check for bulk purchases (indicates larger household)
  const bulkPurchases = purchases.filter(p => (p.quantity || 1) >= 3)
  if (bulkPurchases.length > purchases.length * 0.3) {
    householdSize = Math.max(householdSize, 3)
    indicators.push('Frequent bulk purchases')
    confidence = Math.max(confidence, 0.6)
  }

  // Check for variety (singles buy less variety)
  const uniqueCategories = new Set(purchases.map(p => p.category))
  if (uniqueCategories.size <= 5) {
    householdSize = Math.min(householdSize, 2)
    indicators.push('Limited variety suggests smaller household')
    confidence = Math.max(confidence, 0.6)
  }

  // Determine life stage
  let stage: LifeStageInsight['stage'] = 'unknown'

  if (hasBaby || hasToddler) {
    stage = 'young_family'
    confidence = 0.9
  } else if (hasSchoolAge || hasTeen) {
    stage = 'established_family'
    confidence = 0.85
  } else if (householdSize >= 3 || bulkPurchases.length > 5) {
    stage = 'couple'
    confidence = 0.7
  } else if (uniqueCategories.size <= 5 && purchases.length < 20) {
    stage = 'single'
    confidence = 0.6
  } else if (householdSize === 2) {
    stage = 'couple'
    confidence = 0.65
  }

  // Default to unknown if we don't have enough data
  if (purchases.length < 10) {
    stage = 'unknown'
    confidence = 0.3
    indicators.push('Not enough purchase history')
  }

  // Add household size indicator
  if (householdSize > 1) {
    indicators.unshift(`Estimated household: ${householdSize} people`)
  }

  return {
    stage,
    confidence,
    indicators,
    householdSize,
    hasBaby,
    hasToddler,
    hasSchoolAge,
    hasTeen,
    hasPets,
    petTypes: petTypes.length > 0 ? petTypes : undefined,
  }
}

/**
 * Get human-readable stage name
 */
export function getLifeStageName(stage: LifeStageInsight['stage']): string {
  switch (stage) {
    case 'single':
      return 'Single'
    case 'couple':
      return 'Couple'
    case 'young_family':
      return 'Young Family'
    case 'established_family':
      return 'Established Family'
    case 'empty_nester':
      return 'Empty Nester'
    default:
      return 'Unknown'
  }
}

/**
 * Get stage description
 */
export function getLifeStageDescription(stage: LifeStageInsight['stage']): string {
  switch (stage) {
    case 'single':
      return 'Living alone or shopping for one'
    case 'couple':
      return 'Two-person household'
    case 'young_family':
      return 'Family with young children (0-5 years)'
    case 'established_family':
      return 'Family with school-age or teenage children'
    case 'empty_nester':
      return 'Older couple or individual, children grown'
    default:
      return 'We\'re still learning about your household'
  }
}

/**
 * Get stage emoji
 */
export function getLifeStageEmoji(stage: LifeStageInsight['stage']): string {
  switch (stage) {
    case 'single':
      return '👤'
    case 'couple':
      return '👫'
    case 'young_family':
      return '👨‍👩‍👧'
    case 'established_family':
      return '👨‍👩‍👧‍👦'
    case 'empty_nester':
      return '👴👵'
    default:
      return '❓'
  }
}
