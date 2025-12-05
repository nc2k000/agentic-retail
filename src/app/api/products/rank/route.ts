import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rankProducts } from '@/lib/personalization/ranking'
import { getUserMaturity } from '@/lib/personalization/maturity'
import { getAllProducts } from '@/lib/catalog'
import { buildHouseholdMap } from '@/lib/household/map-builder'

/**
 * POST /api/products/rank
 *
 * Ranks products based on user preferences and maturity level
 *
 * Request Body:
 * {
 *   category?: string       // Filter by category (e.g., "Dairy")
 *   query?: string          // Search query (e.g., "milk")
 *   limit?: number          // Max products to return (default: 10)
 * }
 *
 * Response:
 * {
 *   products: RankedProduct[]
 *   userMaturity: UserMaturityScore
 *   strategy: RecommendationStrategy
 * }
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const { category, query, limit = 10 } = body

    console.log('🎯 Ranking request:', { userId: user.id, category, query, limit })

    // Get user maturity score
    const userMaturity = await getUserMaturity(user.id)
    if (!userMaturity) {
      return NextResponse.json(
        { error: 'Could not determine user maturity' },
        { status: 500 }
      )
    }

    // Get user preferences
    const { data: preferences, error: prefError } = await supabase
      .from('customer_preferences')
      .select('*')
      .eq('user_id', user.id)

    if (prefError) {
      console.error('Error fetching preferences:', prefError)
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      )
    }

    // Get purchase history
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('items, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (orderError) {
      console.error('Error fetching orders:', orderError)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Build purchase history
    const purchaseHistory: any[] = []
    const skuCounts: Record<
      string,
      { count: number; lastDate: string; name: string }
    > = {}

    if (orderData) {
      for (const order of orderData as any[]) {
        for (const item of order.items) {
          if (!skuCounts[item.sku]) {
            skuCounts[item.sku] = {
              count: 0,
              lastDate: order.created_at,
              name: item.name,
            }
          }
          skuCounts[item.sku].count += item.quantity || 1
          if (order.created_at > skuCounts[item.sku].lastDate) {
            skuCounts[item.sku].lastDate = order.created_at
          }
        }
      }
    }

    Object.entries(skuCounts).forEach(([sku, data]) => {
      const daysSince = Math.floor(
        (Date.now() - new Date(data.lastDate).getTime()) / (1000 * 60 * 60 * 24)
      )
      purchaseHistory.push({
        sku,
        product_name: data.name,
        purchase_count: data.count,
        last_purchased: data.lastDate,
        days_since_last: daysSince,
      })
    })

    // Get household map
    const { data: householdFacts } = await supabase
      .from('household_facts')
      .select('*')
      .eq('user_id', user.id)

    const householdMap = buildHouseholdMap(user.id, householdFacts || [])

    // Filter products
    let filteredProducts = getAllProducts()

    // Filter by category if provided
    if (category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
      console.log(`   Filtered to ${filteredProducts.length} products in category: ${category}`)
    }

    // Filter by query if provided
    if (query) {
      const lowerQuery = query.toLowerCase()

      // Expand meal/context queries to include related items
      const mealExpansions: Record<string, string[]> = {
        breakfast: ['bread', 'cereal', 'eggs', 'milk', 'bacon', 'sausage', 'yogurt', 'oatmeal', 'juice', 'coffee', 'bagel', 'muffin', 'pancake', 'waffle', 'syrup', 'butter', 'jam'],
        lunch: ['bread', 'sandwich', 'deli', 'turkey', 'ham', 'cheese', 'lettuce', 'tomato', 'mayo', 'mustard', 'chips', 'soup', 'salad'],
        dinner: ['meat', 'chicken', 'beef', 'pork', 'fish', 'pasta', 'rice', 'vegetables', 'potato', 'sauce', 'seasoning'],
        snack: ['chips', 'cookies', 'crackers', 'candy', 'nuts', 'fruit', 'cheese', 'yogurt', 'granola'],
      }

      // Check if query is a meal context that should be expanded
      const expandedTerms = mealExpansions[lowerQuery] || [lowerQuery]

      filteredProducts = filteredProducts.filter(
        (p) => {
          const productText = `${p.name} ${p.category} ${p.tags?.join(' ')}`.toLowerCase()
          // Match if product contains the original query OR any expanded terms
          return expandedTerms.some(term => productText.includes(term))
        }
      )
      console.log(`   Filtered to ${filteredProducts.length} products matching: ${query}${expandedTerms.length > 1 ? ` (expanded to: ${expandedTerms.slice(0, 5).join(', ')}${expandedTerms.length > 5 ? '...' : ''})` : ''}`)
    }

    if (filteredProducts.length === 0) {
      return NextResponse.json({
        products: [],
        userMaturity,
        message: 'No products found matching criteria',
      })
    }

    // Rank products
    const rankedProducts = await rankProducts(
      filteredProducts,
      user.id,
      userMaturity,
      preferences || [],
      purchaseHistory,
      householdMap
    )

    // Limit results
    const limitedProducts = rankedProducts.slice(0, limit)

    console.log(`   ✅ Returning ${limitedProducts.length} ranked products`)
    console.log(`   Top pick: ${limitedProducts[0]?.name} (score: ${limitedProducts[0]?.score.toFixed(2)})`)

    return NextResponse.json({
      products: limitedProducts,
      userMaturity,
      totalAvailable: rankedProducts.length,
    })
  } catch (error) {
    console.error('Error ranking products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
