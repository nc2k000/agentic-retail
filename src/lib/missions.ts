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
  precision: 6,      // Single items: 6 hours (fast add to cart, then expand)
  essentials: 24,    // Grocery baskets: 24 hours (more browsing freedom)
  recipe: 168,       // Recipes: 7 days
  event: 168,        // Events: 7 days
  research: 168,     // Research: 7 days
}

/**
 * Detect mission type from user query
 */
export function detectMissionType(
  query: string,
  messageCount: number = 1
): { type: Mission['type']; confidence: number } | null {
  const lowerQuery = query.toLowerCase()

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
  // Includes decision tree categories (Phase 1 + Phase 2)
  // CRITICAL: Check this BEFORE precision to prioritize research items
  if (
    // General research keywords
    lowerQuery.includes('compare') ||
    lowerQuery.includes('best') ||
    // Electronics
    lowerQuery.includes('tv') ||
    lowerQuery.includes('television') ||
    lowerQuery.includes('laptop') ||
    lowerQuery.includes('phone') ||
    // Appliances (tree category)
    lowerQuery.includes('appliance') ||
    lowerQuery.includes('washer') ||
    lowerQuery.includes('dryer') ||
    lowerQuery.includes('dishwasher') ||
    lowerQuery.includes('refrigerator') ||
    lowerQuery.includes('fridge') ||
    // Coffee machines (tree category)
    lowerQuery.includes('coffee machine') ||
    lowerQuery.includes('coffee maker') ||
    lowerQuery.includes('espresso') ||
    // Furniture (tree category)
    lowerQuery.includes('furniture') ||
    lowerQuery.includes('couch') ||
    lowerQuery.includes('sofa') ||
    lowerQuery.includes('desk') ||
    lowerQuery.includes('table') ||
    lowerQuery.includes('mattress') ||
    lowerQuery.includes('bed') ||  // Added standalone 'bed' keyword
    // Home improvement (tree category)
    lowerQuery.includes('paint') ||
    lowerQuery.includes('stain') ||
    // Power tools (tree category)
    lowerQuery.includes('drill') ||
    lowerQuery.includes('saw') ||
    lowerQuery.includes('sander') ||
    lowerQuery.includes('power tool') ||
    lowerQuery.includes('impact driver') ||
    // Beverages (AI tree category - Phase 2)
    lowerQuery.includes('beverage') ||
    lowerQuery.includes('drink')
  ) {
    return { type: 'research', confidence: 0.85 }
  }

  // ESSENTIALS: Meal contexts or multi-item requests (e.g., "breakfast items", "lunch stuff")
  // These are list-building missions, not single-item carousels
  const mealContexts = ['breakfast', 'lunch', 'dinner', 'snack']
  const hasMealContext = mealContexts.some(meal => lowerQuery.includes(meal))
  const hasMultiItemIntent = lowerQuery.includes('items') || lowerQuery.includes('things') || lowerQuery.includes('stuff')

  if (hasMealContext || hasMultiItemIntent) {
    return { type: 'essentials', confidence: 0.85 }
  }

  // ESSENTIALS: Grocery basket/list building (e.g., "weekly groceries", "build a list")
  // More browsing freedom, helpful suggestions
  const hasBasketIntent =
    lowerQuery.includes('groceries') ||
    lowerQuery.includes('list') ||
    lowerQuery.includes('weekly') ||
    lowerQuery.includes('stock') ||  // Matches "stock up", "stocking up"
    lowerQuery.includes('shopping') ||
    messageCount >= 2

  if (hasBasketIntent) {
    return { type: 'essentials', confidence: 0.75 }
  }

  // PRECISION: Single specific item request (e.g., "I need milk", "get me bread")
  // Fast add to cart, then expand to essentials basket
  const hasSingleItemIntent =
    (lowerQuery.includes('need') || lowerQuery.includes('get') || lowerQuery.includes('buy')) &&
    messageCount <= 2

  if (hasSingleItemIntent) {
    return { type: 'precision', confidence: 0.70 }
  }

  return null
}

/**
 * Get active mission for user (most recently active, not paused)
 */
