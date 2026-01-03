import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let supabase: SupabaseClient

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey)
} else {
    supabase = createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseKey || 'placeholder-key'
    )
}

export { supabase }
