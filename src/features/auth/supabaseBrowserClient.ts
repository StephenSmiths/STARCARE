import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/** 無環境變數時回傳 null（走記憶體 Repository） */
export const getBrowserSupabaseClient = (): SupabaseClient | null => {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!url?.trim() || !key?.trim()) {
    return null
  }
  if (!client) {
    client = createClient(url, key)
  }
  return client
}
