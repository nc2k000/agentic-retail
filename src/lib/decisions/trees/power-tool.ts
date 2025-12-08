/**
 * Power Tool Purchase Decision Tree
 *
 * Guides users through selecting the right power tool based on:
 * - Tool type needed
 * - Usage frequency (DIY vs professional)
 * - Power source preference
 * - Budget
 */

import type { DecisionTree } from '@/types'

export const POWER_TOOL_DECISION_TREE: DecisionTree = {
  id: 'power-tool-purchase',
  name: 'Find Your Perfect Power Tool',
  description: 'Let\'s find the right power tool for your project and skill level',
  category: 'Tools & Hardware',
  rootNodeId: 'tool-type',
  estimatedTime: '1 minute',

  nodes: [
    // Question 1: Tool Type
    {
      id: 'tool-type',
      type: 'question',
      question: 'What type of power tool do you need?',
      description: 'Choose the primary tool for your project',
      filterKey: 'tool_type',
      options: [
        {
          label: 'Drill / Driver',
          value: 'drill',
          description: 'For drilling holes and driving screws',
          nextNodeId: 'usage-frequency',
          filterValue: 'drill',
        },
        {
          label: 'Saw (circular, miter, jigsaw)',
          value: 'saw',
          description: 'For cutting wood, metal, or other materials',
          nextNodeId: 'usage-frequency',
          filterValue: 'saw',
        },
        {
          label: 'Sander / Grinder',
          value: 'sander',
          description: 'For smoothing surfaces or grinding',
          nextNodeId: 'usage-frequency',
          filterValue: 'sander',
        },
        {
          label: 'Impact driver / wrench',
          value: 'impact',
          description: 'For high-torque fastening tasks',
          nextNodeId: 'usage-frequency',
          filterValue: 'impact',
        },
      ],
    },

    // Question 2: Usage Frequency
    {
      id: 'usage-frequency',
      type: 'question',
      question: 'How often will you use this tool?',
      description: 'This determines the quality and durability you need',
      filterKey: 'usage_level',
      options: [
        {
          label: 'Occasional DIY (few times per year)',
          value: 'occasional',
          description: 'Light-duty, homeowner-grade tools',
          nextNodeId: 'power-source',
          filterValue: 'diy',
        },
        {
          label: 'Regular DIY (monthly projects)',
          value: 'regular',
          description: 'Mid-grade prosumer tools',
          nextNodeId: 'power-source',
          filterValue: 'prosumer',
        },
        {
          label: 'Frequent / Hobbyist (weekly use)',
          value: 'frequent',
          description: 'Professional-grade consumer tools',
          nextNodeId: 'power-source',
          filterValue: 'pro-consumer',
        },
        {
          label: 'Professional / Daily use',
          value: 'professional',
          description: 'Commercial-grade professional tools',
          nextNodeId: 'power-source',
          filterValue: 'professional',
        },
      ],
    },

    // Question 3: Power Source
    {
      id: 'power-source',
      type: 'question',
      question: 'What power source do you prefer?',
      description: 'Consider portability vs continuous power',
      filterKey: 'power_source',
      options: [
        {
          label: 'Cordless / Battery (portable)',
          value: 'cordless',
          description: 'Freedom to move, rechargeable battery',
          nextNodeId: 'budget',
          filterValue: 'cordless',
        },
        {
          label: 'Corded (continuous power)',
          value: 'corded',
          description: 'Unlimited runtime, more power',
          nextNodeId: 'budget',
          filterValue: 'corded',
        },
        {
          label: 'Pneumatic (air-powered)',
          value: 'pneumatic',
          description: 'Requires air compressor, professional use',
          nextNodeId: 'budget',
          filterValue: 'pneumatic',
        },
        {
          label: 'No preference',
          value: 'any',
          description: 'Show me all options',
          nextNodeId: 'budget',
          filterValue: 'any',
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
          label: 'Under $100 (Entry-level)',
          value: 'budget',
          nextNodeId: 'recommendation-power-tool',
          filterValue: { max: 100 },
        },
        {
          label: '$100 - $250 (Mid-range)',
          value: 'mid-range',
          nextNodeId: 'recommendation-power-tool',
          filterValue: { min: 100, max: 250 },
        },
        {
          label: '$250 - $500 (Premium)',
          value: 'premium',
          nextNodeId: 'recommendation-power-tool',
          filterValue: { min: 250, max: 500 },
        },
        {
          label: '$500+ (Professional)',
          value: 'flagship',
          nextNodeId: 'recommendation-power-tool',
          filterValue: { min: 500 },
        },
      ],
    },

    // Recommendation Node
    {
      id: 'recommendation-power-tool',
      type: 'recommendation',
      question: 'Perfect! Let me find the best power tools for you based on your needs, usage level, power preference, and budget.',
      recommendedSkus: [],
    },
  ],
}
