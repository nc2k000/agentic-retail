import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { discoverFromPurchase, discoverFromMessage, calculateUpdatedConfidence } from '@/lib/household/discovery'
import { HouseholdFact } from '@/lib/household/types'

/**
 * POST /api/household/discover
 *
 * Discovers household facts from purchases or messages.
 * Updates existing facts or creates new ones.
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

    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ error: 'Missing type or data' }, { status: 400 })
    }

    let discoveries: Partial<HouseholdFact>[] = []

    // Discover facts based on input type
    if (type === 'purchase') {
      const { items, timestamp } = data
      discoveries = discoverFromPurchase(user.id, items, timestamp)
    } else if (type === 'message') {
      const { message, timestamp } = data
      discoveries = discoverFromMessage(user.id, message, timestamp)
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    console.log(`🔍 Discovered ${discoveries.length} facts for user ${user.id}`)

    // Upsert facts into database
    const upsertedFacts: HouseholdFact[] = []

    for (const discovery of discoveries) {
      // Skip if missing required fields
      if (!discovery.factKey || !discovery.category || !discovery.subcategory) {
        console.warn('⚠️ Skipping discovery with missing required fields:', discovery)
        continue
      }

      // Check if fact already exists
      const { data: existing, error: existingError } = await supabase
        .from('household_facts')
        .select('*')
        .eq('user_id', user.id)
        .eq('fact_key', discovery.factKey)
        .single()

      if (existingError && existingError.code !== 'PGRST116') {
        console.error('Error checking existing fact:', existingError)
        continue
      }

      if (existing) {
        // Update existing fact
        const newEvidence = discovery.supportingEvidence![0]
        const existingFact = existing as any
        const updatedConfidence = calculateUpdatedConfidence(
          existingFact.confidence,
          newEvidence,
          existingFact.data_points
        )

        // Supabase JSONB types are strict - using type assertion
        const updateData: any = {
          fact_value: discovery.factValue,
          confidence: updatedConfidence,
          data_points: existingFact.data_points + 1,
          supporting_evidence: [...(existingFact.supporting_evidence || []), newEvidence],
          updated_at: new Date().toISOString(),
        }

        const { data: updated, error: updateError } = await (supabase
          .from('household_facts') as any)
          .update(updateData)
          .eq('id', existingFact.id)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating fact:', updateError)
          continue
        }

        console.log(`   ✓ Updated: ${discovery.factKey} (confidence: ${updatedConfidence.toFixed(2)})`)
        upsertedFacts.push({
          ...updated,
          userId: updated.user_id,
          factKey: updated.fact_key,
          factValue: updated.fact_value,
          dataPoints: updated.data_points,
          lastConfirmedAt: updated.last_confirmed_at,
          discoveredFrom: updated.discovered_from,
          supportingEvidence: updated.supporting_evidence || [],
          createdAt: updated.created_at,
          updatedAt: updated.updated_at,
        })
      } else {
        // Insert new fact
        const { data: inserted, error: insertError } = await (supabase
          .from('household_facts') as any)
          .insert({
            user_id: user.id,
            category: discovery.category,
            subcategory: discovery.subcategory,
            fact_key: discovery.factKey,
            fact_value: discovery.factValue,
            confidence: discovery.confidence,
            data_points: 1,
            discovered_from: discovery.discoveredFrom,
            supporting_evidence: discovery.supportingEvidence,
          })
          .select()
          .single()

        if (insertError) {
          console.error('Error inserting fact:', insertError)
          continue
        }

        console.log(`   ✓ Created: ${discovery.factKey} (confidence: ${discovery.confidence?.toFixed(2)})`)
        upsertedFacts.push({
          ...inserted,
          userId: inserted.user_id,
          factKey: inserted.fact_key,
          factValue: inserted.fact_value,
          dataPoints: inserted.data_points,
          lastConfirmedAt: inserted.last_confirmed_at,
          discoveredFrom: inserted.discovered_from,
          supportingEvidence: inserted.supporting_evidence || [],
          createdAt: inserted.created_at,
          updatedAt: inserted.updated_at,
        })
      }
    }

    // Calculate map completeness
    const { data: allFacts } = await supabase
      .from('household_facts')
      .select('id')
      .eq('user_id', user.id)

    const totalFacts = allFacts?.length || 0
    const mapCompleteness = Math.min(100, (totalFacts / 50) * 100)

    return NextResponse.json({
      success: true,
      discovered: upsertedFacts.length,
      facts: upsertedFacts,
      mapCompleteness: Math.round(mapCompleteness),
    })
  } catch (error) {
    console.error('Discovery error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    )
  }
}
