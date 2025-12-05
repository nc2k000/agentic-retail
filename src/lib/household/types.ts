/**
 * Household Map Types
 *
 * Type definitions for the progressive household discovery system.
 * The Household Map is a comprehensive knowledge graph about the customer's
 * household, discovered gradually through shopping interactions.
 */

// ============================================================================
// Core Fact Types
// ============================================================================

export type FactCategory = 'physical_space' | 'people' | 'pets' | 'lifestyle' | 'patterns'

export type PhysicalSpaceSubcategory =
  | 'property_type'
  | 'property_size'
  | 'property_features'
  | 'location_context'

export type PeopleSubcategory =
  | 'household_member'
  | 'life_stage'
  | 'dietary_restriction'
  | 'health_condition'

export type PetsSubcategory = 'pet' | 'pet_dietary'

export type LifestyleSubcategory =
  | 'cooking_frequency'
  | 'entertaining_style'
  | 'fitness_level'
  | 'work_style'
  | 'hobby'

export type PatternsSubcategory =
  | 'meal_rotation'
  | 'seasonal_habit'
  | 'event_preparation'
  | 'replenishment_cycle'

export type Subcategory =
  | PhysicalSpaceSubcategory
  | PeopleSubcategory
  | PetsSubcategory
  | LifestyleSubcategory
  | PatternsSubcategory

export interface Evidence {
  type: 'purchase' | 'answer' | 'behavior' | 'inference'
  timestamp: string
  details: any
  weight: number // 0.0 - 1.0: How much this evidence contributes to confidence
}

export interface HouseholdFact {
  id: string
  userId: string
  category: FactCategory
  subcategory: Subcategory
  factKey: string
  factValue: any // Flexible: string, number, boolean, object, array
  confidence: number // 0.0 - 1.0
  dataPoints: number // Number of supporting observations
  lastConfirmedAt?: string
  discoveredFrom: string
  supportingEvidence: Evidence[]
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Aggregated Views
// ============================================================================

export interface PhysicalSpaceMap {
  propertyType?: 'house' | 'apartment' | 'condo' | 'townhouse'
  bedrooms?: number
  bathrooms?: number
  squareFootage?: number
  hasBackyard?: boolean
  hasPool?: boolean
  hasGarage?: boolean
  hasHomeOffice?: boolean
  locationContext?: 'urban' | 'suburban' | 'rural'
}

export interface PersonProfile {
  role: 'adult' | 'child' | 'baby' | 'teenager'
  age?: string // "0-3 months", "4-12 years", "30-40 years", etc.
  dietaryRestrictions: string[]
  allergies: string[]
  healthConditions: string[]
}

export interface PetProfile {
  type: 'dog' | 'cat' | 'bird' | 'fish' | 'other'
  breed?: string
  age?: string
  dietaryNeeds: string[]
}

export interface LifestyleProfile {
  cookingFrequency?: 'daily' | 'frequent' | 'occasional' | 'rarely'
  entertainingStyle?: 'frequent_host' | 'occasional_gatherings' | 'intimate_only' | 'never'
  fitnessLevel?: 'very_active' | 'moderately_active' | 'lightly_active' | 'sedentary'
  workStyle?: 'wfh_full_time' | 'hybrid' | 'office_based' | 'retired' | 'student'
  hobbies: string[]
  dietaryPreferences: string[] // 'organic', 'vegan', 'gluten_free', etc.
}

export interface DiscoveredPattern {
  type: 'meal_rotation' | 'seasonal_habit' | 'event_preparation' | 'replenishment_cycle'
  name: string
  description: string
  frequency?: string
  relatedProducts: string[]
  confidence: number
}

// ============================================================================
// Household Map
// ============================================================================

export interface HouseholdMap {
  userId: string
  completeness: number // 0-100%
  facts: HouseholdFact[]

  // Aggregated views
  physicalSpace: PhysicalSpaceMap
  people: PersonProfile[]
  pets: PetProfile[]
  lifestyle: LifestyleProfile
  patterns: DiscoveredPattern[]

