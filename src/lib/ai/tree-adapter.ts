/**
 * AI Tree Adapter
 *
 * Converts AI-generated decision trees to the DecisionTree format
 * used by the conversation system
 */

import type { DecisionTree, DecisionNode, DecisionOption } from '@/types/decisions'
import type { GeneratedTree, GeneratedQuestion } from './types'

/**
 * Convert AI-generated tree to DecisionTree format
 */
export function convertAITreeToDecisionTree(aiTree: GeneratedTree): DecisionTree {
  const { treeId, category, questions } = aiTree

  // Convert questions to decision nodes
  const nodes: DecisionNode[] = questions.map((question, index) => {
    const isLastQuestion = index === questions.length - 1

    const options: DecisionOption[] = question.options.map((option) => ({
      label: option.label,
      value: option.id, // Use option ID as value
      description: option.example,
      nextNodeId: isLastQuestion
        ? 'results'
        : questions[index + 1]?.id || 'results',
      filterValue: option.filters,
    }))

    return {
      id: question.id,
      type: 'question' as const,
      question: question.text,
      filterKey: question.id, // Use question ID as filter key
      options,
    }
  })

  // Add results/recommendation node
  nodes.push({
    id: 'results',
    type: 'recommendation' as const,
    question: `Here are the ${category.toLowerCase()} that match your preferences:`,
    description: `Based on your answers, we'll show you the best options.`,
  })

  return {
    id: treeId,
    category,
    name: `${category} Decision Tree`,
    description: `AI-generated decision tree for ${category}`,
    rootNodeId: questions[0]?.id || 'results',
    estimatedTime: `${questions.length} questions`,
    nodes,
  }
}

/**
 * Extract all filters from a decision path
 * This combines all the filters from options selected in the conversation
 */
export function extractFiltersFromPath(
  tree: DecisionTree,
  selectedOptions: Array<{ nodeId: string; optionValue: string }>
): Record<string, any> {
  const allFilters: Record<string, any> = {}

  for (const { nodeId, optionValue } of selectedOptions) {
    const node = tree.nodes.find((n) => n.id === nodeId)
    if (!node || node.type !== 'question') continue

    const option = node.options?.find((o) => o.value === optionValue)
    if (!option?.filterValue) continue

    // Merge filters
    Object.assign(allFilters, option.filterValue)
  }

  return allFilters
}
