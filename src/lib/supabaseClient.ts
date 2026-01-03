import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Get the Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create the Supabase client instance
// We check if we have valid credentials first - if not, we use placeholder values
// This way the app won't crash even if env vars aren't set (useful for development)
let supabase: SupabaseClient

if (supabaseUrl && supabaseKey) {
    // We have real credentials, create a normal client
    supabase = createClient(supabaseUrl, supabaseKey)
} else {
    // No credentials found - use placeholders so the app doesn't break
    // The app will still render, but database operations will fail (which is fine)
    supabase = createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseKey || 'placeholder-key'
    )
}

export { supabase }
