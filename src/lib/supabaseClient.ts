import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create client with fallback empty strings to prevent crashes
// Note: The app will still work for viewing charts, but data persistence won't work without proper credentials
export const supabase = createClient(supabaseUrl, supabaseKey)
