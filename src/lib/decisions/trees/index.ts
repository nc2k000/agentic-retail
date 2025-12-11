/**
 * Decision Trees Registry
 *
 * All available decision trees for the application.
 * Trees are imported from individual files for better organization.
 *
 * Phase 2: AI-generated trees are loaded dynamically and cached.
 */

import type { DecisionTree } from '@/types/decisions'
import { getOrGenerateTree } from '@/lib/ai/tree-cache'
import { convertAITreeToDecisionTree } from '@/lib/ai/tree-adapter'

// Import individual trees (Phase 1 - hardcoded fallbacks)
import { TV_DECISION_TREE } from './tv'
import { APPLIANCE_DECISION_TREE } from './appliance'
import { FURNITURE_DECISION_TREE } from './furniture'
import { COFFEE_MACHINE_DECISION_TREE } from './coffee'
import { PAINT_DECISION_TREE } from './paint'
import { MATTRESS_DECISION_TREE } from './mattress'
import { POWER_TOOL_DECISION_TREE } from './power-tool'

/**
 * All available decision trees
 */
export const DECISION_TREES: DecisionTree[] = [
  TV_DECISION_TREE,
  APPLIANCE_DECISION_TREE,
  FURNITURE_DECISION_TREE,
  COFFEE_MACHINE_DECISION_TREE,
  PAINT_DECISION_TREE,
  MATTRESS_DECISION_TREE,
  POWER_TOOL_DECISION_TREE,
]

/**
 * In-memory cache for AI-generated trees
 * This avoids regenerating trees on every request
 */
const aiTreeCache = new Map<string, DecisionTree>()

/**
 * Get tree by ID (checks both hardcoded and AI-generated trees)
 */
export function getTreeById(treeId: string): DecisionTree | undefined {
  // Check hardcoded trees first
  const hardcodedTree = DECISION_TREES.find(tree => tree.id === treeId)
  if (hardcodedTree) {
    return hardcodedTree
  }

  // Check AI tree cache
  return aiTreeCache.get(treeId)
}

/**
 * Get tree by ID (async version that can generate AI trees)
 * Use this when you need to ensure AI trees are loaded
 */
export async function getTreeByIdAsync(treeId: string): Promise<DecisionTree | undefined> {
  // Check hardcoded trees first
  const hardcodedTree = DECISION_TREES.find(tree => tree.id === treeId)
  if (hardcodedTree) {
    return hardcodedTree
  }

  // Check cache
  if (aiTreeCache.has(treeId)) {
    return aiTreeCache.get(treeId)
  }

  // Try to extract category from treeId (format: "category-decision-tree")
  // Example: "beverages-decision-tree" -> "Beverages"
  const categoryMatch = treeId.match(/^(.+)-decision-tree$/)
  if (!categoryMatch) {
    return undefined
  }

  const category = categoryMatch[1]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  try {
    // Generate and cache the AI tree
    const aiTree = await getOrGenerateTree(category, { maxQuestions: 4 })
    const decisionTree = convertAITreeToDecisionTree(aiTree)

    // Cache it
    aiTreeCache.set(treeId, decisionTree)

    return decisionTree
  } catch (error) {
    console.error(`Failed to generate AI tree for ${category}:`, error)
    return undefined
  }
}

/**
 * Get trees by category
 */
export function getTreesByCategory(category: string): DecisionTree[] {
  return DECISION_TREES.filter(tree => tree.category === category)
}

/**
 * Get or generate AI tree for a category
 * Falls back to hardcoded tree if AI generation fails
 */
export async function getOrGenerateTreeForCategory(
  category: string
): Promise<DecisionTree> {
  try {
    // Try to get AI-generated tree
    console.log(`🌲 Getting AI tree for category: ${category}`)
    const aiTree = await getOrGenerateTree(category, {
      maxQuestions: 4,
    })

    // Convert to DecisionTree format
    const decisionTree = convertAITreeToDecisionTree(aiTree)
    console.log(`✅ AI tree loaded: ${decisionTree.id}`)

    // Cache it in memory for quick lookup
    aiTreeCache.set(decisionTree.id, decisionTree)

    return decisionTree
  } catch (error) {
    // Fall back to hardcoded trees
    console.warn(`⚠️  AI tree generation failed for ${category}, using fallback:`, error)

    const fallbackTree = getTreesByCategory(category)[0]
    if (!fallbackTree) {
      throw new Error(`No tree available for category: ${category}`)
    }

    console.log(`📋 Using hardcoded fallback tree: ${fallbackTree.id}`)
    return fallbackTree
  }
}
