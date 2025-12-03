'use client'

import { useState } from 'react'

interface BasicInfoScreenProps {
  data: {
    name: string
    householdSize: number
  }
  onUpdate: (data: { name: string; householdSize: number }) => void
  onNext: () => void
}

export function BasicInfoScreen({ data, onUpdate, onNext }: BasicInfoScreenProps) {
  const [name, setName] = useState(data.name)
  const [householdSize, setHouseholdSize] = useState(data.householdSize)

  const handleNext = () => {
    if (!name.trim()) {
      alert('Please enter your name')
      return
    }
    if (householdSize < 1) {
      alert('Household size must be at least 1')
      return
    }
    onUpdate({ name: name.trim(), householdSize })
    onNext()
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Tell us about yourself
      </h2>
      <p className="text-gray-600 mb-8">
        We'll use this to personalize your experience
      </p>

      <div className="space-y-6">
        {/* Name input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            What's your name?
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            autoFocus
          />
        </div>

        {/* Household size */}
        <div>
          <label
            htmlFor="household"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            How many people live in your household?
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
              className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-2xl font-bold text-gray-700 transition-colors"
            >
              −
            </button>
            <input
              id="household"
              type="number"
              value={householdSize}
              onChange={(e) => setHouseholdSize(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center text-2xl font-bold py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
            <button
              onClick={() => setHouseholdSize(householdSize + 1)}
              className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-2xl font-bold text-gray-700 transition-colors"
            >
              +
            </button>
            <span className="text-lg text-gray-600 ml-2">people</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
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
