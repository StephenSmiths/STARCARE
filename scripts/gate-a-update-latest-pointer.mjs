/**
 * 產出 `docs/evidence/gate-a-latest.md`；檔尾 blockquote 列由 **`gateALatestMarkdownFooterLines`**（四行）寫入。
 * 本腳本之終端 stdout 僅附 **`gateAStandardCloseoutBlockquotes`** 兩行（與檔內頁尾列數不同；見 **`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段）。
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildSpawnBaseEnv, gateAStrictHttpEnabled } from './gate-a-env-lib.mjs'
import { gateALatestMarkdownFooterLines, gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'
import {
  computeGateAReadyState,
  gateAPreflightStrictNextMarkdownLine,
  recommendNextCommand,
} from './gate-a-ready-core.mjs'

const strictHttpLbl = gateAStrictHttpEnabled(process.argv, buildSpawnBaseEnv()) ? 'ON' : 'OFF'

const evidenceDir = resolve(process.cwd(), 'docs/evidence')
const s = computeGateAReadyState(evidenceDir)
const rec = recommendNextCommand(s)

const fmt = (name) => (name ? `\`docs/evidence/${name}\`` : '`（未找到）`')

const lines = []
lines.push('# Gate A Latest Pointers')
lines.push('')
lines.push(`- 更新時間：${new Date().toISOString()}`)
lines.push(`- 判定狀態：\`${s.ready ? 'READY' : 'NOT_READY'}\``)
lines.push(`- HTTP 嚴格取證：${strictHttpLbl}`)
lines.push(`- auto evidence：${fmt(s.auto)}`)
lines.push(`- 401：${fmt(s.e401)}`)
lines.push(`- 403：${fmt(s.e403)}`)
lines.push(`- doctor：${fmt(s.doctorFile)}`)
lines.push(`- report：${fmt(s.report)}`)
lines.push(`- fill snippet：${fmt(s.fillSnippet)}`)
lines.push(`- decision ref：${fmt(s.decisionRef)}`)
lines.push('')
lines.push('## Next Command')
lines.push(`- \`${rec.command}\`（${rec.reason}）`)
lines.push(gateAPreflightStrictNextMarkdownLine())
lines.push('')
for (const line of gateALatestMarkdownFooterLines()) {
  lines.push(line)
}

const outPath = resolve(evidenceDir, 'gate-a-latest.md')
writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8')
process.stdout.write(
  `[updated] ${outPath}\n` + ['', ...gateAStandardCloseoutBlockquotes()].join('\n') + '\n',
)
