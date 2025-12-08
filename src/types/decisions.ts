/**
 * Decision Tree Types
 *
 * Type definitions for the guided shopping decision tree system
 */

export type NodeType = 'question' | 'recommendation'

export interface DecisionOption {
  label: string
  value: string
  description?: string
  nextNodeId: string
  filterValue?: any
}

export interface DecisionNode {
  id: string
  type: NodeType
  question: string
  description?: string
  filterKey?: string
  options?: DecisionOption[]
  nextNodeId?: string
  recommendedSkus?: string[]
}

export interface DecisionTree {
  id: string
  name: string
  description: string
  category: string
  rootNodeId: string
  estimatedTime?: string
  nodes: DecisionNode[]
}
