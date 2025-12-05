/**
 * Product Ranking Engine
 *
 * Scores and ranks products based on user preferences, purchase history,
 * and maturity level to power personalized recommendations and carousels.
 */

import { Product, UserMaturityScore, RecommendationStrategy } from '@/types'
import { getRecommendationStrategy } from './maturity'
import type { HouseholdMap } from '@/lib/household/types'

export interface RankedProduct extends Product {
  rank: number
  score: number
  matchReason?: string
  badges?: Array<'favorite' | 'organic' | 'best_value' | 'new' | 'usual_choice' | 'brand_match'>
  personalScore: number
  popularityScore: number
  valueScore: number
}

export interface UserPreference {
  preference_type: 'brand' | 'dietary' | 'favorite' | 'dislike' | 'allergy'
  preference_key: string
  preference_value?: string
  confidence: number
  times_confirmed: number
}

export interface PurchaseHistory {
  sku: string
  product_name: string
  purchase_count: number
  last_purchased: string
  days_since_last: number
}

/**
 * Rank products for a user based on personalization
 */
export async function rankProducts(
  products: Product[],
  userId: string,
  userMaturity: UserMaturityScore,
  preferences: UserPreference[],
  purchaseHistory: PurchaseHistory[],
  householdMap?: HouseholdMap
): Promise<RankedProduct[]> {
  const strategy = getRecommendationStrategy(userMaturity)

  console.log(`🎯 Ranking ${products.length} products for user maturity: ${userMaturity.level}`)
  console.log(`   Strategy: ${strategy.strategy} (${(strategy.accuracy_weight * 100).toFixed(0)}% accuracy, ${(strategy.relevancy_weight * 100).toFixed(0)}% relevancy)`)
  if (householdMap && householdMap.facts.length > 0) {
    console.log(`   🏠 Household context: ${householdMap.people.length} people, ${householdMap.pets.length} pets`)
  }

  const rankedProducts: RankedProduct[] = products.map((product) => {
    // Calculate individual scores
    const personalScore = calculatePersonalScore(product, preferences, purchaseHistory, householdMap)
    const popularityScore = calculatePopularityScore(product)
    const valueScore = calculateValueScore(product)

    // Weighted combination based on maturity
    const finalScore =
      personalScore * strategy.accuracy_weight +
      popularityScore * strategy.relevancy_weight +
      valueScore * 0.1 // Small value boost

    // Determine badges and match reason
    const { badges, matchReason } = determineProductBadges(
      product,
      preferences,
      purchaseHistory,
      personalScore
    )

    return {
      ...product,
      rank: 0, // Will be set after sorting
      score: finalScore,
      matchReason,
      badges,
      personalScore,
      popularityScore,
      valueScore,
    }
  })

  // Sort by score (descending)
  rankedProducts.sort((a, b) => b.score - a.score)

  // Assign ranks
  rankedProducts.forEach((product, index) => {
    product.rank = index + 1
  })

  // Log top 3 for debugging
  console.log('   Top 3 products:')
  rankedProducts.slice(0, 3).forEach((p) => {
    console.log(`     ${p.rank}. ${p.name} (score: ${p.score.toFixed(2)}, badges: ${p.badges?.join(', ') || 'none'})`)
  })

  return rankedProducts
}

/**
 * Calculate personalized score based on preferences, history, and household context
 */
