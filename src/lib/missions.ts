import { Mission, FunnelStage, CartItem } from '@/types'
import { createClient } from './supabase/client'
import { recordInteraction } from './memory'

/**
 * Mission-Based Funnel System
 *
 * Tracks customer shopping missions with persistent funnel states.
 * Missions can be paused, resumed, and abandoned based on context and time.
 *
 * Architecture:
 * - Missions ARE funnels (one-to-one relationship)
 * - Auto-detected after 1-2 conversational turns
 * - Persist across sessions in database
 * - Context-aware pausing/resuming
 * - Time-based abandonment by mission type
 */

// Abandon thresholds by mission type (in hours)
const ABANDON_THRESHOLDS: Record<string, number> = {
  essentials: 12,    // Quick grabs: 12 hours
  recipe: 168,       // Recipes: 7 days
  event: 168,        // Events: 7 days
  research: 168,     // Research: 7 days
  precision: 168,    // Precision: 7 days
}

/**
 * Detect mission type from user query
 */
export function detectMissionType(
  query: string,
  messageCount: number = 1
): { type: Mission['type']; confidence: number } | null {
  const lowerQuery = query.toLowerCase()

  // Single item requests → essentials
  if (
    (lowerQuery.includes('need') || lowerQuery.includes('get') || lowerQuery.includes('buy')) &&
    messageCount <= 2
  ) {
    return { type: 'essentials', confidence: 0.85 }
  }

  // Recipe keywords → recipe
  if (
    lowerQuery.includes('recipe') ||
    lowerQuery.includes('cook') ||
    lowerQuery.includes('make') ||
    lowerQuery.includes('ingredients')
  ) {
    return { type: 'recipe', confidence: 0.90 }
  }

  // Event keywords → event
  if (
    lowerQuery.includes('party') ||
    lowerQuery.includes('event') ||
    lowerQuery.includes('celebration') ||
    lowerQuery.includes('gathering') ||
    lowerQuery.includes('birthday') ||
    lowerQuery.includes('wedding')
  ) {
    return { type: 'event', confidence: 0.90 }
  }

  // High-consideration items → research
  if (
    lowerQuery.includes('tv') ||
    lowerQuery.includes('laptop') ||
    lowerQuery.includes('phone') ||
    lowerQuery.includes('appliance') ||
    lowerQuery.includes('compare') ||
    lowerQuery.includes('best')
  ) {
    return { type: 'research', confidence: 0.85 }
  }

  // Multiple items or list → essentials (default)
  if (messageCount >= 2) {
    return { type: 'essentials', confidence: 0.70 }
  }

  return null
}

/**
 * Get active mission for user (most recently active, not paused)
 */
export async function getActiveMission(userId: string): Promise<Mission | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .is('paused_at', null)
      .order('last_active_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return null

    return mapDatabaseMissionToType(data)
  } catch {
    return null
  }
}

/**
 * Get all active missions (including paused) for user
 */
export async function getAllActiveMissions(userId: string): Promise<Mission[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('last_active_at', { ascending: false })

    if (error || !data) return []

    return data.map(mapDatabaseMissionToType)
  } catch {
    return []
  }
}

/**
 * Get paused missions that should be nudged
 */
export async function getMissionsForNudge(userId: string): Promise<Mission[]> {
  try {
    const supabase = createClient()

    // @ts-expect-error - Supabase type inference doesn't handle custom RPC functions well
    const { data, error } = await supabase
      .rpc('get_missions_for_nudge', { p_user_id: userId })

    if (error || !data) return []

    return data
      .filter((m: any) => m.should_nudge)
      .map(mapDatabaseMissionToType)
  } catch {
    return []
  }
}

/**
 * Create new mission
 */
export async function createMission(
  userId: string,
  query: string,
  type: Mission['type'],
  confidence: number = 0.80
): Promise<Mission | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('missions')
      .insert({
        user_id: userId,
        query,
        type,
        status: 'active',
        funnel_stage: 'arriving',
        items_viewed: 0,
        items_added: 0,
        questions_asked: 0,
        abandon_threshold_hours: ABANDON_THRESHOLDS[type] || 72,
        detection_confidence: confidence,
        last_active_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error || !data) return null

    return mapDatabaseMissionToType(data)
  } catch {
    return null
  }
}

/**
 * Update mission funnel stage
 */
