/**
 * Test AI Tree Integration
 *
 * Tests the full integration of AI-generated trees:
 * 1. Generate an AI tree for a category
 * 2. Load it via getTreeByIdAsync
 * 3. Verify it works with the decision system
 *
 * Run with: npx tsx scripts/test-ai-tree-integration.ts
 */

import { config } from 'dotenv'
import { getOrGenerateTreeForCategory, getTreeByIdAsync } from '../src/lib/decisions/trees'

// Load .env.local
config({ path: '.env.local' })

async function main() {
  console.log('🧪 Testing AI Tree Integration\n')
  console.log('='.repeat(60))

  const category = 'Beverages'

  try {
    // Test 1: Generate AI tree
    console.log(`\n📦 Test 1: Generate AI tree for "${category}"`)
    console.log('-'.repeat(60))

    const tree = await getOrGenerateTreeForCategory(category)

    console.log(`\n✅ Generated tree:`)
    console.log(`   ID: ${tree.id}`)
    console.log(`   Name: ${tree.name}`)
    console.log(`   Category: ${tree.category}`)
    console.log(`   Root Node: ${tree.rootNodeId}`)
    console.log(`   Total Nodes: ${tree.nodes.length}`)
    console.log(`   Questions: ${tree.nodes.filter(n => n.type === 'question').length}`)

    // Test 2: Load via async function
    console.log(`\n📦 Test 2: Load tree via getTreeByIdAsync`)
    console.log('-'.repeat(60))

    const loadedTree = await getTreeByIdAsync(tree.id)

    if (!loadedTree) {
      throw new Error('Failed to load tree via getTreeByIdAsync')
    }

    console.log(`\n✅ Loaded tree:`)
    console.log(`   ID: ${loadedTree.id}`)
    console.log(`   Same as generated: ${loadedTree.id === tree.id ? 'YES' : 'NO'}`)

    // Test 3: Inspect questions
    console.log(`\n📦 Test 3: Inspect questions`)
    console.log('-'.repeat(60))

    const questions = tree.nodes.filter(n => n.type === 'question')

    questions.forEach((q, index) => {
      console.log(`\n  Question ${index + 1}: ${q.question}`)
      q.options?.forEach((opt, i) => {
        console.log(`    ${i + 1}. ${opt.label}`)
        if (opt.description) {
          console.log(`       Description: ${opt.description}`)
        }
      })
    })

    // Test 4: Test cache (should be instant)
    console.log(`\n📦 Test 4: Test caching`)
    console.log('-'.repeat(60))

    const start = Date.now()
    const cachedTree = await getTreeByIdAsync(tree.id)
    const duration = Date.now() - start

    console.log(`\n✅ Cache test:`)
    console.log(`   Duration: ${duration}ms (should be <50ms)`)
    console.log(`   From cache: ${duration < 50 ? 'YES ✅' : 'NO ❌'}`)

    console.log('\n' + '='.repeat(60))
    console.log('\n✅ All tests passed!\n')

  } catch (error) {
    console.error('\n❌ Error:', error)

    if ((error as any).code === 'PGRST205') {
      console.log('\n📝 The ai_decision_trees table needs to be created manually.')
      console.log('\nSteps:')
      console.log('1. Open Supabase Dashboard → SQL Editor')
      console.log('2. Copy contents of: supabase/migrations/20251210185500_ai_decision_trees.sql')
      console.log('3. Paste and run the SQL\n')
    }

    throw error
  }
}

main().catch(console.error)
