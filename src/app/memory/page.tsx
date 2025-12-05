'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getLifeStageName, getLifeStageDescription, getLifeStageEmoji } from '@/lib/patterns/life-stage'

interface MemoryData {
  preferences: {
    brands: any[]
    dietary: any[]
    allergies: any[]
    favorites: any[]
    dislikes: any[]
    total: number
  }
  lifeStage: any
  household?: any
  restock: {
    items: any[]
    urgentCount: number
  }
  maturity: any
  stats: {
    totalOrders: number
    totalItems: number
    uniqueProducts: number
    categoriesShoppedIn: number
    daysSinceFirstPurchase: number
    firstPurchaseDate: string
  }
}

export default function MemoryMapPage() {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-stone-600">Loading your memory map...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading memory data</p>
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

  const { preferences, lifeStage, household, restock, maturity, stats } = data

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Your Memory Map</h1>
            <p className="text-sm text-stone-600 mt-1">
              See what we've learned about your shopping preferences
            </p>
          </div>
          <button
            onClick={() => router.push('/chat')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Chat
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <div className="text-2xl font-bold text-green-600">{stats.totalOrders}</div>
            <div className="text-sm text-stone-600 mt-1">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <div className="text-2xl font-bold text-green-600">{stats.uniqueProducts}</div>
            <div className="text-sm text-stone-600 mt-1">Unique Products</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <div className="text-2xl font-bold text-green-600">{preferences.total}</div>
            <div className="text-sm text-stone-600 mt-1">Preferences Learned</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <div className="text-2xl font-bold text-green-600">{stats.daysSinceFirstPurchase}</div>
            <div className="text-sm text-stone-600 mt-1">Days Shopping</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Life Stage & Maturity */}
          <div className="space-y-6">
            {/* Life Stage */}
            <div className="bg-white rounded-lg p-6 border border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Life Stage</h2>

              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{getLifeStageEmoji(lifeStage.stage)}</div>
                <div className="text-xl font-semibold text-stone-900">
                  {getLifeStageName(lifeStage.stage)}
                </div>
                <div className="text-sm text-stone-600 mt-1">
                  {getLifeStageDescription(lifeStage.stage)}
                </div>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {(lifeStage.confidence * 100).toFixed(0)}% confident
                  </span>
                </div>
              </div>

              {lifeStage.indicators && lifeStage.indicators.length > 0 && (
                <div className="border-t border-stone-200 pt-4">
                  <div className="text-sm font-medium text-stone-700 mb-2">Indicators:</div>
                  <ul className="space-y-2">
                    {lifeStage.indicators.map((indicator: string, index: number) => (
                      <li key={index} className="text-sm text-stone-600 flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* User Maturity */}
            <div className="bg-white rounded-lg p-6 border border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Personalization Level</h2>

              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {maturity.score.toFixed(1)}
                </div>
                <div className="text-sm font-medium text-stone-700 capitalize">
                  {maturity.level.replace('_', ' ')}
                </div>

                {/* Progress bar */}
                <div className="mt-4 bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-600 h-full transition-all"
                    style={{ width: `${maturity.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-xs text-stone-600 space-y-1">
                <div className="flex justify-between">
                  <span>Orders:</span>
                  <span className="font-medium">{stats.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preferences:</span>
                  <span className="font-medium">{preferences.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span className="font-medium">{stats.categoriesShoppedIn}</span>
                </div>
              </div>
            </div>

            {/* Household Map */}
            {household && household.facts && household.facts.length > 0 && (
              <div className="bg-white rounded-lg p-6 border border-stone-200">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">Household Overview</h2>

                {/* Completeness */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">Map Completeness</span>
                    <span className="font-medium text-stone-900">{household.completeness}%</span>
                  </div>
                  <div className="bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-600 h-full transition-all"
                      style={{ width: `${household.completeness}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    {household.totalFacts} {household.totalFacts === 1 ? 'fact' : 'facts'} discovered
                  </div>
                </div>

                {/* Property */}
                {household.physicalSpace?.propertyType && (
                  <div className="border-t border-stone-200 pt-3 mt-3">
                    <div className="text-xs font-medium text-stone-500 uppercase mb-2">Property</div>
                    <div className="text-sm text-stone-900 capitalize">
                      {household.physicalSpace.propertyType.replace('_', ' ')}
                    </div>
                    {household.physicalSpace.features && household.physicalSpace.features.length > 0 && (
                      <div className="text-xs text-stone-600 mt-1">
                        {household.physicalSpace.features.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Pets */}
                {household.pets && household.pets.length > 0 && (
                  <div className="border-t border-stone-200 pt-3 mt-3">
                    <div className="text-xs font-medium text-stone-500 uppercase mb-2">Pets</div>
                    <div className="space-y-1">
                      {household.pets.map((pet: any, index: number) => (
                        <div key={index} className="text-sm text-stone-900 flex items-center justify-between">
                          <span className="capitalize">{pet.type}</span>
                          <span className="text-xs text-stone-500">
                            {(pet.confidence * 100).toFixed(0)}% confident
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* People */}
                {household.people && household.people.length > 0 && (
                  <div className="border-t border-stone-200 pt-3 mt-3">
                    <div className="text-xs font-medium text-stone-500 uppercase mb-2">Household Members</div>
                    <div className="space-y-1">
                      {household.people.map((person: any, index: number) => (
                        <div key={index} className="text-sm text-stone-900">
                          {person.role && <span className="capitalize">{person.role}</span>}
                          {person.ageRange && <span className="text-stone-600"> ({person.ageRange})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Middle Column - Preferences */}
          <div className="space-y-6">
            {/* Brand Preferences */}
            <div className="bg-white rounded-lg p-6 border border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">
                Brand Preferences
                <span className="ml-2 text-sm font-normal text-stone-500">
                  ({preferences.brands.length})
                </span>
              </h2>

              {preferences.brands.length === 0 ? (
                <p className="text-sm text-stone-500 italic">
                  We haven't detected any brand preferences yet. Keep shopping!
                </p>
              ) : (
                <div className="space-y-3">
                  {preferences.brands.slice(0, 8).map((pref: any) => (
                    <div key={pref.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-900 truncate">
                          {pref.preference_key}
                        </div>
                        <div className="text-xs text-stone-500">
                          Purchased {pref.times_confirmed}× • {(pref.confidence * 100).toFixed(0)}% confident
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="w-12 bg-stone-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-green-600 h-full"
                            style={{ width: `${pref.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dietary Preferences */}
            <div className="bg-white rounded-lg p-6 border border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">
                Dietary Preferences
                <span className="ml-2 text-sm font-normal text-stone-500">
                  ({preferences.dietary.length})
                </span>
              </h2>

              {preferences.dietary.length === 0 ? (
                <p className="text-sm text-stone-500 italic">
                  No dietary preferences detected yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {preferences.dietary.map((pref: any) => (
                    <span
                      key={pref.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full"
                    >
                      <span>🌱</span>
                      <span>{pref.preference_key}</span>
                      <span className="text-xs opacity-75">
                        {(pref.confidence * 100).toFixed(0)}%
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Allergies */}
            {preferences.allergies.length > 0 && (
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h2 className="text-lg font-semibold text-red-900 mb-4">
                  ⚠️ Allergies
                  <span className="ml-2 text-sm font-normal text-red-600">
                    ({preferences.allergies.length})
                  </span>
                </h2>

                <div className="flex flex-wrap gap-2">
                  {preferences.allergies.map((pref: any) => (
                    <span
                      key={pref.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-full"
                    >
                      <span>⚠️</span>
                      <span>{pref.preference_key}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites */}
            {preferences.favorites.length > 0 && (
              <div className="bg-white rounded-lg p-6 border border-stone-200">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  ⭐ Favorite Items
                  <span className="ml-2 text-sm font-normal text-stone-500">
                    ({preferences.favorites.length})
                  </span>
                </h2>

                <div className="space-y-2">
                  {preferences.favorites.slice(0, 5).map((pref: any) => (
                    <div key={pref.id} className="text-sm text-stone-700">
                      ⭐ {pref.preference_key}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Restock Predictions */}
          <div>
            <div className="bg-white rounded-lg p-6 border border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">
                Restock Predictions
                {restock.urgentCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    {restock.urgentCount} urgent
                  </span>
                )}
              </h2>

              {restock.items.length === 0 ? (
                <p className="text-sm text-stone-500 italic">
                  No restock predictions yet. Make a few orders first!
                </p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {restock.items.map((item: any) => {
                    const isUrgent = item.restockUrgency === 'order_now' || item.restockUrgency === 'order_soon'
                    const isOverdue = item.daysUntilSuggestedOrder <= 0

                    return (
                      <div
                        key={item.sku}
                        className={`p-3 rounded-lg border ${
                          isOverdue
                            ? 'bg-red-50 border-red-200'
                            : isUrgent
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl flex-shrink-0">{item.image}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-stone-900 truncate">
                              {item.name}
                            </div>
                            <div className="text-xs text-stone-600 mt-1">
                              ${item.price.toFixed(2)} • Bought {item.totalPurchases}×
                            </div>

                            {/* Status indicator */}
                            <div className="mt-2 flex items-center gap-2">
                              {isOverdue ? (
                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 font-medium rounded-full">
                                  🔴 Order now
                                </span>
                              ) : isUrgent ? (
                                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 font-medium rounded-full">
                                  🟡 Order soon
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 font-medium rounded-full">
                                  ✅ Well stocked
                                </span>
                              )}

                              <span className="text-xs text-stone-500">
                                {item.daysUntilRestock > 0
                                  ? `${item.daysUntilRestock}d until restock`
                                  : 'Time to restock'}
                              </span>
                            </div>

                            {/* Prediction method */}
                            <div className="mt-1 text-xs text-stone-500">
                              {item.predictionMethod === 'historical'
                                ? `Based on your ${item.averageDaysBetweenPurchases}d purchase cycle`
                                : item.predictionMethod === 'blended'
                                ? `Blended prediction (${(item.confidenceScore * 100).toFixed(0)}% confident)`
                                : `Standard ${item.standardConsumptionDays}d consumption rate`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {restock.items.length > 0 && (
                <button
                  onClick={() => router.push('/chat')}
                  className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Start Shopping
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
