import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
})

// Helper function to handle Supabase errors
export function handleSupabaseError(error: unknown) {
  console.error('Supabase error:', error)
  
  // Type guard to check if error has expected properties
  if (error && typeof error === 'object' && 'code' in error) {
    const typedError = error as { code: string; message?: string }
    
    if (typedError.code === 'PGRST301') {
      return 'Database connection failed. Please try again.'
    }
    
    if (typedError.code === '23505') {
      return 'This email is already registered. Please use a different email.'
    }
    
    return typedError.message || 'An unexpected error occurred. Please try again.'
  }
  
  return 'An unexpected error occurred. Please try again.'
}