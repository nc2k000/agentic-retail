/**
 * Mission Detection Test Suite
 *
 * Tests mission type detection and context switching across all scenarios.
 */

import { detectMissionType } from '../src/lib/missions'

interface TestCase {
  name: string
  prompt: string
  expectedType: 'precision' | 'essentials' | 'recipe' | 'event' | 'research' | null
  expectedTree?: string | null
  messageCount?: number
}

const testCases: TestCase[] = [
  // PRECISION TESTS (Single item, fast add-to-cart)
  {
    name: 'PRECISION: Simple milk request',
    prompt: 'I need milk',
    expectedType: 'precision',
    expectedTree: null,
  },
  {
    name: 'PRECISION: Get bread',
    prompt: 'Get me bread',
    expectedType: 'precision',
    expectedTree: null,
  },
  {
    name: 'PRECISION: Buy eggs',
    prompt: 'Buy eggs',
    expectedType: 'precision',
    expectedTree: null,
  },

  // ESSENTIALS TESTS (Grocery lists, multi-item)
  {
    name: 'ESSENTIALS: Breakfast items',
    prompt: 'I need breakfast items',
    expectedType: 'essentials',
    expectedTree: null,
  },
  {
    name: 'ESSENTIALS: Weekly grocery list',
    prompt: 'Help me build my weekly grocery list',
    expectedType: 'essentials',
    expectedTree: null,
  },
  {
    name: 'ESSENTIALS: Stocking up',
    prompt: "I'm stocking up for the week",
    expectedType: 'essentials',
    expectedTree: null,
  },
  {
    name: 'ESSENTIALS: Lunch stuff',
    prompt: 'I need lunch stuff',
    expectedType: 'essentials',
    expectedTree: null,
  },
  {
    name: 'ESSENTIALS: Dinner items',
    prompt: 'What should I get for dinner items?',
    expectedType: 'essentials',
    expectedTree: null,
  },

  // RECIPE TESTS (Ingredient shopping)
  {
    name: 'RECIPE: Pasta carbonara',
    prompt: 'I want to make pasta carbonara',
    expectedType: 'recipe',
    expectedTree: null,
  },
  {
    name: 'RECIPE: Cookie ingredients',
    prompt: 'What ingredients do I need for chocolate chip cookies?',
    expectedType: 'recipe',
    expectedTree: null,
  },
  {
    name: 'RECIPE: Cooking dinner',
    prompt: "I'm cooking dinner tonight",
    expectedType: 'recipe',
    expectedTree: null,
  },
  {
    name: 'RECIPE: Recipe request',
    prompt: 'Give me a recipe for lasagna',
    expectedType: 'recipe',
    expectedTree: null,
  },

  // EVENT TESTS (Party/celebration shopping)
  {
    name: 'EVENT: Birthday party',
    prompt: "I'm planning a birthday party",
    expectedType: 'event',
    expectedTree: null,
  },
  {
    name: 'EVENT: Wedding reception',
    prompt: 'I need supplies for a wedding reception',
    expectedType: 'event',
    expectedTree: null,
  },
  {
    name: 'EVENT: Celebration',
    prompt: "We're having a celebration",
    expectedType: 'event',
    expectedTree: null,
  },
  {
    name: 'EVENT: Party gathering',
    prompt: 'Party gathering this weekend',
    expectedType: 'event',
    expectedTree: null,
  },

  // RESEARCH TESTS WITHOUT TREES (High-consideration, no tree)
  {
    name: 'RESEARCH (no tree): Best laptop',
    prompt: "What's the best laptop?",
    expectedType: 'research',
    expectedTree: null,
  },
  {
    name: 'RESEARCH (no tree): Compare smartphones',
    prompt: 'Compare smartphones for me',
    expectedType: 'research',
    expectedTree: null,
  },
  {
    name: 'RESEARCH (no tree): Best phone',
    prompt: 'I need the best phone',
    expectedType: 'research',
    expectedTree: null,
  },

  // RESEARCH TESTS WITH TREES (Should trigger decision trees)
  {
    name: 'TREE: TV purchase',
    prompt: "I'm looking for a TV",
    expectedType: 'research',
    expectedTree: 'tv-purchase',
  },
  {
    name: 'TREE: Television',
    prompt: 'I need a television',
    expectedType: 'research',
    expectedTree: 'tv-purchase',
  },
  {
    name: 'TREE: Coffee machine',
    prompt: 'I need a coffee machine',
    expectedType: 'research',
    expectedTree: 'coffee-machine-purchase',
  },
  {
    name: 'TREE: Espresso maker',
    prompt: 'Looking for an espresso machine',
    expectedType: 'research',
    expectedTree: 'coffee-machine-purchase',
  },
  {
    name: 'TREE: Paint',
    prompt: "I'm looking for paint",
    expectedType: 'research',
    expectedTree: 'paint-purchase',
  },
  {
    name: 'TREE: Mattress',
    prompt: 'I need a new mattress',
    expectedType: 'research',
    expectedTree: 'mattress-purchase',
  },
  {
    name: 'TREE: Bed purchase',
    prompt: 'I need to buy a bed',
    expectedType: 'research',
    expectedTree: 'mattress-purchase',
  },
  {
    name: 'TREE: Drill',
    prompt: 'I need a drill',
    expectedType: 'research',
    expectedTree: 'power-tool-purchase',
  },
  {
    name: 'TREE: Power tools',
    prompt: 'Looking for power tools',
    expectedType: 'research',
    expectedTree: 'power-tool-purchase',
  },
  {
    name: 'TREE: Refrigerator',
    prompt: "I'm looking for a refrigerator",
    expectedType: 'research',
    expectedTree: 'appliance-purchase',
  },
  {
    name: 'TREE: Dishwasher',
    prompt: 'I need a dishwasher',
    expectedType: 'research',
    expectedTree: 'appliance-purchase',
  },
  {
    name: 'TREE: Couch',
    prompt: 'I need a new couch',
    expectedType: 'research',
    expectedTree: 'furniture-purchase',
  },
  {
    name: 'TREE: Sofa',
    prompt: "I'm looking for a sofa",
    expectedType: 'research',
    expectedTree: 'furniture-purchase',
  },
  {
    name: 'TREE (AI): Beverages',
    prompt: "I'm looking for beverages",
    expectedType: 'research',
    expectedTree: 'beverages',
  },
  {
    name: 'TREE (AI): Drinks',
    prompt: 'I need drinks',
    expectedType: 'research',
    expectedTree: 'beverages',
  },
]

