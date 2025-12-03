'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { WelcomeScreen } from './WelcomeScreen'
import { BasicInfoScreen } from './BasicInfoScreen'
import { HouseholdMembersScreen } from './HouseholdMembersScreen'
import { DietaryPreferencesScreen } from './DietaryPreferencesScreen'
import { AllergiesScreen } from './AllergiesScreen'
import { ConfirmationScreen } from './ConfirmationScreen'
import { createClient } from '@/lib/supabase/client'
import { upsertPreference } from '@/lib/memory'

interface HouseholdMember {
  id: string
  name: string
  age?: number
  relationship?: 'self' | 'partner' | 'child' | 'parent' | 'other'
}

interface OnboardingData {
  name: string
  householdSize: number
  members: HouseholdMember[]
  dietaryPreferences: string[]
  allergies: string[]
}

interface OnboardingFlowProps {
  user: User
}

export function OnboardingFlow({ user }: OnboardingFlowProps) {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    name: '',
    householdSize: 1,
    members: [],
    dietaryPreferences: [],
    allergies: [],
  })

  const handleNext = () => {
    setCurrentScreen((prev) => Math.min(prev + 1, 5))
  }

  const handleBack = () => {
    setCurrentScreen((prev) => Math.max(prev - 1, 0))
  }

  const handleUpdateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const handleComplete = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      console.log('Starting onboarding completion...')

      // 1. Update profile with name and household info
      console.log('Updating profile...')
      const { error: profileError } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase client doesn't know the JSONB structure
        .update({
          name: data.name,
          household: {
            size: data.householdSize,
            members: data.members,
            pets: [],
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
        throw profileError
      }
      console.log('Profile updated successfully')

      // 2. Save dietary preferences to memory system
      console.log('Saving dietary preferences:', data.dietaryPreferences)
      for (const pref of data.dietaryPreferences) {
        const result = await upsertPreference({
          userId: user.id,
          type: 'dietary',
          key: pref,
          confidence: 0.95, // High confidence since explicitly stated
          reason: 'Set during onboarding',
          source: 'explicit',
        })
        console.log('Dietary preference saved:', pref, 'result:', result)
      }

      // 3. Save allergies to memory system (critical!)
      for (const allergy of data.allergies) {
        await upsertPreference({
          userId: user.id,
          type: 'allergy',
          key: allergy,
          confidence: 1.0, // Maximum confidence for safety
          reason: 'Set during onboarding - NEVER suggest this',
          source: 'explicit',
        })
      }

      // 4. Mark onboarding as complete (always create this flag)
      console.log('Marking onboarding as complete...')
      const flagResult = await upsertPreference({
        userId: user.id,
        type: 'brand', // Using 'brand' as a flag type (allowed by DB constraint)
        key: '_onboarding_completed',
        confidence: 1.0,
        reason: 'User completed onboarding flow',
        source: 'explicit',
      })
      console.log('Onboarding flag saved:', flagResult)

      // 5. Wait a moment for database to commit, then do hard redirect
      console.log('Waiting before redirect...')
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Redirecting to /chat')
      window.location.href = '/chat'
    } catch (error) {
      console.error('Error completing onboarding:', error)
      alert('Failed to save your profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const screens = [
    <WelcomeScreen key="welcome" onNext={handleNext} />,
    <BasicInfoScreen
      key="basic"
      data={data}
      onUpdate={handleUpdateData}
      onNext={handleNext}
    />,
    <HouseholdMembersScreen
      key="household"
      data={data}
      onUpdate={handleUpdateData}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <DietaryPreferencesScreen
      key="dietary"
      data={data}
      onUpdate={handleUpdateData}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <AllergiesScreen
      key="allergies"
      data={data}
      onUpdate={handleUpdateData}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <ConfirmationScreen
      key="confirmation"
      onComplete={handleComplete}
      isLoading={isLoading}
    />,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[0, 1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 mx-1 rounded-full transition-colors ${
                  step <= currentScreen
                    ? 'bg-blue-600'
                    : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Step {currentScreen + 1} of 6
          </p>
        </div>

        {/* Current screen */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {screens[currentScreen]}
        </div>
      </div>
    </div>
  )
}
