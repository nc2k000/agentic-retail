/**
 * User Maturity System
 *
 * Calculates user maturity level based on purchase history and preferences.
 * Determines personalization strategy (accuracy vs relevancy weighting).
 */

import { UserMaturityLevel, UserMaturityScore, RecommendationStrategy } from '@/types'

/**
 * Calculate user maturity score
 *
 * Scoring algorithm:
 * - Purchase count: Max 50 points (2 points per order)
 * - Preference count: Max 30 points (3 points per preference)
 * - Avg confidence: Max 15 points (confidence * 15)
 * - Tenure: Max 5 points (days / 3, capped at 5)
 */
export async function calculateUserMaturity(userId: string): Promise<UserMaturityScore> {
  // Dynamic import to avoid pulling in server-only code at module level
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  // Get order count
  const { count: purchaseCount, error: orderError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (orderError) {
    console.error('Error fetching order count:', orderError)
  }

  // Get preferences with confidence
  const { data: preferences, error: prefError } = await supabase
    .from('customer_preferences')
    .select('confidence, created_at')
    .eq('user_id', userId)

  if (prefError) {
    console.error('Error fetching preferences:', prefError)
  }

  const preferenceCount = preferences?.length || 0
  const avgConfidence = preferences && preferences.length > 0
    ? preferences.reduce((sum: number, p: any) => sum + p.confidence, 0) / preferences.length
    : 0

  // Get first order date for tenure calculation
  const { data: firstOrder, error: firstOrderError } = await supabase
    .from('orders')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (firstOrderError && firstOrderError.code !== 'PGRST116') {
    // PGRST116 = no rows returned (ok for new users)
    console.error('Error fetching first order:', firstOrderError)
  }

  const daysSinceFirstPurchase = firstOrder
    ? Math.floor((Date.now() - new Date((firstOrder as any).created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Calculate weighted score
  const purchaseScore = Math.min((purchaseCount || 0) * 2, 50)        // Max 50 points
  const preferenceScore = Math.min(preferenceCount * 3, 30)            // Max 30 points
  const confidenceScore = avgConfidence * 15                           // Max 15 points
  const tenureScore = Math.min(daysSinceFirstPurchase / 3, 5)         // Max 5 points

  const totalScore = purchaseScore + preferenceScore + confidenceScore + tenureScore

  // Determine maturity level
  let level: UserMaturityLevel
  if (totalScore < 10) {
    level = UserMaturityLevel.COLD_START
  } else if (totalScore < 30) {
    level = UserMaturityLevel.ONBOARDING
  } else if (totalScore < 60) {
    level = UserMaturityLevel.EMERGING
  } else if (totalScore < 85) {
    level = UserMaturityLevel.ESTABLISHED
  } else {
    level = UserMaturityLevel.POWER_USER
  }

  console.log('📊 User Maturity Breakdown:', {
    level,
    totalScore: totalScore.toFixed(1),
    breakdown: {
      purchases: `${purchaseCount || 0} orders = ${purchaseScore.toFixed(1)} pts`,
      preferences: `${preferenceCount} prefs = ${preferenceScore.toFixed(1)} pts`,
      confidence: `${(avgConfidence * 100).toFixed(0)}% avg = ${confidenceScore.toFixed(1)} pts`,
      tenure: `${daysSinceFirstPurchase} days = ${tenureScore.toFixed(1)} pts`
    }
  })

  return {
    level,
    score: Math.round(totalScore * 10) / 10, // Round to 1 decimal
    purchase_count: purchaseCount || 0,
    preference_count: preferenceCount,
    avg_confidence: Math.round(avgConfidence * 100) / 100, // Round to 2 decimals
    days_since_first_purchase: daysSinceFirstPurchase,
    calculated_at: new Date().toISOString()
  }
}

/**
 * Cache for maturity scores (1 hour TTL)
 * Prevents repeated database queries
 */
const maturityCache = new Map<string, { score: UserMaturityScore; expires: number }>()

export async function getUserMaturity(userId: string): Promise<UserMaturityScore> {
  // Check cache
  const cached = maturityCache.get(userId)
  if (cached && cached.expires > Date.now()) {
    return cached.score
  }

  // Calculate fresh score
  const score = await calculateUserMaturity(userId)

  // Cache for 1 hour
  maturityCache.set(userId, {
    score,
    expires: Date.now() + (60 * 60 * 1000)
  })

  return score
}

/**
 * Clear maturity cache for a user
 * Call this when user makes a purchase or updates preferences
 */
export function invalidateMaturityCache(userId: string): void {
  maturityCache.delete(userId)
  console.log('🔄 Invalidated maturity cache for user:', userId)
}

/**
 * Get recommendation strategy based on maturity level
 *
 * Cold start users get popular items (high relevancy)
 * Established users get personalized (high accuracy)
 */
export function getRecommendationStrategy(maturity: UserMaturityScore): RecommendationStrategy {
  switch (maturity.level) {
    case UserMaturityLevel.COLD_START:
      return {
        accuracy_weight: 0.2,
        relevancy_weight: 0.8,
        strategy: 'popular',
        ask_frequency: 'high',
        show_confidence: true
      }

    case UserMaturityLevel.ONBOARDING:
      return {
        accuracy_weight: 0.5,
        relevancy_weight: 0.5,
        strategy: 'hybrid',
        ask_frequency: 'medium',
        show_confidence: true
      }

    case UserMaturityLevel.EMERGING:
      return {
        accuracy_weight: 0.7,
        relevancy_weight: 0.3,
        strategy: 'hybrid',
        ask_frequency: 'low',
        show_confidence: false
      }

    case UserMaturityLevel.ESTABLISHED:
      return {
        accuracy_weight: 0.85,
        relevancy_weight: 0.15,
        strategy: 'personalized',
        ask_frequency: 'minimal',
        show_confidence: false
      }

    case UserMaturityLevel.POWER_USER:
      return {
        accuracy_weight: 0.95,
        relevancy_weight: 0.05,
        strategy: 'personalized',
        ask_frequency: 'minimal',
        show_confidence: false
      }
  }
}

/**
 * Get user-friendly description of maturity level
 */
export function getMaturityDescription(level: UserMaturityLevel): string {
  switch (level) {
    case UserMaturityLevel.COLD_START:
      return "New user - We're just getting to know you! Showing popular items while we learn your preferences."

    case UserMaturityLevel.ONBOARDING:
      return "Learning your preferences - We're starting to understand what you like. Keep shopping to get better recommendations!"

    case UserMaturityLevel.EMERGING:
      return "Building your profile - We're seeing patterns in your shopping. Recommendations are getting more personal."

    case UserMaturityLevel.ESTABLISHED:
      return "Personalized experience - We know you well! Recommendations are tailored to your preferences."

    case UserMaturityLevel.POWER_USER:
      return "VIP shopper - We know you inside and out. Recommendations are highly personalized and predictive."
  }
}
