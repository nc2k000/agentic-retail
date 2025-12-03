'use client'

import { useState } from 'react'

interface DietaryPreferencesScreenProps {
  data: {
    dietaryPreferences: string[]
  }
  onUpdate: (data: { dietaryPreferences: string[] }) => void
  onNext: () => void
  onBack: () => void
}

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'gluten-free', label: 'Gluten-free', icon: '🌾' },
  { value: 'dairy-free', label: 'Dairy-free', icon: '🥛' },
  { value: 'keto', label: 'Keto', icon: '🥑' },
  { value: 'paleo', label: 'Paleo', icon: '🍖' },
  { value: 'halal', label: 'Halal', icon: '☪️' },
  { value: 'kosher', label: 'Kosher', icon: '✡️' },
]

export function DietaryPreferencesScreen({
  data,
  onUpdate,
  onNext,
  onBack,
}: DietaryPreferencesScreenProps) {
  const [selected, setSelected] = useState<string[]>(data.dietaryPreferences)

  const togglePreference = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((p) => p !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const handleNext = () => {
    onUpdate({ dietaryPreferences: selected })
    onNext()
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Any dietary preferences?
      </h2>
      <p className="text-gray-600 mb-8">
        Select all that apply - we'll use this to personalize recommendations
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {DIETARY_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => togglePreference(option.value)}
            className={`
              flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all
              ${
                selected.includes(option.value)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }
            `}
          >
            <span className="text-2xl">{option.icon}</span>
            <span className="font-medium">{option.label}</span>
            {selected.includes(option.value) && (
              <span className="ml-auto text-blue-600">✓</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => setSelected([])}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        None of these apply
      </button>

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
          Next
        </button>
      </div>
    </div>
  )
}
