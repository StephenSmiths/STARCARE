import { afterEach, describe, expect, it, vi } from 'vitest'
import { isSupabaseBrowserConfigured } from './supabaseBrowserEnv'

describe('isSupabaseBrowserConfigured', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  /**
   * `vi.stubEnv` 會與 Vite 既有 `import.meta.env` 合併；負例（清空／缺一）易與本機 `.env` 衝突，
   * 故僅對「stub 補齊兩鍵」做肯定断言（與 `getSupabaseBrowserCredentials`／Auth client 同源正規化）。
   */
  it('stub 同時設定 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY 時為 true', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://stub-example.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'stub-anon-key-for-test')
    expect(isSupabaseBrowserConfigured()).toBe(true)
  })
})
