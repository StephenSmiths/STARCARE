/**
 * 與各 Repository 選用 Edge 分支一致：瀏覽器是否設定 Supabase（`VITE_*`）。
 * 供審計「已由 Edge 落庫則跳過 `audit-trail-append`」等判斷使用。
 */
export const isSupabaseBrowserConfigured = (): boolean => {
  try {
    const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}
    return !!(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY)
  } catch {
    return false
  }
}
