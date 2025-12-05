import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateRestockPredictions } from '@/lib/patterns/restock'
import { detectLifeStage } from '@/lib/patterns/life-stage'
import { getUserMaturity } from '@/lib/personalization/maturity'

/**
 * GET /api/memory
 *
 * Returns complete memory map for the current user:
 * - Brand preferences with confidence scores
 * - Dietary preferences and allergies
 * - Favorite items
 * - Life stage insights
 * - Restock predictions
 * - User maturity level
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all preferences
    const { data: preferences, error: prefError } = await supabase
      .from('customer_preferences')
      .select('*')
      .eq('user_id', user.id)
      .order('confidence', { ascending: false })

    if (prefError) {
      console.error('Error fetching preferences:', prefError)
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
    }

    // Group preferences by type
    const brandPreferences = preferences?.filter(p => p.preference_type === 'brand') || []
    const dietaryPreferences = preferences?.filter(p => p.preference_type === 'dietary') || []
    const allergies = preferences?.filter(p => p.preference_type === 'allergy') || []
    const favorites = preferences?.filter(p => p.preference_type === 'favorite') || []
    const dislikes = preferences?.filter(p => p.preference_type === 'dislike') || []

    // Get purchase history for life stage detection and restock
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('items, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (orderError) {
      console.error('Error fetching orders:', orderError)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Flatten order items for analysis
    const purchaseHistory: Array<{
      sku: string
      name: string
      category: string
      image: string
      price: number
      quantity?: number
      purchasedAt: string
    }> = []

    for (const order of orders || []) {
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

    // Detect life stage
    const lifeStage = detectLifeStage(
      purchaseHistory.map(p => ({
        sku: p.sku,
        name: p.name,
        category: p.category,
        quantity: p.quantity,
      }))
    )

    // Calculate restock predictions
    const restockPredictions = calculateRestockPredictions(purchaseHistory)

    // Get user maturity
    const maturity = await getUserMaturity(user.id)

    // Get purchase statistics
    const totalOrders = orders?.length || 0
    const totalItems = purchaseHistory.length
    const uniqueProducts = new Set(purchaseHistory.map(p => p.sku)).size
    const categoriesShoppedIn = new Set(purchaseHistory.map(p => p.category)).size

    // Calculate date of first purchase
    const firstPurchaseDate = orders && orders.length > 0 ? orders[0].created_at : null
    const daysSinceFirstPurchase = firstPurchaseDate
      ? Math.floor((Date.now() - new Date(firstPurchaseDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    console.log(`📊 Memory map for user ${user.id}:`)
    console.log(`   Life stage: ${lifeStage.stage} (confidence: ${lifeStage.confidence})`)
    console.log(`   Maturity: ${maturity.level} (score: ${maturity.score})`)
    console.log(`   Preferences: ${preferences?.length || 0} total`)
    console.log(`   Restock items: ${restockPredictions.length}`)

    return NextResponse.json({
      userId: user.id,

      // Preferences
      preferences: {
        brands: brandPreferences,
        dietary: dietaryPreferences,
        allergies,
        favorites,
        dislikes,
        total: preferences?.length || 0,
      },

      // Life stage
      lifeStage,

      // Restock predictions
      restock: {
        items: restockPredictions,
        urgentCount: restockPredictions.filter(
          i => i.restockUrgency === 'order_now' || i.restockUrgency === 'order_soon'
        ).length,
      },

      // User maturity
      maturity,

      // Statistics
      stats: {
        totalOrders,
        totalItems,
        uniqueProducts,
        categoriesShoppedIn,
        daysSinceFirstPurchase,
        firstPurchaseDate,
      },

      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Memory map error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    )
  }
}
