import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseBrowserCredentials } from '../../services/supabaseBrowserEnv'

let client: SupabaseClient | null = null

/** 無環境變數時回傳 null（走記憶體 Repository） */
export const getBrowserSupabaseClient = (): SupabaseClient | null => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return null
  }
  if (!client) {
    client = createClient(creds.supabaseUrl, creds.anonKey)
  }
  return client
}
