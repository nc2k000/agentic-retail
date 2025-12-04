// Memory System Data Layer
// Functions to interact with customer memory tables

import { createClient } from '@/lib/supabase/client'
import type {
  CustomerPreference,
  ShoppingPattern,
  InteractionHistory,
  MemoryInsight,
  MemoryContext,
  UpsertPreferenceParams,
  UpdatePatternParams,
  RecordInteractionParams,
  FetchMemoryContextParams,
} from '@/types/memory'

/**
 * Upsert a customer preference
 * Creates new preference or updates confidence if exists
 */
export async function upsertPreference(params: UpsertPreferenceParams): Promise<string | null> {
  const supabase = createClient()
  const {
    userId,
    type,
    key,
    confidence = 0.50,
    reason = null,
    source = 'inferred',
    memberId = null,
    memberName = null,
  } = params

  try {
    const { data, error } = await supabase.rpc('upsert_preference', {
      p_user_id: userId,
      p_type: type,
      p_key: key,
      p_confidence: confidence,
      p_reason: reason,
      p_source: source,
      p_member_id: memberId,
      p_member_name: memberName,
    } as any)

    if (error) {
      console.error('Error upserting preference:', error)
      return null
    }

    return data as string
  } catch (error) {
    console.error('Failed to upsert preference:', error)
    return null
  }
}

/**
 * Update a shopping pattern
 * Creates new pattern or increments occurrence count if exists
 */
export async function updatePattern(params: UpdatePatternParams): Promise<string | null> {
  const supabase = createClient()
  const { userId, type, key, value = null, memberId = null, memberName = null } = params

  try {
    const { data, error } = await supabase.rpc('update_pattern', {
      p_user_id: userId,
      p_type: type,
      p_key: key,
      p_value: value,
      p_member_id: memberId,
      p_member_name: memberName,
    } as any)

    if (error) {
      console.error('Error updating pattern:', error)
      return null
    }

    return data as string
  } catch (error) {
    console.error('Failed to update pattern:', error)
    return null
  }
}

/**
 * Record an interaction
 * Logs user interaction for pattern analysis
 */
export async function recordInteraction(params: RecordInteractionParams): Promise<string | null> {
  const supabase = createClient()
  const {
    userId,
    type,
    key = null,
    value = null,
    sessionId = null,
    memberId = null,
    memberName = null,
  } = params

  try {
    const { data, error } = await supabase.rpc('record_interaction', {
      p_user_id: userId,
      p_type: type,
      p_key: key,
      p_value: value,
      p_session_id: sessionId,
      p_member_id: memberId,
      p_member_name: memberName,
    } as any)

    if (error) {
      console.error('Error recording interaction:', error)
      return null
    }

    return data as string
  } catch (error) {
    console.error('Failed to record interaction:', error)
    return null
  }
}

/**
 * Fetch memory context for AI prompt injection
 * Returns high-confidence preferences and insights
 */
export async function fetchMemoryContext(params: FetchMemoryContextParams): Promise<MemoryContext | null> {
  const supabase = createClient()
  const { userId, minConfidence = 0.70 } = params

  try {
    const { data, error } = await supabase.rpc('fetch_memory_context', {
      p_user_id: userId,
      p_min_confidence: minConfidence,
    } as any)

    if (error) {
      console.error('Error fetching memory context:', error)
      return null
    }

    // Transform database response into MemoryContext
    const context: MemoryContext = {}
    const rows = data as any[] | null

    if (rows && Array.isArray(rows)) {
      rows.forEach((row: any) => {
        const category = row.category
        const items = row.items

        if (category === 'insights') {
          context.insights = items
        } else {
          context[category as keyof MemoryContext] = items
        }
      })
    }

    return context
  } catch (error) {
    console.error('Failed to fetch memory context:', error)
    return null
  }
}

/**
 * Get all preferences for a user
 * Useful for memory management UI
 */
export async function getAllPreferences(userId: string): Promise<CustomerPreference[]> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('customer_preferences')
      .select('*')
      .eq('user_id', userId)
      .order('confidence', { ascending: false })
      .order('times_confirmed', { ascending: false })

    if (error) {
      console.error('Error fetching preferences:', error)
      return []
    }

    return data as CustomerPreference[]
  } catch (error) {
    console.error('Failed to fetch preferences:', error)
    return []
  }
}

/**
 * Get all patterns for a user
 * Useful for analytics and debugging
 */
