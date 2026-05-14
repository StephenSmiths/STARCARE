import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'
import { computeGateAReadyState } from './gate-a-ready-core.mjs'

const s = computeGateAReadyState()
const footer = ['', ...gateAStandardCloseoutBlockquotes()].join('\n') + '\n'

if (s.ready) {
  process.stdout.write(`Gate A gate: PASS (READY)\n${footer}`)
  process.exitCode = 0
} else {
  process.stdout.write(
    `Gate A gate: FAIL (NOT_READY)\nTry: npm run gatea:evidence:next；人工／strict-http／keep=1：docs/gate-a-manual-evidence-checklist-2026-05-06.md 開首\n${footer}`,
  )
  process.exitCode = 1
}
