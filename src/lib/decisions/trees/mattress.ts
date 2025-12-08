/**
 * Mattress Purchase Decision Tree
 *
 * Guides users through selecting the right mattress based on:
 * - Sleeping position
 * - Firmness preference
 * - Size needed
 * - Budget
 */

import type { DecisionTree } from '@/types'

export const MATTRESS_DECISION_TREE: DecisionTree = {
  id: 'mattress-purchase',
  name: 'Find Your Perfect Mattress',
  description: 'Let\'s find the right mattress for your sleep style and budget',
  category: 'Furniture & Bedding',
  rootNodeId: 'sleeping-position',
  estimatedTime: '1 minute',

  nodes: [
    // Question 1: Sleeping Position
    {
      id: 'sleeping-position',
      type: 'question',
      question: 'What\'s your primary sleeping position?',
      description: 'Different positions need different support levels',
      filterKey: 'sleeping_position',
      options: [
        {
          label: 'Side sleeper',
          value: 'side',
          description: 'Need pressure relief for shoulders & hips',
          nextNodeId: 'firmness',
          filterValue: 'side',
        },
        {
          label: 'Back sleeper',
          value: 'back',
          description: 'Need lumbar support and alignment',
          nextNodeId: 'firmness',
          filterValue: 'back',
        },
        {
          label: 'Stomach sleeper',
          value: 'stomach',
          description: 'Need firmer support to prevent sagging',
          nextNodeId: 'firmness',
          filterValue: 'stomach',
        },
        {
          label: 'Combination (I switch positions)',
          value: 'combo',
          description: 'Need balanced support for all positions',
          nextNodeId: 'firmness',
          filterValue: 'combo',
        },
      ],
    },

    // Question 2: Firmness Preference
    {
      id: 'firmness',
      type: 'question',
      question: 'What firmness level do you prefer?',
      description: 'Firmness affects comfort and support',
      filterKey: 'firmness',
      options: [
        {
          label: 'Soft / Plush (sink-in feel)',
          value: 'soft',
          description: 'Best for side sleepers, pressure relief',
          nextNodeId: 'mattress-size',
          filterValue: 'soft',
        },
        {
          label: 'Medium (balanced feel)',
          value: 'medium',
          description: 'Most popular, works for most sleepers',
          nextNodeId: 'mattress-size',
          filterValue: 'medium',
        },
        {
          label: 'Firm (supportive feel)',
          value: 'firm',
          description: 'Best for back/stomach sleepers, heavier individuals',
          nextNodeId: 'mattress-size',
          filterValue: 'firm',
        },
        {
          label: 'Extra Firm (very supportive)',
          value: 'extra-firm',
          description: 'Maximum support, minimal sink',
          nextNodeId: 'mattress-size',
          filterValue: 'extra-firm',
        },
      ],
    },

    // Question 3: Mattress Size
    {
      id: 'mattress-size',
      type: 'question',
      question: 'What size mattress do you need?',
      description: 'Choose based on room size and sleeping partners',
      filterKey: 'mattress_size',
      options: [
        {
          label: 'Twin / Twin XL (single person)',
          value: 'twin',
          description: '38" x 75" or 38" x 80"',
          nextNodeId: 'budget',
          filterValue: 'twin',
        },
        {
          label: 'Full / Double (single or couple)',
          value: 'full',
          description: '54" x 75"',
          nextNodeId: 'budget',
          filterValue: 'full',
        },
        {
          label: 'Queen (most popular)',
          value: 'queen',
          description: '60" x 80"',
          nextNodeId: 'budget',
          filterValue: 'queen',
        },
        {
          label: 'King / Cal King (spacious)',
          value: 'king',
          description: '76" x 80" or 72" x 84"',
          nextNodeId: 'budget',
          filterValue: 'king',
        },
      ],
    },

    // Question 4: Budget (FINAL QUESTION)
    {
      id: 'budget',
      type: 'question',
      question: 'What\'s your budget?',
      filterKey: 'budget',
      options: [
        {
          label: 'Under $500 (Budget)',
          value: 'budget',
          nextNodeId: 'recommendation-mattress',
          filterValue: { max: 500 },
        },
        {
          label: '$500 - $1000 (Mid-range)',
          value: 'mid-range',
          nextNodeId: 'recommendation-mattress',
          filterValue: { min: 500, max: 1000 },
        },
        {
          label: '$1000 - $2000 (Premium)',
          value: 'premium',
          nextNodeId: 'recommendation-mattress',
          filterValue: { min: 1000, max: 2000 },
        },
        {
          label: '$2000+ (Luxury)',
          value: 'flagship',
          nextNodeId: 'recommendation-mattress',
          filterValue: { min: 2000 },
        },
      ],
    },

    // Recommendation Node
    {
      id: 'recommendation-mattress',
      type: 'recommendation',
      question: 'Perfect! Let me find the best mattresses for you based on your sleep position, firmness preference, size, and budget.',
      recommendedSkus: [],
    },
  ],
}
