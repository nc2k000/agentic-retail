import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user has already completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Check if they have any preferences (created during onboarding)
  const { count: preferencesCount } = await supabase
    .from('customer_preferences')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (preferencesCount && preferencesCount > 0) {
    redirect('/chat')
  }

  return <OnboardingFlow user={user} />
}
