#!/usr/bin/env node
/**
 * 本機／CI：檢查 VITE_SUPABASE_URL、VITE_SUPABASE_ANON_KEY 是否與 Supabase Dashboard（Project Settings → API）建議格式一致。
 * Vercel 後台敏感值無法代查；請將 Vercel 環境變數與 Dashboard 逐字對齊後重新部署。
 *
 * 用法：
 *   node scripts/verify-supabase-vite-env.mjs
 *   node scripts/verify-supabase-vite-env.mjs --ping   # 另打 auth health + REST root 驗證可連線
 */
import { hydrateProcessEnvMissingFromDotenv } from './gate-a-env-lib.mjs'
import {
  maskAnonKeyForLog,
  maskSupabaseUrlForLog,
  validateSupabaseViteEnvFormat,
} from './supabase-vite-env-guard.mjs'

hydrateProcessEnvMissingFromDotenv()

const wantPing = process.argv.includes('--ping')

const urlRaw = process.env.VITE_SUPABASE_URL
const anonRaw = process.env.VITE_SUPABASE_ANON_KEY

const result = validateSupabaseViteEnvFormat(urlRaw, anonRaw)

if (!result.ok) {
  process.stderr.write('[verify:supabase-vite-env] 格式檢查失敗：\n')
  for (const e of result.errors) process.stderr.write(`  - ${e}\n`)
  process.stderr.write('\n請自 Supabase「Project Settings → API」複製 Project URL 與 anon public，寫入本機 `.env` 或與 Vercel 環境變數一致。\n')
  process.exit(1)
}

const { canonicalUrl, anonKey, warnings } = result

process.stdout.write('[verify:supabase-vite-env] 格式檢查通過。\n')
process.stdout.write(`  - Project URL（遮罩）：${maskSupabaseUrlForLog(canonicalUrl)}\n`)
process.stdout.write(`  - anon public（遮罩）：${maskAnonKeyForLog(anonKey)}\n`)

for (const w of warnings) {
  process.stdout.write(`  （提醒）${w}\n`)
}

process.stdout.write(
  '\n手動對齊 Vercel：專案 → Settings → Environment Variables，確認 VITE_SUPABASE_URL／VITE_SUPABASE_ANON_KEY 與上述 Dashboard 值一致（Sensitive 無法檢視時請以 Supabase 為準覆寫後 Redeploy）。\n',
)

if (!wantPing) {
  process.stdout.write('\n可加上 --ping 以驗證網路可連至該 Supabase 專案。\n')
  process.exit(0)
}

const pingOne = async (label, input, init) => {
  const res = await fetch(input, init)
  const ok = res.ok
  process.stdout.write(`  - ${label}：HTTP ${res.status}${ok ? '（OK）' : ''}\n`)
  if (!ok) {
    const t = (await res.text()).slice(0, 200)
    if (t) process.stdout.write(`    內文片段：${t.replace(/\s+/g, ' ')}\n`)
  }
  return { ok, status: res.status }
}

process.stdout.write('\n[verify:supabase-vite-env] 連線檢查（--ping）…\n')

let hOk = false
let rOk = false
try {
  const healthUrl = `${canonicalUrl}/auth/v1/health`
  const h = await pingOne('Auth health', healthUrl, { method: 'GET' })
  hOk = h.ok && h.status === 200

  const restUrl = `${canonicalUrl}/rest/v1/`
  const r = await pingOne('REST root（帶 anon）', restUrl, {
    method: 'GET',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  })
  // 不同 PostgREST／路由設定下可能非 2xx；401 表示金鑰與專案明顯不一致。
  rOk = r.status !== 401 && r.status < 500
  if (r.status === 401) {
    process.stderr.write('  - REST root：anon 遭拒（401），請確認 VITE_SUPABASE_ANON_KEY 與該 Project URL 同一專案。\n')
  }
} catch (err) {
  process.stderr.write(`\n[verify:supabase-vite-env] 連線失敗：${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
}

if (!hOk || !rOk) {
  process.stderr.write(
    '\n[verify:supabase-vite-env] 連線檢查未全部成功：常見原因為網路、專案暫停、URL／金鑰與專案不一致，或瀏覽器外之防火牆阻擋。\n',
  )
  process.exit(1)
}

process.stdout.write('\n[verify:supabase-vite-env] 連線檢查通過。\n')
process.exit(0)
