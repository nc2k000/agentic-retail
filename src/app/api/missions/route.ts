import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/missions
 *
 * Get active missions for the current user, optionally filtered by tree_id
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const treeId = searchParams.get('treeId')

    let query = supabase
      .from('missions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('last_active_at', { ascending: false })

    if (treeId) {
      query = query.eq('tree_id', treeId)
    }

    const { data: missions, error } = await query

    if (error) {
      console.error('Error fetching missions:', error)
      return NextResponse.json({ error: 'Failed to fetch missions' }, { status: 500 })
    }

    // Filter out abandoned missions (inactive past threshold)
    const activeMissions = missions?.filter((m: any) => {
      if (m.abandoned_at) return false
      if (!m.last_active_at || !m.abandon_threshold_hours) return true

      const hoursSinceActive = (Date.now() - new Date(m.last_active_at).getTime()) / (1000 * 60 * 60)
      return hoursSinceActive < m.abandon_threshold_hours
    }) || []

    return NextResponse.json({ missions: activeMissions })
  } catch (error) {
    console.error('Missions API error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

/**
 * POST /api/missions
 *
 * Create or update a mission (upsert based on tree_id)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      treeId,
      query,
      treeAnswers,
      treeFilters,
      treeCompleted,
      funnelStage,
      recommendedProducts
    } = body

    if (!treeId) {
      return NextResponse.json({ error: 'Missing treeId' }, { status: 400 })
    }

    console.log(`💾 Saving mission for tree: ${treeId}`)

    // Check if mission already exists for this tree
    const { data: existing } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', user.id)
      .eq('tree_id', treeId)
      .eq('status', 'active')
      .order('last_active_at', { ascending: false })
      .limit(1)
      .single()

    const existingMission = existing as any
    let mission

    if (existingMission) {
      // Update existing mission
      const updateData: any = {
        tree_answers: treeAnswers || existingMission.tree_answers,
        tree_filters: treeFilters || existingMission.tree_filters,
        tree_completed: treeCompleted ?? existingMission.tree_completed,
        funnel_stage: funnelStage || existingMission.funnel_stage,
        last_active_at: new Date().toISOString(),
      }

      // Only update recommendedProducts if provided
      if (recommendedProducts !== undefined) {
        updateData.recommended_products = recommendedProducts
      }

      const { data: updated, error: updateError } = await (supabase
        .from('missions') as any)
        .update(updateData)
        .eq('id', existingMission.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating mission:', updateError)
        return NextResponse.json({ error: 'Failed to update mission' }, { status: 500 })
      }

      mission = updated
      console.log(`  ✅ Updated mission ${mission.id}`)
    } else {
      // Create new mission
      const insertData: any = {
        user_id: user.id,
        query: query || `${treeId} search`,
        type: 'research', // Decision trees are research missions
        status: 'active',
        tree_id: treeId,
        tree_answers: treeAnswers || {},
        tree_filters: treeFilters || {},
        tree_completed: treeCompleted || false,
        funnel_stage: funnelStage || 'browsing',
        last_active_at: new Date().toISOString(),
        abandon_threshold_hours: 168, // 7 days for research missions
      }

      // Only set recommendedProducts if provided
      if (recommendedProducts !== undefined) {
        insertData.recommended_products = recommendedProducts
      }

      const { data: created, error: createError } = await (supabase
        .from('missions') as any)
        .insert(insertData)
        .select()
        .single()

      if (createError) {
        console.error('Error creating mission:', createError)
        return NextResponse.json({ error: 'Failed to create mission' }, { status: 500 })
      }

      mission = created
      console.log(`  ✅ Created mission ${mission.id}`)
    }

    return NextResponse.json({ success: true, mission })
  } catch (error) {
    console.error('Missions API error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

/**
 * PATCH /api/missions/:id
 *
 * Update mission status (complete/abandon)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { missionId, status, treeCompleted } = body

    if (!missionId) {
      return NextResponse.json({ error: 'Missing missionId' }, { status: 400 })
    }

    const updates: any = {}

    if (status) {
      updates.status = status
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString()
      } else if (status === 'abandoned') {
        updates.abandoned_at = new Date().toISOString()
      }
    }

    if (treeCompleted !== undefined) {
      updates.tree_completed = treeCompleted
    }

    const { data: mission, error } = await (supabase
      .from('missions') as any)
      .update(updates)
      .eq('id', missionId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating mission status:', error)
      return NextResponse.json({ error: 'Failed to update mission' }, { status: 500 })
    }

    console.log(`✅ Updated mission ${missionId} status to ${status}`)

    return NextResponse.json({ success: true, mission })
  } catch (error) {
    console.error('Missions API error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
