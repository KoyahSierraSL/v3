import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/database.types'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

/**
 * Browser client for your Supabase project. Null until URL and anon key are set in `.env`.
 * RLS policies on the database gate what this key can read/write.
 */
export const supabase: SupabaseClient<Database> | null =
  url && anonKey ? createClient<Database>(url, anonKey) : null

export const isSupabaseConfigured = Boolean(supabase)
