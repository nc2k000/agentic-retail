/**
 * Paint Purchase Decision Tree
 *
 * Guides users through selecting the right paint based on:
 * - Project type (interior walls, exterior, wood stain)
 * - Surface condition
 * - Color preference (critical for SKU precision testing)
 * - Budget
 */

import type { DecisionTree } from '@/types'

export const PAINT_DECISION_TREE: DecisionTree = {
  id: 'paint-purchase',
  name: 'Find Your Perfect Paint',
  description: 'Let\'s find the right paint for your project',
  category: 'Home Improvement',
  rootNodeId: 'project-type',
  estimatedTime: '1 minute',

  nodes: [
    // Question 1: Project Type
    {
      id: 'project-type',
      type: 'question',
      question: 'What are you painting?',
      description: 'Different surfaces need different paint formulations',
      filterKey: 'project_type',
      options: [
        {
          label: 'Interior walls & ceilings',
          value: 'interior',
          description: 'Standard latex or acrylic paint',
          nextNodeId: 'finish-type',
          filterValue: 'interior',
        },
        {
          label: 'Exterior (house, fence, siding)',
          value: 'exterior',
          description: 'Weather-resistant exterior paint',
          nextNodeId: 'finish-type',
          filterValue: 'exterior',
        },
        {
          label: 'Wood stain & sealers',
          value: 'stain',
          description: 'For decks, furniture, cabinets',
          nextNodeId: 'finish-type',
          filterValue: 'stain',
        },
        {
          label: 'Specialty (primer, texture, metal)',
          value: 'specialty',
          description: 'Primers, textured coatings, metal paint',
          nextNodeId: 'finish-type',
          filterValue: 'specialty',
        },
      ],
    },

    // Question 2: Finish Type
    {
      id: 'finish-type',
      type: 'question',
      question: 'What finish do you prefer?',
      description: 'Finish affects appearance and durability',
      filterKey: 'finish',
      options: [
        {
          label: 'Flat / Matte (no shine)',
          value: 'flat',
          description: 'Hides imperfections, best for low-traffic areas',
          nextNodeId: 'color-family',
          filterValue: 'flat',
        },
        {
          label: 'Eggshell / Satin (slight sheen)',
          value: 'eggshell',
          description: 'Washable, good for living rooms & bedrooms',
          nextNodeId: 'color-family',
          filterValue: 'eggshell',
        },
        {
          label: 'Semi-gloss (moderate shine)',
          value: 'semigloss',
          description: 'Durable, ideal for kitchens & bathrooms',
          nextNodeId: 'color-family',
          filterValue: 'semigloss',
        },
        {
          label: 'High-gloss (very shiny)',
          value: 'gloss',
          description: 'Most durable, for trim & cabinets',
          nextNodeId: 'color-family',
          filterValue: 'gloss',
        },
      ],
    },

    // Question 3: Color Family (CRITICAL FOR SKU PRECISION)
    {
      id: 'color-family',
      type: 'question',
      question: 'What color family are you looking for?',
      description: 'This is critical for finding the exact SKU you need',
      filterKey: 'color_family',
      options: [
        {
          label: 'White & Off-White',
          value: 'white',
          description: 'Pure white, cream, ivory tones',
          nextNodeId: 'budget',
          filterValue: 'white',
        },
        {
          label: 'Gray & Neutral',
          value: 'gray',
          description: 'Gray, greige, taupe tones',
          nextNodeId: 'budget',
          filterValue: 'gray',
        },
        {
          label: 'Beige & Warm Neutrals',
          value: 'beige',
          description: 'Beige, tan, warm neutrals',
          nextNodeId: 'budget',
          filterValue: 'beige',
        },
        {
          label: 'Blue',
          value: 'blue',
          description: 'Light blue, navy, teal',
          nextNodeId: 'budget',
          filterValue: 'blue',
        },
        {
          label: 'Green',
          value: 'green',
          description: 'Sage, forest, mint',
          nextNodeId: 'budget',
          filterValue: 'green',
        },
        {
          label: 'Other colors (red, yellow, etc.)',
          value: 'other',
          description: 'Bold or specialty colors',
          nextNodeId: 'budget',
          filterValue: 'other',
        },
      ],
    },

    // Question 4: Budget (FINAL QUESTION)
    {
      id: 'budget',
      type: 'question',
      question: 'What\'s your budget per gallon?',
      filterKey: 'budget',
      options: [
        {
          label: 'Under $30 (Economy)',
          value: 'budget',
          nextNodeId: 'recommendation-paint',
          filterValue: { max: 30 },
        },
        {
          label: '$30 - $50 (Mid-range)',
          value: 'mid-range',
          nextNodeId: 'recommendation-paint',
          filterValue: { min: 30, max: 50 },
        },
        {
          label: '$50 - $80 (Premium)',
          value: 'premium',
          nextNodeId: 'recommendation-paint',
          filterValue: { min: 50, max: 80 },
        },
        {
          label: '$80+ (Designer/Specialty)',
          value: 'flagship',
          nextNodeId: 'recommendation-paint',
          filterValue: { min: 80 },
        },
      ],
    },

    // Recommendation Node
    {
      id: 'recommendation-paint',
      type: 'recommendation',
      question: 'Perfect! Let me find the best paint options for you based on your project, finish, color, and budget.',
      recommendedSkus: [],
    },
  ],
}