export async function getActiveMission(userId: string): Promise<Mission | null> {
  try {
    const supabase = createClient()

    const { data, error } = await (supabase.from('missions') as any)
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .is('paused_at', null)
      .order('last_active_at', { ascending: false })
      .limit(1)

    if (error || !data || data.length === 0) return null

    return mapDatabaseMissionToType(data[0])
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

    const { data, error } = await (supabase.from('missions') as any)
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

    const { data, error } = await (supabase.rpc as any)('get_missions_for_nudge', { p_user_id: userId })

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

    const { data, error } = await (supabase.from('missions') as any)
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

    if (error) {
      console.error('Error creating mission:', error)
      return null
    }

    if (!data) {
      console.error('No data returned from mission insert')
      return null
    }

    return mapDatabaseMissionToType(data)
  } catch (err) {
    console.error('Exception creating mission:', err)
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

    await (supabase.from('missions') as any)
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
 * Update mission tree ID (for decision tree missions)
 */
export async function updateMissionTreeId(
  missionId: string,
  treeId: string
): Promise<void> {
  try {
    const supabase = createClient()

    await (supabase.from('missions') as any)
      .update({
        tree_id: treeId,
        last_active_at: new Date().toISOString(),
      })
      .eq('id', missionId)
  } catch (error) {
    console.error('Failed to update mission tree ID:', error)
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
    const { data: mission, error: fetchError } = await (supabase.from('missions') as any)
      .select('*')
      .eq('id', missionId)
      .single()

    if (fetchError) {
      console.error('Error fetching mission:', fetchError)
      return
    }

    if (!mission) {
      console.error('Mission not found:', missionId)
      return
    }

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
          updates.funnel_stage = 'decided'
          // Record transition in interaction history
          await recordInteraction({
            userId,
            type: 'funnel_transition',
            key: `mission_${missionId}`,
            value: { trigger: 'add_to_cart', to: 'decided', timestamp: new Date().toISOString() },
          })
        }
        break
      case 'question':
        updates.questions_asked = (mission.questions_asked || 0) + 1
        // Transition to 'comparing' if browsing and multiple questions
        if (mission.funnel_stage === 'browsing' && (mission.questions_asked || 0) >= 2) {
          updates.funnel_stage = 'comparing'
          // Record transition in interaction history
          await recordInteraction({
            userId,
            type: 'funnel_transition',
            key: `mission_${missionId}`,
            value: { trigger: 'asked_question', to: 'comparing', timestamp: new Date().toISOString() },
          })
        }
        break
      case 'message':
        // Transition from 'arriving' to 'browsing' after first message
        if (mission.funnel_stage === 'arriving') {
          updates.funnel_stage = 'browsing'
          // Record transition in interaction history
          await recordInteraction({
            userId,
            type: 'funnel_transition',
            key: `mission_${missionId}`,
            value: { trigger: 'first_interaction', to: 'browsing', timestamp: new Date().toISOString() },
          })
        }
        break
      case 'checkout':
        // Transition to 'checkout' stage
        if (mission.funnel_stage !== 'checkout') {
          updates.funnel_stage = 'checkout'
          // Record transition in interaction history
          await recordInteraction({
            userId,
            type: 'funnel_transition',
            key: `mission_${missionId}`,
            value: { trigger: 'checkout_initiated', to: 'checkout', timestamp: new Date().toISOString() },
          })
        }
        break
    }

    // Apply all updates in single query
    const { error: updateError } = await (supabase.from('missions') as any)
      .update(updates)
      .eq('id', missionId)

    if (updateError) {
      console.error('Error updating mission:', updateError)
    }
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

    await (supabase.from('missions') as any)
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

    await (supabase.from('missions') as any)
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

    await (supabase.from('missions') as any)
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

    await (supabase.from('missions') as any)
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
  const lowerMessage = userMessage.toLowerCase()

  // SPECIAL CASE: Decision tree categories
  const treeCategories = {
    'tv-purchase': ['tv', 'television'],
    'appliance-purchase': ['washer', 'dryer', 'fridge', 'refrigerator', 'dishwasher', 'appliance'],
    'furniture-purchase': ['couch', 'sofa', 'mattress', 'desk', 'table', 'furniture']
  }

  // Check if user message mentions ANY decision tree category
  let mentionedTreeId: string | null = null
  for (const [treeId, keywords] of Object.entries(treeCategories)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      mentionedTreeId = treeId
      break
    }
  }

  // If user mentions a tree category AND current mission has a DIFFERENT treeId (or no treeId), it's a context switch
  if (mentionedTreeId && mentionedTreeId !== currentMission.treeId) {
    console.log('🔄 Decision tree switch detected:', currentMission.treeId || 'none', '→', mentionedTreeId)
    return true
  }

  // First, detect if the new message would create a DIFFERENT mission type
  const newMissionDetection = detectMissionType(userMessage, 1)

  if (newMissionDetection && newMissionDetection.type !== currentMission.type) {
    // Different mission type detected - this is a context switch
    console.log('🔄 Mission type change:', currentMission.type, '→', newMissionDetection.type)
    return true
  }

  // Check for explicit mission type keywords that differ from current
  const explicitSwitches: Record<string, string[]> = {
    precision: ['weekly', 'groceries', 'list', 'stock up', 'party', 'event', 'recipe', 'cook'],
    essentials: ['party', 'event', 'recipe', 'cook', 'best', 'compare'],
    event: ['need', 'groceries', 'list', 'recipe', 'cook'],
    recipe: ['party', 'event', 'groceries', 'list'],
    research: ['party', 'event', 'groceries', 'list', 'recipe', 'cook']
  }

  const switchKeywords = explicitSwitches[currentMission.type] || []
  const hasExplicitSwitch = switchKeywords.some(keyword => lowerMessage.includes(keyword))

  if (hasExplicitSwitch) {
    console.log('🔄 Explicit context switch detected')
    return true
  }

  // Check if message is completely unrelated to current mission query
  const missionKeywords = currentMission.query.toLowerCase().split(' ')
  const hasRelatedKeyword = missionKeywords.some(keyword =>
    keyword.length > 3 && lowerMessage.includes(keyword)
  )

  // If no related keywords and we have an expected action that doesn't match
  if (!hasRelatedKeyword && currentMission.expectedNextAction) {
    const lowerExpected = currentMission.expectedNextAction.toLowerCase()
    if (!lowerMessage.includes(lowerExpected)) {
      console.log('🔄 No related keywords and expectation not met')
      return true
    }
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
  console.log('🔍 findOrCreateMission called:', userMessage, 'messageCount:', messageCount)

  // Try to get active mission first
  const activeMission = await getActiveMission(userId)
  console.log('🔍 Active mission found:', activeMission?.id, 'Type:', activeMission?.type)

  if (activeMission) {
    // CRITICAL: If we're in an active decision tree, check if user is asking for a DIFFERENT tree
    // If same tree category, continue. If different tree category, pause and create new mission.
    if (activeMission.treeId) {
      // Check if user is mentioning a DIFFERENT tree category
      const lowerMessage = userMessage.toLowerCase()
      const treeCategories = {
        'tv-purchase': ['tv', 'television'],
        'appliance-purchase': ['washer', 'dryer', 'fridge', 'refrigerator', 'dishwasher', 'appliance'],
        'furniture-purchase': ['couch', 'sofa', 'desk', 'table', 'furniture'],
        'coffee-machine-purchase': ['coffee machine', 'coffee maker', 'espresso machine', 'espresso maker'],
        'paint-purchase': ['paint', 'stain', 'primer', 'coating'],
        'mattress-purchase': ['mattress', 'bed'],
        'power-tool-purchase': ['drill', 'saw', 'sander', 'power tool', 'power tools', 'impact driver', 'impact wrench']
      }

      // Find if user is mentioning a different tree category
      let mentionedTreeId: string | null = null
      for (const [treeId, keywords] of Object.entries(treeCategories)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
          mentionedTreeId = treeId
          break
        }
      }

      // If user is asking for a DIFFERENT tree, pause current mission
      if (mentionedTreeId && mentionedTreeId !== activeMission.treeId) {
        console.log('🔄 User asked for different tree:', activeMission.treeId, '→', mentionedTreeId)
        console.log('⏸️ Pausing current tree mission:', activeMission.id)
        await pauseMission(activeMission.id)
        // Fall through to create new mission - skip context deviation check
      } else if (mentionedTreeId === activeMission.treeId) {
        // Same tree - but check if this active mission has products
        // If not, look for a paused mission with products
        const hasProducts = activeMission.recommendedProducts && activeMission.recommendedProducts.length > 0
        if (!hasProducts && activeMission.treeCompleted) {
          console.log('⚠️ Active tree mission has no products - checking for paused mission with products')
          const supabase = createClient()
          const { data: user } = await supabase.auth.getUser()
          if (user.user) {
            const { data: pausedMissions } = await (supabase.from('missions') as any)
              .select('*')
              .eq('user_id', user.user.id)
              .eq('status', 'active')
              .eq('tree_id', activeMission.treeId)
              .not('paused_at', 'is', null)
              .not('id', 'eq', activeMission.id) // Exclude current mission

            if (pausedMissions && pausedMissions.length > 0) {
              const missionWithProducts = pausedMissions.find((m: any) =>
                m.recommended_products && Array.isArray(m.recommended_products) && m.recommended_products.length > 0
              )
              if (missionWithProducts) {
                console.log('✅ Found better paused mission with products - switching to it')
                await pauseMission(activeMission.id)
                const betterMission = mapDatabaseMissionToType(missionWithProducts)
                await resumeMission(betterMission.id)
                return betterMission
              }
            }
          }
        }
        // Same tree category - continue current mission
        console.log('✅ Active tree mission - continuing:', activeMission.treeId)
        return activeMission
      } else {
        // No tree detected in message - check if user is switching to a different mission type
        const isDeviation = detectContextDeviation(activeMission, userMessage)
        console.log('🔍 Context deviation from tree mission?', isDeviation)

        if (isDeviation) {
          console.log('⏸️ Pausing tree mission due to context switch:', activeMission.id)
          await pauseMission(activeMission.id)
          // Fall through to create new mission
        } else {
          // Continue current mission
          console.log('✅ Active tree mission - continuing:', activeMission.treeId)
          return activeMission
        }
      }
    } else {
      // Not a tree mission - check for context deviation
      // Check for context deviation
      const isDeviation = detectContextDeviation(activeMission, userMessage)
      console.log('🔍 Context deviation detected?', isDeviation)

      if (isDeviation) {
        // User is switching context - pause current mission
        console.log('⏸️ Pausing mission:', activeMission.id)
        await pauseMission(activeMission.id)
        // Fall through to create new mission
      } else {
        // Continue with current mission
        console.log('✅ Continuing with mission:', activeMission.id)
        return activeMission
      }
    }
  }

  // Check for paused missions matching the requested tree type
  const lowerMessage = userMessage.toLowerCase()
  const treeCategories = {
    'tv-purchase': ['tv', 'television'],
    'appliance-purchase': ['washer', 'dryer', 'fridge', 'refrigerator', 'dishwasher', 'appliance'],
    'furniture-purchase': ['couch', 'sofa', 'desk', 'table', 'furniture'],
    'coffee-machine-purchase': ['coffee machine', 'coffee maker', 'espresso machine', 'espresso maker', 'coffee'],
    'paint-purchase': ['paint', 'stain', 'primer', 'coating'],
    'mattress-purchase': ['mattress', 'bed'],
    'power-tool-purchase': ['drill', 'saw', 'sander', 'power tool', 'power tools', 'impact driver', 'impact wrench']
  }

  let requestedTreeId: string | null = null
  for (const [treeId, keywords] of Object.entries(treeCategories)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      requestedTreeId = treeId
      break
    }
  }

  // If user is requesting a tree, check for paused missions with that tree
  if (requestedTreeId) {
    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()
    if (user.user) {
      const { data: pausedMissions } = await (supabase.from('missions') as any)
        .select('*')
        .eq('user_id', user.user.id)
        .eq('status', 'active')
        .eq('tree_id', requestedTreeId)
        .not('paused_at', 'is', null)
        .order('paused_at', { ascending: false })

      if (pausedMissions && pausedMissions.length > 0) {
        // Prefer missions with cached products
        const missionWithProducts = pausedMissions.find((m: any) =>
          m.recommended_products && Array.isArray(m.recommended_products) && m.recommended_products.length > 0
        )
        const missionToResume = missionWithProducts || pausedMissions[0]
        const pausedMission = mapDatabaseMissionToType(missionToResume)

        console.log('▶️ Found paused mission for requested tree - resuming:', pausedMission.id,
          'Products:', pausedMission.recommendedProducts?.length || 0)
        await resumeMission(pausedMission.id)
        return pausedMission
      }
    }
  }

  // Detect if this is a new mission (after 1-2 turns)
  if (messageCount >= 1) {
    const detection = detectMissionType(userMessage, messageCount)
    console.log('🔍 Mission detection:', detection)

    if (detection) {
      // Detect if this is a decision tree query (reuse treeCategories from above)
      const treeCategories = {
        'tv-purchase': ['tv', 'television'],
        'appliance-purchase': ['washer', 'dryer', 'fridge', 'refrigerator', 'dishwasher', 'appliance'],
        'furniture-purchase': ['couch', 'sofa', 'desk', 'table', 'furniture'],
        'coffee-machine-purchase': ['coffee machine', 'coffee maker', 'espresso machine', 'espresso maker'],
        'paint-purchase': ['paint', 'stain', 'primer', 'coating'],
        'mattress-purchase': ['mattress', 'bed'],
        'power-tool-purchase': ['drill', 'saw', 'sander', 'power tool', 'power tools', 'impact driver', 'impact wrench']
      }

      let detectedTreeId: string | null = null
      for (const [treeId, keywords] of Object.entries(treeCategories)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
          detectedTreeId = treeId
          break
        }
      }

      // Create new mission
      console.log('🆕 Creating new mission type:', detection.type, 'treeId:', detectedTreeId)
      const mission = await createMission(userId, userMessage, detection.type, detection.confidence)

      // If we detected a tree ID, update the mission with it
      if (mission && detectedTreeId) {
        console.log('🌲 Updating mission with treeId:', detectedTreeId)
        await updateMissionTreeId(mission.id, detectedTreeId)
        mission.treeId = detectedTreeId // Update the local object too
      }

      return mission
    }
  }

  console.log('❌ No mission created')
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

  // Mission completion strategies by type
  const completionStrategies: Record<Mission['type'], string> = {
    precision: '🎯 QUICK ADD → EXPAND BASKET - (1) Show CAROUSEL of top 3-5 options, (2) Add to cart ASAP, (3) Ask: "Anything else?"',
    essentials: '🛒 BUILD SHOPPING LIST - Use LIST format (NOT carousels). Add multiple items across categories. Help build complete grocery list with variety.',
    recipe: '🍳 COMPLETE INGREDIENTS - Use LIST format. Ensure all recipe ingredients are covered, suggest missing items',
    event: '🎉 CATEGORY COVERAGE - Use LIST format. Check all event categories (food, decorations, tableware, etc.), suggest gaps',
    research: '🔍 CONFIDENT DECISION - Show CAROUSEL for comparisons. Provide details to help them decide.',
  }

  const hoursActive = mission.lastActiveAt
    ? Math.floor((new Date().getTime() - new Date(mission.lastActiveAt).getTime()) / 1000 / 60 / 60)
    : 0

  const isPaused = mission.pausedAt !== null && mission.pausedAt !== undefined

  // Calculate time remaining before abandonment
  const hoursUntilAbandon = mission.abandonThresholdHours - hoursActive
  const isNearAbandonment = hoursUntilAbandon <= (mission.abandonThresholdHours * 0.25) // 25% of threshold

  // Detect if mission is stuck (lots of questions, few items added)
  const isStuck = mission.questionsAsked >= 3 && mission.itemsAdded === 0 && mission.funnelStage === 'browsing'

  const timeWindowDisplay = mission.type === 'precision' ? '6hr' : mission.type === 'essentials' ? '24hr' : '7-day'

  // Decision tree resumption info
  const hasTreeData = mission.treeId && mission.treeAnswers && Object.keys(mission.treeAnswers).length > 0
  let treeResumptionSection = ''

  if (hasTreeData) {
    const answers = Object.entries(mission.treeAnswers!)
      .map(([q, a]) => `  - ${q}: ${a}`)
      .join('\n')

    const hasSavedProducts = mission.recommendedProducts && mission.recommendedProducts.length > 0
    const savedProductsNote = hasSavedProducts
      ? `\n**Saved Product SKUs:** ${mission.recommendedProducts!.join(', ')}\n**CRITICAL:** These are the EXACT products you showed last time. You MUST render a carousel block with ONLY these SKUs (do not run rank_products or any other search!).`
      : '\n**No saved products yet** - Will need to run rank_products on resume.'

    console.log('🌲 Tree resumption context detected:', {
      treeId: mission.treeId,
      completed: mission.treeCompleted,
      answerCount: Object.keys(mission.treeAnswers!).length,
      savedProducts: mission.recommendedProducts?.length || 0,
      productSkus: mission.recommendedProducts
    })

    treeResumptionSection = `
# ⚠️ CRITICAL: PREVIOUS DECISION TREE DETECTED

The user has ALREADY completed a decision tree for this exact product category.

**Tree ID:** ${mission.treeId}
**Completed:** ${mission.treeCompleted ? 'YES - ALL ANSWERS COLLECTED' : 'NO (in progress)'}
**User's Previous Answers:**
${answers}
${savedProductsNote}

## 🚨 CRITICAL INSTRUCTIONS - READ BEFORE RESPONDING 🚨

${hasSavedProducts ? `
YOU MUST FOLLOW THESE EXACT STEPS. DO NOT DEVIATE.

**WHAT HAPPENED:** The user completed a decision tree and saw products. They came back and said "${mission.treeId?.replace('-', ' ').replace('purchase', '')}".

**WHAT YOU MUST DO RIGHT NOW:**

Write this EXACT response (replace SKUs with the list above):

---
I see you already searched for ${mission.treeId?.replace('-', ' ').replace('purchase', '')}s. Here are your recommendations again:

\`\`\`carousel
{"skus": ${JSON.stringify(mission.recommendedProducts)}, "title": "Your ${mission.treeId?.replace('-', ' ').replace('purchase', '')} recommendations"}
\`\`\`

Would you like to refine these results or start a fresh search?
---

**DO NOT:**
- Call rank_products (the SKUs are already saved above!)
- Call get_restock_suggestions (this is a durable good purchase, not groceries!)
- Generate a \`\`\`running-out\`\`\` block (NO restock suggestions for durable goods!)
- Ask them what they want first
- Describe the products in text
- Create a tree block
- Do ANYTHING other than the exact response above

**IF YOU CALL rank_products OR ANY OTHER TOOL, YOU WILL SHOW DIFFERENT PRODUCTS AND BREAK THE EXPERIENCE.**
` : `
**NO SAVED PRODUCTS - NEED TO SEARCH**

1. Acknowledge: "I see you searched for ${mission.treeId?.replace('-', ' ').replace('purchase', '')}s before"
2. Offer: "Would you like me to show products based on your previous answers, or start fresh?"
3. If continue: call rank_products with their filters
4. If fresh: show tree block
`}

