/**
 * Appliance Purchase Decision Tree
 *
 * Guides users through selecting major appliances:
 * - Refrigerator, Washer, Dryer, Dishwasher, Oven, etc.
 */

import type { DecisionTree } from '@/types'

export const APPLIANCE_DECISION_TREE: DecisionTree = {
  id: 'appliance-purchase',
  name: 'Appliance Purchase Decision',
  description: 'Find the right appliance for your home with expert guidance',
  category: 'Appliances',
  rootNodeId: 'appliance-type',
  estimatedTime: '3-4 minutes',

  nodes: [
    // Question 1: Which appliance?
    {
      id: 'appliance-type',
      type: 'question',
      question: 'Which appliance are you shopping for?',
      filterKey: 'appliance_type',
      options: [
        {
          label: 'Refrigerator',
          value: 'refrigerator',
          nextNodeId: 'fridge-style',
          filterValue: 'refrigerator',
        },
        {
          label: 'Washing Machine',
          value: 'washer',
          nextNodeId: 'washer-type',
          filterValue: 'washer',
        },
        {
          label: 'Dryer',
          value: 'dryer',
          nextNodeId: 'dryer-type',
          filterValue: 'dryer',
        },
        {
          label: 'Dishwasher',
          value: 'dishwasher',
          nextNodeId: 'household-size',
          filterValue: 'dishwasher',
        },
      ],
    },

    // REFRIGERATOR PATH
    {
      id: 'fridge-style',
      type: 'question',
      question: 'What style of refrigerator do you prefer?',
      description: 'Different styles offer different storage configurations',
      filterKey: 'fridge_style',
      options: [
        {
          label: 'French Door (top fridge, bottom freezer with double doors)',
          value: 'french-door',
          description: 'Most popular, great for families',
          nextNodeId: 'fridge-size',
          filterValue: 'french-door',
        },
        {
          label: 'Side-by-Side (fridge and freezer next to each other)',
          value: 'side-by-side',
          description: 'Easy access to both compartments',
          nextNodeId: 'fridge-size',
          filterValue: 'side-by-side',
        },
        {
          label: 'Top Freezer (classic style, freezer on top)',
          value: 'top-freezer',
          description: 'Most affordable, energy efficient',
          nextNodeId: 'fridge-size',
          filterValue: 'top-freezer',
        },
        {
          label: 'Bottom Freezer (fridge on top, freezer below)',
          value: 'bottom-freezer',
          description: 'Fresh food at eye level',
          nextNodeId: 'fridge-size',
          filterValue: 'bottom-freezer',
        },
      ],
    },

    {
      id: 'fridge-size',
      type: 'question',
      question: 'How many people are in your household?',
      description: 'This helps determine the right capacity',
      filterKey: 'fridge_capacity',
      options: [
        {
          label: '1-2 people',
          value: '1-2',
          description: '18-22 cu ft recommended',
          nextNodeId: 'fridge-budget',
          filterValue: { min: 18, max: 22 },
        },
        {
          label: '3-4 people',
          value: '3-4',
          description: '22-26 cu ft recommended',
          nextNodeId: 'fridge-budget',
          filterValue: { min: 22, max: 26 },
        },
        {
          label: '5+ people',
          value: '5+',
          description: '26+ cu ft recommended',
          nextNodeId: 'fridge-budget',
          filterValue: { min: 26, max: 35 },
        },
      ],
    },

    {
      id: 'fridge-budget',
      type: 'question',
      question: 'What\'s your budget for the refrigerator?',
      filterKey: 'budget',
      options: [
        {
          label: 'Under $1,000',
          value: 'budget',
          nextNodeId: 'fridge-features',
          filterValue: { max: 1000 },
        },
        {
          label: '$1,000 - $2,000',
          value: 'mid-range',
          nextNodeId: 'fridge-features',
          filterValue: { min: 1000, max: 2000 },
        },
        {
          label: '$2,000 - $3,500',
          value: 'premium',
          nextNodeId: 'fridge-features',
          filterValue: { min: 2000, max: 3500 },
        },
        {
          label: '$3,500+',
          value: 'luxury',
          nextNodeId: 'fridge-features',
          filterValue: { min: 3500 },
        },
      ],
    },

    {
      id: 'fridge-features',
      type: 'question',
      question: 'Which features are most important to you?',
      description: 'Select the one that matters most',
      filterKey: 'top_feature',
      options: [
        {
          label: 'Ice & Water Dispenser',
          value: 'dispenser',
          nextNodeId: 'recommendation-appliance',
          filterValue: 'dispenser',
        },
        {
          label: 'Smart Features (Wi-Fi, app control)',
          value: 'smart',
          nextNodeId: 'recommendation-appliance',
          filterValue: 'smart',
        },
        {
          label: 'Energy Efficiency',
          value: 'energy-efficient',
          nextNodeId: 'recommendation-appliance',
          filterValue: 'energy-star',
        },
        {
          label: 'Maximum Storage Space',
          value: 'storage',
          nextNodeId: 'recommendation-appliance',
          filterValue: 'max-storage',
        },
      ],
    },

    // WASHER PATH
    {
      id: 'washer-type',
      type: 'question',
      question: 'What type of washing machine do you need?',
      filterKey: 'washer_type',
      options: [
        {
          label: 'Top Load (classic style, lid on top)',
          value: 'top-load',
          description: 'Most affordable, easy to use',
          nextNodeId: 'household-size',
          filterValue: 'top-load',
        },
        {
          label: 'Front Load (door on front)',
          value: 'front-load',
          description: 'More efficient, better cleaning',
          nextNodeId: 'household-size',
          filterValue: 'front-load',
        },
        {
          label: 'Combo Unit (washer + dryer in one)',
          value: 'combo',
          description: 'Space-saving, great for apartments',
          nextNodeId: 'household-size',
          filterValue: 'combo',
        },
      ],
    },

    // DRYER PATH
    {
      id: 'dryer-type',
      type: 'question',
      question: 'What type of dryer do you need?',
      filterKey: 'dryer_fuel',
      options: [
        {
          label: 'Electric Dryer',
          value: 'electric',
          description: 'Works with standard outlets',
          nextNodeId: 'household-size',
          filterValue: 'electric',
        },
        {
          label: 'Gas Dryer',
          value: 'gas',
          description: 'More energy efficient, requires gas line',
          nextNodeId: 'household-size',
          filterValue: 'gas',
        },
        {
          label: 'Ventless / Heat Pump',
          value: 'ventless',
          description: 'No external venting needed, apartment-friendly',
          nextNodeId: 'household-size',
          filterValue: 'ventless',
        },
      ],
    },

    // SHARED: Household Size
    {
      id: 'household-size',
      type: 'question',
      question: 'How many people are in your household?',
      filterKey: 'household_size',
      options: [
        {
          label: '1-2 people',
          value: '1-2',
          nextNodeId: 'appliance-budget',
          filterValue: 'small',
        },
        {
          label: '3-4 people',
          value: '3-4',
          nextNodeId: 'appliance-budget',
          filterValue: 'medium',
        },
        {
          label: '5+ people',
          value: '5+',
          nextNodeId: 'appliance-budget',
          filterValue: 'large',
        },
      ],
    },

    // SHARED: Budget
    {
      id: 'appliance-budget',
      type: 'question',
      question: 'What\'s your budget?',
      filterKey: 'budget',
      options: [
        {
          label: 'Under $500',
          value: 'budget',
          nextNodeId: 'recommendation-appliance',
          filterValue: { max: 500 },
        },
        {
          label: '$500 - $1,000',
          value: 'mid-range',
          nextNodeId: 'recommendation-appliance',
          filterValue: { min: 500, max: 1000 },
        },
        {
          label: '$1,000 - $1,500',
          value: 'premium',
          nextNodeId: 'recommendation-appliance',
          filterValue: { min: 1000, max: 1500 },
        },
        {
          label: '$1,500+',
          value: 'luxury',
          nextNodeId: 'recommendation-appliance',
          filterValue: { min: 1500 },
        },
      ],
    },

    // Recommendation
    {
      id: 'recommendation-appliance',
      type: 'recommendation',
      question: 'Great! Based on your preferences, here are my top appliance recommendations:\n\n🏠 These options match your household size, budget, and feature requirements. All include delivery and installation available.\n\nQuestions about any of these? I can help you compare features!',
      recommendedSkus: [
        'appliance-whirlpool-fridge',
        'appliance-lg-washer',
        'appliance-samsung-dryer',
      ],
    },
  ],
}
