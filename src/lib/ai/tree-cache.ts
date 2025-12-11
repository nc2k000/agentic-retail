/**
 * Decision Tree Cache
 *
 * Manages cached AI-generated decision trees in Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { generateDecisionTree } from './tree-generator'
import { GeneratedTree } from './types'
import { CATALOG } from '@/lib/catalog'

/**
 * Get Supabase client with service role (for write operations)
 */
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Cache duration in days
 */
const CACHE_DURATION_DAYS = 7

/**
 * Get or generate a decision tree for a category
 * This is the main function to use - it handles caching automatically
 */
export async function getOrGenerateTree(
  category: string,
  options?: {
    forceRegenerate?: boolean
    maxQuestions?: number
  }
): Promise<GeneratedTree> {
  const { forceRegenerate = false, maxQuestions = 4 } = options || {}

  console.log(`🔍 Looking for cached tree: ${category}`)

  // 1. Try to get from cache (unless force regenerate)
  if (!forceRegenerate) {
    const cached = await getCachedTree(category)
    if (cached) {
      console.log(`  ✅ Found cached tree (expires: ${cached.expiresAt})`)
      return cached.tree
    }
    console.log(`  ⚠️  No cached tree found`)
  }

  // 2. Generate new tree
  console.log(`  🌲 Generating new tree...`)
  const tree = await generateDecisionTree({
    category,
    maxQuestions,
  })

  // 3. Cache the tree
  await cacheTree(category, tree)
  console.log(`  ✅ Tree cached successfully`)

  return tree
}

/**
 * Get a cached tree if it exists and hasn't expired
 */
async function getCachedTree(category: string): Promise<{
  tree: GeneratedTree
  expiresAt: string
} | null> {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('ai_decision_trees')
    .select('*')
    .eq('category', category)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - not an error, just no cache
      return null
    }
    console.error('Error fetching cached tree:', error)
    return null
  }

  if (!data) {
    return null
  }

  return {
    tree: data.tree_definition as GeneratedTree,
    expiresAt: data.expires_at,
  }
}

/**
 * Cache a generated tree
 */
async function cacheTree(category: string, tree: GeneratedTree): Promise<void> {
  const supabase = getServiceClient()

  // Get products for snapshot
  const products = CATALOG[category] || []
  const sampleProducts = products.slice(0, 5).map((p) => ({
    sku: p.sku,
    name: p.name,
    price: p.price,
    tags: p.tags,
  }))

  // Calculate expiration
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + CACHE_DURATION_DAYS)

  const { error } = await supabase.from('ai_decision_trees').insert({
    category,
    tree_definition: tree as any,
    catalog_snapshot: {
      productCount: products.length,
      sampleProducts,
    },
    generation_metadata: {
      processingTime: 0, // Not tracking this here
      attributesAnalyzed: tree.questions.length,
      questionsGenerated: tree.questions.length,
      confidenceScore: tree.metadata.confidenceScore,
      model: tree.metadata.model,
    },
    expires_at: expiresAt.toISOString(),
  })

  if (error) {
    console.error('Error caching tree:', error)
    throw error
  }
}

/**
 * Invalidate (delete) cached tree for a category
 */
export async function invalidateCachedTree(category: string): Promise<void> {
  const supabase = getServiceClient()

  const { error } = await supabase
    .from('ai_decision_trees')
    .delete()
    .eq('category', category)

  if (error) {
    console.error('Error invalidating cached tree:', error)
    throw error
  }

  console.log(`  ✅ Invalidated cached tree for: ${category}`)
}

/**
 * Cleanup expired trees (can be run periodically)
 */
export async function cleanupExpiredTrees(): Promise<number> {
  const supabase = getServiceClient()

  // Delete trees that expired more than 7 days ago
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - 7)

  const { data, error } = await supabase
    .from('ai_decision_trees')
    .delete()
    .lt('expires_at', cutoffDate.toISOString())
    .select('id')

  if (error) {
    console.error('Error cleaning up expired trees:', error)
    throw error
  }

  const deletedCount = data?.length || 0
  console.log(`  ✅ Cleaned up ${deletedCount} expired trees`)

  return deletedCount
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalTrees: number
  activeTrees: number
  expiredTrees: number
  categoriesCached: string[]
}> {
  const supabase = getServiceClient()

  const { data: allTrees, error } = await supabase
    .from('ai_decision_trees')
    .select('category, expires_at')

  if (error) {
    console.error('Error fetching cache stats:', error)
    throw error
  }

  const now = new Date()
  const active = allTrees?.filter((t) => new Date(t.expires_at) > now) || []
  const expired = allTrees?.filter((t) => new Date(t.expires_at) <= now) || []

  return {
    totalTrees: allTrees?.length || 0,
    activeTrees: active.length,
    expiredTrees: expired.length,
    categoriesCached: active.map((t) => t.category),
  }
}
