import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'

const run = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

const now = new Date()
const pad = (n) => String(n).padStart(2, '0')
const ymd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
const hms = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
const ts = now.toISOString()

const repoRoot = resolve(process.cwd())
const outDir = resolve(repoRoot, 'docs/evidence')
mkdirSync(outDir, { recursive: true })

const commit = run('git rev-parse --short HEAD')
const branch = run('git rev-parse --abbrev-ref HEAD')
const migrationList = run('npx supabase migration list')
const functionsList = run('npx supabase functions list')

const body = `# Gate A 自動證據（${ymd} ${hms}）

- 產生時間（UTC ISO）：\`${ts}\`
- branch：\`${branch}\`
- commit：\`${commit}\`

## ops:verify / migration list

\`\`\`
${migrationList}
\`\`\`

## ops:verify / functions list

\`\`\`
${functionsList}
\`\`\`

> 本檔由 \`scripts/gate-a-auto-evidence.mjs\` 產生；搭配 \`docs/gate-a-evidence-capture-2026-05-06.md\` 手動補齊截圖證據。

${gateAStandardCloseoutBlockquotes().join('\n')}
`

const outPath = resolve(outDir, `gate-a-auto-evidence-${ymd}-${hms}.md`)
writeFileSync(outPath, body, 'utf8')
process.stdout.write(`${outPath}\n`)