This is MANDATORY. The user will be frustrated if you don't follow these instructions exactly.
`
  } else {
    console.log('❌ No tree resumption context:', {
      treeId: mission.treeId,
      hasAnswers: !!mission.treeAnswers,
      answerCount: mission.treeAnswers ? Object.keys(mission.treeAnswers).length : 0
    })
  }

  return `
${treeResumptionSection ? treeResumptionSection + '\n' : ''}
## ACTIVE SHOPPING MISSION

**Mission:** ${mission.query}
**Type:** ${mission.type} (${timeWindowDisplay} window)
**Status:** ${isPaused ? 'PAUSED (can resume)' : 'ACTIVE'}
${mission.treeId ? `**Tree ID:** ${mission.treeId}` : ''}

### Funnel Stage: ${mission.funnelStage.toUpperCase()}
- ${stageDescriptions[mission.funnelStage]}
- ${verbosityHints[mission.funnelStage]}

### Mission Progress:
- Items viewed: ${mission.itemsViewed}
- Items added to cart: ${mission.itemsAdded}
- Questions asked: ${mission.questionsAsked}
- Last active: ${hoursActive < 1 ? 'just now' : hoursActive === 1 ? '1 hour ago' : `${hoursActive} hours ago`}
${isNearAbandonment ? `- ⚠️ **URGENCY**: Only ${hoursUntilAbandon} hours until mission abandons!\n` : ''}

