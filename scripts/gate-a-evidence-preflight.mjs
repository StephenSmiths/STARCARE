/**
 * 取證前快速診斷：合併環境鍵是否齊備（不輸出密值）、證據目錄與 READY 相關缺口。
 */
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv, gateAStrictHttpEnabled } from './gate-a-env-lib.mjs'
import { computeGateAReadyState, recommendNextCommand } from './gate-a-ready-core.mjs'

const strict = process.argv.includes('--strict')

const e = buildSpawnBaseEnv()
const pick = (key) => (String(e[key] ?? '').trim() ? 'SET' : 'MISSING')

const evidenceDir = resolve(process.cwd(), 'docs/evidence')
const evidenceDirOk = existsSync(evidenceDir)

const lines = []
lines.push('# Gate A Preflight')
lines.push('')
lines.push('## 環境（僅 SET／MISSING，不列印密值）')
lines.push(`- VITE_SUPABASE_URL：${pick('VITE_SUPABASE_URL')}`)
lines.push(`- VITE_SUPABASE_ANON_KEY：${pick('VITE_SUPABASE_ANON_KEY')}`)
lines.push(`- GATEA_STAFF_EMAIL：${pick('GATEA_STAFF_EMAIL')}`)
lines.push(`- GATEA_STAFF_PASSWORD：${pick('GATEA_STAFF_PASSWORD')}`)
lines.push(`- GATEA_STAFF_ACCESS_TOKEN：${pick('GATEA_STAFF_ACCESS_TOKEN')}`)
lines.push(
  `- HTTP 嚴格取證（401／403 不符即 exit 非 0）：${gateAStrictHttpEnabled(process.argv, e) ? '**ON**' : 'OFF'}（\`--strict-http\` 或 \`GATEA_STRICT_HTTP\`=1／true／yes）`,
)
lines.push('')
lines.push('> 合併規則與取證腳本相同：`{ ...repo .env, ...process.env }`（shell／CI 覆寫檔案）。')
lines.push('')

if (!evidenceDirOk) {
  lines.push('## 證據目錄')
  lines.push('- `docs/evidence`：不存在（請建立目錄後再跑取證）')
  lines.push('')
  lines.push('## 建議')
  lines.push('- 建立 `docs/evidence` 後執行 `npm run gatea:evidence:all` 或依 `docs/gate-a-evidence-capture-2026-05-06.md`')
} else {
  const gate = computeGateAReadyState(evidenceDir)
  const rec = recommendNextCommand(gate)
  const docLine =
    gate.doctorTotal > 0 ? `${gate.doctorDone}/${gate.doctorTotal}` : gate.doctorFile ? gate.doctorDisplay : '無 doctor'

  lines.push('## 證據與判定')
  lines.push('- docs/evidence：存在')
  lines.push(`- auto：${gate.autoOk ? 'OK' : 'MISSING'}`)
  lines.push(`- 401：${gate.ok401 ? 'OK' : 'MISSING'}`)
  lines.push(`- 403：${gate.ok403 ? 'OK' : 'MISSING'}`)
  lines.push(`- doctor：${docLine}`)
  lines.push(`- READY：\`${gate.ready ? 'READY' : 'NOT_READY'}\``)
  lines.push('')
  lines.push('## 建議下一步')
  lines.push(`- \`${rec.command}\`（${rec.reason}）`)
}

lines.push('')
lines.push(
  strict
    ? '- strict：**已啟用**（缺證據目錄或 VITE_* 任一未設 → exit 非 0）'
    : '- strict：未啟用；`npm run gatea:evidence:preflight:strict`（或 `npm run gatea:evidence:preflight -- --strict`）可強制檢查目錄存在與 VITE_* 齊備',
)
lines.push(
  '- HTTP 取證若要「401／403 狀態不符即失敗」：`npm run gatea:evidence:http:strict`、`npm run gatea:evidence:http:auth:strict`、全流程 `npm run gatea:evidence:all:strict-http`；或於環境／`.env` 設 `GATEA_STRICT_HTTP=1`（等同 `--strict-http`）',
)
lines.push(
  '- 全流程後順便 prune 並再同步引用區：`npm run gatea:evidence:refresh`（末尾會再跑 `docs-sync` 與判定稿 `decision-sync`；嚴格 HTTP 可用 `npm run gatea:evidence:refresh:strict-http`）',
)
lines.push('- 指令總表（與 package.json 同源）：`npm run gatea:evidence:list`')

process.stdout.write(`${lines.join('\n')}\n`)

if (strict) {
  const viteOk = pick('VITE_SUPABASE_URL') === 'SET' && pick('VITE_SUPABASE_ANON_KEY') === 'SET'
  if (!evidenceDirOk || !viteOk) {
    process.stderr.write(
      '[gatea preflight:strict] 失敗：需存在 docs/evidence 且 VITE_SUPABASE_URL／VITE_SUPABASE_ANON_KEY 皆為 SET。\n',
    )
    process.exitCode = 1
  }
}
