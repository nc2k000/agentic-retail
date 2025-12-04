import { upsertPreference } from '@/lib/memory'
import type { MemoryConfirmation } from '@/components/chat/MemoryConfirmationToast'
import type { PreferenceType } from '@/types/memory'

/**
 * Generate memory confirmation message based on preference type and key
 */
export function generateConfirmationMessage(
  type: PreferenceType,
  key: string,
  reason?: string
): string {
  const messages: Record<PreferenceType, (key: string, reason?: string) => string> = {
    dietary: (key, reason) =>
      reason
        ? `I noticed you're ${key}. Is this correct?`
        : `I noticed you prefer ${key} items. Is this correct?`,

    allergy: (key, reason) =>
      reason
        ? `I noticed you're allergic to ${key} (${reason}). Is this correct?`
        : `I noticed you're allergic to ${key}. Is this correct?`,

    favorite: (key, reason) =>
      reason
        ? `I noticed ${key} is one of your favorites (you've purchased it ${reason}). Should I remember this?`
        : `I noticed ${key} is one of your favorites. Should I remember this?`,

    dislike: (key, reason) =>
      reason
        ? `I noticed you don't like ${key} (${reason}). Is this correct?`
        : `I noticed you don't like ${key}. Is this correct?`,

    brand: (key, reason) =>
      reason
        ? `I noticed you prefer ${key} products (${reason}). Is this correct?`
        : `I noticed you prefer ${key} products. Is this correct?`,

    communication_style: (key, reason) =>
      reason
        ? `I noticed you prefer ${key} responses (${reason}). Is this correct?`
        : `I noticed you prefer ${key} responses. Is this correct?`,
  }

  return messages[type](key, reason)
}

/**
 * Confirm memory preference (user accepted)
 */
export async function confirmMemoryPreference(
  userId: string,
  confirmation: MemoryConfirmation
): Promise<boolean> {
  try {
    console.log('💾 Saving confirmed preference:', {
      userId,
      type: confirmation.type,
      key: confirmation.key,
      confidence: 1.0,
      source: 'explicit'
    })

    // Update preference with high confidence and source='explicit'
    const result = await upsertPreference({
      userId,
      type: confirmation.type as PreferenceType,
      key: confirmation.key,
      confidence: 1.0, // Maximum confidence when user confirms
      reason: confirmation.reason,
      source: 'explicit', // User explicitly confirmed
    })

    console.log('💾 Save result:', result)
    return result !== null
  } catch (error) {
    console.error('❌ Error confirming memory preference:', error)
    return false
  }
}

/**
 * Reject memory preference (user declined)
 */
export async function rejectMemoryPreference(
  userId: string,
  confirmation: MemoryConfirmation
): Promise<boolean> {
  try {
    // TODO: Implement deletion or marking as incorrect
    // For now, we'll just not store it
    console.log('User rejected preference:', confirmation)
    return true
  } catch (error) {
    console.error('Error rejecting memory preference:', error)
    return false
  }
}

/**
 * Check if preference should trigger confirmation
 * Only show confirmation for medium-confidence inferred preferences
 */
export function shouldConfirmPreference(
  type: PreferenceType,
  confidence: number,
  source: string,
  timesConfirmed: number
): boolean {
  // Don't confirm if already confirmed by user
  if (source === 'explicit' || timesConfirmed > 0) {
    return false
  }

  // Only confirm medium-confidence inferences
  if (confidence >= 0.6 && confidence < 0.9) {
    return true
  }

  // Always confirm allergies (safety)
  if (type === 'allergy' && confidence >= 0.5) {
    return true
  }

  return false
}
