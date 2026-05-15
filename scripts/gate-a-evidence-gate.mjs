/**
 * Gate A 關卡（**PASS**／**FAIL**）stdout；末段附 **`gateAStandardCloseoutBlockquotes`** 兩行 blockquote（**第一行** stdout 歸檔、**第二行** 人工／strict-http／keep=1；**`scripts/gate-a-markdown-footer.mjs`** **Export 契約**）。與 **`npm run gatea:evidence:ready`**、**`docs/gate-a-status-2026-05-06-commands-appendix.md`** **`gatea:evidence:gate`** 小節併讀。
 */
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
