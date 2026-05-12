/**
 * 驗證與 Vite 注入一致之 `VITE_SUPABASE_URL`／`VITE_SUPABASE_ANON_KEY` 格式（對齊 Dashboard → Project Settings → API）。
 * 供 `verify-supabase-vite-env.mjs` 與 Vitest 共用。
 */

/** @param {unknown} raw */
export function normalizeViteEnvString(raw) {
  if (raw == null || typeof raw !== 'string') return ''
  return raw.trim().replace(/^["']|["']$/g, '')
}

/**
 * @param {string} supabaseUrlRaw
 * @param {string} anonKeyRaw
 * @returns {{ ok: true, canonicalUrl: string, anonKey: string, warnings: string[] } | { ok: false, errors: string[] }}
 */
export function validateSupabaseViteEnvFormat(supabaseUrlRaw, anonKeyRaw) {
  /** @type {string[]} */
  const errors = []
  /** @type {string[]} */
  const warnings = []

  const supabaseUrl = normalizeViteEnvString(supabaseUrlRaw)
  const anonKey = normalizeViteEnvString(anonKeyRaw)

  if (!supabaseUrl) errors.push('缺少或為空的 VITE_SUPABASE_URL。')
  if (!anonKey) errors.push('缺少或為空的 VITE_SUPABASE_ANON_KEY。')
  if (errors.length) return { ok: false, errors }

  if (!supabaseUrl.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL 必須以 https:// 開頭（請勿使用 http 或省略協定）。')
  }

  if (/\/\/+/.test(supabaseUrl.replace(/^https:\/\//, ''))) {
    errors.push('VITE_SUPABASE_URL 含連續斜線，請檢查是否貼錯。')
  }

  if (/\/+$/.test(supabaseUrl)) {
    errors.push('VITE_SUPABASE_URL 結尾不得多餘斜線（請移除尾端 /）。')
  }

  let host = ''
  try {
    const u = new URL(supabaseUrl)
    host = u.hostname
    if (u.pathname !== '' && u.pathname !== '/') {
      errors.push('VITE_SUPABASE_URL 僅需專案 origin（不應含路徑），例如 https://<ref>.supabase.co。')
    }
  } catch {
    errors.push('VITE_SUPABASE_URL 不是合法 URL。')
  }

  if (host && !host.endsWith('.supabase.co') && host !== '127.0.0.1' && host !== 'localhost') {
    warnings.push(
      `主機名「${host}」非 *.supabase.co；若為自訂網域請手動確認與 Dashboard「Project URL」一致。`,
    )
  }

  if (anonKey.length < 80) {
    errors.push('VITE_SUPABASE_ANON_KEY 長度異常偏短（請確認是否誤貼、截斷或混用其他金鑰）。')
  }

  if (!anonKey.startsWith('eyJ')) {
    warnings.push('VITE_SUPABASE_ANON_KEY 通常為 JWT（eyJ 開頭）；若非如此請手動確認仍為 anon public。')
  }

  if (errors.length) return { ok: false, errors }

  return { ok: true, canonicalUrl: supabaseUrl, anonKey, warnings }
}

/** @param {string} url */
export function maskSupabaseUrlForLog(url) {
  try {
    const u = new URL(url)
    return `${u.protocol}//${u.hostname}`
  } catch {
    return '(無法解析的 URL)'
  }
}

/** @param {string} key */
export function maskAnonKeyForLog(key) {
  if (key.length < 14) return '(已設定)'
  return `${key.slice(0, 8)}…${key.slice(-4)}`
}
