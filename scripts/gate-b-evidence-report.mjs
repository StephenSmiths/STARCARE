import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { computeGateBReadyState } from './gate-b-ready-core.mjs'

const state = computeGateBReadyState()
const evidenceDir = resolve(process.cwd(), 'docs/evidence')
const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-')
const outPath = resolve(evidenceDir, `gate-b-report-${stamp}.md`)

const lines = []
lines.push('# Gate B 自動化收斂報告')
lines.push('')
lines.push(`- 產生時間：${new Date().toISOString()}`)
lines.push('- 流程來源：`npm run gateb:evidence:report`')
lines.push(`- 判定狀態：\`${state.ready ? 'READY' : 'NOT_READY'}\``)
lines.push(`- 完成度：${state.done}/${state.total}`)
lines.push('')
lines.push('## 檢查清單')
for (const check of state.checks) {
  lines.push(`- [${check.ok ? 'x' : ' '}] ${check.label}`)
}
lines.push('')
lines.push('## 建議下一步')
if (state.ready) {
  lines.push('- Gate B 證據已齊備，可執行最終 strict gate 並回寫 kickoff。')
} else {
  lines.push('- 依 `docs/gate-b-manual-evidence-checklist-2026-05-07.md` 補齊缺項。')
  lines.push('- 補齊後執行 `npm run gateb:evidence:doctor -- --write`。')
  lines.push('- 再執行 `npm run gateb:evidence:ready -- --strict`。')
}

const output = `${lines.join('\n')}\n`
writeFileSync(outPath, output, 'utf8')
process.stdout.write(`${output}\n[saved] ${outPath}\n`)

