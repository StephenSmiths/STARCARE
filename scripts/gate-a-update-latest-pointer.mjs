import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildSpawnBaseEnv, gateAStrictHttpEnabled } from './gate-a-env-lib.mjs'
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
// 與 go-live／README／其他 gate-a-*.md 頁尾互鏈一致；勿刪以免 npm run gatea:evidence:latest 覆寫後文件鏈斷
lines.push('> 此檔為固定入口，便於在文件／群組貼單一連結。')
lines.push(
  '> **全案收尾與證據留痕**：見 **`docs/go-live-checklist.md`** 開首 **全案收尾與證據留痕**（**`README.md`**「專案收尾」、**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））。'
)
lines.push(
  '> **收證指令／旗標細部**：**`docs/gate-a-status-2026-05-06.md`** **§5**、**`docs/gate-a-status-2026-05-06-commands-appendix.md`**。'
)

const outPath = resolve(evidenceDir, 'gate-a-latest.md')
writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8')
process.stdout.write(`[updated] ${outPath}\n`)
