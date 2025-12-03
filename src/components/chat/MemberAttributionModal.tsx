'use client'

import { HouseholdMember } from '@/types'

interface MemberAttributionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (member: HouseholdMember | null) => void
  members: HouseholdMember[]
  context?: string // e.g., "adding milk to cart", "dietary preference"
}

export function MemberAttributionModal({
  isOpen,
  onClose,
  onSelect,
  members,
  context,
}: MemberAttributionModalProps) {
  if (!isOpen || members.length === 0) return null

  const handleSelect = (member: HouseholdMember | null) => {
    onSelect(member)
    onClose()
  }

  const getRelationshipEmoji = (relationship: string) => {
    switch (relationship) {
      case 'self':
        return '👤'
      case 'partner':
      case 'spouse':
        return '💑'
      case 'child':
        return '👶'
      case 'parent':
        return '👴'
      default:
        return '👥'
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800">
              Who is this for?
            </h2>
            {context && (
              <p className="text-xs text-stone-500 mt-1">{context}</p>
            )}
          </div>

          {/* Member List */}
          <div className="p-4 space-y-2">
            {/* Everyone / Primary User Option */}
            <button
              onClick={() => handleSelect(null)}
              className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-stone-200 hover:border-amber-500 hover:bg-amber-50 transition-colors text-left"
            >
              <span className="text-2xl">🏠</span>
              <div>
                <p className="font-medium text-stone-800">Everyone / Household</p>
                <p className="text-xs text-stone-500">General household item</p>
              </div>
            </button>

            {/* Individual Members */}
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => handleSelect(member)}
                className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-stone-200 hover:border-amber-500 hover:bg-amber-50 transition-colors text-left"
              >
                <span className="text-2xl">{getRelationshipEmoji(member.relationship)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-stone-800">{member.name}</p>
                    {member.age && (
                      <span className="text-xs text-stone-500">({member.age}yo)</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 capitalize">{member.relationship}</p>

                  {/* Show dietary/allergies if present */}
                  {(member.dietary && member.dietary.length > 0) && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {member.dietary.slice(0, 2).map((item, i) => (
                        <span
                          key={i}
                          className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700"
                        >
                          {item}
                        </span>
                      ))}
                      {member.dietary.length > 2 && (
                        <span className="text-xs text-stone-400">
                          +{member.dietary.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {(member.allergies && member.allergies.length > 0) && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {member.allergies.slice(0, 2).map((item, i) => (
                        <span
                          key={i}
                          className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700"
                        >
                          ⚠️ {item}
                        </span>
                      ))}
                      {member.allergies.length > 2 && (
                        <span className="text-xs text-red-500">
                          +{member.allergies.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-stone-100 bg-stone-50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm text-stone-600 hover:text-stone-800 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
