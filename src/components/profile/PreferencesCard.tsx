'use client'

import { CustomerPreference } from '@/types/memory'
import { useState } from 'react'

interface PreferencesCardProps {
  preferences: CustomerPreference[]
}

export function PreferencesCard({ preferences }: PreferencesCardProps) {
  const [showAll, setShowAll] = useState(false)
  const [groupBy, setGroupBy] = useState<'type' | 'member'>('type')

  // Group preferences by type
  const groupedByType = preferences.reduce((acc, pref) => {
    if (!acc[pref.preference_type]) {
      acc[pref.preference_type] = []
    }
    acc[pref.preference_type].push(pref)
    return acc
  }, {} as Record<string, CustomerPreference[]>)

  // Group preferences by member
  const groupedByMember = preferences.reduce((acc, pref) => {
    const key = pref.member_name || 'Household'
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(pref)
    return acc
  }, {} as Record<string, CustomerPreference[]>)

  const groupedPreferences = groupBy === 'type' ? groupedByType : groupedByMember
  const hasMemberPreferences = preferences.some(p => p.member_name)

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'dietary':
        return { emoji: '🥗', label: 'Dietary Preferences', color: 'emerald' }
      case 'allergy':
        return { emoji: '⚠️', label: 'Allergies', color: 'red' }
      case 'favorite':
        return { emoji: '⭐', label: 'Favorites', color: 'amber' }
      case 'brand':
        return { emoji: '🏷️', label: 'Preferred Brands', color: 'blue' }
      case 'dislike':
        return { emoji: '👎', label: 'Dislikes', color: 'stone' }
      default:
        return { emoji: '📌', label: type, color: 'stone' }
    }
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return { label: 'Very High', color: 'emerald' }
    if (confidence >= 0.7) return { label: 'High', color: 'blue' }
    if (confidence >= 0.5) return { label: 'Medium', color: 'amber' }
    return { label: 'Low', color: 'stone' }
  }

  const displayLimit = showAll ? Infinity : 5

  if (preferences.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Preferences</h2>
        <div className="text-center py-8">
          <span className="text-4xl">🎯</span>
          <p className="mt-2 text-stone-500 text-sm">
            No preferences yet. Start shopping to build your profile!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-800">Preferences</h2>
        <div className="flex items-center gap-3">
          {hasMemberPreferences && (
            <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
              <button
                onClick={() => setGroupBy('type')}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  groupBy === 'type'
                    ? 'bg-white text-stone-800 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                By Type
              </button>
              <button
                onClick={() => setGroupBy('member')}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  groupBy === 'member'
                    ? 'bg-white text-stone-800 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                By Member
              </button>
            </div>
          )}
          <span className="text-xs text-stone-500">{preferences.length} total</span>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedPreferences).map(([key, prefs]) => {
          // Determine header based on grouping mode
          let emoji, label, color
          if (groupBy === 'member') {
            emoji = key === 'Household' ? '🏠' : '👤'
            label = key
            color = 'stone'
          } else {
            ({ emoji, label, color } = getTypeInfo(key))
          }

          const displayPrefs = prefs.slice(0, displayLimit)

          return (
            <div key={key}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{emoji}</span>
                <h3 className="text-sm font-semibold text-stone-700">{label}</h3>
                <span className="text-xs text-stone-400">({prefs.length})</span>
              </div>

              <div className="space-y-2">
                {displayPrefs.map((pref) => {
                  const badge = getConfidenceBadge(pref.confidence)
                  const prefTypeInfo = getTypeInfo(pref.preference_type)
                  return (
                    <div
                      key={pref.id}
                      className={`flex items-start justify-between p-3 rounded-lg border ${
                        pref.preference_type === 'allergy'
                          ? 'border-red-200 bg-red-50'
                          : 'border-stone-100 bg-stone-50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-stone-800 text-sm">
                            {pref.preference_key}
                          </p>
                          {groupBy === 'member' && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-stone-200 text-stone-600">
                              {prefTypeInfo.emoji} {pref.preference_type}
                            </span>
                          )}
                        </div>
                        {pref.reason && (
                          <p className="text-xs text-stone-500 mt-1">{pref.reason}</p>
                        )}
                        {groupBy === 'type' && pref.member_name && (
                          <p className="text-xs text-stone-400 mt-1">
                            For: {pref.member_name}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1 ml-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                            badge.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                            badge.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            badge.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                            'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-xs text-stone-400">
                          {pref.times_confirmed}× confirmed
                        </span>
                      </div>
                    </div>
                  )
                })}

                {prefs.length > displayLimit && !showAll && (
                  <button
                    onClick={() => setShowAll(true)}
                    className="w-full text-xs text-amber-600 hover:text-amber-700 py-2"
                  >
                    Show {prefs.length - displayLimit} more...
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showAll && preferences.length > 5 && (
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
