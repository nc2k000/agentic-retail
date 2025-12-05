/**
 * Purchase History Ingestion System
 *
 * Processes CSV files containing past purchase history and:
 * 1. Creates historical orders in the database
 * 2. Auto-generates preferences from purchase patterns
 * 3. Calculates replenishment cycles
 */

import { createClient as createServerClient } from '@/lib/supabase/server'
import { CartItem } from '@/types'

export interface CSVRecord {
  order_id: string
  order_date: string
  item_sku: string
  item_name: string
  category: string
  brand?: string
  price: string
  quantity: string
}

/**
 * Process order history from CSV records
 * Groups items by order_id and creates orders in database
 */
export async function processOrderHistory(
  supabase: any,
  userId: string,
  records: CSVRecord[]
): Promise<number> {

  // Group by order_id
  const orderMap = new Map<string, CSVRecord[]>()
  for (const record of records) {
    if (!orderMap.has(record.order_id)) {
      orderMap.set(record.order_id, [])
    }
    orderMap.get(record.order_id)!.push(record)
  }

  let ordersCreated = 0

  console.log(`📦 Processing ${orderMap.size} orders from CSV...`)

  // Create orders
  for (const [orderId, items] of Array.from(orderMap.entries())) {
    const firstItem = items[0]
    const orderDate = new Date(firstItem.order_date)

    // Calculate total
    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity),
      0
    )

    // Convert items to CartItem format
    const cartItems: CartItem[] = items.map((item) => ({
      sku: item.item_sku,
      name: item.item_name,
      price: parseFloat(item.price),
      category: item.category,
      image: getCategoryEmoji(item.category),
      quantity: parseInt(item.quantity),
      tags: item.brand ? [item.brand] : [],
      source: 'reorder',
    }))

    // Create order
    const { error } = await supabase.from('orders').insert({
      user_id: userId,
      items: cartItems as any,
      total,
      status: 'delivered',
      created_at: orderDate.toISOString(),
      delivered_at: orderDate.toISOString(),
    } as any)

    if (error) {
      console.error(`Error creating order ${orderId}:`, error)
      continue
    }

    ordersCreated++
  }

  console.log(`✅ Created ${ordersCreated} orders`)
  return ordersCreated
}

/**
 * Generate preferences from purchase history
 * Analyzes patterns to infer:
 * - Brand preferences
 * - Dietary preferences (organic, gluten-free, etc.)
 * - Favorite items (frequently purchased)
 */
export async function generatePreferencesFromHistory(
  supabase: any,
  userId: string
): Promise<number> {

  console.log('🧠 Analyzing purchase patterns to generate preferences...')

  // Get all orders with items
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (ordersError || !orders || orders.length === 0) {
    console.error('Error fetching orders:', ordersError)
    return 0
  }

  const preferencesToCreate: any[] = []

  // Extract all items from all orders
  const allItems = orders.flatMap((order: any) => order.items || [])
  const totalItems = allItems.length

  console.log(`📊 Analyzing ${totalItems} items from ${orders.length} orders...`)

  // 1. Analyze brand patterns
  const brandCounts = new Map<string, number>()
  for (const item of allItems) {
    const brand = item.tags?.[0] || item.brand
    if (brand && brand !== 'Generic') {
      brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1)
    }
  }

  for (const [brand, count] of Array.from(brandCounts.entries())) {
    if (count >= 3) {
      const confidence = Math.min(0.5 + count * 0.05, 0.9)
      preferencesToCreate.push({
        user_id: userId,
        preference_type: 'brand',
        preference_key: brand,
        confidence,
        times_confirmed: count,
        source: 'pattern',
        reason: `Purchased ${count} times in history`,
      })
      console.log(`  🏷️  Brand preference: ${brand} (confidence: ${(confidence * 100).toFixed(0)}%)`)
    }
  }

  // 2. Detect organic preference
  let organicCount = 0
  for (const item of allItems) {
    if (item.name.toLowerCase().includes('organic')) {
      organicCount++
    }
  }

  const organicRatio = organicCount / totalItems
  if (organicRatio > 0.5) {
    const confidence = Math.min(organicRatio, 0.9)
    preferencesToCreate.push({
      user_id: userId,
      preference_type: 'dietary',
      preference_key: 'organic',
      confidence,
      times_confirmed: organicCount,
      source: 'pattern',
      reason: `${organicCount} of ${totalItems} items were organic`,
    })
    console.log(`  🌱 Dietary preference: organic (confidence: ${(confidence * 100).toFixed(0)}%)`)
  }

  // 3. Detect gluten-free preference
  let glutenFreeCount = 0
  for (const item of allItems) {
    const name = item.name.toLowerCase()
    if (name.includes('gluten free') || name.includes('gluten-free')) {
      glutenFreeCount++
    }
  }

  const glutenFreeRatio = glutenFreeCount / totalItems
  if (glutenFreeRatio > 0.3) {
    const confidence = Math.min(glutenFreeRatio + 0.2, 0.9)
    preferencesToCreate.push({
      user_id: userId,
      preference_type: 'dietary',
      preference_key: 'gluten-free',
      confidence,
      times_confirmed: glutenFreeCount,
      source: 'pattern',
      reason: `${glutenFreeCount} of ${totalItems} items were gluten-free`,
    })
    console.log(`  🌾 Dietary preference: gluten-free (confidence: ${(confidence * 100).toFixed(0)}%)`)
  }

  // 4. Detect frequently purchased items (favorites)
  const itemCounts = new Map<string, { count: number; sku: string }>()
  for (const item of allItems) {
    const existing = itemCounts.get(item.name)
    if (existing) {
      existing.count++
    } else {
      itemCounts.set(item.name, { count: 1, sku: item.sku })
    }
  }

  for (const [itemName, data] of Array.from(itemCounts.entries())) {
    if (data.count >= 3) {
      const confidence = Math.min(0.5 + data.count * 0.08, 0.9)
      preferencesToCreate.push({
        user_id: userId,
        preference_type: 'favorite',
        preference_key: itemName,
        preference_value: data.sku,
        confidence,
        times_confirmed: data.count,
        source: 'pattern',
        reason: `Purchased ${data.count} times`,
      })
      console.log(`  ⭐ Favorite item: ${itemName} (${data.count} purchases)`)
    }
  }

  // Bulk insert preferences
  if (preferencesToCreate.length > 0) {
    const { error } = await supabase
      .from('customer_preferences')
      .insert(preferencesToCreate as any)

    if (error) {
      console.error('Error creating preferences:', error)
      return 0
    }

    console.log(`✅ Generated ${preferencesToCreate.length} preferences`)
  } else {
    console.log('⚠️  No strong patterns detected (need more purchase history)')
  }

  return preferencesToCreate.length
}

/**
 * Get emoji for category (used for item images in mock data)
 */
function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    Dairy: '🥛',
    Produce: '🥬',
    Meat: '🥩',
    Bakery: '🍞',
    Pantry: '🥫',
    Frozen: '🧊',
    Beverages: '🥤',
    Snacks: '🍿',
    Household: '🧹',
    'Personal Care': '🧴',
  }
  return emojiMap[category] || '🛒'
}
