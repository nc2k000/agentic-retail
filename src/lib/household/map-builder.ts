/**
 * Household Map Builder
 *
 * Aggregates household facts into a comprehensive map with computed views.
 */

import {
  HouseholdFact,
  HouseholdMap,
  PhysicalSpaceMap,
  PersonProfile,
  PetProfile,
  LifestyleProfile,
  DiscoveredPattern,
} from './types'
import { calculateMapCompleteness, generateConfirmationQuestions } from './discovery'

/**
 * Build a complete household map from facts
 */
export function buildHouseholdMap(userId: string, facts: HouseholdFact[]): HouseholdMap {
  const completeness = calculateMapCompleteness(facts)
  const lowConfidenceFacts = facts.filter(f => f.confidence < 0.7)
  const suggestedQuestions = generateConfirmationQuestions(lowConfidenceFacts)

  return {
    userId,
    completeness,
    facts,
    physicalSpace: buildPhysicalSpaceMap(facts),
    people: buildPeopleProfiles(facts),
    pets: buildPetProfiles(facts),
    lifestyle: buildLifestyleProfile(facts),
    patterns: buildDiscoveredPatterns(facts),
    lowConfidenceFacts,
    suggestedQuestions,
    lastUpdated: new Date().toISOString(),
    totalDataPoints: facts.reduce((sum, f) => sum + f.dataPoints, 0),
  }
}

/**
 * Build physical space map
 */
function buildPhysicalSpaceMap(facts: HouseholdFact[]): PhysicalSpaceMap {
  const physicalFacts = facts.filter(f => f.category === 'physical_space')

  const map: PhysicalSpaceMap = {}

  for (const fact of physicalFacts) {
    switch (fact.factKey) {
      case 'property_type':
        map.propertyType = fact.factValue
        break
      case 'bedrooms':
        map.bedrooms = fact.factValue
        break
      case 'bathrooms':
        map.bathrooms = fact.factValue
        break
      case 'square_footage':
        map.squareFootage = fact.factValue
        break
      case 'has_backyard':
        map.hasBackyard = fact.factValue
        break
      case 'has_pool':
        map.hasPool = fact.factValue
        break
      case 'has_garage':
        map.hasGarage = fact.factValue
        break
      case 'has_home_office':
        map.hasHomeOffice = fact.factValue
        break
      case 'location_context':
        map.locationContext = fact.factValue
        break
    }
  }

  return map
}

/**
 * Build people profiles
 */
function buildPeopleProfiles(facts: HouseholdFact[]): PersonProfile[] {
  const profiles: PersonProfile[] = []
  const peopleFacts = facts.filter(f => f.category === 'people')

  // Check for baby
  const hasBaby = peopleFacts.find(f => f.factKey === 'has_baby')?.factValue
  if (hasBaby) {
    const babyAge = peopleFacts.find(f => f.factKey === 'baby_age')?.factValue
    profiles.push({
      role: 'baby',
      age: babyAge || '0-12 months',
      dietaryRestrictions: [],
      allergies: [],
      healthConditions: [],
    })
  }

  // Check for toddler
  const hasToddler = peopleFacts.find(f => f.factKey === 'has_toddler')?.factValue
  if (hasToddler) {
    profiles.push({
      role: 'child',
      age: '1-3 years',
      dietaryRestrictions: [],
      allergies: [],
      healthConditions: [],
    })
  }

  // Check for school-age children
  const hasSchoolAge = peopleFacts.find(f => f.factKey === 'has_school_age_children')?.factValue
  if (hasSchoolAge) {
    profiles.push({
      role: 'child',
      age: '4-12 years',
      dietaryRestrictions: [],
      allergies: [],
      healthConditions: [],
    })
  }

  // Check for teenagers
  const hasTeen = peopleFacts.find(f => f.factKey === 'has_teenager')?.factValue
  if (hasTeen) {
    profiles.push({
      role: 'teenager',
      age: '13-17 years',
      dietaryRestrictions: [],
      allergies: [],
      healthConditions: [],
    })
  }

  // Primary user (always present)
  const allergies = peopleFacts
    .filter(f => f.factKey.startsWith('allergy_'))
    .map(f => f.factKey.replace('allergy_', ''))

  const dietaryRestrictions = peopleFacts
    .filter(
      f =>
        f.subcategory === 'dietary_restriction' ||
        (f.factKey.startsWith('dietary_') && f.factValue === true)
    )
    .map(f => f.factKey.replace('dietary_', ''))

  profiles.unshift({
    role: 'adult',
    dietaryRestrictions,
    allergies,
    healthConditions: [],
  })

  return profiles
}

/**
 * Build pet profiles
 */
