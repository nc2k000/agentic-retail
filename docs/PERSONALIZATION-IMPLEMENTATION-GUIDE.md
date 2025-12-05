# Personalization System - Implementation Guide

**Date:** December 4, 2024
**Implementation Timeline:** 3 weeks

---

## 📋 Overview

This guide provides step-by-step instructions for implementing the cumulative, adaptive personalization system described in `PERSONALIZATION-ARCHITECTURE.md`.

---

## 🗓️ Week 1: Foundation

### Day 1-2: User Maturity System

#### Step 1: Add maturity fields to user profile

```typescript
// src/types/index.ts

export enum UserMaturityLevel {
  COLD_START = 'cold_start',
  ONBOARDING = 'onboarding',
  EMERGING = 'emerging',
  ESTABLISHED = 'established',
  POWER_USER = 'power_user'
}

export interface UserMaturityScore {
  level: UserMaturityLevel
  score: number // 0-100
  purchase_count: number
  preference_count: number
  avg_confidence: number
  days_since_first_purchase: number
  calculated_at: string
}
```

#### Step 2: Create maturity calculation function

```typescript
// src/lib/personalization/maturity.ts

import { createClient } from '@/lib/supabase/client'
import { UserMaturityLevel, UserMaturityScore } from '@/types'

export async function calculateUserMaturity(userId: string): Promise<UserMaturityScore> {
  const supabase = createClient()

  // Get order count
  const { count: purchaseCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get preferences
  const { data: preferences } = await supabase
    .from('customer_preferences')
    .select('confidence, created_at')
    .eq('user_id', userId)

  const preferenceCount = preferences?.length || 0
  const avgConfidence = preferences && preferences.length > 0
    ? preferences.reduce((sum, p) => sum + p.confidence, 0) / preferences.length
    : 0

  // Get first order date
  const { data: firstOrder } = await supabase
    .from('orders')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  const daysSinceFirstPurchase = firstOrder
    ? Math.floor((Date.now() - new Date(firstOrder.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Calculate weighted score
  const purchaseScore = Math.min((purchaseCount || 0) * 2, 50)
  const preferenceScore = Math.min(preferenceCount * 3, 30)
  const confidenceScore = avgConfidence * 15
  const tenureScore = Math.min(daysSinceFirstPurchase / 3, 5)

  const totalScore = purchaseScore + preferenceScore + confidenceScore + tenureScore

  // Determine level
  let level: UserMaturityLevel
  if (totalScore < 10) level = UserMaturityLevel.COLD_START
  else if (totalScore < 30) level = UserMaturityLevel.ONBOARDING
  else if (totalScore < 60) level = UserMaturityLevel.EMERGING
  else if (totalScore < 85) level = UserMaturityLevel.ESTABLISHED
  else level = UserMaturityLevel.POWER_USER

  return {
    level,
    score: totalScore,
    purchase_count: purchaseCount || 0,
    preference_count: preferenceCount,
    avg_confidence: avgConfidence,
    days_since_first_purchase: daysSinceFirstPurchase,
    calculated_at: new Date().toISOString()
  }
}

// Cache maturity score for 1 hour
const maturityCache = new Map<string, { score: UserMaturityScore; expires: number }>()

export async function getUserMaturity(userId: string): Promise<UserMaturityScore> {
  const cached = maturityCache.get(userId)
  if (cached && cached.expires > Date.now()) {
    return cached.score
  }

  const score = await calculateUserMaturity(userId)
  maturityCache.set(userId, {
    score,
    expires: Date.now() + (60 * 60 * 1000) // 1 hour
  })

  return score
}
```

#### Step 3: Add maturity to ChatInterface context

```typescript
// src/components/chat/ChatInterface.tsx

const [userMaturity, setUserMaturity] = useState<UserMaturityScore | null>(null)

useEffect(() => {
  async function loadMaturity() {
    const maturity = await getUserMaturity(user.id)
    setUserMaturity(maturity)
    console.log('👤 User maturity:', maturity.level, `(${maturity.score}/100)`)
  }
  loadMaturity()
}, [user.id])
```

---

### Day 3-4: CSV Ingestion System

#### Step 1: Create ingestion API endpoint

```typescript
// src/app/api/admin/ingest-purchases/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'

export async function POST(request: NextRequest) {
  const supabase = createClient()

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const csvText = await file.text()
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true
  })

  // Process orders
  const ordersCreated = await processOrderHistory(user.id, records)

  // Generate preferences
  const preferencesCreated = await generatePreferencesFromHistory(user.id)

  return NextResponse.json({
    success: true,
    orders_created: ordersCreated,
    preferences_created: preferencesCreated
  })
}
```

