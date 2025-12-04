import { FunnelStage, FunnelState, FunnelTransition } from '@/types'
import { recordInteraction } from './memory'

/**
 * Funnel Detection System
 *
 * Tracks customer journey stage and adapts AI behavior accordingly.
 * Stages: arriving → browsing → comparing → decided → checkout
 */

const STORAGE_KEY = 'funnel-state'

/**
 * Get current funnel state from session storage
 */
export function getFunnelState(): FunnelState | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

/**
 * Initialize funnel state for new session
 */
export function initializeFunnel(): FunnelState {
  const initialState: FunnelState = {
    stage: 'arriving',
    enteredAt: new Date().toISOString(),
    actions: [],
    itemsViewed: 0,
    itemsAdded: 0,
    questionsAsked: 0,
  }

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
  }

  return initialState
}

/**
 * Update funnel state
 */
export function updateFunnelState(updates: Partial<FunnelState>): FunnelState {
  const current = getFunnelState() || initializeFunnel()
  const updated = { ...current, ...updates }

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return updated
}

/**
 * Transition to a new funnel stage
 */
export async function transitionFunnelStage(
  newStage: FunnelStage,
  trigger: string,
  userId?: string
): Promise<FunnelTransition> {
  const current = getFunnelState() || initializeFunnel()

  const transition: FunnelTransition = {
    from: current.stage,
    to: newStage,
    trigger,
    timestamp: new Date().toISOString(),
  }

  // Update state
  updateFunnelState({
    stage: newStage,
    enteredAt: new Date().toISOString(),
    actions: [...current.actions, trigger],
  })

  // Record in memory system
  if (userId) {
    await recordInteraction({
      userId,
      type: 'funnel_transition',
      key: `${transition.from}_to_${transition.to}`,
      value: { trigger, timestamp: transition.timestamp },
    })
  }

  return transition
}

/**
 * Detect funnel stage based on user actions
 */
export function detectFunnelStage(
  messageCount: number,
  itemsInCart: number,
  hasAskedQuestions: boolean,
  hasViewedItems: boolean
): FunnelStage {
  // Checkout: has items and ready to complete
  if (itemsInCart > 0 && messageCount > 5) {
    return 'decided'
  }

  // Decided: has items in cart
  if (itemsInCart > 0) {
    return 'decided'
  }

  // Comparing: asking specific questions or viewing multiple items
  if (hasAskedQuestions && hasViewedItems) {
    return 'comparing'
  }

  // Browsing: viewing items but not adding
  if (hasViewedItems || messageCount > 2) {
    return 'browsing'
  }

  // Arriving: just started
  return 'arriving'
}

/**
 * Track user action and update funnel metrics
 */
export async function trackFunnelAction(
  action: 'message' | 'view_item' | 'add_to_cart' | 'question' | 'checkout',
  userId?: string
): Promise<FunnelState> {
  const current = getFunnelState() || initializeFunnel()

  const updates: Partial<FunnelState> = {
    actions: [...current.actions, action],
  }

  // Update metrics based on action
  switch (action) {
    case 'view_item':
      updates.itemsViewed = current.itemsViewed + 1
      break
    case 'add_to_cart':
      updates.itemsAdded = current.itemsAdded + 1
      // Transition to 'decided' stage
      if (current.stage !== 'decided' && current.stage !== 'checkout') {
        await transitionFunnelStage('decided', 'add_to_cart', userId)
      }
      break
    case 'question':
      updates.questionsAsked = current.questionsAsked + 1
      // Transition to 'comparing' if browsing
      if (current.stage === 'browsing') {
        await transitionFunnelStage('comparing', 'asked_question', userId)
      }
      break
    case 'message':
      // Transition from 'arriving' to 'browsing' after first message
      if (current.stage === 'arriving' && current.actions.length > 0) {
        await transitionFunnelStage('browsing', 'first_interaction', userId)
      }
      break
    case 'checkout':
      // Transition to 'checkout' stage
      if (current.stage !== 'checkout') {
        await transitionFunnelStage('checkout', 'checkout_initiated', userId)
      }
      break
  }

  return updateFunnelState(updates)
}

/**
 * Get funnel context for AI prompt
 */
export function getFunnelContext(): string {
  const state = getFunnelState()
  if (!state) return ''

  const stageDescriptions: Record<FunnelStage, string> = {
    arriving: 'User just arrived, be welcoming and helpful',
    browsing: 'User is exploring options, provide inspiration and suggestions',
    comparing: 'User is evaluating choices, provide detailed comparisons and reasoning',
    decided: 'User has items in cart, focus on value and checkout readiness',
    checkout: 'User is checking out, be concise and efficient',
  }

  const verbosityHints: Record<FunnelStage, string> = {
    arriving: 'Use friendly, welcoming tone',
    browsing: 'Be informative but not overwhelming',
    comparing: 'Provide detailed information to help decision-making',
    decided: 'Reinforce value, address concerns, encourage completion',
    checkout: 'Be brief and action-oriented',
  }

  return `
## CUSTOMER JOURNEY STAGE

Current Stage: ${state.stage.toUpperCase()}
- ${stageDescriptions[state.stage]}
- ${verbosityHints[state.stage]}
- Items viewed: ${state.itemsViewed}
- Items added to cart: ${state.itemsAdded}
- Questions asked: ${state.questionsAsked}
- Time in session: ${getSessionDuration(state.enteredAt)}
`.trim()
}

/**
 * Calculate session duration
 */
function getSessionDuration(startedAt: string): string {
  const start = new Date(startedAt)
  const now = new Date()
  const minutes = Math.floor((now.getTime() - start.getTime()) / 1000 / 60)

  if (minutes < 1) return 'just started'
  if (minutes === 1) return '1 minute'
  if (minutes < 60) return `${minutes} minutes`

  const hours = Math.floor(minutes / 60)
  return hours === 1 ? '1 hour' : `${hours} hours`
}

/**
 * Reset funnel state (e.g., after checkout)
 */
export function resetFunnel(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}
