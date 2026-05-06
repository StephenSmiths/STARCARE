/**
 * 由 package.json 列出所有 `gatea:evidence:*` 指令（與倉庫實際腳本同源，免文件漂移）。
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const pkgPath = resolve(process.cwd(), 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
const scripts = pkg.scripts ?? {}

const keys = Object.keys(scripts)
  .filter((k) => k.startsWith('gatea:evidence:'))
  .sort()

const lines = []
lines.push('# Gate A npm 指令一覽（package.json）')
lines.push('')
lines.push(
  `- 共 ${keys.length} 條；證據固定入口 docs/evidence/gate-a-latest.md（Next Command 與 preflight:strict 並列）；詳見 README、docs/gate-a-status-2026-05-06.md（§5 指令速查 docs/gate-a-status-2026-05-06-commands-appendix.md）、docs/gate-a-evidence-capture-2026-05-06.md。`,
)
lines.push('')
for (const k of keys) {
  lines.push(`- \`${k}\``)
  lines.push(`  - ${scripts[k]}`)
}

process.stdout.write(`${lines.join('\n')}\n`)
