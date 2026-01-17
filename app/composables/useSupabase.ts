import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export function useSupabase() {
  const config = useRuntimeConfig()

  if (!supabaseClient) {
    const supabaseUrl = config.public.supabaseUrl as string
    const supabaseKey = config.public.supabaseKey as string

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env')
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey)
  }

  return {
    supabase: supabaseClient,
  }
}
