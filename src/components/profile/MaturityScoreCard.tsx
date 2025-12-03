'use client'

interface MaturityScoreCardProps {
  maturityScore: number
  orderCount: number
  preferenceCount: number
  avgConfidence: number
}

export function MaturityScoreCard({
  maturityScore,
  orderCount,
  preferenceCount,
  avgConfidence,
}: MaturityScoreCardProps) {
  // Calculate maturity level
  const getMaturityLevel = (score: number): { level: string; color: string; emoji: string } => {
    if (score >= 80) return { level: 'Expert', color: 'emerald', emoji: '🌟' }
    if (score >= 60) return { level: 'Advanced', color: 'blue', emoji: '🎯' }
    if (score >= 40) return { level: 'Growing', color: 'amber', emoji: '📈' }
    if (score >= 20) return { level: 'Developing', color: 'orange', emoji: '🌱' }
    return { level: 'New', color: 'stone', emoji: '👋' }
  }

  const { level, color, emoji } = getMaturityLevel(maturityScore)

  // Progress bar width
  const progressWidth = Math.min(100, maturityScore)

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-800 mb-1">Profile Maturity</h2>
          <p className="text-xs text-stone-500">
            Based on your shopping history and preferences
          </p>
        </div>
        <span className="text-3xl">{emoji}</span>
      </div>

      {/* Score Display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-stone-800">
            {Math.round(maturityScore)}
          </span>
          <span className="text-lg text-stone-500">/ 100</span>
          <span
            className={`ml-auto text-sm font-semibold px-3 py-1 rounded-full ${
              color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
              color === 'blue' ? 'bg-blue-100 text-blue-700' :
              color === 'amber' ? 'bg-amber-100 text-amber-700' :
              color === 'orange' ? 'bg-orange-100 text-orange-700' :
              'bg-stone-100 text-stone-700'
            }`}
          >
            {level}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              color === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
              color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
              color === 'amber' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
              color === 'orange' ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
              'bg-gradient-to-r from-stone-400 to-stone-600'
            }`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-stone-700">{orderCount}</p>
          <p className="text-xs text-stone-500 mt-1">Orders</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-stone-700">{preferenceCount}</p>
          <p className="text-xs text-stone-500 mt-1">Preferences</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-stone-700">
            {Math.round(avgConfidence * 100)}%
          </p>
          <p className="text-xs text-stone-500 mt-1">Confidence</p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 pt-4 border-t border-stone-100">
        <p className="text-xs text-stone-500 leading-relaxed">
          Your profile maturity improves as you shop more, build preferences, and interact with
          the AI assistant. Higher maturity means better personalized recommendations.
        </p>
      </div>
    </div>
  )
}
