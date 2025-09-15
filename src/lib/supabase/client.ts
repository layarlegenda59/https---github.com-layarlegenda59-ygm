import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://buqimneauuzvtgvvflbu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cWltbmVhdXV6dnRndnZmbGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NzYxOTIsImV4cCI6MjA3MzE1MjE5Mn0.ALckMER1ZMiUI5WxjSbx1JZ1gW1MTflsBeWLdtwX_U8'

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}
if (!supabaseAnonKey) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