  // Strategic gaps
  lowConfidenceFacts: HouseholdFact[] // confidence < 70%
  suggestedQuestions: ConfirmationQuestion[]

  // Metadata
  lastUpdated: string
  totalDataPoints: number
}

// ============================================================================
// Confirmation System
// ============================================================================

export interface ConfirmationQuestion {
  factKey: string
  question: string
  answerType: 'yes_no' | 'single_choice' | 'multiple_choice' | 'number' | 'text'
  options?: QuestionOption[]
  priority: 'high' | 'medium' | 'low'
  reason: string // Why we're asking (shown to AI, not user)
}

export interface QuestionOption {
  value: string
  label: string
  description?: string
}

// ============================================================================
// Decision Trees
// ============================================================================

export interface DecisionTree {
  id: string
  name: string
  description: string
  trigger: TreeTrigger
  purpose: 'purchase_guidance' | 'household_discovery' | 'subscription_setup'
  questions: DecisionQuestion[]
  outcomes: TreeOutcome[]
}

export interface TreeTrigger {
  type: 'product_category' | 'low_confidence_fact' | 'mission_start' | 'explicit_request'
  condition: any
}

export interface DecisionQuestion {
  id: string
  question: string
  context?: string // Additional context shown to user
  answerType: 'single_choice' | 'multiple_choice' | 'number' | 'text' | 'yes_no'
  options?: QuestionOption[]

  // What facts this question discovers
  discovers: FactDiscovery[]

  // Conditional logic
  showIf?: (answers: Record<string, any>, householdMap: HouseholdMap) => boolean
  nextQuestion?: (answer: any, answers: Record<string, any>) => string | null
}

export interface FactDiscovery {
  factKey: string
  category: FactCategory
  subcategory: Subcategory
  valueMapping: Record<string, any> // Maps answer → fact value
  confidence: number
}

export interface TreeOutcome {
  id: string
  condition: (answers: Record<string, any>) => boolean
  factsToSave: Partial<HouseholdFact>[]
  recommendations?: string[]
  productFilters?: any
  nextActions?: string[]
}

// ============================================================================
// Discovery System
// ============================================================================

export interface DiscoveryInput {
  type: 'purchase' | 'message' | 'behavior' | 'external'
  userId: string
  data: any
  timestamp?: string
}

export interface DiscoveryResult {
  discovered: HouseholdFact[]
  updated: HouseholdFact[]
  conflicts: FactConflict[]
  suggestedConfirmations: ConfirmationQuestion[]
}

export interface FactConflict {
  existingFact: HouseholdFact
  newEvidence: Evidence
  conflictType: 'contradiction' | 'uncertainty' | 'staleness'
  resolutionStrategy: 'confirm' | 'update' | 'ignore'
}

// ============================================================================
// API Types
// ============================================================================

export interface GetHouseholdMapResponse {
  success: boolean
  map: HouseholdMap
  generatedAt: string
}

export interface DiscoverFactsRequest {
  input: DiscoveryInput
}

export interface DiscoverFactsResponse {
  success: boolean
  result: DiscoveryResult
  mapCompleteness: number
}

export interface ConfirmFactRequest {
  factKey: string
  confirmedValue: any
  explicit: boolean // User explicitly confirmed vs. implicit
}

export interface ConfirmFactResponse {
  success: boolean
  updatedFact: HouseholdFact
  mapCompleteness: number
}

export interface ExecuteDecisionTreeRequest {
  treeId: string
  answers: Record<string, any>
}

export interface ExecuteDecisionTreeResponse {
  success: boolean
  outcome: TreeOutcome
  factsDiscovered: HouseholdFact[]
  mapCompleteness: number
}

// ============================================================================
// Utility Types
// ============================================================================

export interface MapCompleteness {
  overall: number // 0-100%
  byCategory: {
    physical_space: number
    people: number
    pets: number
    lifestyle: number
    patterns: number
  }
  missingCriticalFacts: string[]
}

export interface PersonaMatch {
  personaId: string
  personaName: string
  matchScore: number // 0-100%
  matchingFacts: string[]
  missingFacts: string[]
}
