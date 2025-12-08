/**
 * Furniture Purchase Decision Tree
 *
 * Guides users through selecting furniture:
 * - Couch/Sofa, Mattress, Dining Table, Desk, etc.
 */

import type { DecisionTree } from '@/types'

export const FURNITURE_DECISION_TREE: DecisionTree = {
  id: 'furniture-purchase',
  name: 'Furniture Purchase Decision',
  description: 'Find the perfect furniture for your space and style',
  category: 'Furniture',
  rootNodeId: 'furniture-type',
  estimatedTime: '3-4 minutes',

  nodes: [
    // Question 1: Which furniture?
    {
      id: 'furniture-type',
      type: 'question',
      question: 'What type of furniture are you looking for?',
      filterKey: 'furniture_type',
      options: [
        {
          label: 'Couch / Sofa',
          value: 'couch',
          nextNodeId: 'couch-type',
          filterValue: 'couch',
        },
        {
          label: 'Mattress',
          value: 'mattress',
          nextNodeId: 'mattress-size',
          filterValue: 'mattress',
        },
        {
          label: 'Dining Table',
          value: 'dining-table',
          nextNodeId: 'table-size',
          filterValue: 'dining-table',
        },
        {
          label: 'Desk',
          value: 'desk',
          nextNodeId: 'desk-use',
          filterValue: 'desk',
        },
      ],
    },

    // COUCH PATH
    {
      id: 'couch-type',
      type: 'question',
      question: 'What style of couch works best for your space?',
      filterKey: 'couch_type',
      options: [
        {
          label: 'Sectional (L-shaped or U-shaped)',
          value: 'sectional',
          description: 'Great for large spaces and entertaining',
          nextNodeId: 'couch-size',
          filterValue: 'sectional',
        },
        {
          label: 'Standard Sofa (3-seater)',
          value: 'standard-sofa',
          description: 'Classic, versatile',
          nextNodeId: 'couch-size',
          filterValue: 'standard-sofa',
        },
        {
          label: 'Loveseat (2-seater)',
          value: 'loveseat',
          description: 'Compact, perfect for smaller spaces',
          nextNodeId: 'couch-size',
          filterValue: 'loveseat',
        },
        {
          label: 'Sleeper Sofa',
          value: 'sleeper',
          description: 'Sofa + guest bed in one',
          nextNodeId: 'couch-size',
          filterValue: 'sleeper-sofa',
        },
      ],
    },

    {
      id: 'couch-size',
      type: 'question',
      question: 'How much space do you have?',
      description: 'Measure your room to be sure it fits!',
      filterKey: 'room_size',
      options: [
        {
          label: 'Small (apartment, under 200 sq ft)',
          value: 'small',
          description: 'Compact designs',
          nextNodeId: 'couch-material',
          filterValue: 'small',
        },
        {
          label: 'Medium (living room, 200-400 sq ft)',
          value: 'medium',
          description: 'Most popular sizes',
          nextNodeId: 'couch-material',
          filterValue: 'medium',
        },
        {
          label: 'Large (open concept, 400+ sq ft)',
          value: 'large',
          description: 'Spacious sectionals',
          nextNodeId: 'couch-material',
          filterValue: 'large',
        },
      ],
    },

    {
      id: 'couch-material',
      type: 'question',
      question: 'What material do you prefer?',
      filterKey: 'material',
      options: [
        {
          label: 'Fabric (soft, cozy)',
          value: 'fabric',
          nextNodeId: 'furniture-budget',
          filterValue: 'fabric',
        },
        {
          label: 'Leather (durable, easy to clean)',
          value: 'leather',
          nextNodeId: 'furniture-budget',
          filterValue: 'leather',
        },
        {
          label: 'Faux Leather (affordable alternative)',
          value: 'faux-leather',
          nextNodeId: 'furniture-budget',
          filterValue: 'faux-leather',
        },
        {
          label: 'No preference',
          value: 'no-preference',
          nextNodeId: 'furniture-budget',
          filterValue: null,
        },
      ],
    },

    // MATTRESS PATH
    {
      id: 'mattress-size',
      type: 'question',
      question: 'What size mattress do you need?',
      filterKey: 'mattress_size',
      options: [
        {
          label: 'Twin / Twin XL',
          value: 'twin',
          nextNodeId: 'mattress-type',
          filterValue: 'twin',
        },
        {
          label: 'Full / Double',
          value: 'full',
          nextNodeId: 'mattress-type',
          filterValue: 'full',
        },
        {
          label: 'Queen',
          value: 'queen',
          description: 'Most popular',
          nextNodeId: 'mattress-type',
          filterValue: 'queen',
        },
        {
          label: 'King / California King',
          value: 'king',
          nextNodeId: 'mattress-type',
          filterValue: 'king',
        },
      ],
    },

    {
      id: 'mattress-type',
      type: 'question',
      question: 'What type of mattress do you prefer?',
      filterKey: 'mattress_type',
      options: [
        {
          label: 'Memory Foam',
          value: 'memory-foam',
          description: 'Conforms to body, pressure relief',
          nextNodeId: 'mattress-firmness',
          filterValue: 'memory-foam',
        },
        {
          label: 'Innerspring',
          value: 'innerspring',
          description: 'Traditional, bouncy support',
          nextNodeId: 'mattress-firmness',
          filterValue: 'innerspring',
        },
        {
          label: 'Hybrid (foam + springs)',
          value: 'hybrid',
          description: 'Best of both worlds',
          nextNodeId: 'mattress-firmness',
          filterValue: 'hybrid',
        },
        {
          label: 'Latex',
          value: 'latex',
          description: 'Responsive, eco-friendly',
          nextNodeId: 'mattress-firmness',
          filterValue: 'latex',
        },
      ],
    },

    {
      id: 'mattress-firmness',
      type: 'question',
      question: 'How firm do you like your mattress?',
      filterKey: 'firmness',
      options: [
        {
          label: 'Soft (plush, sink-in feel)',
          value: 'soft',
          nextNodeId: 'furniture-budget',
          filterValue: 'soft',
        },
        {
          label: 'Medium (balanced comfort)',
          value: 'medium',
          description: 'Most popular',
          nextNodeId: 'furniture-budget',
          filterValue: 'medium',
        },
        {
          label: 'Firm (solid support)',
          value: 'firm',
          nextNodeId: 'furniture-budget',
          filterValue: 'firm',
        },
      ],
    },

    // DINING TABLE PATH
    {
      id: 'table-size',
      type: 'question',
      question: 'How many people do you need to seat?',
      filterKey: 'seating_capacity',
      options: [
        {
          label: '2-4 people',
          value: '2-4',
          nextNodeId: 'table-shape',
          filterValue: { min: 2, max: 4 },
        },
        {
          label: '4-6 people',
          value: '4-6',
          nextNodeId: 'table-shape',
          filterValue: { min: 4, max: 6 },
        },
        {
          label: '6-8 people',
          value: '6-8',
          nextNodeId: 'table-shape',
          filterValue: { min: 6, max: 8 },
        },
        {
          label: '8+ people',
          value: '8+',
          nextNodeId: 'table-shape',
          filterValue: { min: 8 },
        },
      ],
    },

    {
      id: 'table-shape',
      type: 'question',
      question: 'What shape works best for your space?',
      filterKey: 'table_shape',
      options: [
        {
          label: 'Rectangular',
          value: 'rectangular',
          description: 'Classic, fits most spaces',
          nextNodeId: 'furniture-budget',
          filterValue: 'rectangular',
        },
        {
          label: 'Round',
          value: 'round',
          description: 'Great for conversation',
          nextNodeId: 'furniture-budget',
          filterValue: 'round',
        },
        {
          label: 'Square',
          value: 'square',
          description: 'Compact, modern',
          nextNodeId: 'furniture-budget',
          filterValue: 'square',
        },
      ],
    },

    // DESK PATH
    {
      id: 'desk-use',
      type: 'question',
      question: 'What will you primarily use the desk for?',
      filterKey: 'desk_use',
      options: [
        {
          label: 'Computer / Office Work',
          value: 'computer',
          nextNodeId: 'desk-features',
          filterValue: 'computer',
        },
        {
          label: 'Gaming Setup',
          value: 'gaming',
          nextNodeId: 'desk-features',
          filterValue: 'gaming',
        },
        {
          label: 'Crafts / Hobbies',
          value: 'crafts',
          nextNodeId: 'desk-features',
          filterValue: 'crafts',
        },
        {
          label: 'Student / Homework',
          value: 'student',
          nextNodeId: 'desk-features',
          filterValue: 'student',
        },
      ],
    },

    {
      id: 'desk-features',
      type: 'question',
      question: 'Do you want any special features?',
      filterKey: 'desk_features',
      options: [
        {
          label: 'Standing Desk (height adjustable)',
          value: 'standing',
          nextNodeId: 'furniture-budget',
          filterValue: 'standing',
        },
        {
          label: 'L-Shaped (corner desk)',
          value: 'l-shaped',
          nextNodeId: 'furniture-budget',
          filterValue: 'l-shaped',
        },
        {
          label: 'With Drawers / Storage',
          value: 'storage',
          nextNodeId: 'furniture-budget',
          filterValue: 'storage',
        },
        {
          label: 'Simple / Minimalist',
          value: 'simple',
          nextNodeId: 'furniture-budget',
          filterValue: 'simple',
        },
      ],
    },

    // SHARED: Budget
    {
      id: 'furniture-budget',
      type: 'question',
      question: 'What\'s your budget?',
      filterKey: 'budget',
      options: [
        {
          label: 'Under $300',
          value: 'budget',
          nextNodeId: 'recommendation-furniture',
          filterValue: { max: 300 },
        },
        {
          label: '$300 - $800',
          value: 'mid-range',
          nextNodeId: 'recommendation-furniture',
          filterValue: { min: 300, max: 800 },
        },
        {
          label: '$800 - $1,500',
          value: 'premium',
          nextNodeId: 'recommendation-furniture',
          filterValue: { min: 800, max: 1500 },
        },
        {
          label: '$1,500+',
          value: 'luxury',
          nextNodeId: 'recommendation-furniture',
          filterValue: { min: 1500 },
        },
      ],
    },

    // Recommendation
    {
      id: 'recommendation-furniture',
      type: 'recommendation',
      question: 'Perfect! Here are my top furniture recommendations based on your preferences:\n\n🛋️ Each option matches your space, style, and budget. Free shipping on most items, with white-glove delivery available.\n\nNeed help visualizing it in your space? I can provide dimensions and styling tips!',
      recommendedSkus: [
        'furniture-couch-sectional',
        'furniture-mattress-queen',
        'furniture-desk-standing',
      ],
    },
  ],
}
