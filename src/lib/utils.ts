// Format price with dollar sign
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Classify shopping mission type
export function classifyMission(query: string): string {
  const q = query.toLowerCase()
  
  if (q.includes('recipe') || q.includes('cook') || q.includes('make')) {
    return 'recipe'
  }
  if (q.includes('party') || q.includes('birthday') || q.includes('game day') || q.includes('holiday')) {
    return 'event'
  }
  if (q.includes('compare') || q.includes('research') || q.includes('baby') || q.includes('which')) {
    return 'research'
  }
  if (q.includes('add') || q.includes('get me') || q.includes('need')) {
    return 'precision'
  }
  return 'essentials'
}

// Strip emojis from text (for TTS)
export function stripEmojis(text: string): string {
  return text
    .replace(/[\uD800-\uDFFF]|[\u2600-\u26FF]|[\u2700-\u27BF]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return then.toLocaleDateString()
}
