/**
 * Gate C 上線前診斷：E2E 憑證、Gate A READY、簽核草稿路徑（不輸出密值）。
 * `--strict`：缺 VITE_*、主路徑 E2E_AUTH_* 或 Gate A 非 READY → exit 1。
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv } from './gate-a-env-lib.mjs'

const strict = process.argv.includes('--strict')
const e = buildSpawnBaseEnv()
const pick = (key) => (String(e[key] ?? '').trim() ? 'SET' : 'MISSING')

/** 成對鍵須皆 SET 才視為就緒。 */
function pairReady(prefix) {
  return pick(`${prefix}_EMAIL`) === 'SET' && pick(`${prefix}_PASSWORD`) === 'SET'
}

const latestPath = resolve(process.cwd(), 'docs/evidence/gate-a-latest.md')
let gateAReady = false
if (existsSync(latestPath)) {
  const text = readFileSync(latestPath, 'utf8')
  gateAReady = /判定狀態：`READY`/.test(text)
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
lines.push('')
lines.push('## 前置閘')
lines.push(`- Gate A latest：\`${gateAReady ? 'READY' : 'NOT_READY'}\`（\`docs/evidence/gate-a-latest.md\`）`)
lines.push(`- 簽核草稿：${existsSync(resolve(process.cwd(), signoffPath)) ? '存在' : 'MISSING'}`)
lines.push('')
lines.push('## Gate C 阻塞摘要')
const blockers = []
if (!gateAReady) blockers.push('Gate A 未 READY')
if (!e2eMain) blockers.push('E2E_AUTH_*（`test:e2e:auth` 會 15 skip）')
if (!e2eAdmin || !e2eStaff) blockers.push('E2E_AUTH_ADMIN_*／STAFF_*（user-role-admin 會 skip）')
if (!e2eTl && !e2eAdmin) blockers.push('E2E_AUTH_TEAMLEAD_* 或 ADMIN（system-settings P2 會 skip）')
blockers.push('§6 PAT 輪替（人工，見 security-token-rotation-checklist §A）')
blockers.push('§7 三方簽名（見 gate-c-go-live-signoff-draft §4）')
if (blockers.length) {
  for (const b of blockers) lines.push(`- [ ] ${b}`)
} else {
  lines.push('- （工程項）無阻塞；仍待 PAT／簽名')
}
lines.push('')
lines.push('## 建議下一步')
if (!e2eMain) {
  lines.push('- 於 `.env` 設 `E2E_AUTH_EMAIL`／`E2E_AUTH_PASSWORD`（見 `.env.example`、`docs/gate-c-go-live-signoff-draft-2026-05-15.md` §3）')
  lines.push('- `npm run test:e2e:auth`')
} else {
  lines.push('- `npm run test:e2e:auth`（憑證已齊）')
}
if (!e2eAdmin || !e2eStaff) lines.push('- 補 Admin/Staff 後：`npm run test:e2e:auth:user-role-admin`')
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
  if (!viteOk || !e2eMain || !gateAReady) {
    process.stderr.write('[gatec preflight:strict] 失敗：需 VITE_*、E2E_AUTH_*、Gate A READY。\n')
    process.exitCode = 1
  }
}
