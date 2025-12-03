'use client'

import { ShoppingPattern } from '@/types/memory'
import { useState } from 'react'

interface PatternsCardProps {
  patterns: ShoppingPattern[]
}

export function PatternsCard({ patterns }: PatternsCardProps) {
  const [showAll, setShowAll] = useState(false)

  // Group patterns by type
  const groupedPatterns = patterns.reduce((acc, pattern) => {
    if (!acc[pattern.pattern_type]) {
      acc[pattern.pattern_type] = []
    }
    acc[pattern.pattern_type].push(pattern)
    return acc
  }, {} as Record<string, ShoppingPattern[]>)

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'time_of_day':
        return { emoji: '⏰', label: 'Shopping Times', color: 'blue' }
      case 'day_of_week':
        return { emoji: '📅', label: 'Shopping Days', color: 'emerald' }
      case 'frequency':
        return { emoji: '🔄', label: 'Shopping Frequency', color: 'amber' }
      case 'basket_size':
        return { emoji: '🛒', label: 'Basket Size', color: 'orange' }
      case 'category_preference':
        return { emoji: '📦', label: 'Category Preferences', color: 'purple' }
      default:
        return { emoji: '📊', label: type, color: 'stone' }
    }
  }

  const displayLimit = showAll ? Infinity : 5

  if (patterns.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Shopping Patterns</h2>
        <div className="text-center py-8">
          <span className="text-4xl">📊</span>
          <p className="mt-2 text-stone-500 text-sm">
            No patterns detected yet. Continue shopping to reveal insights!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-800">Shopping Patterns</h2>
        <span className="text-xs text-stone-500">{patterns.length} insights</span>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedPatterns).map(([type, patternList]) => {
          const { emoji, label, color } = getTypeInfo(type)
          const displayPatterns = patternList.slice(0, displayLimit)

          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{emoji}</span>
                <h3 className="text-sm font-semibold text-stone-700">{label}</h3>
                <span className="text-xs text-stone-400">({patternList.length})</span>
              </div>

              <div className="space-y-2">
                {displayPatterns.map((pattern) => {
                  const lastOccurrence = new Date(pattern.last_occurrence)
                  const daysAgo = Math.floor(
                    (Date.now() - lastOccurrence.getTime()) / (1000 * 60 * 60 * 24)
                  )

                  return (
                    <div
                      key={pattern.id}
                      className="flex items-start justify-between p-3 rounded-lg border border-stone-100 bg-stone-50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 text-sm">
                          {pattern.pattern_key || 'Unknown'}
                        </p>
                        {pattern.pattern_value && (
                          <p className="text-xs text-stone-500 mt-1">
                            {JSON.stringify(pattern.pattern_value)}
                          </p>
                        )}
                        {pattern.member_name && (
                          <p className="text-xs text-stone-400 mt-1">
                            For: {pattern.member_name}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1 ml-3">
                        <span className="text-xs text-stone-400">
                          {pattern.occurrence_count}× observed
                        </span>
                        <span className="text-xs text-stone-400">
                          {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                color === 'blue' ? 'bg-blue-500' :
                                color === 'emerald' ? 'bg-emerald-500' :
                                color === 'amber' ? 'bg-amber-500' :
                                color === 'orange' ? 'bg-orange-500' :
                                color === 'purple' ? 'bg-purple-500' :
                                'bg-stone-500'
                              }`}
                              style={{ width: `${Math.min(100, pattern.confidence * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-stone-400">
                            {Math.round(pattern.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {patternList.length > displayLimit && !showAll && (
                  <button
                    onClick={() => setShowAll(true)}
                    className="w-full text-xs text-amber-600 hover:text-amber-700 py-2"
                  >
                    Show {patternList.length - displayLimit} more...
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showAll && patterns.length > 5 && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full mt-4 text-xs text-stone-500 hover:text-stone-700 py-2 border-t border-stone-100"
        >
          Show less
        </button>
      )}
    </div>
  )
}
