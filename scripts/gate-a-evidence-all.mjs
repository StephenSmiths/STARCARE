import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const run = (label, cmd, args, extraEnv = {}) => {
  process.stdout.write(`\n== ${label} ==\n`)
  const out = spawnSync(cmd, args, {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  })
  return out.status ?? 1
}

const readDotenv = () => {
  const path = resolve(process.cwd(), '.env')
  if (!existsSync(path)) return {}
  const text = readFileSync(path, 'utf8')
  const out = {}
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const k = line.slice(0, eq).trim()
    const v = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    out[k] = v
  }
  return out
}

let failed = false
const dotenv = readDotenv()
const mergedEnv = {
  GATEA_STAFF_EMAIL: process.env.GATEA_STAFF_EMAIL || dotenv.GATEA_STAFF_EMAIL || '',
  GATEA_STAFF_PASSWORD: process.env.GATEA_STAFF_PASSWORD || dotenv.GATEA_STAFF_PASSWORD || '',
  GATEA_STAFF_ACCESS_TOKEN: process.env.GATEA_STAFF_ACCESS_TOKEN || dotenv.GATEA_STAFF_ACCESS_TOKEN || '',
}

if (run('auto evidence', 'node', ['scripts/gate-a-auto-evidence.mjs']) !== 0) {
  failed = true
}

const hasStaffCreds = Boolean(mergedEnv.GATEA_STAFF_EMAIL && mergedEnv.GATEA_STAFF_PASSWORD)
if (hasStaffCreds) {
  if (run('http evidence (auth)', 'node', ['scripts/gate-a-http-evidence-auth.mjs'], mergedEnv) !== 0) {
    failed = true
  }
} else {
  if (run('http evidence (401 only)', 'node', ['scripts/gate-a-http-evidence.mjs'], mergedEnv) !== 0) {
    failed = true
  }
  process.stdout.write(
    '\n[hint] 未設定 GATEA_STAFF_EMAIL / GATEA_STAFF_PASSWORD（含 .env），已略過 403 自動取證。\n',
  )
}

if (run('evidence summary', 'node', ['scripts/gate-a-evidence-summary.mjs']) !== 0) {
  failed = true
}

if (run('fill snippet', 'node', ['scripts/gate-a-generate-fill-snippet.mjs', '--write']) !== 0) {
  failed = true
}

if (run('decision reference', 'node', ['scripts/gate-a-generate-decision-reference.mjs', '--write']) !== 0) {
  failed = true
}

if (run('decision draft sync', 'node', ['scripts/gate-a-sync-decision-draft.mjs']) !== 0) {
  failed = true
}

// 須早於 markdown 自動引用區同步：區塊內會寫入「最新 doctor 報告」檔名
run('evidence doctor', 'node', ['scripts/gate-a-evidence-doctor.mjs', '--write'])

if (run('gate a report snapshot', 'node', ['scripts/gate-a-evidence-report.mjs']) !== 0) {
  failed = true
}

if (run('latest pointer refresh', 'node', ['scripts/gate-a-update-latest-pointer.mjs']) !== 0) {
  failed = true
}

// report 落檔後再同步四份文件，確保自動引用區指向「當次最新 report」
if (run('markdown docs sync bundle', 'node', ['scripts/gate-a-sync-all-markdown.mjs']) !== 0) {
  failed = true
}

process.exitCode = failed ? 1 : 0
