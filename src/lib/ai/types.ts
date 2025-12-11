/**
 * AI Decision Trees - Type Definitions
 *
 * Types for AI-generated decision trees from catalog analysis
 */

import { Product } from '@/types'

/**
 * Type of attribute found in products
 */
export type AttributeType = 'categorical' | 'numeric' | 'boolean'

/**
 * Analysis of a single product attribute
 */
export interface AttributeAnalysis {
  /** Attribute name (e.g., "screen_size", "color", "capacity") */
  name: string

  /** Type of attribute */
  type: AttributeType

  /** Unique values found for this attribute */
  values: string[]

  /** Percentage of products that have this attribute (0-1) */
  coverage: number

  /** How well this attribute splits the product set (0-1) */
  /** Higher = more useful for filtering */
  discriminationPower: number

  /** Overall priority score (coverage × discrimination) */
  priority: number
}

/**
 * Suggested question based on attribute analysis
 */
export interface QuestionSuggestion {
  /** Natural language question text */
  text: string

  /** Attribute this question is based on */
  attribute: string

  /** Possible answer options */
  options: string[]

  /** Priority score (1-10, higher = ask earlier) */
  priority: number

  /** Example products for each option (optional) */
  examples?: Record<string, Product[]>
}

/**
 * Complete catalog analysis for a category
 */
export interface CatalogAnalysis {
  /** Category analyzed */
  category: string

  /** Total number of products analyzed */
  totalProducts: number

  /** All attributes found and analyzed */
  attributes: AttributeAnalysis[]

  /** Suggested questions for decision tree */
  suggestedQuestions: QuestionSuggestion[]

  /** Analysis metadata */
  metadata: {
    /** When analysis was performed */
    analyzedAt: string

    /** Processing time in ms */
    processingTime: number

    /** Any warnings or issues */
    warnings?: string[]
  }
}

/**
 * Generated decision tree (output from question generator)
 */
export interface GeneratedTree {
  /** Unique tree identifier */
  treeId: string

  /** Category this tree is for */
  category: string

  /** Generated questions */
  questions: GeneratedQuestion[]

  /** Generation metadata */
  metadata: {
    /** When tree was generated */
    generatedAt: string

    /** Size of catalog used */
    catalogSize: number

    /** Confidence score (0-1) */
    confidenceScore: number

    /** Model used for generation */
    model?: string
  }
}

/**
 * A single generated question
 */
export interface GeneratedQuestion {
  /** Question ID */
  id: string

  /** Question text */
  text: string

  /** Answer options */
  options: GeneratedOption[]

  /** Source attribute */
  sourceAttribute?: string
}

/**
 * An answer option for a generated question
 */
export interface GeneratedOption {
  /** Option ID */
  id: string

  /** Display label */
  label: string

  /** Filters to apply when this option is selected */
  filters: Record<string, any>

  /** Example value (for display) */
  example?: string
}

/**
 * Cached tree entry in database
 */
export interface CachedTree {
  /** Database ID */
  id: string

  /** Category */
  category: string

  /** Full tree definition */
  treeDefinition: GeneratedTree

  /** Snapshot of products at generation time */
  catalogSnapshot?: {
    productCount: number
    sampleProducts: Product[]
  }

  /** When generated */
  generatedAt: string

  /** When expires */
  expiresAt: string

  /** Generation metadata */
  generationMetadata: {
    processingTime: number
    attributesAnalyzed: number
    questionsGenerated: number
  }
}