// Helper to detect tree from prompt (mimics chat API logic)
function detectTreeQuery(text: string): string | null {
  const lower = text.toLowerCase()

  if (lower.includes('tv') || lower.includes('television')) return 'tv-purchase'
  if (lower.includes('coffee machine') || lower.includes('coffee maker') || lower.includes('espresso machine')) return 'coffee-machine-purchase'
  if (lower.includes('paint') && !lower.includes('painting')) return 'paint-purchase'
  if (lower.includes('mattress') || (lower.includes('bed') && (lower.includes('new') || lower.includes('buy') || lower.includes('need')))) return 'mattress-purchase'
  if (lower.includes('drill') || lower.includes('saw') || lower.includes('sander') || lower.includes('power tool')) return 'power-tool-purchase'
  if (lower.includes('washer') || lower.includes('dryer') || lower.includes('dishwasher') || lower.includes('refrigerator') || lower.includes('fridge') || lower.includes('appliance')) return 'appliance-purchase'
  if (lower.includes('couch') || lower.includes('sofa') || lower.includes('desk') || lower.includes('table') || lower.includes('furniture')) return 'furniture-purchase'
  if (lower.includes('beverage') || lower.includes('drink') || (lower.includes('water') && (lower.includes('buy') || lower.includes('need') || lower.includes('looking')))) return 'beverages'

  return null
}

function runTests() {
  console.log('\n🧪 MISSION DETECTION TEST SUITE\n')
  console.log('═'.repeat(80))

  let passed = 0
  let failed = 0
  const failures: string[] = []

  for (const test of testCases) {
    const messageCount = test.messageCount || 1
    const detection = detectMissionType(test.prompt, messageCount)
    const treeDetection = detectTreeQuery(test.prompt)

    const actualType = detection?.type || null
    const actualTree = treeDetection

    // Check mission type
    const typeMatch = actualType === test.expectedType

    // Check tree (only if expectedTree is specified)
    const treeMatch = test.expectedTree === undefined
      ? true  // Skip tree check if not specified
      : test.expectedTree === null
        ? actualTree === null  // Expect no tree
        : test.expectedTree === 'beverages'
          ? actualTree === 'beverages'  // Special case for AI tree
          : actualTree === test.expectedTree

    const testPassed = typeMatch && treeMatch

    if (testPassed) {
      passed++
      console.log(`✅ ${test.name}`)
      console.log(`   Prompt: "${test.prompt}"`)
      console.log(`   Type: ${actualType} | Tree: ${actualTree || 'none'}`)
    } else {
      failed++
      const failureMsg = `❌ ${test.name}
   Prompt: "${test.prompt}"
   Expected: type=${test.expectedType}, tree=${test.expectedTree || 'none'}
   Got:      type=${actualType}, tree=${actualTree || 'none'}`

      console.log(failureMsg)
      failures.push(failureMsg)
    }
    console.log('')
  }

  console.log('═'.repeat(80))
  console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed out of ${testCases.length} tests\n`)

  if (failures.length > 0) {
    console.log('❌ FAILURES:\n')
    failures.forEach(f => console.log(f + '\n'))
    process.exit(1)
  } else {
    console.log('✅ ALL TESTS PASSED!\n')
    process.exit(0)
  }
}

runTests()
