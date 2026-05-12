import { describe, expect, it } from 'vitest'
import {
  normalizeViteEnvString,
  validateSupabaseViteEnvFormat,
} from './supabase-vite-env-guard.mjs'

const validAnon =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature'

describe('normalizeViteEnvString', () => {
  it('trim 並去除首尾引號', () => {
    expect(normalizeViteEnvString('  "https://a.supabase.co"  ')).toBe('https://a.supabase.co')
  })
})

describe('validateSupabaseViteEnvFormat', () => {
  it('通過：合法 https origin 與足夠長 anon', () => {
    const r = validateSupabaseViteEnvFormat('https://abc123.supabase.co', validAnon)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.canonicalUrl).toBe('https://abc123.supabase.co')
      expect(r.anonKey).toBe(validAnon)
    }
  })

  it('失敗：尾端斜線', () => {
    const r = validateSupabaseViteEnvFormat(`https://abc123.supabase.co/`, validAnon)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.some((e) => e.includes('斜線'))).toBe(true)
  })

  it('失敗：非 https', () => {
    const r = validateSupabaseViteEnvFormat('http://abc123.supabase.co', validAnon)
    expect(r.ok).toBe(false)
  })

  it('失敗：缺鍵', () => {
    const r = validateSupabaseViteEnvFormat('', '')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.length).toBeGreaterThanOrEqual(2)
  })
})