function calculatePersonalScore(
  product: Product,
  preferences: UserPreference[],
  purchaseHistory: PurchaseHistory[],
  householdMap?: HouseholdMap
): number {
  let score = 1.0

  // Check for allergies (CRITICAL - instant zero)
  const allergyMatch = preferences.find(
    (p) =>
      p.preference_type === 'allergy' &&
      (product.name.toLowerCase().includes(p.preference_key.toLowerCase()) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(p.preference_key.toLowerCase())))
  )
  if (allergyMatch) {
    return 0 // NEVER recommend allergens
  }

  // Check for dislikes (major penalty)
  const dislikeMatch = preferences.find(
    (p) =>
      p.preference_type === 'dislike' &&
      (product.name.toLowerCase().includes(p.preference_key.toLowerCase()) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(p.preference_key.toLowerCase())))
  )
  if (dislikeMatch) {
    score *= 0.2 // 80% penalty
  }

  // Brand preference boost
  const brandMatch = preferences.find((p) => {
    if (p.preference_type !== 'brand') return false

    const brandLower = p.preference_key.toLowerCase()
    const productNameLower = product.name.toLowerCase()

    // Check tags first
    if (product.tags?.some((tag) => tag.toLowerCase() === brandLower)) {
      return true
    }

    // For brand names with multiple words (e.g., "Dave's Killer Bread"),
    // match if product name starts with the significant brand words
    // "Dave's Killer Bread" should match "Dave's Killer 21 Grain"
    const brandWords = brandLower.split(' ').filter(w => w.length > 2) // Skip short words like "co"
    const matchesAllSignificantWords = brandWords.slice(0, 2).every(word =>
      productNameLower.includes(word)
    )

    return matchesAllSignificantWords || productNameLower.includes(brandLower)
  })

  if (brandMatch) {
    score *= 1 + brandMatch.confidence * 0.5 // Up to 1.5x boost
  }

  // Dietary preference boost (organic, gluten-free, etc.)
  for (const pref of preferences.filter((p) => p.preference_type === 'dietary')) {
    const matches =
      product.name.toLowerCase().includes(pref.preference_key.toLowerCase()) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(pref.preference_key.toLowerCase()))

    if (matches) {
      score *= 1 + pref.confidence * 0.3 // Up to 1.3x boost
    }
  }

  // Favorite item boost
  const favoriteMatch = preferences.find(
    (p) =>
      p.preference_type === 'favorite' &&
      (product.name.toLowerCase() === p.preference_key.toLowerCase() ||
        product.sku === p.preference_value)
  )
  if (favoriteMatch) {
    score *= 1 + favoriteMatch.confidence * 0.6 // Up to 1.6x boost (favorites are strong signals)
  }

  // Purchase history boost
  const historyMatch = purchaseHistory.find((h) => h.sku === product.sku)
  if (historyMatch) {
    // Logarithmic boost based on purchase count
    const purchaseBoost = Math.log(historyMatch.purchase_count + 1) * 0.2
    score *= 1 + purchaseBoost

    // Recency boost (purchased recently = higher score)
    if (historyMatch.days_since_last < 30) {
      score *= 1.2 // 20% boost for recent purchases
    }
  }

  // Household context boosts
  if (householdMap && householdMap.facts.length > 0) {
    const productName = product.name.toLowerCase()
    const productCategory = product.category.toLowerCase()
    const productTags = product.tags?.map(t => t.toLowerCase()) || []

    // Boost pet products if user has pets
    for (const pet of householdMap.pets) {
      const petType = pet.type.toLowerCase()
      if (productCategory.includes('pet') ||
          productName.includes(petType) ||
          productTags.some(tag => tag.includes(petType) || tag.includes('pet'))) {
        score *= 1 + pet.confidence * 0.4 // Up to 1.4x boost for pet products
      }
    }

    // Boost baby/kid products if user has children
    for (const person of householdMap.people) {
      if (person.role === 'baby' || person.age === 'baby') {
        if (productCategory.includes('baby') || productCategory.includes('kids') ||
            productName.includes('baby') || productName.includes('infant') ||
            productTags.some(tag => tag.includes('baby') || tag.includes('infant'))) {
          score *= 1.5 // Strong boost for baby products
        }
      }
      if (person.role === 'toddler' || person.age === 'toddler') {
        if (productCategory.includes('kids') || productCategory.includes('toddler') ||
            productName.includes('toddler') || productName.includes('kid') ||
            productTags.some(tag => tag.includes('toddler') || tag.includes('kid'))) {
          score *= 1.4 // Strong boost for toddler products
        }
      }
    }

    // Boost products based on lifestyle
    if (householdMap.lifestyle) {
      // Organic preference from lifestyle
      if (householdMap.lifestyle.dietaryPreferences.includes('organic')) {
        if (productName.includes('organic') || productTags.some(tag => tag === 'organic')) {
          score *= 1.3 // Boost organic products
        }
      }

      // Fitness-oriented boosts
      if (householdMap.lifestyle.fitnessLevel === 'active' || householdMap.lifestyle.fitnessLevel === 'moderately_active') {
        if (productCategory.includes('produce') || productCategory.includes('health') ||
            productName.includes('protein') || productName.includes('energy') ||
            productTags.some(tag => tag.includes('protein') || tag.includes('health'))) {
          score *= 1.2 // Boost healthy products for active households
        }
      }
    }
  }

  return score
}

