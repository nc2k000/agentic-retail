/**
 * TV Purchase Decision Tree
 *
 * Guides users through selecting the right TV based on:
 * - Room size / viewing distance
 * - Usage (movies, gaming, sports)
 * - Budget
 * - Display technology preferences
 */

import type { DecisionTree } from '@/types'

export const TV_DECISION_TREE: DecisionTree = {
  id: 'tv-purchase',
  name: 'Find Your Perfect TV',
  description: 'Let\'s find the right TV for your space and budget',
  category: 'Electronics',
  rootNodeId: 'room-size',
  estimatedTime: '1 minute',

  nodes: [
    // Question 1: Room Size / Viewing Distance
    {
      id: 'room-size',
      type: 'question',
      question: 'How far will you be sitting from the TV?',
      description: 'This helps us determine the optimal screen size for comfortable viewing',
      filterKey: 'screen_size',
      options: [
        {
          label: '4-6 feet (Small bedroom, office)',
          value: '4-6ft',
          description: 'Ideal for 32-43 inch TVs',
          nextNodeId: 'primary-use',
          filterValue: { min: 32, max: 43 },
        },
        {
          label: '6-9 feet (Medium bedroom, apartment living room)',
          value: '6-9ft',
          description: 'Ideal for 43-55 inch TVs',
          nextNodeId: 'primary-use',
          filterValue: { min: 43, max: 55 },
        },
        {
          label: '9-12 feet (Large living room)',
          value: '9-12ft',
          description: 'Ideal for 55-65 inch TVs',
          nextNodeId: 'primary-use',
          filterValue: { min: 55, max: 65 },
        },
        {
          label: '12+ feet (Home theater, large space)',
          value: '12ft+',
          description: 'Ideal for 65-85+ inch TVs',
          nextNodeId: 'primary-use',
          filterValue: { min: 65, max: 100 },
        },
      ],
    },

    // Question 2: Primary Use
    {
      id: 'primary-use',
      type: 'question',
      question: 'What will you primarily use this TV for?',
      description: 'Different uses require different features',
      filterKey: 'primary_use',
      options: [
        {
          label: 'Movies & Streaming',
          value: 'movies',
          description: 'Netflix, Disney+, HBO Max - need great picture quality',
          nextNodeId: 'budget',
          filterValue: 'movies',
        },
        {
          label: 'Gaming (PS5, Xbox, PC)',
          value: 'gaming',
          description: 'Need 120Hz, low input lag, HDMI 2.1',
          nextNodeId: 'budget',
          filterValue: 'gaming',
        },
        {
          label: 'Sports & Live TV',
          value: 'sports',
          description: 'Fast motion handling, bright display',
          nextNodeId: 'budget',
          filterValue: 'sports',
        },
        {
          label: 'General / Mixed Use',
          value: 'general',
          description: 'A bit of everything',
          nextNodeId: 'budget',
          filterValue: 'general',
        },
      ],
    },

    // Question 3: Budget (FINAL QUESTION - goes straight to recommendation)
    {
      id: 'budget',
      type: 'question',
      question: 'What\'s your budget?',
      filterKey: 'budget',
      options: [
        {
          label: 'Under $300',
          value: 'budget',
          nextNodeId: 'recommendation-tv',
          filterValue: { max: 300 },
        },
        {
          label: '$300 - $600',
          value: 'mid-range',
          nextNodeId: 'recommendation-tv',
          filterValue: { min: 300, max: 600 },
        },
        {
          label: '$600 - $1200',
          value: 'premium',
          nextNodeId: 'recommendation-tv',
          filterValue: { min: 600, max: 1200 },
        },
        {
          label: '$1200+',
          value: 'flagship',
          nextNodeId: 'recommendation-tv',
          filterValue: { min: 1200 },
        },
      ],
    },

    // REMOVED: display-tech and smart-features questions (too verbose for streamlined UX)
    // Now 3 quick questions: room size → usage → budget → recommendations

    // Recommendation Node
    {
      id: 'recommendation-tv',
      type: 'recommendation',
      question: 'Perfect! Let me find the best TVs for you based on your space, usage, and budget.',
      recommendedSkus: [],
    },
  ],
}