### MISSION COMPLETION STRATEGY:
${completionStrategies[mission.type]}

${isPaused ? '\n**Note:** This mission was paused (context switch). Welcome them back and help them continue where they left off.\n' : ''}

${isStuck ? '\n**⚠️ STUCK SIGNAL DETECTED**: User has asked many questions but added nothing to cart. Proactively suggest specific items to help them move forward.\n' : ''}

**Your Goal:** Help complete this mission by guiding them to ${mission.funnelStage === 'checkout' ? 'complete checkout' : mission.funnelStage === 'decided' ? 'proceed to checkout' : mission.funnelStage === 'comparing' ? 'make a decision' : mission.funnelStage === 'browsing' ? 'find suitable items' : 'understand their needs'}

**Expected Next Action:** ${mission.expectedNextAction || 'Not set - infer from context and guide them forward'}
`.trim()
}

/**
 * Map database mission to TypeScript type
 */
function mapDatabaseMissionToType(data: any): Mission {
  console.log('🗺️ Mapping database mission:', {
    id: data.id,
    tree_id: data.tree_id,
    recommended_products_raw: data.recommended_products,
    recommended_products_type: typeof data.recommended_products,
    recommended_products_length: data.recommended_products?.length
  })

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
    items: data.items || [], // JSONB is already parsed by Supabase
    treeId: data.tree_id,
    treeAnswers: data.tree_answers || {},
    treeFilters: data.tree_filters || {},
    treeCompleted: data.tree_completed || false,
    recommendedProducts: data.recommended_products || [],
  }
}
