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
