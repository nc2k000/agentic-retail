'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { CustomerPreference, ShoppingPattern } from '@/types/memory'
import { MaturityScoreCard } from './MaturityScoreCard'
import { PreferencesCard } from './PreferencesCard'
import { PatternsCard } from './PatternsCard'
import { HouseholdCard } from './HouseholdCard'

interface ProfileViewProps {
  user: User
  profile: any
  preferences: CustomerPreference[]
  patterns: ShoppingPattern[]
  orderCount: number
}

export function ProfileView({
  user,
  profile,
  preferences,
  patterns,
  orderCount,
}: ProfileViewProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'household'>('overview')

  const handleBackToChat = () => {
    router.push('/chat')
  }

  const handleSignOut = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // Calculate maturity score
  const avgConfidence =
    preferences.length > 0
      ? preferences.reduce((sum, p) => sum + p.confidence, 0) / preferences.length
      : 0

  const maturityScore =
    (orderCount * 10 + preferences.length * 5 + avgConfidence * 50) / 100

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={handleBackToChat}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Chat</span>
        </button>

        <h1 className="text-lg font-semibold text-stone-800">Profile</h1>

        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800"
        >
          Sign Out
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('household')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'household'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Household
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {activeTab === 'overview' ? (
          <>
            {/* Maturity Score Card */}
            <MaturityScoreCard
              maturityScore={maturityScore}
              orderCount={orderCount}
              preferenceCount={preferences.length}
              avgConfidence={avgConfidence}
            />

            {/* Preferences Card */}
            <PreferencesCard preferences={preferences} />

            {/* Patterns Card */}
            <PatternsCard patterns={patterns} />
          </>
        ) : (
          <>
            {/* Household Card */}
            <HouseholdCard profile={profile} />
          </>
        )}
      </div>
    </div>
  )
}
