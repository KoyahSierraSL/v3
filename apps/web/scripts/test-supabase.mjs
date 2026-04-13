import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL?.trim()
const anonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim()

if (!url || !anonKey) {
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy apps/web/.env.example to apps/web/.env or .env.local and set both.',
  )
  process.exit(1)
}

const supabase = createClient(url, anonKey)

// Intentionally query a non-existent table: PostgREST still proves we reached your project.
const { error } = await supabase
  .from('_cursor_connection_probe_')
  .select('id')
  .limit(1)

if (!error) {
  console.log('OK: Connected to Supabase (unexpected empty error).')
  process.exit(0)
}

const code = error.code ?? ''
const msg = error.message ?? ''

// Schema/table not in cache — request hit PostgREST successfully.
if (code === 'PGRST205' || msg.includes('does not exist')) {
  console.log('OK: Connected to Supabase (project URL and anon key are accepted).')
  process.exit(0)
}

if (
  msg.includes('Invalid API key') ||
  msg.includes('JWT') ||
  code === '401' ||
  /invalid/i.test(msg)
) {
  console.error('Failed: API rejected the anon key. Copy the anon (public) key from Supabase → Settings → API.')
  process.exit(1)
}

if (msg.includes('fetch failed') || msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED')) {
  console.error('Failed: Could not reach Supabase. Check VITE_SUPABASE_URL and your network.')
  process.exit(1)
}

console.error('Failed:', code || '(no code)', msg)
process.exit(1)
