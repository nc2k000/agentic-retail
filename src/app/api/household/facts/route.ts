import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { HouseholdFact } from '@/lib/household/types'

/**
 * POST /api/household/facts
 *
 * Directly saves household facts to the database (bypasses AI extraction).
 * Used by decision trees to save structured facts.
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
    const { facts } = body

    if (!facts || !Array.isArray(facts)) {
      return NextResponse.json({ error: 'Missing facts array' }, { status: 400 })
    }

    console.log(`💾 Saving ${facts.length} facts directly for user ${user.id}`)

    // Upsert facts into database
    const upsertedFacts: HouseholdFact[] = []

    for (const factData of facts) {
      const { fact, confidence, category, source, timestamp } = factData

      if (!fact) {
        continue
      }

      // Use fact as both key and value for simple text facts
      const factKey = `tv_search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const factValue = fact

      // Check if fact already exists (check by value since keys are unique)
      const { data: existing } = await supabase
        .from('household_facts')
        .select('*')
        .eq('user_id', user.id)
        .eq('fact_value', factValue)
        .single()

      const existingFact = existing as any
      if (existingFact && existingFact.data) {
        // Update existing fact with higher confidence
        const updatedConfidence = Math.max((existingFact.data as any).confidence || 0, confidence || 0.9)

        const fact = existingFact.data as any
        const { data: updated, error: updateError} = await (supabase
          .from('household_facts') as any)
          .update({
            confidence: updatedConfidence,
            updated_at: timestamp || new Date().toISOString(),
            data_points: (fact.data_points || 0) + 1,
          })
          .eq('id', fact.id)
          .select()
          .single()

        if (!updateError && updated) {
          upsertedFacts.push(updated)
          console.log(`  ✅ Updated fact: "${factValue}" (confidence: ${updatedConfidence})`)
        } else if (updateError) {
          console.error(`  ❌ Error updating fact "${factValue}":`, updateError)
        }
      } else {
        // Create new fact
        const { data: created, error: createError} = await (supabase
          .from('household_facts') as any)
          .insert({
            user_id: user.id,
            category: 'lifestyle', // Map to one of the 5 categories
            subcategory: 'hobby', // Simple mapping for now
            fact_key: factKey,
            fact_value: factValue,
            confidence: confidence || 0.9,
            data_points: 1,
            discovered_from: source || 'decision_tree',
            supporting_evidence: [],
          })
          .select()
          .single()

        if (!createError && created) {
          upsertedFacts.push(created)
          console.log(`  ✅ Created fact: "${factValue}" (confidence: ${confidence || 0.9})`)
        } else if (createError) {
          console.error(`  ❌ Error creating fact "${factValue}":`, createError)
        }
      }
    }

    console.log(`✅ Saved ${upsertedFacts.length} facts directly`)

    return NextResponse.json({
      success: true,
      factsCreated: upsertedFacts.length,
      facts: upsertedFacts,
    })
  } catch (error) {
    console.error('Error saving household facts:', error)
    return NextResponse.json(
      { error: 'Failed to save household facts' },
      { status: 500 }
    )
  }
}
