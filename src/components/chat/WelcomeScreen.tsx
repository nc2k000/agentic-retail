'use client'

interface WelcomeScreenProps {
  profile: any
  onSendMessage: (message: string) => void
}

export function WelcomeScreen({ profile, onSendMessage }: WelcomeScreenProps) {
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
