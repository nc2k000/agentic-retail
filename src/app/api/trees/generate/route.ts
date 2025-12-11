/**
 * API Route: Generate AI Decision Tree
 *
 * POST /api/trees/generate
 * Body: { category: string }
 *
 * Returns the generated tree with its ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { getOrGenerateTreeForCategory } from '@/lib/decisions/trees'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category } = body

    if (!category || typeof category !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid category parameter' },
        { status: 400 }
      )
    }

    console.log(`🌲 API: Generating tree for category: ${category}`)

    // Generate or get cached tree
    const tree = await getOrGenerateTreeForCategory(category)

    console.log(`✅ API: Tree ready - ${tree.id}`)

    return NextResponse.json({
      success: true,
      tree: {
        id: tree.id,
        category: tree.category,
        name: tree.name,
        description: tree.description,
        questionCount: tree.nodes.filter(n => n.type === 'question').length,
        estimatedTime: tree.estimatedTime,
      },
    })
  } catch (error: any) {
    console.error('❌ API: Error generating tree:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate decision tree',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
