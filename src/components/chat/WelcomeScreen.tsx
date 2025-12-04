'use client'

import { ReplenishmentSuggestion } from '@/lib/replenishment'
import { formatPrice } from '@/lib/utils'

interface WelcomeScreenProps {
  profile: any
  onSendMessage: (message: string) => void
  replenishmentSuggestions?: ReplenishmentSuggestion[]
}

export function WelcomeScreen({
  profile,
  onSendMessage,
  replenishmentSuggestions = []
}: WelcomeScreenProps) {
  const name = profile?.name?.split(' ')[0] || 'there'
  
  // Get time-based greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Seasonal suggestions
  const month = new Date().getMonth()
  const isHolidaySeason = month === 11 || month === 0 // Dec or Jan
  const isSummer = month >= 5 && month <= 8
  const isFootballSeason = month >= 8 || month <= 1

  const quickActions = [
    {
      emoji: '🛒',
      label: 'Weekly groceries',
      prompt: 'Help me with my weekly grocery shopping',
    },
    {
      emoji: '🍳',
      label: 'Find a recipe',
      prompt: 'I need a recipe idea for dinner tonight',
    },
    {
      emoji: isHolidaySeason ? '🎄' : isSummer ? '☀️' : '🎉',
      label: isHolidaySeason ? 'Holiday dinner' : isSummer ? 'Summer BBQ' : 'Plan a party',
      prompt: isHolidaySeason 
        ? 'Help me plan a holiday dinner for 8 people'
        : isSummer 
          ? 'Help me plan a summer BBQ'
          : 'Help me plan a birthday party',
    },
    {
      emoji: '👶',
      label: 'Baby essentials',
      prompt: 'I need help choosing baby products',
    },
  ]

  // Add football season option
  if (isFootballSeason) {
    quickActions[2] = {
      emoji: '🏈',
      label: 'Game day',
      prompt: 'Help me plan a game day spread for friends',
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Greeting */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-2">
          {greeting}, {name}! 👋
        </h2>
        <p className="text-stone-500">
          What would you like to shop for today?
        </p>
      </div>

      {/* Replenishment Suggestions */}
      {replenishmentSuggestions.length > 0 && (
        <div className="w-full max-w-md mb-6">
          <h3 className="text-sm font-medium text-stone-600 mb-3 flex items-center gap-2">
            <span>🔄</span>
            <span>Time to restock</span>
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-2">
            {replenishmentSuggestions.slice(0, 3).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(`Add ${suggestion.item.name} to my cart`)}
                className="w-full flex items-center gap-3 p-2 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all text-left"
              >
                <span className="text-xl flex-shrink-0">{suggestion.item.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-800 truncate">{suggestion.item.name}</p>
                  <p className="text-[10px] text-stone-500 truncate">{suggestion.message}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-stone-700">{formatPrice(suggestion.item.price)}</p>
                </div>
              </button>
            ))}
            {replenishmentSuggestions.length > 3 && (
              <button
                onClick={() => onSendMessage('Show me all items I need to restock')}
                className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 text-center"
              >
                +{replenishmentSuggestions.length - 3} more items
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(action.prompt)}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all text-left"
          >
            <span className="text-2xl">{action.emoji}</span>
            <span className="text-sm font-medium text-stone-700">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Lists */}
      {/* TODO: Show recent lists here */}
    </div>
  )
}
