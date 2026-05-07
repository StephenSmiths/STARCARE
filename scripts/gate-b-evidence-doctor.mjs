import { resolve } from 'node:path'
import { writeFileSync } from 'node:fs'

import { computeGateBReadyState } from './gate-b-ready-core.mjs'

const state = computeGateBReadyState()
const lines = []

lines.push('# Gate B Evidence Doctor')
lines.push('')
lines.push(`- 完成度：${state.done} / ${state.total}`)
lines.push(`- 缺口數：${state.missing.length}`)
lines.push('')
lines.push('## 檢查結果')
for (const check of state.checks) {
  lines.push(`- [${check.ok ? 'x' : ' '}] ${check.label}`)
}

if (!state.ready) {
  lines.push('')
  lines.push('## 建議下一步')
  lines.push('- 依 `docs/gate-b-manual-evidence-checklist-2026-05-07.md` 補齊人工證據。')
  lines.push('- 補齊後執行：`npm run gateb:evidence:doctor -- --write`。')
  lines.push('- 最後執行：`npm run gateb:evidence:ready -- --strict`。')
}

const output = `${lines.join('\n')}\n`
const shouldWrite = process.argv.includes('--write')

if (shouldWrite) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-')
  const outPath = resolve(process.cwd(), 'docs/evidence', `gate-b-evidence-doctor-${stamp}.md`)
  writeFileSync(outPath, output, 'utf8')
  process.stdout.write(`${output}\n[saved] ${outPath}\n`)
} else {
  process.stdout.write(output)
}

