'use client'

import { useState } from 'react'
import { Pet } from '@/types'

interface AddPetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (pet: Pet) => void
  editingPet?: Pet | null
  editingIndex?: number
}

export function AddPetModal({ isOpen, onClose, onSave, editingPet, editingIndex }: AddPetModalProps) {
  const [name, setName] = useState(editingPet?.name || '')
  const [type, setType] = useState(editingPet?.type || 'dog')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const pet: Pet = {
      name: name.trim() || undefined,
      type: type.trim(),
    }

    onSave(pet)
    handleClose()
  }

  const handleClose = () => {
    setName('')
    setType('dog')
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
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800">
              {editingPet ? 'Edit Pet' : 'Add Pet'}
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="dog">Dog 🐕</option>
                <option value="cat">Cat 🐈</option>
                <option value="bird">Bird 🦜</option>
                <option value="fish">Fish 🐟</option>
                <option value="rabbit">Rabbit 🐰</option>
                <option value="hamster">Hamster 🐹</option>
                <option value="other">Other 🐾</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter pet's name"
              />
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
                {editingPet ? 'Save Changes' : 'Add Pet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