function buildPetProfiles(facts: HouseholdFact[]): PetProfile[] {
  const profiles: PetProfile[] = []
  const petFacts = facts.filter(f => f.category === 'pets')

  const hasDog = petFacts.find(f => f.factKey === 'has_dog')?.factValue
  if (hasDog) {
    profiles.push({
      type: 'dog',
      dietaryNeeds: [],
    })
  }

  const hasCat = petFacts.find(f => f.factKey === 'has_cat')?.factValue
  if (hasCat) {
    profiles.push({
      type: 'cat',
      dietaryNeeds: [],
    })
  }

  return profiles
}

/**
 * Build lifestyle profile
 */
function buildLifestyleProfile(facts: HouseholdFact[]): LifestyleProfile {
  const lifestyleFacts = facts.filter(f => f.category === 'lifestyle')

  const profile: LifestyleProfile = {
    hobbies: [],
    dietaryPreferences: [],
  }

  for (const fact of lifestyleFacts) {
    switch (fact.subcategory) {
      case 'cooking_frequency':
        if (fact.factKey === 'cooks_frequently' && fact.factValue) {
          profile.cookingFrequency = 'frequent'
        } else if (fact.factKey === 'cooking_frequency') {
          profile.cookingFrequency = fact.factValue
        }
        break

      case 'entertaining_style':
        profile.entertainingStyle = fact.factValue
        break

      case 'fitness_level':
        if (fact.factKey === 'fitness_oriented' && fact.factValue) {
          profile.fitnessLevel = 'moderately_active'
        } else if (fact.factKey === 'fitness_level') {
          profile.fitnessLevel = fact.factValue
        }
        break

      case 'work_style':
        profile.workStyle = fact.factValue
        break

      case 'hobby':
        profile.hobbies.push(fact.factValue)
        break

      case 'dietary_preference':
        if (fact.factKey === 'prefers_organic' && fact.factValue) {
          profile.dietaryPreferences.push('organic')
        } else {
          profile.dietaryPreferences.push(fact.factValue)
        }
        break
    }
  }

  return profile
}

/**
 * Build discovered patterns
 */
function buildDiscoveredPatterns(facts: HouseholdFact[]): DiscoveredPattern[] {
  const patterns: DiscoveredPattern[] = []
  const patternFacts = facts.filter(f => f.category === 'patterns')

  for (const fact of patternFacts) {
    patterns.push({
      type: fact.subcategory as any,
      name: fact.factKey,
      description: fact.factValue.description || '',
      frequency: fact.factValue.frequency,
      relatedProducts: fact.factValue.relatedProducts || [],
      confidence: fact.confidence,
    })
  }

  return patterns
}

/**
 * Get household context summary for AI prompts
 */
export function getHouseholdContextSummary(map: HouseholdMap): string {
  const lines: string[] = []

  lines.push('## Household Context')
  lines.push(`Map Completeness: ${map.completeness.toFixed(0)}%`)
  lines.push('')

  // People
  if (map.people.length > 0) {
    lines.push('### Household Members:')
    for (const person of map.people) {
      const details = [person.role]
      if (person.age) details.push(person.age)
      if (person.dietaryRestrictions.length > 0)
        details.push(`dietary: ${person.dietaryRestrictions.join(', ')}`)
      if (person.allergies.length > 0) details.push(`allergies: ${person.allergies.join(', ')}`)
      lines.push(`- ${details.join(' • ')}`)
    }
    lines.push('')
  }

  // Pets
  if (map.pets.length > 0) {
    lines.push('### Pets:')
    for (const pet of map.pets) {
      lines.push(`- ${pet.type}${pet.breed ? ` (${pet.breed})` : ''}`)
    }
    lines.push('')
  }

  // Lifestyle
  if (map.lifestyle) {
    lines.push('### Lifestyle:')
    if (map.lifestyle.cookingFrequency)
      lines.push(`- Cooking: ${map.lifestyle.cookingFrequency}`)
    if (map.lifestyle.fitnessLevel) lines.push(`- Fitness: ${map.lifestyle.fitnessLevel}`)
    if (map.lifestyle.dietaryPreferences.length > 0)
      lines.push(`- Dietary preferences: ${map.lifestyle.dietaryPreferences.join(', ')}`)
    lines.push('')
  }

  // Patterns
  if (map.patterns.length > 0) {
    lines.push('### Discovered Patterns:')
    for (const pattern of map.patterns.slice(0, 3)) {
      lines.push(`- ${pattern.name}: ${pattern.description}`)
    }
    lines.push('')
  }

  // Low confidence facts
  if (map.lowConfidenceFacts.length > 0) {
    lines.push(
      `### Note: ${map.lowConfidenceFacts.length} facts need confirmation (confidence < 70%)`
    )
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Get strategic questions to ask
 */
export function getStrategicQuestions(map: HouseholdMap): string[] {
  return map.suggestedQuestions.slice(0, 3).map(q => q.question)
}