export async function updateMissionFunnelStage(
  missionId: string,
  newStage: FunnelStage,
  trigger: string,
  userId: string
): Promise<void> {
  try {
    const supabase = createClient()

    await supabase
      .from('missions')
      .update({
        funnel_stage: newStage,
        last_active_at: new Date().toISOString(),
      })
      .eq('id', missionId)

    // Record transition in interaction history
    await recordInteraction({
      userId,
      type: 'funnel_transition',
      key: `mission_${missionId}`,
      value: { trigger, to: newStage, timestamp: new Date().toISOString() },
    })
  } catch (error) {
    console.error('Failed to update mission funnel stage:', error)
  }
}

/**
 * Track action on mission
 */
export async function trackMissionAction(
  missionId: string,
  action: 'message' | 'view_item' | 'add_to_cart' | 'question' | 'checkout',
  userId: string
): Promise<void> {
  try {
    const supabase = createClient()

    // Get current mission state
    const { data: mission } = await supabase
      .from('missions')
      .select('*')
      .eq('id', missionId)
      .single()

    if (!mission) return

    // Update metrics based on action
    const updates: any = {
      last_active_at: new Date().toISOString(),
    }

    switch (action) {
      case 'view_item':
        updates.items_viewed = (mission.items_viewed || 0) + 1
        break
      case 'add_to_cart':
        updates.items_added = (mission.items_added || 0) + 1
        // Transition to 'decided' stage
        if (mission.funnel_stage !== 'decided' && mission.funnel_stage !== 'checkout') {
          await updateMissionFunnelStage(missionId, 'decided', 'add_to_cart', userId)
        }
        break
      case 'question':
        updates.questions_asked = (mission.questions_asked || 0) + 1
        // Transition to 'comparing' if browsing
        if (mission.funnel_stage === 'browsing') {
          await updateMissionFunnelStage(missionId, 'comparing', 'asked_question', userId)
        }
        break
      case 'message':
        // Transition from 'arriving' to 'browsing' after first message
        if (mission.funnel_stage === 'arriving') {
          await updateMissionFunnelStage(missionId, 'browsing', 'first_interaction', userId)
        }
        break
      case 'checkout':
        // Transition to 'checkout' stage
        if (mission.funnel_stage !== 'checkout') {
          await updateMissionFunnelStage(missionId, 'checkout', 'checkout_initiated', userId)
        }
        break
    }

    await supabase
      .from('missions')
      .update(updates)
      .eq('id', missionId)
  } catch (error) {
    console.error('Failed to track mission action:', error)
  }
}

/**
 * Pause mission (context switch detected)
 */
export async function pauseMission(missionId: string): Promise<void> {
  try {
    const supabase = createClient()

    await supabase
      .from('missions')
      .update({
        paused_at: new Date().toISOString(),
      })
      .eq('id', missionId)
  } catch (error) {
    console.error('Failed to pause mission:', error)
  }
}

/**
 * Resume mission (unpause)
 */
export async function resumeMission(missionId: string): Promise<void> {
  try {
    const supabase = createClient()

    await supabase
      .from('missions')
      .update({
        paused_at: null,
        last_active_at: new Date().toISOString(),
      })
      .eq('id', missionId)
  } catch (error) {
    console.error('Failed to resume mission:', error)
  }
}

/**
 * Complete mission
 */
export async function completeMission(missionId: string): Promise<void> {
  try {
    const supabase = createClient()

    await supabase
      .from('missions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', missionId)
  } catch (error) {
    console.error('Failed to complete mission:', error)
  }
}

/**
 * Abandon mission
 */
export async function abandonMission(missionId: string): Promise<void> {
  try {
    const supabase = createClient()

    await supabase
      .from('missions')
      .update({
        status: 'abandoned',
        abandoned_at: new Date().toISOString(),
      })
      .eq('id', missionId)
  } catch (error) {
    console.error('Failed to abandon mission:', error)
  }
}

/**
 * Detect context deviation (user switching missions)
 */
export function detectContextDeviation(
  currentMission: Mission,
  userMessage: string
): boolean {
  if (!currentMission.expectedNextAction) {
    // No expectation set, can't detect deviation
    return false
  }

  const lowerMessage = userMessage.toLowerCase()
  const lowerExpected = currentMission.expectedNextAction.toLowerCase()

  // Check if message is completely unrelated to current mission
  const missionKeywords = currentMission.query.toLowerCase().split(' ')
  const hasRelatedKeyword = missionKeywords.some(keyword =>
    keyword.length > 3 && lowerMessage.includes(keyword)
  )

  // If no related keywords and doesn't match expected action → deviation
  if (!hasRelatedKeyword && !lowerMessage.includes(lowerExpected)) {
    return true
  }

  return false
}

