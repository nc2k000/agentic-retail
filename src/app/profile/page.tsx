import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileView } from '@/components/profile/ProfileView'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get customer preferences
  const { data: preferences } = await supabase
    .from('customer_preferences')
    .select('*')
    .eq('user_id', user.id)
    .order('confidence', { ascending: false })

  // Get shopping patterns
  const { data: patterns } = await supabase
    .from('shopping_patterns')
    .select('*')
    .eq('user_id', user.id)
    .order('confidence', { ascending: false })

  // Get order count for maturity score
  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <ProfileView
      user={user}
      profile={profile}
      preferences={preferences || []}
      patterns={patterns || []}
      orderCount={orderCount || 0}
    />
  )
}
