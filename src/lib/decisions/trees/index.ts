/**
 * Decision Trees Registry
 *
 * All available decision trees for the application.
 * Trees are imported from individual files for better organization.
 */

import type { DecisionTree } from '@/types'

// Import individual trees
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
 * Get tree by ID
 */
export function getTreeById(treeId: string): DecisionTree | undefined {
  return DECISION_TREES.find(tree => tree.id === treeId)
}

/**
 * Get trees by category
 */
export function getTreesByCategory(category: string): DecisionTree[] {
  return DECISION_TREES.filter(tree => tree.category === category)
}
