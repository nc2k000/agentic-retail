import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HistoryView } from '@/components/history/HistoryView'

export default async function HistoryPage() {
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

  // Get all orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get all shopping lists
  const { data: lists } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <HistoryView
      user={user}
      profile={profile}
      orders={orders || []}
      lists={lists || []}
    />
  )
}