export async function getAllPatterns(userId: string): Promise<ShoppingPattern[]> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('shopping_patterns')
      .select('*')
      .eq('user_id', userId)
      .order('confidence', { ascending: false })
      .order('occurrence_count', { ascending: false })

    if (error) {
      console.error('Error fetching patterns:', error)
      return []
    }

    return data as ShoppingPattern[]
  } catch (error) {
    console.error('Failed to fetch patterns:', error)
    return []
  }
}

/**
 * Get recent interactions for a user
 * Useful for debugging and analytics
 */
export async function getRecentInteractions(
  userId: string,
  limit: number = 50
): Promise<InteractionHistory[]> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('interaction_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching interactions:', error)
      return []
    }

    return data as InteractionHistory[]
  } catch (error) {
    console.error('Failed to fetch interactions:', error)
    return []
  }
}

/**
 * Get all insights for a user
 * Returns unexpired insights only
 */
export async function getAllInsights(userId: string): Promise<MemoryInsight[]> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('memory_insights')
      .select('*')
      .eq('user_id', userId)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
      .order('confidence', { ascending: false })

    if (error) {
      console.error('Error fetching insights:', error)
      return []
    }

    return data as MemoryInsight[]
  } catch (error) {
    console.error('Failed to fetch insights:', error)
    return []
  }
}

/**
 * Delete a specific preference
 * For user privacy controls
 */
export async function deletePreference(preferenceId: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('customer_preferences')
      .delete()
      .eq('id', preferenceId)

    if (error) {
      console.error('Error deleting preference:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to delete preference:', error)
    return false
  }
}

/**
 * Delete all memories for a user
 * For complete privacy reset
 */
export async function deleteAllMemories(userId: string): Promise<boolean> {
  const supabase = createClient()

  try {
    // Delete in order (child tables first due to foreign keys)
    await supabase.from('interaction_history').delete().eq('user_id', userId)
    await supabase.from('memory_insights').delete().eq('user_id', userId)
    await supabase.from('shopping_patterns').delete().eq('user_id', userId)
    await supabase.from('customer_preferences').delete().eq('user_id', userId)

    return true
  } catch (error) {
    console.error('Failed to delete all memories:', error)
    return false
  }
}

/**
 * Helper: Get current time period (morning, afternoon, evening, night)
 */
export function getCurrentTimePeriod(): string {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 22) return 'evening'
  return 'night'
}

/**
 * Helper: Get current day of week
 */
export function getCurrentDayOfWeek(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
}

/**
 * Helper: Categorize basket size
 */
export function getBasketSizeCategory(itemCount: number): string {
  if (itemCount <= 5) return 'small'
  if (itemCount <= 15) return 'medium'
  if (itemCount <= 30) return 'large'
  return 'bulk'
}

/**
 * Helper: Extract dietary restrictions from message
 * Looks for common phrases indicating dietary preferences
 */
export function extractDietaryRestriction(message: string): string | null {
  const lower = message.toLowerCase()

  // Check for common dietary restrictions
  if (lower.includes('vegetarian')) return 'vegetarian'
  if (lower.includes('vegan')) return 'vegan'
  if (lower.includes('gluten free') || lower.includes('gluten-free')) return 'gluten_free'
  if (lower.includes('dairy free') || lower.includes('dairy-free')) return 'dairy_free'
  if (lower.includes('nut free') || lower.includes('nut-free')) return 'nut_free'
  if (lower.includes('keto')) return 'keto'
  if (lower.includes('paleo')) return 'paleo'
  if (lower.includes('halal')) return 'halal'
  if (lower.includes('kosher')) return 'kosher'

  return null
}

/**
 * Helper: Extract allergy information from message
 * Looks for phrases indicating allergies
 */
export function extractAllergy(message: string): string | null {
  const lower = message.toLowerCase()

  if (!lower.includes('allerg')) return null

  // Common allergens
  if (lower.includes('peanut')) return 'peanuts'
  if (lower.includes('tree nut')) return 'tree_nuts'
  if (lower.includes('dairy') || lower.includes('milk') || lower.includes('lactose')) return 'dairy'
  if (lower.includes('egg')) return 'eggs'
  if (lower.includes('soy')) return 'soy'
  if (lower.includes('wheat') || lower.includes('gluten')) return 'wheat'
  if (lower.includes('shellfish')) return 'shellfish' // Check shellfish before fish
  if (lower.includes('fish')) return 'fish'

  return null
}
