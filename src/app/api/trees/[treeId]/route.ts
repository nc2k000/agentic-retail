/**
 * API Route: Get Decision Tree by ID
 *
 * GET /api/trees/[treeId]
 *
 * Returns a decision tree (hardcoded or AI-generated)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getTreeById, getOrGenerateTreeForCategory } from '@/lib/decisions/trees'

export async function GET(
  request: NextRequest,
  { params }: { params: { treeId: string } }
) {
  try {
    const { treeId } = params

    console.log(`📥 API: Get tree by ID: ${treeId}`)

    // Try hardcoded trees first
    let tree = getTreeById(treeId)

    if (tree) {
      console.log(`✅ API: Found hardcoded tree: ${tree.id}`)
      return NextResponse.json({ success: true, tree })
    }

    // Not found in hardcoded - try to extract category and generate AI tree
    // Tree ID format: "category_timestamp" or "category-decision-tree"
    let category: string | null = null

    // Try underscore format (e.g., "beverages_1765421282160")
    const underscoreMatch = treeId.match(/^([a-z-]+)_\d+$/)
    if (underscoreMatch) {
      // Handle both single word and hyphenated categories
      category = underscoreMatch[1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    // Try kebab format (e.g., "beverages-decision-tree")
    if (!category) {
      const kebabMatch = treeId.match(/^([a-z-]+)-decision-tree$/)
      if (kebabMatch) {
        category = kebabMatch[1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
    }

    if (!category) {
      console.log(`❌ API: Could not extract category from tree ID: ${treeId}`)
      return NextResponse.json(
        { error: 'Tree not found', treeId },
        { status: 404 }
      )
    }

    console.log(`🌲 API: Generating AI tree for category: ${category}`)
    tree = await getOrGenerateTreeForCategory(category)

    console.log(`✅ API: AI tree loaded: ${tree.id}`)

    return NextResponse.json({ success: true, tree })
  } catch (error: any) {
    console.error('❌ API: Error getting tree:', error)

    return NextResponse.json(
      {
        error: 'Failed to get decision tree',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
