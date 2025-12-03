'use client'

import { useState } from 'react'
import { HouseholdMember } from '@/types'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (member: Omit<HouseholdMember, 'id'>) => void
  editingMember?: HouseholdMember | null
}

export function AddMemberModal({ isOpen, onClose, onSave, editingMember }: AddMemberModalProps) {
  const [name, setName] = useState(editingMember?.name || '')
  const [age, setAge] = useState(editingMember?.age?.toString() || '')
  const [relationship, setRelationship] = useState<HouseholdMember['relationship']>(
    editingMember?.relationship || 'other'
  )
  const [dietary, setDietary] = useState(editingMember?.dietary?.join(', ') || '')
  const [allergies, setAllergies] = useState(editingMember?.allergies?.join(', ') || '')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Parse dietary and allergies from comma-separated strings
    const dietaryArray = dietary
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)

    const allergiesArray = allergies
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)

    const member: Omit<HouseholdMember, 'id'> = {
      name: name.trim(),
      relationship,
      age: age ? parseInt(age, 10) : undefined,
      dietary: dietaryArray.length > 0 ? dietaryArray : undefined,
      allergies: allergiesArray.length > 0 ? allergiesArray : undefined,
    }

    onSave(member)
    handleClose()
  }

  const handleClose = () => {
    setName('')
    setAge('')
    setRelationship('other')
    setDietary('')
    setAllergies('')
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800">
              {editingMember ? 'Edit Member' : 'Add Household Member'}
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter name"
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Relationship <span className="text-red-500">*</span>
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as HouseholdMember['relationship'])}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="self">Self</option>
                <option value="partner">Partner</option>
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Age (optional)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="0"
                max="150"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter age"
              />
            </div>

            {/* Dietary Preferences */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Dietary Preferences (optional)
              </label>
              <input
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., vegetarian, vegan, gluten-free"
              />
              <p className="text-xs text-stone-500 mt-1">Separate multiple items with commas</p>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Allergies (optional)
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                placeholder="e.g., peanuts, dairy, shellfish"
              />
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Critical: List all allergies to prevent dangerous suggestions
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
              >
                {editingMember ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
