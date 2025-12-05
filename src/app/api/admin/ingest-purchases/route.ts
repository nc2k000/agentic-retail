/**
 * CSV Purchase History Ingestion API
 *
 * POST /api/admin/ingest-purchases
 * Accepts CSV file with purchase history and:
 * 1. Creates historical orders
 * 2. Generates preferences from patterns
 * 3. Updates user maturity
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { processOrderHistory, generatePreferencesFromHistory, CSVRecord } from '@/lib/personalization/ingestion'
import { invalidateMaturityCache } from '@/lib/personalization/maturity'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log(`📥 Ingesting purchase history for user ${user.id}`)
    console.log(`   File: ${file.name} (${file.size} bytes)`)

    // Parse CSV
    const csvText = await file.text()
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CSVRecord[]

    console.log(`   Records: ${records.length}`)

    // Validate CSV format
    if (records.length === 0) {
      return NextResponse.json(
        { error: 'CSV file is empty' },
        { status: 400 }
      )
    }

    const firstRecord = records[0]
    const requiredColumns = ['order_id', 'order_date', 'item_sku', 'item_name', 'category', 'price', 'quantity']
    for (const col of requiredColumns) {
      if (!(col in firstRecord)) {
        return NextResponse.json(
          { error: `Missing required column: ${col}` },
          { status: 400 }
        )
      }
    }

    // Process orders
    const ordersCreated = await processOrderHistory(supabase, user.id, records)

    // Generate preferences from history
    const preferencesCreated = await generatePreferencesFromHistory(supabase, user.id)

    // Invalidate maturity cache so it recalculates
    invalidateMaturityCache(user.id)

    console.log('✅ Ingestion complete!')

    return NextResponse.json({
      success: true,
      orders_created: ordersCreated,
      preferences_created: preferencesCreated,
      items_processed: records.length,
    })
  } catch (error: any) {
    console.error('❌ Ingestion failed:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process CSV' },
      { status: 500 }
    )
  }
}