/**
 * Find or create mission for current conversation
 */
export async function findOrCreateMission(
  userId: string,
  userMessage: string,
  messageCount: number
): Promise<Mission | null> {
  // Try to get active mission first
  const activeMission = await getActiveMission(userId)

  if (activeMission) {
    // Check for context deviation
    if (detectContextDeviation(activeMission, userMessage)) {
      // User is switching context - pause current mission
      await pauseMission(activeMission.id)
      // Fall through to create new mission
    } else {
      // Continue with current mission
      return activeMission
    }
  }

  // Detect if this is a new mission (after 1-2 turns)
  if (messageCount >= 1) {
    const detection = detectMissionType(userMessage, messageCount)

    if (detection) {
      // Create new mission
      return await createMission(userId, userMessage, detection.type, detection.confidence)
    }
  }

  return null
}

/**
 * Get funnel context for AI prompt (mission-aware)
 */
export function getMissionFunnelContext(mission: Mission | null): string {
  if (!mission) return ''

  const stageDescriptions: Record<FunnelStage, string> = {
    arriving: 'Just started this mission, be welcoming and understand their goal',
    browsing: 'Exploring options for this mission, provide inspiration and suggestions',
    comparing: 'Evaluating choices, provide detailed comparisons and reasoning',
    decided: 'Has items in cart for this mission, focus on value and readiness',
    checkout: 'Completing this mission, be concise and efficient',
  }

  const verbosityHints: Record<FunnelStage, string> = {
    arriving: 'Use friendly, welcoming tone to understand their goal',
    browsing: 'Be informative but not overwhelming',
    comparing: 'Provide detailed information to help decision-making',
    decided: 'Reinforce value, address concerns, encourage completion',
    checkout: 'Be brief and action-oriented',
  }

  const hoursActive = mission.lastActiveAt
    ? Math.floor((new Date().getTime() - new Date(mission.lastActiveAt).getTime()) / 1000 / 60 / 60)
    : 0

  const isPaused = mission.pausedAt !== null && mission.pausedAt !== undefined

  return `
## ACTIVE SHOPPING MISSION

**Mission:** ${mission.query}
**Type:** ${mission.type} (${mission.type === 'essentials' ? '12hr' : '7-day'} window)
**Status:** ${isPaused ? 'PAUSED (can resume)' : 'ACTIVE'}

### Funnel Stage: ${mission.funnelStage.toUpperCase()}
- ${stageDescriptions[mission.funnelStage]}
- ${verbosityHints[mission.funnelStage]}

### Mission Progress:
- Items viewed: ${mission.itemsViewed}
- Items added to cart: ${mission.itemsAdded}
- Questions asked: ${mission.questionsAsked}
- Last active: ${hoursActive < 1 ? 'just now' : hoursActive === 1 ? '1 hour ago' : `${hoursActive} hours ago`}

${isPaused ? '\n**Note:** This mission was paused (context switch). User may be resuming it now.\n' : ''}

**Expected Next Action:** ${mission.expectedNextAction || 'Not set - infer from context'}
`.trim()
}

/**
 * Map database mission to TypeScript type
 */
function mapDatabaseMissionToType(data: any): Mission {
  return {
    id: data.id,
    userId: data.user_id,
    query: data.query,
    type: data.type,
    status: data.status,
    startedAt: data.started_at,
    completedAt: data.completed_at,
    funnelStage: data.funnel_stage || 'arriving',
    itemsViewed: data.items_viewed || 0,
    itemsAdded: data.items_added || 0,
    questionsAsked: data.questions_asked || 0,
    expectedNextAction: data.expected_next_action,
    lastActiveAt: data.last_active_at,
    pausedAt: data.paused_at,
    abandonedAt: data.abandoned_at,
    abandonThresholdHours: data.abandon_threshold_hours || 72,
    detectedAt: data.detected_at || data.started_at,
    detectionConfidence: data.detection_confidence || 0.80,
    items: data.items ? JSON.parse(data.items) : [],
  }
}
