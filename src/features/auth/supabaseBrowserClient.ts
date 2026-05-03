import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/** 無環境變數時回傳 null（走記憶體 Repository） */
export const getBrowserSupabaseClient = (): SupabaseClient | null => {
  const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  // 建置時常見：Vercel／.env 多餘空白或包一層引號，會讓 Auth 請求 URL 變成非法 path
  const url = rawUrl?.trim().replace(/^["']|["']$/g, '')
  const key = rawKey?.trim().replace(/^["']|["']$/g, '')
  if (!url || !key) {
    return null
  }
  if (!client) {
    client = createClient(url, key)
  }
  return client
}
