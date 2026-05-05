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

/**
 * Vite 執行時以 `import.meta.env` 為準；Vitest 的 `vi.stubEnv` 主要落在 `process.env`。
 * CI／worktree 無 `.env` 時若僅讀 meta，會與 stub 脫鉤而誤判未設定。
 */
const viteBrowserLookup = (key: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}
  const fromMeta = normalizeViteEnvString(env[key])
  if (fromMeta) return fromMeta
  if (import.meta.env.MODE === 'test' && typeof process !== 'undefined') {
    return normalizeViteEnvString(process.env[key])
  }
  return ''
}

/** 未設定或正規化後為空時回傳 null（走記憶體／Null Repository） */
export const getSupabaseBrowserCredentials = (): SupabaseBrowserCredentials | null => {
  try {
    const supabaseUrl = viteBrowserLookup('VITE_SUPABASE_URL')
    const anonKey = viteBrowserLookup('VITE_SUPABASE_ANON_KEY')
    if (!supabaseUrl || !anonKey) return null
    return { supabaseUrl, anonKey }
  } catch {
    return null
  }
}

export const isSupabaseBrowserConfigured = (): boolean => getSupabaseBrowserCredentials() !== null
