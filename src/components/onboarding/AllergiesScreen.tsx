'use client'

import { useState } from 'react'

interface AllergiesScreenProps {
  data: {
    allergies: string[]
  }
  onUpdate: (data: { allergies: string[] }) => void
  onNext: () => void
  onBack: () => void
}

const COMMON_ALLERGENS = [
  { value: 'peanuts', label: 'Peanuts', icon: '🥜' },
  { value: 'tree-nuts', label: 'Tree Nuts', icon: '🌰' },
  { value: 'dairy', label: 'Dairy', icon: '🥛' },
  { value: 'eggs', label: 'Eggs', icon: '🥚' },
  { value: 'soy', label: 'Soy', icon: '🫘' },
  { value: 'wheat', label: 'Wheat', icon: '🌾' },
  { value: 'fish', label: 'Fish', icon: '🐟' },
  { value: 'shellfish', label: 'Shellfish', icon: '🦐' },
]

export function AllergiesScreen({
  data,
  onUpdate,
  onNext,
  onBack,
}: AllergiesScreenProps) {
  const [selected, setSelected] = useState<string[]>(data.allergies)
  const [customAllergy, setCustomAllergy] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const toggleAllergy = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((a) => a !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const addCustomAllergy = () => {
    if (!customAllergy.trim()) return

    const allergy = customAllergy.trim().toLowerCase()
    if (!selected.includes(allergy)) {
      setSelected([...selected, allergy])
    }
    setCustomAllergy('')
    setShowCustomInput(false)
  }

  const removeCustomAllergy = (allergy: string) => {
    setSelected(selected.filter((a) => a !== allergy))
  }

  const handleNext = () => {
    onUpdate({ allergies: selected })
    onNext()
  }

  const customAllergies = selected.filter(
    (a) => !COMMON_ALLERGENS.some((ca) => ca.value === a)
  )

  return (
    <div>
      <div className="flex items-start mb-2">
        <span className="text-3xl mr-3">⚠️</span>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Do you or anyone in your household have allergies?
          </h2>
        </div>
      </div>
      <p className="text-gray-600 mb-2">
        This is critical for safety. We'll never suggest these items.
      </p>
      <p className="text-sm text-amber-600 mb-8">
        If you have severe allergies, always verify ingredients yourself.
      </p>

      {/* Common allergens */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Common allergens:</h3>
        <div className="grid grid-cols-2 gap-3">
          {COMMON_ALLERGENS.map((allergen) => (
            <button
              key={allergen.value}
              onClick={() => toggleAllergy(allergen.value)}
              className={`
                flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all
                ${
                  selected.includes(allergen.value)
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
            >
              <span className="text-2xl">{allergen.icon}</span>
              <span className="font-medium">{allergen.label}</span>
              {selected.includes(allergen.value) && (
                <span className="ml-auto text-red-600">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom allergies */}
      {customAllergies.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Custom allergies:</h3>
          <div className="space-y-2">
            {customAllergies.map((allergy) => (
              <div
                key={allergy}
                className="flex items-center justify-between bg-red-50 border border-red-200 p-3 rounded-lg"
              >
                <span className="font-medium text-red-900 capitalize">
                  {allergy}
                </span>
                <button
                  onClick={() => removeCustomAllergy(allergy)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add custom allergy */}
      {showCustomInput ? (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter allergy name:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomAllergy()}
              placeholder="e.g., sesame, gluten"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={addCustomAllergy}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowCustomInput(false)
                setCustomAllergy('')
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowCustomInput(true)}
          className="text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          + Add custom allergy
        </button>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 font-medium py-3 px-6"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          {selected.length > 0 ? 'Finish Setup' : 'Skip - No Allergies'}
        </button>
      </div>
    </div>
  )
}
