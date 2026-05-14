/**
 * Gate A 全流程 orchestrator。內嵌 **`gate-a-sync-all-markdown.mjs`** 時傳 **`--suppress-closeout-footer`**，避免緊接 **`gate-a-evidence-summary`** 之兩行 blockquote 重複；**`--strict-http`**（或 **`GATEA_STRICT_HTTP`**）時併傳子程序，使 preflight／產物／**`gate-a-latest.md`**／引用區之 **HTTP 嚴格取證** 敘述一致。其餘子程序 stdout 頁尾見各腳本／**`gate-a-markdown-footer.mjs`** 註解。
 */
import { spawnSync } from 'node:child_process'

import { buildSpawnBaseEnv, gateAStrictHttpEnabled } from './gate-a-env-lib.mjs'

const baseEnv = buildSpawnBaseEnv()
const strictHttp = gateAStrictHttpEnabled(process.argv, baseEnv)
const strictForward = strictHttp ? ['--strict-http'] : []

const skipPreflight = process.argv.includes('--no-preflight')
if (!skipPreflight) {
  process.stdout.write('\n== gatea preflight (strict) ==\n')
  const pre = spawnSync('node', ['scripts/gate-a-evidence-preflight.mjs', '--strict', ...strictForward], {
    stdio: 'inherit',
    env: baseEnv,
  })
  if ((pre.status ?? 1) !== 0) {
    process.stderr.write(
      '\n[abort] `gatea:evidence:preflight:strict` 未通過，已中止全流程（略過：`npm run gatea:evidence:all -- --no-preflight`）。\n',
    )
    process.exit(1)
  }
}

const run = (label, cmd, args, extraEnv = {}) => {
  process.stdout.write(`\n== ${label} ==\n`)
  const out = spawnSync(cmd, args, {
    stdio: 'inherit',
    env: { ...baseEnv, ...extraEnv },
  })
  return out.status ?? 1
}

let failed = false
const httpEvidenceArgs = strictForward

const mergedEnv = {
  GATEA_STAFF_EMAIL: baseEnv.GATEA_STAFF_EMAIL || '',
  GATEA_STAFF_PASSWORD: baseEnv.GATEA_STAFF_PASSWORD || '',
  GATEA_STAFF_ACCESS_TOKEN: baseEnv.GATEA_STAFF_ACCESS_TOKEN || '',
}

if (run('auto evidence', 'node', ['scripts/gate-a-auto-evidence.mjs']) !== 0) {
  failed = true
}

const hasStaffCreds = Boolean(mergedEnv.GATEA_STAFF_EMAIL && mergedEnv.GATEA_STAFF_PASSWORD)
if (hasStaffCreds) {
  if (
    run('http evidence (auth)', 'node', ['scripts/gate-a-http-evidence-auth.mjs', ...httpEvidenceArgs], mergedEnv) !== 0
  ) {
    failed = true
  }
} else {
  if (
    run('http evidence（401／有 token 則另有 403）', 'node', ['scripts/gate-a-http-evidence.mjs', ...httpEvidenceArgs], mergedEnv) !== 0
  ) {
    failed = true
  }
  if (!mergedEnv.GATEA_STAFF_ACCESS_TOKEN) {
    process.stdout.write(
      '\n[hint] 未取得 staff JWT：請在 `.env` 設定 GATEA_STAFF_EMAIL／PASSWORD（將自動換取 token），或直接設定 GATEA_STAFF_ACCESS_TOKEN；否則僅會產生 401 文字證據。\n',
    )
  }
}

if (run('fill snippet', 'node', ['scripts/gate-a-generate-fill-snippet.mjs', '--write', ...strictForward]) !== 0) {
  failed = true
}

if (run('decision reference', 'node', ['scripts/gate-a-generate-decision-reference.mjs', '--write', ...strictForward]) !== 0) {
  failed = true
}

if (run('decision draft sync', 'node', ['scripts/gate-a-sync-decision-draft.mjs', ...strictForward]) !== 0) {
  failed = true
}

// 須早於 markdown 自動引用區同步：區塊內會寫入「最新 doctor 報告」檔名
run('evidence doctor', 'node', ['scripts/gate-a-evidence-doctor.mjs', '--write', ...strictForward])

if (run('gate a report snapshot', 'node', ['scripts/gate-a-evidence-report.mjs', ...strictForward]) !== 0) {
  failed = true
}

// 置於 doctor／report 落檔之後，彙總與 READY 解析才與當輪產物一致
if (run('evidence summary', 'node', ['scripts/gate-a-evidence-summary.mjs', ...strictForward]) !== 0) {
  failed = true
}

if (run('latest pointer refresh', 'node', ['scripts/gate-a-update-latest-pointer.mjs', ...strictForward]) !== 0) {
  failed = true
}

// report 落檔後再同步四份文件，確保自動引用區指向「當次最新 report」
if (
  run('markdown docs sync bundle', 'node', [
    'scripts/gate-a-sync-all-markdown.mjs',
    '--suppress-closeout-footer',
    ...strictForward,
  ]) !== 0
) {
  failed = true
}

process.exitCode = failed ? 1 : 0
