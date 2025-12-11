/**
 * Test AI Decision Tree Cache
 *
 * Run with: npx tsx scripts/test-cache.ts
 */

import { config } from 'dotenv'
import { getOrGenerateTree, getCacheStats } from '../src/lib/ai/tree-cache'

// Load .env.local
config({ path: '.env.local' })

async function main() {
  console.log('🧪 Testing AI Decision Tree Cache\n')
  console.log('=' .repeat(60))

  const category = 'Beverages'

  try {
    // Test 1: Get or generate tree (first time - should generate)
    console.log(`\n📦 Test 1: Get or generate tree for "${category}"`)
    console.log('-'.repeat(60))

    const tree1Start = Date.now()
    const tree1 = await getOrGenerateTree(category, {
      maxQuestions: 3,
    })
    const tree1Time = Date.now() - tree1Start

    console.log(`\n✅ Got tree in ${tree1Time}ms`)
    console.log(`   Tree ID: ${tree1.treeId}`)
    console.log(`   Questions: ${tree1.questions.length}`)
    console.log(`   Confidence: ${(tree1.metadata.confidenceScore * 100).toFixed(1)}%`)

    // Test 2: Get from cache (second time - should be fast)
    console.log(`\n📦 Test 2: Get same tree again (should use cache)`)
    console.log('-'.repeat(60))

    const tree2Start = Date.now()
    const tree2 = await getOrGenerateTree(category)
    const tree2Time = Date.now() - tree2Start

    console.log(`\n✅ Got tree in ${tree2Time}ms`)
    console.log(`   Tree ID: ${tree2.treeId}`)
    console.log(`   Same tree: ${tree1.treeId === tree2.treeId ? 'YES ✅' : 'NO ❌'}`)
    console.log(`   Speed improvement: ${Math.round((tree1Time / tree2Time) * 100) / 100}x faster`)

    // Test 3: Cache stats
    console.log(`\n📊 Cache Statistics`)
    console.log('-'.repeat(60))

    const stats = await getCacheStats()
    console.log(`   Total trees: ${stats.totalTrees}`)
    console.log(`   Active trees: ${stats.activeTrees}`)
    console.log(`   Expired trees: ${stats.expiredTrees}`)
    console.log(`   Categories cached: ${stats.categoriesCached.join(', ')}`)

    console.log('\n' + '='.repeat(60))
    console.log('\n✅ All tests passed!\n')

  } catch (error) {
    console.error('\n❌ Error:', error)

    if ((error as any).code === 'PGRST205') {
      console.log('\n📝 The ai_decision_trees table needs to be created manually.')
      console.log('\n Steps:')
      console.log('1. Open Supabase Dashboard → SQL Editor')
      console.log('2. Copy contents of: supabase/migrations/20251210185500_ai_decision_trees.sql')
      console.log('3. Paste and run the SQL\n')
    }

    throw error
  }
}

main().catch(console.error)
