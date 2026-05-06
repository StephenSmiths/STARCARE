import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { gateAStrictHttpEnabled, hydrateProcessEnvMissingFromDotenv } from './gate-a-env-lib.mjs'
import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'

hydrateProcessEnvMissingFromDotenv()

const strictHttp = gateAStrictHttpEnabled(process.argv, process.env)

const url = process.env.VITE_SUPABASE_URL
const anon = process.env.VITE_SUPABASE_ANON_KEY
const staffToken = process.env.GATEA_STAFF_ACCESS_TOKEN

if (!url || !anon) {
  throw new Error(
    '缺少 VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY（請寫入 repo 根 `.env` 或於 shell 匯出；此腳本會補讀未匯出之 `.env` 鍵）。範例鍵名見 repo 根目錄 `.env.example`。',
  )
}

const outDir = resolve(process.cwd(), 'docs/evidence')
mkdirSync(outDir, { recursive: true })

const ts = new Date().toISOString().replaceAll(':', '').replace('T', '-').slice(0, 19)
const endpoint = `${url}/functions/v1/admin-user-role-set`
const body = JSON.stringify({ targetEmail: 'nobody@example.com', role: 'staff' })

const toText = async (res) => {
  const text = await res.text()
  const headers = [...res.headers.entries()].map(([k, v]) => `${k}: ${v}`).join('\n')
  return `HTTP ${res.status}\n${headers}\n\n${text}\n`
}

// 401: 無 Authorization header
const r401 = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', apikey: anon },
  body,
})
const p401 = resolve(outDir, `gate-a-d2-401-admin-user-role-set-${ts}.txt`)
writeFileSync(p401, await toText(r401), 'utf8')

let p403 = ''
if (staffToken) {
  // 403: staff token 呼叫 admin-only edge
  const r403 = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anon,
      Authorization: `Bearer ${staffToken}`,
    },
    body,
  })
  p403 = resolve(outDir, `gate-a-d2-403-admin-user-role-set-${ts}.txt`)
  writeFileSync(p403, await toText(r403), 'utf8')
}

let strictHttpViolation = false
if (r401.status !== 401) {
  process.stderr.write(
    `[gatea http] 警告：未附 Authorization 的請求預期 HTTP 401，實際為 ${r401.status}。已仍寫入證據檔，請核對 Edge \`verify_jwt\` 與部署版本。\n`,
  )
  if (strictHttp) strictHttpViolation = true
}

process.stdout.write(`401 evidence: ${p401}\n`)
if (p403) {
  if (r403.status !== 403) {
    process.stderr.write(
      `[gatea http] 警告：staff JWT 呼叫管理專用函式預期 HTTP 403，實際為 ${r403.status}。已仍寫入證據檔；若為 200 請檢查 staff 角色與函式授權邏輯。\n`,
    )
    if (strictHttp) strictHttpViolation = true
  }
  process.stdout.write(`403 evidence: ${p403}\n`)
} else {
  process.stdout.write('403 evidence: skipped (set GATEA_STAFF_ACCESS_TOKEN to enable)\n')
}

process.stdout.write(['', ...gateAStandardCloseoutBlockquotes()].join('\n') + '\n')

if (strictHttpViolation) {
  process.stderr.write('[gatea http] 嚴格模式（`--strict-http` 或 `GATEA_STRICT_HTTP`）：HTTP 狀態與預期不符，exit 1。\n')
  process.exitCode = 1
}
