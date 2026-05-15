/**
 * Gate C 上線前診斷：E2E 憑證、Gate A READY、簽核草稿路徑（不輸出密值）。
 * `--strict`：缺 VITE_*、主路徑 E2E_AUTH_* 或 Gate A 非 READY → exit 1。
 */
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv } from './gate-a-env-lib.mjs'
import { computeGateCReadyState } from './gate-c-ready-core.mjs'
import { resolveGateCE2EEnv } from './gate-c-resolve-e2e-env.mjs'

const strict = process.argv.includes('--strict')
const cwd = process.cwd()
const resolved = resolveGateCE2EEnv(buildSpawnBaseEnv(cwd))
const e = resolved.env
const state = computeGateCReadyState(cwd)
const pick = (key) => (String(e[key] ?? '').trim() ? 'SET' : 'MISSING')

function pairReady(prefix) {
  return pick(`${prefix}_EMAIL`) === 'SET' && pick(`${prefix}_PASSWORD`) === 'SET'
}

const signoffPath = 'docs/gate-c-go-live-signoff-draft-2026-05-15.md'
const e2eMain = pairReady('E2E_AUTH')
const e2eAdmin = pairReady('E2E_AUTH_ADMIN')
const e2eStaff = pairReady('E2E_AUTH_STAFF')
const e2eTl = pairReady('E2E_AUTH_TEAMLEAD')

const lines = []
lines.push('# Gate C Preflight')
lines.push('')
lines.push('## 環境（僅 SET／MISSING）')
lines.push(`- VITE_SUPABASE_URL：${pick('VITE_SUPABASE_URL')}`)
lines.push(`- VITE_SUPABASE_ANON_KEY：${pick('VITE_SUPABASE_ANON_KEY')}`)
lines.push(`- E2E_AUTH（主路徑）：${e2eMain ? 'READY' : 'MISSING'}`)
lines.push(`- E2E_AUTH_ADMIN：${e2eAdmin ? 'READY' : 'MISSING'}`)
lines.push(`- E2E_AUTH_STAFF：${e2eStaff ? 'READY' : 'MISSING'}`)
lines.push(`- E2E_AUTH_TEAMLEAD：${e2eTl ? 'READY' : 'MISSING'}`)
if (resolved.notes.length) {
  lines.push(`- 環境補齊（執行時生效）：${resolved.notes.join('；')}`)
}
lines.push('')
lines.push('## 前置閘')
lines.push(`- Gate A latest：\`${state.checks.find((c) => c.key === 'gate_a')?.ok ? 'READY' : 'NOT_READY'}\``)
lines.push(`- 工程自動項：\`${state.autoDone}/${state.autoTotal}\`（\`${state.engineeringReady ? 'READY' : 'NOT_READY'}\`）`)
lines.push(`- 基線豁免：\`${state.baselineWaiver ? 'ON' : 'OFF'}\``)
lines.push(`- 簽核草稿：${existsSync(resolve(cwd, signoffPath)) ? '存在' : 'MISSING'}`)
lines.push('')
lines.push('## Gate C 阻塞摘要')
for (const m of state.missing) {
  lines.push(`- [ ] ${m.label}${m.auto ? '' : '（人工）'}`)
}
if (!state.missing.length) lines.push('- （無）可 go-live')
lines.push('')
lines.push('## 建議下一步')
if (!e2eMain) {
  lines.push('- 複製 `.env.gate-c.example` 至 `.env` 並填入 `E2E_AUTH_*`')
  lines.push('- `npm run gatec:e2e:auth`')
} else {
  lines.push('- `npm run gatec:e2e:auth`（憑證已齊；全 skip 會失敗）')
}
lines.push('- `npm run gatec:evidence:sync`（刷新 `docs/evidence/gate-c-latest.md`）')
if (state.baselineWaiver) {
  lines.push('- 工程基線已接受：`npm run gatec:baseline:accept`（見 `gate-c-engineering-baseline-latest.md`）')
} else if (!e2eAdmin || !e2eStaff) {
  lines.push('- 或執行 `npm run gatec:baseline:accept`（Staff E2E + Gate A 403）；或補 Admin/Staff 跑全套件')
}
lines.push('- SQL 抽測：`docs/sql/gate-c-go-live-verification.sql`（結果貼簽核包）')
lines.push('- 營運步驟：`docs/gate-c-operator-runbook-2026-05-15.md`')
lines.push(
  strict
    ? '- strict：**ON**（缺 VITE_*、主 E2E_AUTH、Gate A READY → exit 1）'
    : '- strict：未啟用；`npm run gatec:preflight:strict`',
)

process.stdout.write(`${lines.join('\n')}\n`)

if (strict) {
  const viteOk = pick('VITE_SUPABASE_URL') === 'SET' && pick('VITE_SUPABASE_ANON_KEY') === 'SET'
  if (!viteOk || !state.engineeringReady) {
    process.stderr.write('[gatec preflight:strict] 失敗：需 VITE_* 與工程項 READY（含基線路徑）。\n')
    process.exitCode = 1
  }
}
