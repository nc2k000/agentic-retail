import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * DELETE /api/missions/delete-all
 *
 * Deletes all missions for the current user (for testing)
 * DANGEROUS - use only for development/testing
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`🗑️  Deleting all missions for user: ${user.email}`)

    // First, check what missions exist
    const { data: existingMissions } = await supabase
      .from('missions')
      .select('id, tree_id, status')
      .eq('user_id', user.id)

    console.log(`  Found ${existingMissions?.length || 0} missions:`, existingMissions)

    // Delete ALL missions regardless of status
    const { error: deleteError, count } = await supabase
      .from('missions')
      .delete()
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting missions:', deleteError)
      return NextResponse.json({ error: 'Failed to delete missions' }, { status: 500 })
    }

    console.log(`✅ Deleted ${count || 0} missions`)

    return NextResponse.json({
      success: true,
      deleted: count || 0,
      message: `Deleted ${count || 0} missions for ${user.email}`
    })
  } catch (error) {
    console.error('Delete missions error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
