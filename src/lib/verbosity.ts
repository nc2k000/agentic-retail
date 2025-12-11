import { VerbosityLevel, CommunicationPreference } from '@/types'
import { upsertPreference } from './memory'

/**
 * Verbosity Control System
 *
 * Adapts AI response length based on user preference and behavior.
 * Levels: concise (1-2 sentences) | balanced (default) | detailed (full explanations)
 */

const STORAGE_KEY = 'verbosity-preference'

/**
 * Get current verbosity preference from session storage
 */
export function getVerbosityPreference(): CommunicationPreference | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

/**
 * Initialize verbosity preference (default to balanced)
 */
export function initializeVerbosity(): CommunicationPreference {
  const initialPreference: CommunicationPreference = {
    verbosity: 'balanced',
    confidence: 0.5,
    learnedFrom: 'behavior',
    updatedAt: new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initialPreference))
  }

  return initialPreference
}

/**
 * Update verbosity preference
 */
export function updateVerbosityPreference(
  verbosity: VerbosityLevel,
  confidence: number,
  learnedFrom: 'explicit' | 'behavior'
): CommunicationPreference {
  const preference: CommunicationPreference = {
    verbosity,
    confidence,
    learnedFrom,
    updatedAt: new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(preference))
  }

  return preference
}

/**
 * Infer verbosity preference from user behavior
 */
export async function inferVerbosityFromBehavior(
  userId: string,
  behaviorSignals: {
    quickAdds: number // Direct "add milk" commands
    questions: number // Questions asked
    exploreMessages: number // Long exploratory messages
    totalMessages: number
  }
): Promise<VerbosityLevel> {
  const { quickAdds, questions, exploreMessages, totalMessages } = behaviorSignals

  if (totalMessages < 3) {
    // Not enough data, use balanced
    return 'balanced'
  }

  const quickAddRatio = quickAdds / totalMessages
  const questionRatio = questions / totalMessages
  const exploreRatio = exploreMessages / totalMessages

  // Concise: High ratio of quick adds, low questions
  if (quickAddRatio > 0.6 && questionRatio < 0.2) {
    const confidence = Math.min(0.85, 0.5 + quickAddRatio * 0.5)
    updateVerbosityPreference('concise', confidence, 'behavior')

    // Note: Skipping database storage - verbosity is localStorage only for now
    // TODO: Add 'communication_style' to allowed preference_type values in DB
    // await upsertPreference({
    //   userId,
    //   type: 'communication_style',
    //   key: 'concise',
    //   confidence,
    //   reason: `Quick, direct interactions (${quickAdds}/${totalMessages} quick adds)`,
    //   source: 'pattern',
    // })

    return 'concise'
  }

  // Detailed: High ratio of questions and exploration
  if (questionRatio > 0.4 || exploreRatio > 0.5) {
    const confidence = Math.min(0.85, 0.5 + questionRatio * 0.5)
    updateVerbosityPreference('detailed', confidence, 'behavior')

    // Note: Skipping database storage - verbosity is localStorage only for now
    // TODO: Add 'communication_style' to allowed preference_type values in DB
    // await upsertPreference({
    //   userId,
    //   type: 'communication_style',
    //   key: 'detailed',
    //   confidence,
    //   reason: `Asks many questions, explores options (${questions}/${totalMessages} questions)`,
    //   source: 'pattern',
    // })

    return 'detailed'
  }

  // Balanced: Mixed behavior (default)
  updateVerbosityPreference('balanced', 0.6, 'behavior')

  // Note: Skipping database storage - verbosity is localStorage only for now
  // TODO: Add 'communication_style' to allowed preference_type values in DB
  // await upsertPreference({
  //   userId,
  //   type: 'communication_style',
  //   key: 'balanced',
  //   confidence: 0.6,
  //   reason: 'Mixed interaction style',
  //   source: 'pattern',
  // })

  return 'balanced'
}

/**
 * Set explicit verbosity preference (user choice)
 */
export async function setExplicitVerbosity(
  userId: string,
  verbosity: VerbosityLevel
): Promise<void> {
  updateVerbosityPreference(verbosity, 1.0, 'explicit')

  // Note: Skipping database storage - verbosity is localStorage only for now
  // TODO: Add 'communication_style' to allowed preference_type values in DB
  // await upsertPreference({
  //   userId,
  //   type: 'communication_style',
  //   key: verbosity,
  //   confidence: 1.0,
  //   reason: 'User explicitly selected this preference',
  //   source: 'explicit',
  // })
}

/**
 * Get verbosity context for AI prompt
 */
export function getVerbosityContext(): string {
  const preference = getVerbosityPreference()
  if (!preference) return ''

  const verbosityDescriptions: Record<VerbosityLevel, string> = {
    concise: 'CONCISE mode - Keep responses brief (1-2 sentences). Focus on action, minimal explanation.',
    balanced: 'BALANCED mode - Provide helpful context without overwhelming detail.',
    detailed:
      'DETAILED mode - Provide comprehensive explanations, reasoning, and comparisons to help decision-making.',
  }

  const verbosityExamples: Record<VerbosityLevel, string> = {
    concise:
      'Example: "Added 2% milk to your list. $3.48." (no extra context)',
    balanced:
      'Example: "I added 2% milk ($3.48) to your list. It\'s a household staple that pairs well with your cereal."',
    detailed:
      'Example: "I\'ve added Great Value 2% Reduced Fat Milk ($3.48/gallon) to your list. This is a great choice because it provides essential calcium and vitamin D for your family, especially important for your kids. The 2% fat content balances nutrition and taste - it\'s lower in fat than whole milk but has more flavor than skim. At $3.48, it\'s competitively priced for a gallon."',
  }

  return `
## COMMUNICATION STYLE

Verbosity Level: ${preference.verbosity.toUpperCase()}
- ${verbosityDescriptions[preference.verbosity]}
- ${verbosityExamples[preference.verbosity]}
- Confidence: ${(preference.confidence * 100).toFixed(0)}%
- Source: ${preference.learnedFrom === 'explicit' ? 'User preference' : 'Learned from behavior'}

**IMPORTANT**: Adapt ALL responses to match this verbosity level. This includes:
- Regular chat responses
- Product suggestions
- Shopping list descriptions
- Recipe instructions (concise mode: just ingredients and basic steps)
- Upsell blocks (concise mode: just "You might also like" with no explanations)
`.trim()
}

/**
 * Analyze message to detect behavior signals
 */
export function analyzeMessageForVerbosity(content: string): {
  isQuickAdd: boolean
  isQuestion: boolean
  isExploratory: boolean
} {
  const lowerContent = content.toLowerCase().trim()
  const wordCount = content.split(/\s+/).length

  // Quick add: Short command with add/get keywords
  const hasAddKeyword =
    lowerContent.startsWith('add') ||
    lowerContent.startsWith('get') ||
    lowerContent.startsWith('i need') ||
    lowerContent.includes('add to cart')
  const isQuickAdd = hasAddKeyword && wordCount <= 8

  // Question: Contains question mark or question words
  const isQuestion =
    lowerContent.includes('?') ||
    lowerContent.startsWith('what') ||
    lowerContent.startsWith('how') ||
    lowerContent.startsWith('why') ||
    lowerContent.startsWith('which') ||
    lowerContent.startsWith('should i') ||
    lowerContent.startsWith('can you')

  // Exploratory: Long message without quick add or checkout intent
  const isExploratory = wordCount > 15 && !isQuickAdd && !isQuestion

  return { isQuickAdd, isQuestion, isExploratory }
}