#### Step 2: Create order processing function

```typescript
// src/lib/personalization/ingestion.ts

interface CSVRecord {
  order_id: string
  order_date: string
  item_sku: string
  item_name: string
  category: string
  brand: string
  price: string
  quantity: string
}

export async function processOrderHistory(
  userId: string,
  records: CSVRecord[]
): Promise<number> {
  const supabase = createClient()

  // Group by order_id
  const orderMap = new Map<string, CSVRecord[]>()
  for (const record of records) {
    if (!orderMap.has(record.order_id)) {
      orderMap.set(record.order_id, [])
    }
    orderMap.get(record.order_id)!.push(record)
  }

  let ordersCreated = 0

  // Create orders
  for (const [orderId, items] of orderMap) {
    const firstItem = items[0]
    const total = items.reduce((sum, item) =>
      sum + (parseFloat(item.price) * parseInt(item.quantity)), 0
    )

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        external_order_id: orderId,
        status: 'completed',
        total_amount: total,
        item_count: items.length,
        created_at: new Date(firstItem.order_date).toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating order:', error)
      continue
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      sku: item.item_sku,
      name: item.item_name,
      category: item.category,
      brand: item.brand || 'Generic',
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      image: getCategoryEmoji(item.category)
    }))

    await supabase.from('order_items').insert(orderItems)
    ordersCreated++
  }

  return ordersCreated
}

function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'Dairy': '🥛',
    'Produce': '🥬',
    'Meat': '🥩',
    'Bakery': '🍞',
    'Pantry': '🥫',
    'Frozen': '🧊',
    'Beverages': '🥤',
    'Snacks': '🍿',
    'Household': '🧹',
    'Personal Care': '🧴'
  }
  return emojiMap[category] || '🛒'
}
```

#### Step 3: Create preference generation function

```typescript
// src/lib/personalization/ingestion.ts (continued)

export async function generatePreferencesFromHistory(
  userId: string
): Promise<number> {
  const supabase = createClient()

  // Get all orders with items
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (!orders || orders.length === 0) return 0

  const preferencesToCreate: any[] = []

  // 1. Analyze brand patterns
  const brandCounts = new Map<string, number>()
  for (const order of orders) {
    for (const item of order.items) {
      if (item.brand && item.brand !== 'Generic') {
        brandCounts.set(item.brand, (brandCounts.get(item.brand) || 0) + 1)
      }
    }
  }

  for (const [brand, count] of brandCounts) {
    if (count >= 3) {
      preferencesToCreate.push({
        user_id: userId,
        preference_type: 'brand',
        preference_key: brand,
        confidence: Math.min(0.5 + (count * 0.05), 0.9),
        times_confirmed: count,
        source: 'pattern',
        reason: `Purchased ${count} times in history`
      })
    }
  }

  // 2. Detect organic preference
  let organicCount = 0
  let totalItems = 0
  for (const order of orders) {
    for (const item of order.items) {
      totalItems++
      if (item.name.toLowerCase().includes('organic')) {
        organicCount++
      }
    }
  }

  const organicRatio = organicCount / totalItems
  if (organicRatio > 0.5) {
    preferencesToCreate.push({
      user_id: userId,
      preference_type: 'dietary',
      preference_key: 'organic',
      confidence: Math.min(organicRatio, 0.9),
      times_confirmed: organicCount,
      source: 'pattern',
      reason: `${organicCount} of ${totalItems} items were organic`
    })
  }

  // 3. Detect frequently purchased items (favorites)
  const itemCounts = new Map<string, number>()
  for (const order of orders) {
    for (const item of order.items) {
      itemCounts.set(item.name, (itemCounts.get(item.name) || 0) + 1)
    }
  }

  for (const [itemName, count] of itemCounts) {
    if (count >= 3) {
      preferencesToCreate.push({
        user_id: userId,
        preference_type: 'favorite',
        preference_key: itemName,
        confidence: Math.min(0.5 + (count * 0.08), 0.9),
        times_confirmed: count,
        source: 'pattern',
        reason: `Purchased ${count} times`
      })
    }
  }

  // Bulk insert preferences
  if (preferencesToCreate.length > 0) {
    const { error } = await supabase
      .from('customer_preferences')
      .insert(preferencesToCreate)

    if (error) {
      console.error('Error creating preferences:', error)
      return 0
    }
  }

  return preferencesToCreate.length
}
```

