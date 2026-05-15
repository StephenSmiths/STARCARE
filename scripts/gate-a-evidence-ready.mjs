/**
 * Gate A **READY** 快速檢查 stdout；末段附 **`gateAStandardCloseoutBlockquotes`** 兩行 blockquote（**第一行**併主日誌 **Gate A／stdout** 細列歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**；**第二行**併 **人工／strict-http／keep=1**；**`scripts/gate-a-markdown-footer.mjs`** **Export 契約**）。規則實作見 **`scripts/gate-a-ready-core.mjs`**（與 **`docs/gate-a-status-2026-05-06-commands-appendix.md`** **`gatea:evidence:ready`**／**`gatea:evidence:next`** 段併讀）。
 */
import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'
import { computeGateAReadyState } from './gate-a-ready-core.mjs'

const s = computeGateAReadyState()
const strict = process.argv.includes('--strict')

process.stdout.write('# Gate A Ready Check\n\n')
process.stdout.write(`- auto evidence: ${s.autoOk ? 'OK' : 'MISSING'}\n`)
process.stdout.write(`- 401 evidence: ${s.ok401 ? 'OK' : 'MISSING'}\n`)
process.stdout.write(`- 403 evidence: ${s.ok403 ? 'OK' : 'MISSING'}\n`)
const doctorLine =
  s.doctorTotal > 0 ? `${s.doctorDone}/${s.doctorTotal}` : s.doctorFile ? s.doctorDisplay : 'MISSING doctor report'
process.stdout.write(`- doctor completeness: ${doctorLine}\n`)
process.stdout.write(`\nRESULT: ${s.ready ? 'READY' : 'NOT_READY'}\n`)

if (!s.ready) {
  process.stdout.write(
    '提示：可執行 `npm run gatea:evidence:all`；人工截圖與 HTTP 嚴格取證／`--keep=1` 見 docs/gate-a-manual-evidence-checklist-2026-05-06.md 開首。\n',
  )
}

process.stdout.write(['', ...gateAStandardCloseoutBlockquotes()].join('\n') + '\n')

if (strict && !s.ready) {
  process.exitCode = 1
}
