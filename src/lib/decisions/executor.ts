/**
 * Decision Tree Execution Engine
 *
 * State machine for executing multi-question decision trees in chat.
 * Tracks user answers, manages branching logic, and determines next questions.
 */

import type { DecisionTree, DecisionNode } from '@/types'

export interface DecisionState {
  treeId: string
  currentNodeId: string
  answers: Record<string, string> // nodeId -> answer
  productFilters: Record<string, any> // Accumulated filters from answers
  startedAt: string
  completedAt?: string
}

export interface DecisionStepResult {
  currentQuestion: DecisionNode
  progress: {
    current: number
    total: number
    percentComplete: number
  }
  isComplete: boolean
  recommendedProducts?: any[] // Final product recommendations
  nextNodeId?: string
}

/**
 * Decision Tree Executor
 * Manages state and flow through a decision tree
 */
export class DecisionTreeExecutor {
  private tree: DecisionTree
  private state: DecisionState

  constructor(tree: DecisionTree, existingState?: DecisionState) {
    this.tree = tree

    if (existingState) {
      this.state = existingState
    } else {
      // Initialize new state
      this.state = {
        treeId: tree.id,
        currentNodeId: tree.rootNodeId,
        answers: {},
        productFilters: {},
        startedAt: new Date().toISOString(),
      }
    }
  }

  /**
   * Get the current state (for persistence)
   */
  getState(): DecisionState {
    return { ...this.state }
  }

  /**
   * Get current question and progress
   */
  getCurrentStep(): DecisionStepResult {
    const currentNode = this.tree.nodes.find(n => n.id === this.state.currentNodeId)

    if (!currentNode) {
      throw new Error(`Node ${this.state.currentNodeId} not found in tree ${this.tree.id}`)
    }

    // Calculate progress
    const totalQuestions = this.tree.nodes.filter(n => n.type === 'question').length
    const answeredQuestions = Object.keys(this.state.answers).length
    const progress = {
      current: answeredQuestions + 1, // +1 for current question
      total: totalQuestions,
      percentComplete: Math.round((answeredQuestions / totalQuestions) * 100),
    }

    // Check if complete
    const isComplete = currentNode.type === 'recommendation'

    return {
      currentQuestion: currentNode,
      progress,
      isComplete,
      recommendedProducts: isComplete ? this.getRecommendedProducts(currentNode) : undefined,
      nextNodeId: this.state.currentNodeId,
    }
  }

  /**
   * Answer the current question and advance to next node
   */
  answerQuestion(answer: string): DecisionStepResult {
    const currentNode = this.tree.nodes.find(n => n.id === this.state.currentNodeId)

    if (!currentNode) {
      throw new Error(`Node ${this.state.currentNodeId} not found`)
    }

    if (currentNode.type !== 'question') {
      throw new Error(`Current node is not a question (type: ${currentNode.type})`)
    }

    // Store answer
    this.state.answers[currentNode.id] = answer

    // Update product filters if this question affects filtering
    if (currentNode.filterKey) {
      this.state.productFilters[currentNode.filterKey] = this.extractFilterValue(
        currentNode.filterKey,
        answer,
        currentNode
      )
    }

    // Determine next node based on answer
    const nextNodeId = this.determineNextNode(currentNode, answer)

    if (!nextNodeId) {
      throw new Error(`No next node found for answer "${answer}" at node ${currentNode.id}`)
    }

    this.state.currentNodeId = nextNodeId

    // Check if we reached a recommendation node
    const nextNode = this.tree.nodes.find(n => n.id === nextNodeId)
    if (nextNode?.type === 'recommendation') {
      this.state.completedAt = new Date().toISOString()
    }

    return this.getCurrentStep()
  }

  /**
   * Go back to previous question (undo last answer)
   */
  goBack(): DecisionStepResult | null {
    const answeredNodeIds = Object.keys(this.state.answers)

    if (answeredNodeIds.length === 0) {
      return null // Already at start
    }

    // Remove last answer
    const lastAnsweredNodeId = answeredNodeIds[answeredNodeIds.length - 1]
    delete this.state.answers[lastAnsweredNodeId]

    // Remove associated filter
    const lastNode = this.tree.nodes.find(n => n.id === lastAnsweredNodeId)
    if (lastNode?.filterKey) {
      delete this.state.productFilters[lastNode.filterKey]
    }

    // Set current node to the last answered node
    this.state.currentNodeId = lastAnsweredNodeId
    delete this.state.completedAt

    return this.getCurrentStep()
  }

  /**
   * Restart the tree from beginning
   */
  restart(): DecisionStepResult {
    this.state = {
      treeId: this.tree.id,
      currentNodeId: this.tree.rootNodeId,
      answers: {},
      productFilters: {},
      startedAt: new Date().toISOString(),
    }

    return this.getCurrentStep()
  }

