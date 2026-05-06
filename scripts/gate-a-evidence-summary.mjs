import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv, gateAStrictHttpEnabled } from './gate-a-env-lib.mjs'
import {
  computeGateAReadyState,
  gateAPreflightStrictNextMarkdownLine,
  recommendNextCommand,
} from './gate-a-ready-core.mjs'

const strictHttpLbl = gateAStrictHttpEnabled(process.argv, buildSpawnBaseEnv()) ? 'ON' : 'OFF'

const evidenceDir = resolve(process.cwd(), 'docs/evidence')
const files = readdirSync(evidenceDir, { withFileTypes: true })
  .filter((d) => d.isFile())
  .map((d) => d.name)

const has = (keyword) => files.some((f) => f.includes(keyword))
const latest = (keyword) =>
  files
    .filter((f) => f.includes(keyword))
    .sort()
    .at(-1) ?? '（未找到）'

const latestName = (keyword) => files.filter((f) => f.includes(keyword)).sort().at(-1)
const rel = (name) => (name ? `docs/evidence/${name}` : '（未找到）')

const checks = [
  { id: '401', ok: has('d2-401-admin-user-role-set'), file: latest('d2-401-admin-user-role-set') },
  { id: '403', ok: has('d2-403-admin-user-role-set'), file: latest('d2-403-admin-user-role-set') },
  { id: 'auto', ok: has('gate-a-auto-evidence'), file: latest('gate-a-auto-evidence') },
]

const done = checks.filter((c) => c.ok).length
const total = checks.length

const gate = computeGateAReadyState(evidenceDir)
const rec = recommendNextCommand(gate)
const doctorLine =
  gate.doctorTotal > 0 ? `${gate.doctorDone}/${gate.doctorTotal}` : gate.doctorFile ? gate.doctorDisplay : '無 doctor'

const lines = []
lines.push(`# Gate A 證據彙總`)
lines.push(``)
lines.push(`- 完成度（自動證據面）：${done} / ${total}`)
lines.push(`- 可否進入 Gate A 判定（含 doctor）：\`${gate.ready ? 'READY' : 'NOT_READY'}\`（doctor：${doctorLine}）`)
lines.push(`- HTTP 嚴格取證：${strictHttpLbl}（\`--strict-http\` 或 \`GATEA_STRICT_HTTP\`）`)
lines.push(``)
for (const c of checks) {
  lines.push(`- [${c.ok ? 'x' : ' '}] ${c.id}：${c.file}`)
}
lines.push(``)
lines.push(`## 其他自動落檔（不計入上分母）`)
lines.push(`- latest pointer：docs/evidence/gate-a-latest.md`)
lines.push(`- doctor 快照：${rel(latestName('gate-a-evidence-doctor-'))}`)
lines.push(`- report：${rel(latestName('gate-a-report-'))}`)
lines.push(`- fill snippet：${rel(latestName('gate-a-fill-snippet-'))}`)
lines.push(`- decision ref：${rel(latestName('gate-a-decision-ref-'))}`)
lines.push(`- next command：\`${rec.command}\`（${rec.reason}）`)
lines.push(`- preflight：${gateAPreflightStrictNextMarkdownLine().replace(/^- /, '')}`)
lines.push(``)
lines.push(`> 人工證據仍需依 docs/gate-a-manual-evidence-checklist-2026-05-06.md 補齊。`)

process.stdout.write(`${lines.join('\n')}\n`)
