/**
 * Coffee Machine Purchase Decision Tree
 *
 * Guides users through selecting the right coffee machine based on:
 * - Coffee type preference (espresso, drip, single-serve)
 * - Household size / daily consumption
 * - Budget
 */

import type { DecisionTree } from '@/types'

export const COFFEE_MACHINE_DECISION_TREE: DecisionTree = {
  id: 'coffee-machine-purchase',
  name: 'Find Your Perfect Coffee Machine',
  description: 'Let\'s find the right coffee machine for your lifestyle and budget',
  category: 'Appliances',
  rootNodeId: 'coffee-type',
  estimatedTime: '1 minute',

  nodes: [
    // Question 1: Coffee Type Preference
    {
      id: 'coffee-type',
      type: 'question',
      question: 'What type of coffee do you primarily drink?',
      description: 'This determines the machine type that\'s best for you',
      filterKey: 'coffee_type',
      options: [
        {
          label: 'Espresso-based drinks (lattes, cappuccinos)',
          value: 'espresso',
          description: 'Need espresso machine or super-automatic',
          nextNodeId: 'household-size',
          filterValue: 'espresso',
        },
        {
          label: 'Drip coffee (traditional brewed coffee)',
          value: 'drip',
          description: 'Need drip coffee maker',
          nextNodeId: 'household-size',
          filterValue: 'drip',
        },
        {
          label: 'Single-serve pods (K-Cups, Nespresso)',
          value: 'pods',
          description: 'Need pod-based machine',
          nextNodeId: 'household-size',
          filterValue: 'pods',
        },
        {
          label: 'Cold brew / specialty',
          value: 'specialty',
          description: 'Need cold brew maker or specialty machine',
          nextNodeId: 'household-size',
          filterValue: 'specialty',
        },
      ],
    },

    // Question 2: Household Size / Daily Consumption
    {
      id: 'household-size',
      type: 'question',
      question: 'How many cups of coffee do you make per day?',
      description: 'This helps us match you with the right capacity',
      filterKey: 'daily_cups',
      options: [
        {
          label: '1-2 cups (Just me)',
          value: '1-2',
          description: 'Small single-serve or compact machine',
          nextNodeId: 'budget',
          filterValue: { min: 1, max: 2 },
        },
        {
          label: '3-5 cups (Small household)',
          value: '3-5',
          description: 'Medium capacity machine',
          nextNodeId: 'budget',
          filterValue: { min: 3, max: 5 },
        },
        {
          label: '6-10 cups (Family)',
          value: '6-10',
          description: 'Large capacity machine',
          nextNodeId: 'budget',
          filterValue: { min: 6, max: 10 },
        },
        {
          label: '10+ cups (Large household / office)',
          value: '10+',
          description: 'Commercial-grade or high-capacity machine',
          nextNodeId: 'budget',
          filterValue: { min: 10, max: 20 },
        },
      ],
    },

    // Question 3: Budget (FINAL QUESTION)
    {
      id: 'budget',
      type: 'question',
      question: 'What\'s your budget?',
      filterKey: 'budget',
      options: [
        {
          label: 'Under $100',
          value: 'budget',
          nextNodeId: 'recommendation-coffee',
          filterValue: { max: 100 },
        },
        {
          label: '$100 - $300',
          value: 'mid-range',
          nextNodeId: 'recommendation-coffee',
          filterValue: { min: 100, max: 300 },
        },
        {
          label: '$300 - $600',
          value: 'premium',
          nextNodeId: 'recommendation-coffee',
          filterValue: { min: 300, max: 600 },
        },
        {
          label: '$600+',
          value: 'flagship',
          nextNodeId: 'recommendation-coffee',
          filterValue: { min: 600 },
        },
      ],
    },

    // Recommendation Node
    {
      id: 'recommendation-coffee',
      type: 'recommendation',
      question: 'Perfect! Let me find the best coffee machines for you based on your preferences, usage, and budget.',
      recommendedSkus: [],
    },
  ],
}