/**
 * Calculate popularity score (global product metrics)
 */
function calculatePopularityScore(product: Product): number {
  // In a real system, this would pull from analytics
  // For now, use a simple heuristic based on product attributes
  let score = 1.0

  // Products with bulk deals are likely popular
  if (product.bulkDeal) {
    score *= 1.3
  }

  // Category popularity (some categories are inherently more popular)
  const popularCategories = ['Dairy', 'Produce', 'Bakery', 'Meat']
  if (popularCategories.includes(product.category)) {
    score *= 1.2
  }

  return score
}

/**
 * Calculate value score (price, deals, savings)
 */
function calculateValueScore(product: Product): number {
  let score = 1.0

  // Bulk deal boost
  if (product.bulkDeal && product.bulkDeal.savings > 0) {
    const savingsPercent = product.bulkDeal.savings / product.price
    score *= 1 + savingsPercent * 0.5 // Up to 50% boost for great deals
  }

  // Price tiers (lower price = slightly higher value score)
  if (product.price < 5) {
    score *= 1.2
  } else if (product.price > 15) {
    score *= 0.9
  }

  return score
}

/**
 * Determine badges and match reason for a product
 */
function determineProductBadges(
  product: Product,
  preferences: UserPreference[],
  purchaseHistory: PurchaseHistory[],
  personalScore: number
): { badges: RankedProduct['badges']; matchReason?: string } {
  const badges: RankedProduct['badges'] = []
  let matchReason: string | undefined

  // Check for favorite
  const favoriteMatch = preferences.find(
    (p) =>
      p.preference_type === 'favorite' &&
      (product.name.toLowerCase() === p.preference_key.toLowerCase() ||
        product.sku === p.preference_value)
  )
  if (favoriteMatch) {
    badges.push('favorite')
    if (!matchReason) matchReason = 'Your favorite'
  }

  // Check for usual choice (purchased 3+ times)
  const historyMatch = purchaseHistory.find((h) => h.sku === product.sku)
  if (historyMatch && historyMatch.purchase_count >= 3) {
    badges.push('usual_choice')
    if (!matchReason) matchReason = `You buy this often (${historyMatch.purchase_count}x)`
  }

  // Check for brand match
  const brandMatch = preferences.find(
    (p) =>
      p.preference_type === 'brand' &&
      (product.tags?.some((tag) => tag.toLowerCase() === p.preference_key.toLowerCase()) ||
        product.name.toLowerCase().includes(p.preference_key.toLowerCase()))
  )
  if (brandMatch && brandMatch.confidence > 0.6) {
    badges.push('brand_match')
    if (!matchReason) matchReason = `Matches your ${brandMatch.preference_key} preference`
  }

  // Check for organic
  const organicPref = preferences.find((p) => p.preference_type === 'dietary' && p.preference_key === 'organic')
  if (
    organicPref &&
    (product.name.toLowerCase().includes('organic') ||
      product.tags?.some((tag) => tag.toLowerCase().includes('organic')))
  ) {
    badges.push('organic')
    if (!matchReason && organicPref.confidence > 0.5) matchReason = 'Organic, like you prefer'
  }

  // Check for best value
  if (product.bulkDeal && product.bulkDeal.savings > 2) {
    badges.push('best_value')
    if (!matchReason) matchReason = `Save $${product.bulkDeal.savings.toFixed(2)}`
  }

  // Default match reason based on personal score
  if (!matchReason) {
    if (personalScore > 2.0) {
      matchReason = 'Highly recommended for you'
    } else if (personalScore > 1.5) {
      matchReason = 'Recommended for you'
    } else if (personalScore > 1.2) {
      matchReason = 'Similar to what you buy'
    }
  }

  return { badges, matchReason }
}

/**
 * Rank products for a specific category or query
 * Convenience wrapper around rankProducts
 */
export async function rankProductsByCategory(
  products: Product[],
  category: string,
  userId: string,
  userMaturity: UserMaturityScore,
  preferences: UserPreference[],
  purchaseHistory: PurchaseHistory[]
): Promise<RankedProduct[]> {
  // Filter by category
  const categoryProducts = products.filter((p) => p.category === category)

  return rankProducts(categoryProducts, userId, userMaturity, preferences, purchaseHistory)
}
