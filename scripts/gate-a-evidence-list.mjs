/**
 * 由 package.json 列出所有 `gatea:evidence:*` 指令（與倉庫實際腳本同源，免文件漂移）。
 * stdout 末段與多數取證／同步腳本同附 **`gateAStandardCloseoutBlockquotes`**（例外見 **`gate-a-markdown-footer.mjs`** 檔首「未匯入本檔之腳本」）。
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'

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
  `- 共 ${keys.length} 條；證據固定入口 docs/evidence/gate-a-latest.md（Next Command 與 preflight:strict 並列；檔尾 blockquote 四行：gateALatestMarkdownFooterLines，見 docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment 下文 latest 段）；人工／strict-http／keep=1：docs/gate-a-manual-evidence-checklist-2026-05-06.md 開首；詳見 README、docs/gate-a-status-2026-05-06.md（§5 指令速查 commands-appendix）、docs/gate-a-evidence-capture-2026-05-06.md。`,
)
lines.push('')
for (const k of keys) {
  lines.push(`- \`${k}\``)
  lines.push(`  - ${scripts[k]}`)
}

lines.push(``)
lines.push(...gateAStandardCloseoutBlockquotes())

process.stdout.write(`${lines.join('\n')}\n`)
