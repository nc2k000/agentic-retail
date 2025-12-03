import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatInterface } from '@/components/chat/ChatInterface'

export default async function ChatPage() {
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

  // Check if user needs to complete onboarding
  // Check if they have any preferences set (only created during onboarding)
  const { count: preferencesCount } = await supabase
    .from('customer_preferences')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (!preferencesCount || preferencesCount === 0) {
    redirect('/onboarding')
  }

  // Get recent orders for context
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get recent lists
  const { data: lists } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <ChatInterface 
      user={user}
      profile={profile}
      initialOrders={orders || []}
      initialLists={lists || []}
    />
  )
}
