'use client'

import { useState } from 'react'

interface HouseholdMember {
  id: string
  name: string
  age?: number
  relationship?: 'self' | 'partner' | 'child' | 'parent' | 'other'
}

interface HouseholdMembersScreenProps {
  data: {
    householdSize: number
    members: HouseholdMember[]
  }
  onUpdate: (data: { members: HouseholdMember[] }) => void
  onNext: () => void
  onBack: () => void
}

export function HouseholdMembersScreen({
  data,
  onUpdate,
  onNext,
  onBack,
}: HouseholdMembersScreenProps) {
  const [members, setMembers] = useState<HouseholdMember[]>(data.members)
  const [showForm, setShowForm] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    age: '',
    relationship: 'other' as HouseholdMember['relationship'],
  })

  const handleAddMember = () => {
    if (!newMember.name.trim()) {
      alert('Please enter a name')
      return
    }

    const member: HouseholdMember = {
      id: `member-${Date.now()}`,
      name: newMember.name.trim(),
      age: newMember.age ? parseInt(newMember.age) : undefined,
      relationship: newMember.relationship,
    }

    const updatedMembers = [...members, member]
    setMembers(updatedMembers)
    setNewMember({ name: '', age: '', relationship: 'other' })
    setShowForm(false)
  }

  const handleRemoveMember = (id: string) => {
    const updatedMembers = members.filter((m) => m.id !== id)
    setMembers(updatedMembers)
  }

  const handleNext = () => {
    onUpdate({ members })
    onNext()
  }

  const handleSkip = () => {
    onUpdate({ members: [] })
    onNext()
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Who lives with you?
      </h2>
      <p className="text-gray-600 mb-8">
        Optional but recommended - helps us personalize suggestions for each family member
      </p>

      {/* Member list */}
      {members.length > 0 && (
        <div className="space-y-3 mb-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-600">
                  {member.age && `${member.age} years old • `}
                  {member.relationship && member.relationship !== 'other'
                    ? member.relationship.charAt(0).toUpperCase() + member.relationship.slice(1)
                    : 'Family member'}
                </p>
              </div>
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add member form */}
      {showForm ? (
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Enter name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age (optional)
              </label>
              <input
                type="number"
                value={newMember.age}
                onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                placeholder="Enter age"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship
              </label>
              <select
                value={newMember.relationship}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    relationship: e.target.value as HouseholdMember['relationship'],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="self">Self</option>
                <option value="partner">Partner</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddMember}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Add Member
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-medium py-4 rounded-lg transition-colors mb-6"
        >
          + Add Household Member
        </button>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 font-medium py-3 px-6"
        >
          Back
        </button>
        <div className="space-x-3">
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-900 font-medium py-3 px-6"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