  /**
   * Get accumulated product filters for search/recommendation
   */
  getProductFilters(): Record<string, any> {
    return { ...this.state.productFilters }
  }

  /**
   * Determine next node based on current node and answer
   */
  private determineNextNode(node: DecisionNode, answer: string): string | null {
    if (!node.options) {
      return node.nextNodeId || null
    }

    // Find matching option
    const selectedOption = node.options.find(opt => opt.value === answer)

    if (!selectedOption) {
      // Try case-insensitive match
      const selectedOptionCaseInsensitive = node.options.find(
        opt => opt.value.toLowerCase() === answer.toLowerCase()
      )
      if (selectedOptionCaseInsensitive) {
        return selectedOptionCaseInsensitive.nextNodeId
      }

      // Fallback to default next node
      return node.nextNodeId || null
    }

    return selectedOption.nextNodeId
  }

  /**
   * Extract filter value from answer
   */
  private extractFilterValue(filterKey: string, answer: string, node: DecisionNode): any {
    // Find the option to get its filter value
    const option = node.options?.find(opt => opt.value === answer)

    if (option?.filterValue !== undefined) {
      return option.filterValue
    }

    // Default: use the answer as-is
    return answer
  }

  /**
   * Get recommended products based on final node
   */
  private getRecommendedProducts(node: DecisionNode): any[] {
    // This will be implemented when we integrate with product search
    // For now, return the node's recommended SKUs or filters

    if (node.recommendedSkus && node.recommendedSkus.length > 0) {
      return node.recommendedSkus.map(sku => ({ sku }))
    }

    // Return accumulated filters for product search
    return [{ filters: this.state.productFilters }]
  }

  /**
   * Get summary of all answers
   */
  getAnswerSummary(): Array<{ question: string; answer: string }> {
    return Object.entries(this.state.answers).map(([nodeId, answer]) => {
      const node = this.tree.nodes.find(n => n.id === nodeId)
      return {
        question: node?.question || 'Unknown question',
        answer,
      }
    })
  }

  /**
   * Calculate completion time in seconds
   */
  getCompletionTime(): number | null {
    if (!this.state.completedAt) {
      return null
    }

    const startTime = new Date(this.state.startedAt).getTime()
    const endTime = new Date(this.state.completedAt).getTime()

    return Math.round((endTime - startTime) / 1000)
  }
}

/**
 * Helper: Create executor from tree
 */
export function createExecutor(tree: DecisionTree, existingState?: DecisionState): DecisionTreeExecutor {
  return new DecisionTreeExecutor(tree, existingState)
}

/**
 * Helper: Validate tree structure
 */
export function validateDecisionTree(tree: DecisionTree): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check root node exists
  const rootNode = tree.nodes.find(n => n.id === tree.rootNodeId)
  if (!rootNode) {
    errors.push(`Root node ${tree.rootNodeId} not found`)
  }

  // Check all nodes have valid structure
  for (const node of tree.nodes) {
    // Questions must have options or nextNodeId
    if (node.type === 'question') {
      if (!node.question) {
        errors.push(`Question node ${node.id} missing question text`)
      }

      if (!node.options && !node.nextNodeId) {
        errors.push(`Question node ${node.id} has no options and no nextNodeId`)
      }

      // Validate options
      if (node.options) {
        for (const option of node.options) {
          if (!option.label || !option.value) {
            errors.push(`Option in node ${node.id} missing label or value`)
          }
          if (!option.nextNodeId) {
            errors.push(`Option "${option.label}" in node ${node.id} missing nextNodeId`)
          }
        }
      }
    }

    // Recommendations must have products or message
    if (node.type === 'recommendation') {
      if (!node.recommendedSkus && !node.question) {
        errors.push(`Recommendation node ${node.id} has no products or message`)
      }
    }
  }

  // Check for orphaned nodes (unreachable from root)
  const reachableNodes = new Set<string>([tree.rootNodeId])
  const queue = [tree.rootNodeId]

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    const node = tree.nodes.find(n => n.id === nodeId)

    if (!node) continue

    // Add next nodes to queue
    if (node.nextNodeId && !reachableNodes.has(node.nextNodeId)) {
      reachableNodes.add(node.nextNodeId)
      queue.push(node.nextNodeId)
    }

    if (node.options) {
      for (const option of node.options) {
        if (!reachableNodes.has(option.nextNodeId)) {
          reachableNodes.add(option.nextNodeId)
          queue.push(option.nextNodeId)
        }
      }
    }
  }

  // Check for unreachable nodes
  for (const node of tree.nodes) {
    if (!reachableNodes.has(node.id)) {
      errors.push(`Node ${node.id} is unreachable from root`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
