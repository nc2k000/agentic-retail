import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rankProducts } from '@/lib/personalization/ranking'
import { getUserMaturity } from '@/lib/personalization/maturity'
import { getAllProducts } from '@/lib/catalog'

/**
 * DEBUG ENDPOINT: Shows detailed ranking information for testing
 *
 * GET /api/debug/ranking?query=breakfast
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || 'breakfast'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Filter products by query
    const lowerQuery = query.toLowerCase()
    const mealExpansions: Record<string, string[]> = {
      breakfast: ['bread', 'cereal', 'eggs', 'milk', 'bacon', 'sausage', 'yogurt', 'oatmeal', 'juice', 'coffee', 'bagel', 'muffin', 'pancake', 'waffle', 'syrup', 'butter', 'jam'],
      lunch: ['bread', 'sandwich', 'deli', 'turkey', 'ham', 'cheese', 'lettuce', 'tomato', 'mayo', 'mustard', 'chips', 'soup', 'salad'],
      dinner: ['meat', 'chicken', 'beef', 'pork', 'fish', 'pasta', 'rice', 'vegetables', 'potato', 'sauce', 'seasoning'],
      snack: ['chips', 'cookies', 'crackers', 'candy', 'nuts', 'fruit', 'cheese', 'yogurt', 'granola'],
    }

    const expandedTerms = mealExpansions[lowerQuery] || [lowerQuery]

    let filteredProducts = getAllProducts().filter((p) => {
      const productText = `${p.name} ${p.category} ${p.tags?.join(' ')}`.toLowerCase()
      return expandedTerms.some(term => productText.includes(term))
    })

    // Rank products
    const rankedProducts = await rankProducts(
      filteredProducts,
      user.id,
      userMaturity,
      preferences || [],
      purchaseHistory
    )

    // Return comprehensive debug info
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      query: {
        original: query,
        expanded: expandedTerms.slice(0, 10).join(', '),
        productsFound: filteredProducts.length,
      },
      userMaturity: {
        level: userMaturity.level,
        score: userMaturity.score,
        purchaseCount: userMaturity.purchase_count,
        preferenceCount: userMaturity.preference_count,
        avgConfidence: userMaturity.avg_confidence,
        daysSinceFirstPurchase: userMaturity.days_since_first_purchase,
      },
      preferences: {
        total: preferences?.length || 0,
        byType: {
          brand: preferences?.filter((p: any) => p.preference_type === 'brand') || [],
          dietary: preferences?.filter((p: any) => p.preference_type === 'dietary') || [],
          favorite: preferences?.filter((p: any) => p.preference_type === 'favorite') || [],
          allergy: preferences?.filter((p: any) => p.preference_type === 'allergy') || [],
          dislike: preferences?.filter((p: any) => p.preference_type === 'dislike') || [],
        },
      },
      purchaseHistory: {
        total: purchaseHistory.length,
        topPurchases: purchaseHistory
          .sort((a, b) => b.purchase_count - a.purchase_count)
          .slice(0, 10),
      },
      rankedProducts: rankedProducts.slice(0, limit).map(p => ({
        rank: p.rank,
        name: p.name,
        sku: p.sku,
        category: p.category,
        price: p.price,
        tags: p.tags,
        score: {
          final: p.score.toFixed(2),
          personal: p.personalScore.toFixed(2),
          popularity: p.popularityScore.toFixed(2),
          value: p.valueScore.toFixed(2),
        },
        badges: p.badges,
        matchReason: p.matchReason,
      })),
      analysis: {
        expectedBrands: preferences?.filter((p: any) => p.preference_type === 'brand').map((p: any) => p.preference_key) || [],
        brandsInTopProducts: rankedProducts.slice(0, limit).map(p => p.tags?.join(', ') || 'none'),
        missingExpectedProducts: findMissingProducts(preferences || [], rankedProducts.slice(0, limit)),
      },
    })
  } catch (error) {
    console.error('Debug ranking error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    )
  }
}

function findMissingProducts(preferences: any[], rankedProducts: any[]): string[] {
  const brandPrefs = preferences.filter(p => p.preference_type === 'brand')
  const missing: string[] = []

  for (const pref of brandPrefs) {
    const found = rankedProducts.some(p =>
      p.name.toLowerCase().includes(pref.preference_key.toLowerCase()) ||
      p.tags?.some((tag: string) => tag.toLowerCase().includes(pref.preference_key.toLowerCase()))
    )
    if (!found) {
      missing.push(pref.preference_key)
    }
  }

  return missing
}
