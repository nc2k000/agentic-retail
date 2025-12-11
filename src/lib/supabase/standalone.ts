/**
 * Standalone Supabase Client
 *
 * For use in scripts and non-Next.js contexts
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types'

export function createStandaloneClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseKey)
}
