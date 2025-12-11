/**
 * Test script for decision tree generator
 *
 * Run with: npx tsx scripts/test-tree-generator.ts
 */

import { config } from 'dotenv'
import { generateDecisionTree, validateTree } from '../src/lib/ai/tree-generator'

// Load .env.local
config({ path: '.env.local' })

async function main() {
  console.log('🌲 Testing Decision Tree Generator\n')
  console.log('=' .repeat(60))

  // Test on a single category
  const category = 'Beverages'

  console.log(`\n📦 Generating tree for: ${category}`)
  console.log('-'.repeat(60))

  try {
    const tree = await generateDecisionTree({
      category,
      maxQuestions: 3,
      temperature: 0.3,
    })

    console.log('\n✅ Tree generated successfully!\n')

    // Validate the tree structure
    const validation = validateTree(tree)
    if (!validation.valid) {
      console.log('⚠️  Validation warnings:')
      validation.errors.forEach((err) => console.log(`   - ${err}`))
      console.log('')
    }

    // Display the tree
    console.log('📋 GENERATED DECISION TREE:')
    console.log('-'.repeat(60))
    console.log(`Tree ID: ${tree.treeId}`)
    console.log(`Category: ${tree.category}`)
    console.log(`Generated: ${new Date(tree.metadata.generatedAt).toLocaleString()}`)
    console.log(`Catalog Size: ${tree.metadata.catalogSize} products`)
    console.log(`Confidence: ${(tree.metadata.confidenceScore * 100).toFixed(1)}%`)
    console.log(`Model: ${tree.metadata.model}`)

    console.log('\n🔍 QUESTIONS:\n')

    tree.questions.forEach((question, i) => {
      console.log(`${i + 1}. ${question.text}`)
      console.log(`   ID: ${question.id}`)
      if (question.sourceAttribute) {
        console.log(`   Source: ${question.sourceAttribute}`)
      }
      console.log(`   Options:`)

      question.options.forEach((option) => {
        console.log(`      • ${option.label} (id: ${option.id})`)
        if (Object.keys(option.filters).length > 0) {
          console.log(`        Filters: ${JSON.stringify(option.filters)}`)
        }
        if (option.example) {
          console.log(`        Example: ${option.example}`)
        }
      })
      console.log('')
    })

    console.log('=' .repeat(60))

    // Save to file for inspection
    const fs = require('fs')
    const outputPath = `./generated-tree-${category.toLowerCase().replace(/\s+/g, '-')}.json`
    fs.writeFileSync(outputPath, JSON.stringify(tree, null, 2))
    console.log(`\n💾 Saved to: ${outputPath}`)

  } catch (error) {
    console.error('\n❌ Error generating tree:', error)
    throw error
  }

  console.log('\n✅ Test complete!\n')
}

main().catch(console.error)
