import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateRestockPredictions, getRestockSuggestions } from '@/lib/patterns/restock'

/**
 * GET /api/restock
 *
 * Returns restock predictions for the current user based on purchase history.
 *
 * Query params:
 * - urgentOnly: boolean - If true, only return items that are overdue or due soon
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const urgentOnly = searchParams.get('urgentOnly') === 'true'

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get purchase history
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('items, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (orderError) {
      console.error('Error fetching orders:', orderError)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        userId: user.id,
        items: [],
        overdueCount: 0,
        dueSoonCount: 0,
        calculatedAt: new Date().toISOString(),
        message: 'No purchase history available for predictions',
      })
    }

    // Flatten order items into purchase history
    const purchaseHistory: Array<{
      sku: string
      name: string
      category: string
      image: string
      price: number
      quantity?: number
      purchasedAt: string
    }> = []

    for (const order of orders) {
      for (const item of order.items as any[]) {
        purchaseHistory.push({
          sku: item.sku,
          name: item.name,
          category: item.category || 'Unknown',
          image: item.image || '📦',
          price: item.price || 0,
          quantity: item.quantity || 1,
          purchasedAt: order.created_at,
        })
      }
    }

    // Calculate restock predictions
    const allPredictions = calculateRestockPredictions(purchaseHistory)

    // Filter if urgentOnly requested
    const items = urgentOnly ? getRestockSuggestions(allPredictions) : allPredictions

    const overdueCount = allPredictions.filter(i => i.restockUrgency === 'overdue').length
    const dueSoonCount = allPredictions.filter(
      i => i.restockUrgency === 'due_today' || i.restockUrgency === 'due_soon'
    ).length

    console.log(`📊 Restock predictions for user ${user.id}:`)
    console.log(`   Total replenishable items: ${allPredictions.length}`)
    console.log(`   Overdue: ${overdueCount}, Due soon: ${dueSoonCount}`)
    if (items.length > 0) {
      console.log(`   Top 3:`)
      items.slice(0, 3).forEach((item, i) => {
        console.log(`     ${i + 1}. ${item.name} (${item.restockUrgency}, confidence: ${item.confidenceScore})`)
      })
    }

    return NextResponse.json({
      userId: user.id,
      items,
      overdueCount,
      dueSoonCount,
      calculatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Restock prediction error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    )
  }
}
