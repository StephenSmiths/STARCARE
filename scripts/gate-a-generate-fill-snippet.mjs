/**
 * 由 **`docs/evidence`** 既有檔案產出 **fill snippet** Markdown；檔末附 **`gateAStandardCloseoutBlockquotes`**（**`scripts/gate-a-markdown-footer.mjs`** **Export 契約**）。
 */
import { readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'
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

const auto = latest('gate-a-auto-evidence')
const e401 = latest('d2-401-admin-user-role-set')
const e403 = latest('d2-403-admin-user-role-set')

const lines = []
lines.push('## Gate A 回填片段（自動產生）')
lines.push('')
lines.push(`- HTTP 嚴格取證（產生當下合併環境）：${strictLbl}`)
lines.push('- D2（§1）：')
lines.push(`  - auto 證據：${auto ? `\`docs/evidence/${auto}\`` : '`<待補 auto 證據>`'}`)
lines.push(`  - 401 證據：${e401 ? `\`docs/evidence/${e401}\`` : '`<待補 401 證據>`'}`)
lines.push(`  - 403 證據：${e403 ? `\`docs/evidence/${e403}\`` : '`<待補 403 證據>`'}`)
lines.push('- D3（§3）：')
lines.push('  - `<gateA-d3-scheduling-save-success-2026-05-06.png>`')
lines.push('  - `<gateA-d3-scheduling-history-sql-2026-05-06.png>`')
lines.push('  - `batch_id=<...> / actor_id=<...>`')
lines.push('- D4（§8）：')
lines.push('  - `<gateA-d4-user-rbac-role-set-ui-2026-05-06.png>`')
lines.push('  - `<gateA-d4-audit-events-sql-2026-05-06.png>`')
lines.push('  - `<gateA-d4-rls-staff-2026-05-06.png>`')
lines.push('  - `<gateA-d4-rls-teamlead-2026-05-06.png>`')
lines.push('  - `<gateA-d4-rls-admin-2026-05-06.png>`')
lines.push('')
lines.push('> 其餘人工證據請依 docs/gate-a-manual-evidence-checklist-2026-05-06.md 補齊。')
lines.push('')
lines.push(...gateAStandardCloseoutBlockquotes())

const output = `${lines.join('\n')}\n`
const shouldWrite = process.argv.includes('--write')

if (shouldWrite) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-')
  const path = resolve(dir, `gate-a-fill-snippet-${stamp}.md`)
  writeFileSync(path, output, 'utf8')
  process.stdout.write(`${output}\n[saved] ${path}\n`)
} else {
  process.stdout.write(output)
}
