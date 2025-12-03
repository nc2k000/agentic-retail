// Memory System Types
// TypeScript definitions for customer memory data structures

export type PreferenceType = 'dietary' | 'brand' | 'favorite' | 'dislike' | 'allergy'
export type PreferenceSource = 'explicit' | 'inferred' | 'pattern'

export interface CustomerPreference {
  id: string
  user_id: string
  preference_type: PreferenceType
  preference_key: string
  preference_value?: string
  confidence: number
  reason?: string
  source: PreferenceSource
  created_at: string
  updated_at: string
  last_confirmed_at?: string
  times_confirmed: number
}

export type PatternType = 'time_of_day' | 'day_of_week' | 'frequency' | 'basket_size' | 'category_preference'

export interface ShoppingPattern {
  id: string
  user_id: string
  pattern_type: PatternType
  pattern_key?: string
  pattern_value?: Record<string, any>
  confidence: number
  occurrence_count: number
  last_occurrence: string
  created_at: string
  updated_at: string
}

export type InteractionType = 'question' | 'search' | 'view_item' | 'swap' | 'reject_swap' | 'voice_used' | 'feature_used'

export interface InteractionHistory {
  id: string
  user_id: string
  interaction_type: InteractionType
  interaction_key?: string
  interaction_value?: Record<string, any>
  session_id?: string
  message_id?: string
  created_at: string
}

export type InsightType = 'persona' | 'goal' | 'context' | 'constraint'

export interface MemoryInsight {
  id: string
  user_id: string
  insight_type: InsightType
  insight_key: string
  insight_value: string
  confidence: number
  supporting_data?: Record<string, any>
  created_at: string
  updated_at: string
  expires_at?: string
}

// Memory context for AI prompt injection
export interface MemoryContext {
  dietary?: Array<{
    key: string
    confidence: number
    reason?: string
    times_confirmed: number
  }>
  brand?: Array<{
    key: string
    confidence: number
    reason?: string
    times_confirmed: number
  }>
  favorite?: Array<{
    key: string
    confidence: number
    reason?: string
    times_confirmed: number
  }>
  dislike?: Array<{
    key: string
    confidence: number
    reason?: string
    times_confirmed: number
  }>
  allergy?: Array<{
    key: string
    confidence: number
    reason?: string
    times_confirmed: number
  }>
  insights?: Array<{
    type: InsightType
    key: string
    value: string
    confidence: number
  }>
}

// Function parameter types
export interface UpsertPreferenceParams {
  userId: string
  type: PreferenceType
  key: string
  confidence?: number
  reason?: string
  source?: PreferenceSource
}

export interface UpdatePatternParams {
  userId: string
  type: PatternType
  key: string
  value?: Record<string, any>
}

export interface RecordInteractionParams {
  userId: string
  type: InteractionType
  key?: string
  value?: Record<string, any>
  sessionId?: string
}

export interface FetchMemoryContextParams {
  userId: string
  minConfidence?: number
}
