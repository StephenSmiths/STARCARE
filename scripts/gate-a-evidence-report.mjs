import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildSpawnBaseEnv, gateAStrictHttpEnabled } from './gate-a-env-lib.mjs'
import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'
import { computeGateAReadyState } from './gate-a-ready-core.mjs'

const strictHttpLbl = gateAStrictHttpEnabled(process.argv, buildSpawnBaseEnv()) ? 'ON' : 'OFF'

const evidenceDir = resolve(process.cwd(), 'docs/evidence')
const s = computeGateAReadyState(evidenceDir)

const fmt = (name) => (name ? `\`docs/evidence/${name}\`` : '`（未找到）`')

const lines = []
lines.push('# Gate A 自動化收斂報告')
lines.push('')
lines.push(`- 產生時間：${new Date().toISOString()}`)
lines.push('- 流程來源：`npm run gatea:evidence:all`')
lines.push(`- 判定狀態：\`${s.ready ? 'READY' : 'NOT_READY'}\``)
lines.push(`- HTTP 嚴格取證：${strictHttpLbl}（合併環境；\`--strict-http\`／\`GATEA_STRICT_HTTP\`）`)
lines.push('')
lines.push('## 核心證據')
lines.push(`- auto evidence：${fmt(s.auto)}`)
lines.push(`- 401：${fmt(s.e401)}`)
lines.push(`- 403：${fmt(s.e403)}`)
lines.push('')
lines.push('## 自動產物')
lines.push(`- doctor：${fmt(s.doctorFile)}（完成度 ${s.doctorDisplay}）`)
lines.push(`- fill snippet：${fmt(s.fillSnippet)}`)
lines.push(`- decision ref：${fmt(s.decisionRef)}`)
lines.push('')
lines.push('## 文件同步目標')
lines.push('- `docs/gate-a-decision-draft-2026-05-06.md`')
lines.push('- `docs/project-completion-evidence-index-2026-05.md`')
lines.push('- `docs/project-completion-daily-log-2026-05.md`')
lines.push('- `docs/project-completion-2week-tracker-2026-05-05.md`')
lines.push('- `docs/project-completion-kickoff-checklist-2026-05.md`')
lines.push('')
lines.push(...gateAStandardCloseoutBlockquotes())

const output = `${lines.join('\n')}\n`
const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-')
const outPath = resolve(evidenceDir, `gate-a-report-${stamp}.md`)
writeFileSync(outPath, output, 'utf8')
process.stdout.write(`${output}\n[saved] ${outPath}\n`)