---

### Day 5: Admin Upload UI

```typescript
// src/app/admin/ingest/page.tsx

'use client'

import { useState } from 'react'

export default function IngestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleUpload() {
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/ingest-purchases', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Import Purchase History</h1>

      <div className="mb-4">
        <label className="block mb-2">Upload CSV file:</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Upload & Process'}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h2 className="font-bold">Success!</h2>
          <p>Orders created: {result.orders_created}</p>
          <p>Preferences generated: {result.preferences_created}</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 border rounded">
        <h3 className="font-bold mb-2">CSV Format:</h3>
        <pre className="text-xs">
{`order_id,order_date,item_sku,item_name,category,brand,price,quantity
ORD001,2024-06-01,milk-2p,2% Milk,Dairy,Great Value,3.48,1
ORD001,2024-06-01,banana,Bananas,Produce,,1.99,1`}
        </pre>
      </div>
    </div>
  )
}
```

---

## 🗓️ Week 2: Intelligence Engine

### Day 6-7: Recommendation Strategy

```typescript
// src/lib/personalization/strategy.ts

import { UserMaturityLevel, UserMaturityScore } from '@/types'

export interface RecommendationStrategy {
  accuracy_weight: number
  relevancy_weight: number
  strategy: 'popular' | 'hybrid' | 'personalized'
  ask_frequency: 'high' | 'medium' | 'low' | 'minimal'
  show_confidence: boolean
}

export function getRecommendationStrategy(
  maturity: UserMaturityScore
): RecommendationStrategy {
  switch (maturity.level) {
    case UserMaturityLevel.COLD_START:
      return {
        accuracy_weight: 0.2,
        relevancy_weight: 0.8,
        strategy: 'popular',
        ask_frequency: 'high',
        show_confidence: true
      }

    case UserMaturityLevel.ONBOARDING:
      return {
        accuracy_weight: 0.5,
        relevancy_weight: 0.5,
        strategy: 'hybrid',
        ask_frequency: 'medium',
        show_confidence: true
      }

    case UserMaturityLevel.EMERGING:
      return {
        accuracy_weight: 0.7,
        relevancy_weight: 0.3,
        strategy: 'hybrid',
        ask_frequency: 'low',
        show_confidence: false
      }

    case UserMaturityLevel.ESTABLISHED:
    case UserMaturityLevel.POWER_USER:
      return {
        accuracy_weight: 0.9,
        relevancy_weight: 0.1,
        strategy: 'personalized',
        ask_frequency: 'minimal',
        show_confidence: false
      }
  }
}
```

### Day 8-9: Scoring Engine

*(Implementation continues in next steps...)*

---

## 📝 Testing Plan

### Sample CSV Data

Create `sample-orders.csv`:
```csv
order_id,order_date,item_sku,item_name,category,brand,price,quantity
ORD001,2024-06-01,milk-org-2p,Organic Valley 2% Milk,Dairy,Organic Valley,4.99,1
ORD001,2024-06-01,banana-org,Organic Bananas,Produce,,2.99,1
ORD002,2024-06-08,milk-org-2p,Organic Valley 2% Milk,Dairy,Organic Valley,4.99,1
ORD002,2024-06-08,eggs-org,Organic Eggs,Dairy,Happy Egg Co,5.99,1
ORD003,2024-06-15,milk-org-2p,Organic Valley 2% Milk,Dairy,Organic Valley,4.99,1
ORD003,2024-06-15,bread-org,Organic Whole Wheat Bread,Bakery,Dave's Killer Bread,5.49,1
```

### Expected Results

After ingestion:
- **Orders created:** 3
- **Preferences generated:**
  - Brand: "Organic Valley" (confidence: 0.65)
  - Dietary: "organic" (confidence: 0.85)
  - Favorite: "Organic Valley 2% Milk" (confidence: 0.74)
- **User maturity:** Onboarding (score: ~25)

---

## 🚀 Deployment Checklist

- [ ] All TypeScript types defined
- [ ] Database migrations run
- [ ] CSV parser tested with sample data
- [ ] Preference generation validated
- [ ] Maturity calculation working
- [ ] Admin UI accessible
- [ ] Error handling added
- [ ] Logging configured
- [ ] Documentation updated

---

**Continue to:** Week 2 implementation will focus on the recommendation engine and scoring algorithms.

**Last Updated:** December 4, 2024
