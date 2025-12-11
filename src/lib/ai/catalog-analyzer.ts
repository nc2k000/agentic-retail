/**
 * Catalog Analyzer
 *
 * Analyzes products in a category to identify key attributes
 * and generate question suggestions for decision trees
 */

import { CATALOG } from '@/lib/catalog'
import { Product } from '@/types'
import {
  CatalogAnalysis,
  AttributeAnalysis,
  QuestionSuggestion,
  AttributeType,
} from './types'

/**
 * Analyze all products in a category
 * @param category - Product category to analyze
 * @returns Complete catalog analysis with suggested questions
 */
export async function analyzeCatalog(
  category: string
): Promise<CatalogAnalysis> {
  const startTime = Date.now()
  const warnings: string[] = []

  console.log(`📊 Analyzing catalog for category: ${category}`)

  // 1. Get all products in category from in-memory catalog
  const products = CATALOG[category] || []

  if (products.length === 0) {
    warnings.push(`No products found in category: ${category}`)
    return {
      category,
      totalProducts: 0,
      attributes: [],
      suggestedQuestions: [],
      metadata: {
        analyzedAt: new Date().toISOString(),
        processingTime: Date.now() - startTime,
        warnings,
      },
    }
  }

  console.log(`  ✅ Found ${products.length} products`)

  // 2. Extract attributes from products
  const attributes = extractAttributes(products)
  console.log(`  ✅ Extracted ${attributes.length} attributes`)

  // 3. Calculate coverage and discrimination power
  const analyzedAttributes = analyzeAttributes(attributes, products)
  console.log(`  ✅ Analyzed attribute quality`)

  // 4. Sort by priority (coverage × discrimination)
  const sortedAttributes = analyzedAttributes.sort((a, b) => b.priority - a.priority)

  // 5. Generate question suggestions from top attributes
  const suggestedQuestions = generateQuestionSuggestions(
    sortedAttributes.slice(0, 10), // Top 10 attributes
    products
  )
  console.log(`  ✅ Generated ${suggestedQuestions.length} question suggestions`)

  const processingTime = Date.now() - startTime
  console.log(`📊 Analysis complete in ${processingTime}ms`)

  return {
    category,
    totalProducts: products.length,
    attributes: sortedAttributes,
    suggestedQuestions,
    metadata: {
      analyzedAt: new Date().toISOString(),
      processingTime,
      warnings: warnings.length > 0 ? warnings : undefined,
    },
  }
}

/**
 * Extract all unique attributes from products
 */
function extractAttributes(products: any[]): Map<string, Set<string>> {
  const attributeValues = new Map<string, Set<string>>()

  for (const product of products) {
    // Extract from tags
    if (product.tags && Array.isArray(product.tags)) {
      for (const tag of product.tags) {
        const parsed = parseTag(tag)
        if (parsed) {
          if (!attributeValues.has(parsed.attribute)) {
            attributeValues.set(parsed.attribute, new Set())
          }
          attributeValues.get(parsed.attribute)!.add(parsed.value)
        }
      }
    }

    // Extract from product name (e.g., "50 inch TV" → size: "50 inch")
    const nameAttributes = parseProductName(product.name)
    for (const [attr, value] of Object.entries(nameAttributes)) {
      if (!attributeValues.has(attr)) {
        attributeValues.set(attr, new Set())
      }
      attributeValues.get(attr)!.add(value)
    }
  }

  return attributeValues
}

/**
 * Parse a tag into attribute/value pair
 * Examples:
 * - "size:50inch" → { attribute: "size", value: "50inch" }
 * - "color:red" → { attribute: "color", value: "red" }
 * - "wireless" → { attribute: "features", value: "wireless" }
 */
function parseTag(tag: string): { attribute: string; value: string } | null {
  // Handle key:value format
  if (tag.includes(':')) {
    const [attr, val] = tag.split(':', 2)
    return { attribute: attr.trim(), value: val.trim() }
  }

  // Handle standalone tags (treat as features)
  if (tag.length > 0) {
    return { attribute: 'features', value: tag.trim() }
  }

  return null
}

/**
 * Parse product name for common attributes
 * Examples:
 * - "50 inch TV" → { size: "50 inch" }
 * - "Red Paint" → { color: "red" }
 */
