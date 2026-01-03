import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create client only if we have valid credentials
// Use a placeholder URL if missing to prevent crashes, but operations will fail gracefully
let supabase: SupabaseClient

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey)
} else {
    // Create a dummy client with placeholder values to prevent crashes
    // Operations will fail gracefully with proper error handling
    supabase = createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseKey || 'placeholder-key'
    )
}

export { supabase }
