/**
 * 與各 Repository 選用 Edge 分支、`getBrowserSupabaseClient` 一致：讀取並正規化 `VITE_*`。
 * 供審計「已由 Edge 落庫則跳過 `audit-trail-append`」等判斷使用。
 */

export type SupabaseBrowserCredentials = {
  supabaseUrl: string
  anonKey: string
}

/** 建置／.env 常見：首尾空白或包引號（對齊 Auth client） */
const normalizeViteEnvString = (value: string | undefined): string => {
  if (value == null) return ''
  return value.trim().replace(/^["']|["']$/g, '')
}

/** 未設定或正規化後為空時回傳 null（走記憶體／Null Repository） */
export const getSupabaseBrowserCredentials = (): SupabaseBrowserCredentials | null => {
  try {
    const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}
    const supabaseUrl = normalizeViteEnvString(env.VITE_SUPABASE_URL)
    const anonKey = normalizeViteEnvString(env.VITE_SUPABASE_ANON_KEY)
    if (!supabaseUrl || !anonKey) return null
    return { supabaseUrl, anonKey }
  } catch {
    return null
  }
}

export const isSupabaseBrowserConfigured = (): boolean => getSupabaseBrowserCredentials() !== null
