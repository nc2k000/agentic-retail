'use client'

import { HouseholdMember, Pet } from '@/types'
import { useState } from 'react'
import { AddMemberModal } from './AddMemberModal'
import { AddPetModal } from './AddPetModal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface HouseholdCardProps {
  profile: any
}

export function HouseholdCard({ profile }: HouseholdCardProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPetModalOpen, setIsPetModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<HouseholdMember | null>(null)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [editingPetIndex, setEditingPetIndex] = useState<number>(-1)
  const [isLoading, setIsLoading] = useState(false)

  const household = profile?.household || { size: 1, members: [], pets: [] }
  const members = (household.members || []) as HouseholdMember[]
  const pets = household.pets || []

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

  const handleAddMember = () => {
    setEditingMember(null)
    setIsModalOpen(true)
  }

  const handleEditMember = (member: HouseholdMember) => {
    setEditingMember(member)
    setIsModalOpen(true)
  }

  const handleSaveMember = async (memberData: Omit<HouseholdMember, 'id'>) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      let updatedMembers: HouseholdMember[]

      if (editingMember) {
        // Edit existing member
        updatedMembers = members.map(m =>
          m.id === editingMember.id
            ? { ...memberData, id: editingMember.id }
            : m
        )
      } else {
        // Add new member with generated ID
        const newMember: HouseholdMember = {
          ...memberData,
          id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
        updatedMembers = [...members, newMember]
      }

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase client doesn't know JSONB structure
        .update({
          household: {
            ...household,
            size: updatedMembers.length + 1, // +1 for primary user
            members: updatedMembers,
          },
        })
        .eq('id', profile.id)

      if (error) throw error

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error('Error saving member:', error)
      alert('Failed to save member. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this household member?')) {
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()

      const updatedMembers = members.filter(m => m.id !== memberId)

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase client doesn't know JSONB structure
        .update({
          household: {
            ...household,
            size: updatedMembers.length + 1, // +1 for primary user
            members: updatedMembers,
          },
        })
        .eq('id', profile.id)

      if (error) throw error

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error('Error deleting member:', error)
      alert('Failed to delete member. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Pet management functions
  const handleAddPet = () => {
    setEditingPet(null)
    setEditingPetIndex(-1)
    setIsPetModalOpen(true)
  }

  const handleEditPet = (pet: Pet, index: number) => {
    setEditingPet(pet)
    setEditingPetIndex(index)
    setIsPetModalOpen(true)
  }

  const handleSavePet = async (petData: Pet) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      let updatedPets: Pet[]

      if (editingPetIndex >= 0) {
        // Edit existing pet
        updatedPets = pets.map((p: Pet, i: number) =>
          i === editingPetIndex ? petData : p
        )
      } else {
        // Add new pet
        updatedPets = [...pets, petData]
      }

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase client doesn't know JSONB structure
        .update({
          household: {
            ...household,
            pets: updatedPets,
          },
        })
        .eq('id', profile.id)

      if (error) throw error

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error('Error saving pet:', error)
      alert('Failed to save pet. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePet = async (index: number) => {
    if (!confirm('Are you sure you want to remove this pet?')) {
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()

      const updatedPets = pets.filter((_: Pet, i: number) => i !== index)

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase client doesn't know JSONB structure
        .update({
          household: {
            ...household,
            pets: updatedPets,
          },
        })
        .eq('id', profile.id)

      if (error) throw error

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error('Error deleting pet:', error)
      alert('Failed to delete pet. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingMember(null)
        }}
        onSave={handleSaveMember}
        editingMember={editingMember}
      />

      <AddPetModal
        isOpen={isPetModalOpen}
        onClose={() => {
          setIsPetModalOpen(false)
          setEditingPet(null)
          setEditingPetIndex(-1)
        }}
        onSave={handleSavePet}
        editingPet={editingPet}
        editingIndex={editingPetIndex}
      />

      <div className="space-y-4">
        {/* Household Overview */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Household</h2>
            {isLoading && (
              <span className="text-xs text-stone-500">Saving...</span>
            )}
          </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-stone-50 rounded-lg border border-stone-100">
            <p className="text-3xl font-bold text-stone-700">{household.size}</p>
            <p className="text-xs text-stone-500 mt-1">Household Size</p>
          </div>
          <div className="text-center p-4 bg-stone-50 rounded-lg border border-stone-100">
            <p className="text-3xl font-bold text-stone-700">{members.length}</p>
            <p className="text-xs text-stone-500 mt-1">Members</p>
          </div>
        </div>

        {/* Members List */}
        {members.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-stone-700 mb-2">Household Members</h3>
            {members.map((member: HouseholdMember, index: number) => (
              <div
                key={member.id || index}
                className="flex items-start gap-3 p-4 rounded-lg border border-stone-100 bg-stone-50"
              >
                <span className="text-2xl">{getRelationshipEmoji(member.relationship)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-stone-800">{member.name}</p>
                    {member.age && (
                      <span className="text-xs text-stone-500">({member.age}yo)</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 capitalize mt-0.5">
                    {member.relationship}
                  </p>

                  {/* Dietary & Allergies */}
                  {(member.dietary && member.dietary.length > 0) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {member.dietary.map((item, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700"
                        >
                          🥗 {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {(member.allergies && member.allergies.length > 0) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {member.allergies.map((item, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700"
                        >
                          ⚠️ {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleEditMember(member)}
                    disabled={isLoading}
                    className="text-xs text-stone-500 hover:text-amber-600 transition-colors disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    disabled={isLoading}
                    className="text-xs text-stone-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddMember}
              disabled={isLoading}
              className="w-full py-3 border-2 border-dashed border-stone-200 rounded-lg text-sm text-stone-500 hover:border-amber-300 hover:text-amber-600 transition-colors disabled:opacity-50"
            >
              + Add Member
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl">👥</span>
            <p className="mt-2 text-stone-500 text-sm">No household members added</p>
            <button
              onClick={handleAddMember}
              disabled={isLoading}
              className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Add Household Members
            </button>
          </div>
        )}
      </div>

        {/* Pets */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Pets</h3>

          {pets.length > 0 ? (
            <div className="space-y-2">
              {pets.map((pet: Pet, index: number) => {
                const getPetEmoji = (type: string) => {
                  switch (type) {
                    case 'dog': return '🐕'
                    case 'cat': return '🐈'
                    case 'bird': return '🦜'
                    case 'fish': return '🐟'
                    case 'rabbit': return '🐰'
                    case 'hamster': return '🐹'
                    default: return '🐾'
                  }
                }

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-stone-100 bg-stone-50"
                  >
                    <span className="text-xl">{getPetEmoji(pet.type)}</span>
                    <div className="flex-1">
                      <p className="font-medium text-stone-800 text-sm">{pet.name || 'Pet'}</p>
                      <p className="text-xs text-stone-500 capitalize">{pet.type}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleEditPet(pet, index)}
                        disabled={isLoading}
                        className="text-xs text-stone-500 hover:text-amber-600 transition-colors disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePet(index)}
                        disabled={isLoading}
                        className="text-xs text-stone-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}

              <button
                onClick={handleAddPet}
                disabled={isLoading}
                className="w-full py-3 border-2 border-dashed border-stone-200 rounded-lg text-sm text-stone-500 hover:border-amber-300 hover:text-amber-600 transition-colors disabled:opacity-50"
              >
                + Add Another Pet
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <span className="text-3xl">🐾</span>
              <p className="mt-2 text-stone-500 text-sm">No pets added</p>
              <button
                onClick={handleAddPet}
                disabled={isLoading}
                className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Add Pet
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex gap-3">
            <span className="text-blue-600 text-lg flex-shrink-0">💡</span>
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">
                Personalized Shopping for Everyone
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Add household members to get personalized recommendations for each person. The AI
                will learn their preferences and can suggest items tailored to each member's needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
