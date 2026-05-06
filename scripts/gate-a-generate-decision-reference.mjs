import { readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv, gateAStrictHttpEnabled } from './gate-a-env-lib.mjs'

const dir = resolve(process.cwd(), 'docs/evidence')
const strictLbl = gateAStrictHttpEnabled(process.argv, buildSpawnBaseEnv()) ? 'ON' : 'OFF'
const files = readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isFile())
  .map((d) => d.name)

const latest = (needle) =>
  files
    .filter((f) => f.includes(needle))
    .sort()
    .at(-1)

const fill = latest('gate-a-fill-snippet-')
const auto = latest('gate-a-auto-evidence')
const e401 = latest('d2-401-admin-user-role-set')
const e403 = latest('d2-403-admin-user-role-set')

const lines = []
lines.push('## Gate A 判定稿引用片段（自動產生）')
lines.push('')
lines.push(`- HTTP 嚴格取證（產生當下合併環境）：${strictLbl}`)
lines.push('- 建議貼到：`docs/gate-a-decision-draft-2026-05-06.md` 的「依據（已完成）」之後')
lines.push(`- fill snippet：${fill ? `\`docs/evidence/${fill}\`` : '`<待先執行 gatea:evidence:all 產生 fill snippet>`'}`)
lines.push(`- auto 證據：${auto ? `\`docs/evidence/${auto}\`` : '`<待補 auto 證據>`'}`)
lines.push(`- 401 證據：${e401 ? `\`docs/evidence/${e401}\`` : '`<待補 401 證據>`'}`)
lines.push(`- 403 證據：${e403 ? `\`docs/evidence/${e403}\`` : '`<待補 403 證據>`'}`)
lines.push('')
lines.push('> 若 403 顯示待補，請先執行 `npm run gatea:evidence:http:auth` 或帶 token 執行 `npm run gatea:evidence:http`。')

const output = `${lines.join('\n')}\n`
const shouldWrite = process.argv.includes('--write')

if (shouldWrite) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-')
  const path = resolve(dir, `gate-a-decision-ref-${stamp}.md`)
  writeFileSync(path, output, 'utf8')
  process.stdout.write(`${output}\n[saved] ${path}\n`)
} else {
  process.stdout.write(output)
}
