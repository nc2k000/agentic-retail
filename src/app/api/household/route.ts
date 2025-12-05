import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildHouseholdMap } from '@/lib/household/map-builder'
import { HouseholdFact } from '@/lib/household/types'

/**
 * GET /api/household
 *
 * Returns the complete household map for the current user.
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

    // Fetch all household facts
    const { data: facts, error: factsError } = await supabase
      .from('household_facts')
      .select('*')
      .eq('user_id', user.id)
      .order('confidence', { ascending: false })

    if (factsError) {
      console.error('Error fetching household facts:', factsError)
      return NextResponse.json({ error: 'Failed to fetch household facts' }, { status: 500 })
    }

    // Build household map
    const householdMap = buildHouseholdMap(
      user.id,
      (facts || []).map((f: any) => ({
        id: f.id,
        userId: f.user_id,
        category: f.category,
        subcategory: f.subcategory,
        factKey: f.fact_key,
        factValue: f.fact_value,
        confidence: f.confidence,
        dataPoints: f.data_points,
        lastConfirmedAt: f.last_confirmed_at,
        discoveredFrom: f.discovered_from,
        supportingEvidence: f.supporting_evidence || [],
        createdAt: f.created_at,
        updatedAt: f.updated_at,
      }))
    )

    console.log(`🗺️ Household map for user ${user.id}:`)
    console.log(`   Completeness: ${householdMap.completeness.toFixed(0)}%`)
    console.log(`   Total facts: ${householdMap.facts.length}`)
    console.log(`   People: ${householdMap.people.length}`)
    console.log(`   Pets: ${householdMap.pets.length}`)
    console.log(`   Patterns: ${householdMap.patterns.length}`)

    return NextResponse.json({
      success: true,
      map: householdMap,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Household map error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    )
  }
}
