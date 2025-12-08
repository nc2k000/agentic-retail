/**
 * Decision Tree Trigger System
 *
 * Analyzes user queries to determine if a decision tree should be activated.
 * Uses keyword matching and intent detection to suggest appropriate trees.
 */

import type { DecisionTree } from '@/types'
import { DECISION_TREES } from './trees'

export interface TriggerMatch {
  tree: DecisionTree
  confidence: number // 0-1, how confident we are this tree is relevant
  matchReason: string // Why we think this tree matches
  triggers: string[] // Which triggers matched
}

export interface TreeTrigger {
  treeId: string
  keywords: string[] // Phrases that trigger this tree
  categories?: string[] // Product categories that trigger this tree
  minConfidence?: number // Minimum confidence to activate (default 0.7)
  priority?: number // Higher priority trees are suggested first
}

/**
 * Trigger definitions for each decision tree
 */
const TREE_TRIGGERS: TreeTrigger[] = [
  // TV Decision Tree
  {
    treeId: 'tv-purchase',
    keywords: [
      'tv',
      'television',
      'smart tv',
      '4k tv',
      'oled',
      'qled',
      'need a tv',
      'buy a tv',
      'looking for tv',
      'help me choose tv',
      'which tv',
      'tv recommendation',
      'best tv',
      'tv for',
    ],
    categories: ['Electronics', 'TV & Video'],
    priority: 10,
  },

  // Appliance Decision Tree
  {
    treeId: 'appliance-purchase',
    keywords: [
      'refrigerator',
      'fridge',
      'washer',
      'washing machine',
      'dryer',
      'dishwasher',
      'oven',
      'stove',
      'microwave',
      'need appliance',
      'buy appliance',
      'looking for appliance',
      'which appliance',
      'appliance recommendation',
    ],
    categories: ['Appliances', 'Major Appliances'],
    priority: 9,
  },

  // Furniture Decision Tree
  {
    treeId: 'furniture-purchase',
    keywords: [
      'couch',
      'sofa',
      'sectional',
      'mattress',
      'bed',
      'bed frame',
      'dining table',
      'desk',
      'chair',
      'furniture',
      'need furniture',
      'buy furniture',
      'looking for furniture',
      'which furniture',
      'furniture recommendation',
    ],
    categories: ['Furniture', 'Home Furniture'],
    priority: 8,
  },
]

/**
 * Analyze query and return matching decision trees
 */
export function analyzeTriggers(userQuery: string, context?: {
  currentCategory?: string
  recentProducts?: string[]
}): TriggerMatch[] {
  const query = userQuery.toLowerCase().trim()
  const matches: TriggerMatch[] = []

  for (const trigger of TREE_TRIGGERS) {
    const tree = DECISION_TREES.find(t => t.id === trigger.treeId)
    if (!tree) continue

    const matchedKeywords: string[] = []
    let confidence = 0

    // Check keyword matches
    for (const keyword of trigger.keywords) {
      if (query.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword)

        // Exact match vs partial match scoring
        const words = query.split(/\s+/)
        if (words.includes(keyword.toLowerCase())) {
          confidence += 0.3 // Exact word match
        } else {
          confidence += 0.15 // Partial/phrase match
        }
      }
    }

    // Check category matches (if context provided)
    if (context?.currentCategory && trigger.categories) {
      for (const category of trigger.categories) {
        if (context.currentCategory.toLowerCase().includes(category.toLowerCase())) {
          confidence += 0.2
          matchedKeywords.push(`category:${category}`)
        }
      }
    }

    // Boost confidence for question patterns
    const questionPatterns = [
      'help me',
      'which',
      'what',
      'how do i',
      'looking for',
      'need',
      'want to buy',
      'shopping for',
      'recommend',
    ]

    for (const pattern of questionPatterns) {
      if (query.includes(pattern)) {
        confidence += 0.1
        break
      }
    }

    // Cap confidence at 1.0
    confidence = Math.min(confidence, 1.0)

    // Only include if confidence meets threshold
    const minConfidence = trigger.minConfidence || 0.6
    if (confidence >= minConfidence && matchedKeywords.length > 0) {
      let matchReason = `Query matches ${tree.name.toLowerCase()}`
      if (matchedKeywords.length > 0) {
        matchReason += ` (keywords: ${matchedKeywords.slice(0, 3).join(', ')})`
      }

      matches.push({
        tree,
        confidence,
        matchReason,
        triggers: matchedKeywords,
      })
    }
  }

  // Sort by confidence (descending), then by priority
  matches.sort((a, b) => {
    if (Math.abs(a.confidence - b.confidence) > 0.1) {
      return b.confidence - a.confidence
    }
    const aPriority = TREE_TRIGGERS.find(t => t.treeId === a.tree.id)?.priority || 0
    const bPriority = TREE_TRIGGERS.find(t => t.treeId === b.tree.id)?.priority || 0
    return bPriority - aPriority
  })

  return matches
}

/**
 * Get the best matching tree (highest confidence)
 */
export function getBestMatch(userQuery: string, context?: {
  currentCategory?: string
  recentProducts?: string[]
}): TriggerMatch | null {
  const matches = analyzeTriggers(userQuery, context)
  return matches.length > 0 ? matches[0] : null
}

/**
 * Check if query should trigger a decision tree
 */
export function shouldTriggerTree(userQuery: string, minConfidence = 0.7): boolean {
  const bestMatch = getBestMatch(userQuery)
  return bestMatch !== null && bestMatch.confidence >= minConfidence
}

/**
 * Get tree by ID
 */
export function getTreeById(treeId: string): DecisionTree | null {
  return DECISION_TREES.find(t => t.id === treeId) || null
}

/**
 * Get all available trees
 */
export function getAllTrees(): DecisionTree[] {
  return [...DECISION_TREES]
}

/**
 * Suggest a tree based on user query (for AI to use in prompts)
 */
export function suggestTree(userQuery: string): {
  shouldSuggest: boolean
  tree?: DecisionTree
  suggestion?: string
} {
  const bestMatch = getBestMatch(userQuery)

  if (!bestMatch || bestMatch.confidence < 0.6) {
    return { shouldSuggest: false }
  }

  // Generate suggestion text for AI
  const suggestion = `I can help you find the perfect ${bestMatch.tree.name.toLowerCase().replace(' decision', '')} by asking you a few questions. This will help me understand your needs and recommend the best options. Would you like me to walk you through it?`

  return {
    shouldSuggest: true,
    tree: bestMatch.tree,
    suggestion,
  }
}
