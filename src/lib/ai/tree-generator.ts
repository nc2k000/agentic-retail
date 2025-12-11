/**
 * Decision Tree Generator
 *
 * Uses Claude to generate decision trees from catalog analysis
 */

import Anthropic from '@anthropic-ai/sdk'
import { CATALOG } from '@/lib/catalog'
import { analyzeCatalog } from './catalog-analyzer'
import {
  CatalogAnalysis,
  GeneratedTree,
  GeneratedQuestion,
  GeneratedOption,
} from './types'

/**
 * Get Anthropic client (lazy initialization to allow env vars to load)
 */
function getAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
}

/**
 * Configuration for tree generation
 */
export interface TreeGenerationConfig {
  /** Category to generate tree for */
  category: string

  /** Target number of questions (3-5 recommended) */
  maxQuestions?: number

  /** Model to use (default: claude-sonnet-4-20250514) */
  model?: string

  /** Temperature for generation (0.0-1.0, default: 0.3) */
  temperature?: number
}

/**
 * Generate a decision tree for a product category
 * This is the main function that calls the LLM
 */
export async function generateDecisionTree(
  config: TreeGenerationConfig
): Promise<GeneratedTree> {
  const startTime = Date.now()
  const {
    category,
    maxQuestions = 4,
    model = 'claude-sonnet-4-20250514',
    temperature = 0.3,
  } = config

  console.log(`🌲 Generating decision tree for: ${category}`)

  // 1. Analyze the catalog to get attributes
  console.log(`  📊 Running catalog analysis...`)
  const analysis = await analyzeCatalog(category)

  if (analysis.totalProducts === 0) {
    throw new Error(`No products found in category: ${category}`)
  }

  console.log(`  ✅ Analyzed ${analysis.totalProducts} products`)
  console.log(`  ✅ Found ${analysis.attributes.length} attributes`)

  // 2. Get sample products for context
  const products = CATALOG[category] || []
  const sampleProducts = products.slice(0, 10) // First 10 products

  // 3. Build prompt for Claude
  const prompt = buildTreeGenerationPrompt(analysis, sampleProducts, maxQuestions)

  console.log(`  🤖 Calling Claude to generate decision tree...`)

  // 4. Call Claude API
  const anthropic = getAnthropicClient()
  const response = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    temperature,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  // 5. Parse the response
  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Expected text response from Claude')
  }

  let treeData: any
  try {
    // Extract JSON from response (Claude might wrap it in markdown)
    const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/)
    const jsonString = jsonMatch ? jsonMatch[1] : content.text
    treeData = JSON.parse(jsonString)
  } catch (error) {
    console.error('Failed to parse Claude response:', content.text)
    throw new Error('Failed to parse decision tree from Claude response')
  }

  // 6. Build the final tree structure
  const tree: GeneratedTree = {
    treeId: `${category.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    category,
    questions: treeData.questions.map((q: any) => ({
      id: q.id,
      text: q.text,
      sourceAttribute: q.sourceAttribute,
      options: q.options.map((opt: any) => ({
        id: opt.id,
        label: opt.label,
        filters: opt.filters,
        example: opt.example,
      })),
    })),
    metadata: {
      generatedAt: new Date().toISOString(),
      catalogSize: analysis.totalProducts,
      confidenceScore: calculateConfidenceScore(analysis),
      model,
    },
  }

  const processingTime = Date.now() - startTime
  console.log(`  ✅ Tree generated in ${processingTime}ms`)
  console.log(`  ✅ Created ${tree.questions.length} questions`)

  return tree
}

/**
 * Build the prompt for Claude to generate the decision tree
 */
function buildTreeGenerationPrompt(
  analysis: CatalogAnalysis,
  sampleProducts: any[],
  maxQuestions: number
): string {
  return `You are a product recommendation expert. Generate a decision tree to help customers find the right product in the "${analysis.category}" category.

CATALOG ANALYSIS:
- Total products: ${analysis.totalProducts}
- Top attributes found:
${analysis.attributes
  .slice(0, 8)
  .map(
    (attr) =>
      `  • ${attr.name}: ${attr.values.length} unique values (${(attr.coverage * 100).toFixed(0)}% coverage)`
  )
  .join('\n')}

SAMPLE PRODUCTS:
${sampleProducts
  .slice(0, 5)
  .map(
    (p) => `- ${p.name} (${p.price})
  Tags: ${p.tags?.join(', ') || 'none'}`
  )
  .join('\n')}

TASK:
Create a decision tree with ${maxQuestions} questions that will help narrow down products efficiently.

REQUIREMENTS:
1. Questions should be in priority order (most discriminating first)
2. Each question should have 2-5 answer options
3. Include an "Any" or "I'm not sure" option for each question
4. Use clear, customer-friendly language
5. Base questions on the top attributes from the analysis
6. Filters should use product tags and attributes that actually exist

RESPONSE FORMAT (return ONLY valid JSON):
{
  "questions": [
    {
      "id": "q1",
      "text": "What type of [category] are you looking for?",
      "sourceAttribute": "attribute_name",
      "options": [
        {
          "id": "option1",
          "label": "Option 1",
          "filters": { "tags": ["tag1", "tag2"] },
          "example": "Example product name"
        },
        {
          "id": "any",
          "label": "Any",
          "filters": {},
          "example": "Show all options"
        }
      ]
    }
  ]
}

Generate the decision tree now:`
}

/**
 * Calculate a confidence score based on the catalog analysis
 * Higher score = more confident the tree will work well
 */
function calculateConfidenceScore(analysis: CatalogAnalysis): number {
  // Factors that increase confidence:
  // 1. More products to work with
  const productScore = Math.min(analysis.totalProducts / 50, 1.0) * 0.3

  // 2. More high-quality attributes
  const goodAttributes = analysis.attributes.filter(
    (a) => a.coverage > 0.3 && a.discriminationPower > 0.1
  )
  const attributeScore = Math.min(goodAttributes.length / 5, 1.0) * 0.4

  // 3. Good coverage on top attributes
  const topAttribute = analysis.attributes[0]
  const coverageScore = topAttribute ? topAttribute.coverage * 0.3 : 0

  return Math.min(productScore + attributeScore + coverageScore, 1.0)
}

/**
 * Validate a generated tree to ensure it has correct structure
 */
export function validateTree(tree: GeneratedTree): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!tree.treeId) errors.push('Missing treeId')
  if (!tree.category) errors.push('Missing category')
  if (!tree.questions || tree.questions.length === 0) {
    errors.push('No questions in tree')
  }

  tree.questions?.forEach((q, i) => {
    if (!q.id) errors.push(`Question ${i}: missing id`)
    if (!q.text) errors.push(`Question ${i}: missing text`)
    if (!q.options || q.options.length < 2) {
      errors.push(`Question ${i}: needs at least 2 options`)
    }

    q.options?.forEach((opt, j) => {
      if (!opt.id) errors.push(`Question ${i}, Option ${j}: missing id`)
      if (!opt.label) errors.push(`Question ${i}, Option ${j}: missing label`)
      if (opt.filters === undefined) {
        errors.push(`Question ${i}, Option ${j}: missing filters`)
      }
    })
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
