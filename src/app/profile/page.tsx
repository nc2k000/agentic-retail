'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface MemoryData {
  profile?: {
    name: string | null
    household: any
    preferences: any
  }
  preferences: {
    brands: any[]
    dietary: any[]
    allergies: any[]
    favorites: any[]
    dislikes: any[]
    total: number
  }
  household?: any
  restock: {
    items: any[]
    urgentCount: number
  }
  maturity: any
  stats: {
    totalOrders: number
    uniqueProducts: number
    daysSinceFirstPurchase: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [data, setData] = useState<MemoryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMemoryData() {
      try {
        const response = await fetch('/api/memory')
        if (!response.ok) {
          throw new Error('Failed to fetch memory data')
        }
        const memoryData = await response.json()
        setData(memoryData)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemoryData()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data</p>
          <button
            onClick={() => router.push('/chat')}
            className="text-green-600 hover:text-green-700 underline"
          >
            Return to Chat
          </button>
        </div>
      </div>
    )
  }

  const { profile, preferences, household, stats } = data
  const explicitHousehold = profile?.household
  const discoveredFacts = household?.facts || []

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/chat')}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Chat</span>
          </button>

          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-stone-900">Your Profile</h1>
            <p className="text-sm text-stone-600 mt-1">
              What we know about you and your household
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-stone-600 hover:text-stone-800 text-sm font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <div className="text-2xl font-bold text-green-600">{stats.totalOrders}</div>
            <div className="text-sm text-stone-600 mt-1">Orders</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <div className="text-2xl font-bold text-green-600">{stats.uniqueProducts}</div>
            <div className="text-sm text-stone-600 mt-1">Products Tried</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <div className="text-2xl font-bold text-green-600">{preferences.total}</div>
            <div className="text-sm text-stone-600 mt-1">Preferences Learned</div>
          </div>
        </div>

        {/* Explicit Profile - Your Household */}
        {explicitHousehold && (
          <div className="bg-white rounded-lg p-6 border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-stone-900">Your Household</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                From Your Profile
              </span>
            </div>

            {/* Household Size */}
            <div className="mb-4">
              <div className="text-sm text-stone-600">Household Size</div>
              <div className="text-lg font-medium text-stone-900">
                {explicitHousehold.size} {explicitHousehold.size === 1 ? 'person' : 'people'}
              </div>
            </div>

            {/* Members */}
            {explicitHousehold.members && explicitHousehold.members.length > 0 && (
              <div className="mb-4">
                <div className="text-sm text-stone-600 mb-2">Household Members</div>
                <div className="space-y-2">
                  {explicitHousehold.members.map((member: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                      <div className="text-2xl">
                        {member.relationship === 'self' ? '👤' :
                         member.relationship === 'partner' ? '💑' :
                         member.relationship === 'child' ? '👶' : '👥'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-stone-900">
                          {member.name || `${member.relationship || 'Member'}`}
                        </div>
                        {member.age && (
                          <div className="text-sm text-stone-600">{member.age} years old</div>
                        )}
                        {member.dietary && member.dietary.length > 0 && (
                          <div className="text-xs text-stone-600 mt-1">
                            Dietary: {member.dietary.join(', ')}
                          </div>
                        )}
                        {member.allergies && member.allergies.length > 0 && (
                          <div className="text-xs text-red-600 mt-1">
                            ⚠️ Allergies: {member.allergies.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pets */}
            {explicitHousehold.pets && explicitHousehold.pets.length > 0 && (
              <div>
                <div className="text-sm text-stone-600 mb-2">Pets</div>
                <div className="space-y-2">
                  {explicitHousehold.pets.map((pet: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                      <div className="text-2xl">{pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐈' : '🐾'}</div>
                      <div>
                        <div className="font-medium text-stone-900">{pet.name || pet.type}</div>
                        {pet.breed && <div className="text-sm text-stone-600">{pet.breed}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Discovered Facts */}
        {discoveredFacts.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-stone-900">Discovered from Your Shopping</h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                Inferred
              </span>
            </div>

            <div className="space-y-3">
              {discoveredFacts.map((fact: any) => (
                <div key={fact.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-stone-900">
                      {fact.factKey?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || fact.category || 'Unknown'}
                    </div>
                    <div className="text-sm text-stone-600">
                      Category: {fact.category || 'Unknown'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-amber-700">
                      {((fact.confidence || 0) * 100).toFixed(0)}% confident
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      {fact.dataPoints || 0} data point{fact.dataPoints !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shopping Preferences */}
        <div className="bg-white rounded-lg p-6 border border-stone-200">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Shopping Preferences</h2>

          <div className="space-y-4">
            {/* Favorites */}
            {preferences.favorites.length > 0 && (
              <div>
                <div className="text-sm font-medium text-stone-700 mb-2">⭐ Favorite Products</div>
                <div className="flex flex-wrap gap-2">
                  {preferences.favorites.slice(0, 8).map((fav: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200"
                    >
                      {fav.preference_key}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Brands */}
            {preferences.brands.length > 0 && (
              <div>
                <div className="text-sm font-medium text-stone-700 mb-2">Brand Preferences</div>
                <div className="flex flex-wrap gap-2">
                  {preferences.brands.slice(0, 8).map((brand: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                    >
                      {brand.preference_key}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dietary */}
            {preferences.dietary.length > 0 && (
              <div>
                <div className="text-sm font-medium text-stone-700 mb-2">Dietary Preferences</div>
                <div className="flex flex-wrap gap-2">
                  {preferences.dietary.map((diet: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200"
                    >
                      {diet.preference_key}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergies */}
            {preferences.allergies.length > 0 && (
              <div>
                <div className="text-sm font-medium text-red-700 mb-2">⚠️ Allergies (Never Recommend)</div>
                <div className="flex flex-wrap gap-2">
                  {preferences.allergies.map((allergy: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-200"
                    >
                      {allergy.preference_key}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
