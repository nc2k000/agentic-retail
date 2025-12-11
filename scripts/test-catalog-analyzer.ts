/**
 * Test script for catalog analyzer
 *
 * Run with: npx tsx scripts/test-catalog-analyzer.ts
 */

import { analyzeCatalog } from '../src/lib/ai/catalog-analyzer'
import { CATALOG } from '../src/lib/catalog'

async function main() {
  // Test on real catalog categories
  const categories = [
    'Dairy & Eggs',       // Grocery category with tags
    'Beverages',          // Likely has variety of products
    'Household & Cleaning', // Should have different product attributes
  ]

  console.log('📚 Available categories in catalog:')
  console.log(Object.keys(CATALOG).slice(0, 10).join(', '), '...\n')

  console.log('🧪 Testing Catalog Analyzer\n')
  console.log('=' .repeat(60))

  for (const category of categories) {
    console.log(`\n📦 Category: ${category}`)
    console.log('-'.repeat(60))

    try {
      const analysis = await analyzeCatalog(category)

      console.log(`\n📊 Results:`)
      console.log(`   Total Products: ${analysis.totalProducts}`)
      console.log(`   Attributes Found: ${analysis.attributes.length}`)
      console.log(`   Suggested Questions: ${analysis.suggestedQuestions.length}`)
      console.log(`   Processing Time: ${analysis.metadata.processingTime}ms`)

      if (analysis.metadata.warnings) {
        console.log(`\n⚠️  Warnings:`)
        analysis.metadata.warnings.forEach(w => console.log(`   - ${w}`))
      }

      if (analysis.attributes.length > 0) {
        console.log(`\n🏷️  Top 5 Attributes:`)
        analysis.attributes.slice(0, 5).forEach((attr, i) => {
          console.log(`   ${i + 1}. ${attr.name}`)
          console.log(`      Type: ${attr.type}`)
          console.log(`      Coverage: ${(attr.coverage * 100).toFixed(1)}%`)
          console.log(`      Discrimination: ${(attr.discriminationPower * 100).toFixed(1)}%`)
          console.log(`      Priority: ${attr.priority.toFixed(3)}`)
          console.log(`      Values: ${attr.values.slice(0, 3).join(', ')}${attr.values.length > 3 ? '...' : ''}`)
        })
      }

      if (analysis.suggestedQuestions.length > 0) {
        console.log(`\n❓ Suggested Questions:`)
        analysis.suggestedQuestions.forEach((q, i) => {
          console.log(`   ${i + 1}. ${q.text}`)
          console.log(`      Attribute: ${q.attribute}`)
          console.log(`      Priority: ${q.priority}/10`)
          console.log(`      Options: ${q.options.join(', ')}`)
        })
      }

    } catch (error) {
      console.error(`\n❌ Error analyzing ${category}:`, error)
    }

    console.log('\n' + '='.repeat(60))
  }

  console.log('\n✅ Analysis complete!\n')
}

main().catch(console.error)
