/**
 * Setup AI Decision Trees Table
 *
 * Creates the ai_decision_trees table in Supabase
 * Run with: npx tsx scripts/setup-ai-trees-table.ts
 */

import { config } from 'dotenv'
import { createStandaloneClient } from '../src/lib/supabase/standalone'
import fs from 'fs'
import path from 'path'

// Load .env.local
config({ path: '.env.local' })

async function main() {
  console.log('🔧 Setting up AI Decision Trees table in Supabase\n')

  const supabase = createStandaloneClient()

  // Read the migration file
  const migrationPath = path.join(
    process.cwd(),
    'supabase/migrations/20251210185500_ai_decision_trees.sql'
  )
  const migration = fs.readFileSync(migrationPath, 'utf-8')

  console.log('📄 Running migration...\n')

  try {
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migration } as any)

    if (error) {
      // Try alternative: split into individual statements
      console.log('  ⚠️  RPC method failed, trying direct execution...')

      const statements = migration
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith('--'))

      for (const statement of statements) {
        if (statement.trim()) {
          console.log(`  Executing: ${statement.substring(0, 50)}...`)
          const { error: stmtError } = await (supabase as any).rpc('query', {
            query: statement,
          })

          if (stmtError) {
            console.error(`  ❌ Error:`, stmtError.message)
          }
        }
      }
    }

    // Test if table exists
    console.log('\n✅ Testing table access...')
    const { data, error: testError } = await supabase
      .from('ai_decision_trees')
      .select('count')
      .limit(1)

    if (testError) {
      if (testError.code === '42P01') {
        console.error('\n❌ Table does not exist yet.')
        console.log('\n📝 Please run the migration manually:')
        console.log('\n1. Go to Supabase Dashboard → SQL Editor')
        console.log('2. Paste the contents of:')
        console.log('   supabase/migrations/20251210185500_ai_decision_trees.sql')
        console.log('3. Run the query\n')
      } else {
        console.error('\n❌ Error testing table:', testError)
      }
    } else {
      console.log('  ✅ Table exists and is accessible!')
      console.log('\n✅ Setup complete!\n')
    }
  } catch (error) {
    console.error('\n❌ Error during setup:', error)
    console.log('\n📝 Please run the migration manually:')
    console.log('\n1. Go to Supabase Dashboard → SQL Editor')
    console.log('2. Paste the contents of:')
    console.log('   supabase/migrations/20251210185500_ai_decision_trees.sql')
    console.log('3. Run the query\n')
  }
}

main().catch(console.error)