function parseProductName(name: string): Record<string, string> {
  const attributes: Record<string, string> = {}
  const nameLower = name.toLowerCase()

  // Size patterns (inches, oz, lb, etc.)
  const sizeMatch = nameLower.match(/(\d+)\s*(inch|"|oz|lb|ml|l|gal|qt)/i)
  if (sizeMatch) {
    attributes.size = sizeMatch[0]
  }

  // Color patterns
  const colors = ['red', 'blue', 'green', 'yellow', 'white', 'black', 'gray', 'grey', 'brown', 'beige', 'tan']
  for (const color of colors) {
    if (nameLower.includes(color)) {
      attributes.color = color
      break
    }
  }

  return attributes
}

/**
 * Analyze attributes to calculate coverage and discrimination power
 */
function analyzeAttributes(
  attributeValues: Map<string, Set<string>>,
  products: any[]
): AttributeAnalysis[] {
  const analyses: AttributeAnalysis[] = []
  const totalProducts = products.length

  for (const [attributeName, values] of attributeValues.entries()) {
    // Calculate coverage (what % of products have this attribute)
    const productsWithAttribute = products.filter((p) => {
      if (p.tags) {
        return p.tags.some((tag: string) => {
          const parsed = parseTag(tag)
          return parsed?.attribute === attributeName
        })
      }
      const nameAttrs = parseProductName(p.name)
      return attributeName in nameAttrs
    }).length

    const coverage = productsWithAttribute / totalProducts

    // Calculate discrimination power (how well does this split the set)
    // More unique values = higher discrimination
    // But not too many (if every product is unique, it's not useful)
    const uniqueValues = values.size
    const discriminationPower = Math.min(uniqueValues / 10, 1.0) * coverage

    // Determine attribute type
    const valuesArray = Array.from(values)
    const type = inferAttributeType(valuesArray)

    // Priority = coverage × discrimination
    const priority = coverage * discriminationPower

    analyses.push({
      name: attributeName,
      type,
      values: valuesArray,
      coverage,
      discriminationPower,
      priority,
    })
  }

  return analyses
}

/**
 * Infer whether an attribute is categorical, numeric, or boolean
 */
function inferAttributeType(values: string[]): AttributeType {
  // Boolean if only 2 values
  if (values.length === 2) {
    return 'boolean'
  }

  // Numeric if all values are numbers
  const allNumeric = values.every((v) => !isNaN(parseFloat(v)))
  if (allNumeric) {
    return 'numeric'
  }

  // Otherwise categorical
  return 'categorical'
}

/**
 * Generate question suggestions from analyzed attributes
 */
function generateQuestionSuggestions(
  attributes: AttributeAnalysis[],
  products: any[]
): QuestionSuggestion[] {
  const suggestions: QuestionSuggestion[] = []

  for (const attr of attributes) {
    // Skip if too few or too many values
    if (attr.values.length < 2 || attr.values.length > 10) {
      continue
    }

    // Generate natural language question
    const questionText = generateQuestionText(attr.name, attr.type)

    // Limit to top 5 most common values
    const topValues = attr.values.slice(0, 5)

    // Add "Any" or "I'm not sure" option
    const options = [...topValues, "Any"]

    suggestions.push({
      text: questionText,
      attribute: attr.name,
      options,
      priority: Math.round(attr.priority * 10),
    })
  }

  // Sort by priority
  return suggestions.sort((a, b) => b.priority - a.priority)
}

/**
 * Generate natural language question text for an attribute
 */
function generateQuestionText(attributeName: string, type: AttributeType): string {
  // Clean up attribute name (remove underscores, capitalize)
  const cleanName = attributeName
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Generate question based on type
  switch (type) {
    case 'boolean':
      return `Do you want ${cleanName.toLowerCase()}?`
    case 'numeric':
      return `What ${cleanName.toLowerCase()} are you looking for?`
    case 'categorical':
    default:
      // Special cases for common attributes
      if (attributeName === 'size') {
        return 'What size are you looking for?'
      }
      if (attributeName === 'color') {
        return 'What color would you like?'
      }
      if (attributeName === 'features') {
        return 'Which features are important to you?'
      }
      return `What type of ${cleanName.toLowerCase()} do you prefer?`
  }
}
