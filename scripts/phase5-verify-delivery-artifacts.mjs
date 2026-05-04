import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const bundleRoot = 'delivery'
const bundlePrefix = 'phase5-day1-'
const reportPath = 'docs/phase5-day1-delivery-verification-report.md'

const pickLatest = (target) => {
  if (!existsSync(bundleRoot)) return ''
  const entries = readdirSync(bundleRoot).filter((name) => {
    if (!name.startsWith(bundlePrefix)) return false
    const fullPath = join(bundleRoot, name)
    const stats = statSync(fullPath)
    if (target === 'directory') return stats.isDirectory()
    if (target === 'zip') return stats.isFile() && name.endsWith('.zip')
    return false
  })
  if (entries.length === 0) return ''
  const sorted = entries.sort(
    (a, b) => statSync(join(bundleRoot, b)).mtimeMs - statSync(join(bundleRoot, a)).mtimeMs,
  )
  return join(bundleRoot, sorted[0])
}

const bundleDir = pickLatest('directory')
const zipPath = pickLatest('zip')
const manifestPath = bundleDir ? join(bundleDir, 'MANIFEST.md') : ''

const checks = [
  { name: 'bundle directory exists', ok: Boolean(bundleDir) && existsSync(bundleDir), detail: bundleDir || 'n/a' },
  { name: 'zip exists', ok: Boolean(zipPath) && existsSync(zipPath), detail: zipPath || 'n/a' },
  { name: 'manifest exists', ok: Boolean(manifestPath) && existsSync(manifestPath), detail: manifestPath || 'n/a' },
]

let manifestText = ''
if (existsSync(manifestPath)) {
  manifestText = readFileSync(manifestPath, 'utf-8')
}

checks.push({
  name: 'manifest missing section is none',
  ok: manifestText.includes('## missing') && manifestText.includes('- none'),
  detail: 'MANIFEST.md',
})

const pass = checks.every((item) => item.ok)
const now = new Date().toISOString()

const lines = []
lines.push('# Phase 5 Day 1 交付物驗證報告')
lines.push('')
lines.push(
  '> **對照**：**`docs/business-logic.md`** §0；**`docs/phase5-day1-delivery-index.md`**；關聯自動驗收 **`docs/phase5-day1-automation-report.md`**（**`npm run acceptance:phase5`**）。',
)
lines.push('')
lines.push(`- 時間：${now}`)
lines.push(`- 結果：${pass ? 'PASS' : 'FAIL'}`)
lines.push('')
lines.push('## 檢查項目')
for (const item of checks) {
  lines.push(`- [${item.ok ? 'x' : ' '}] ${item.name}（\`${item.detail}\`）`)
}
lines.push('')
lines.push('## 建議')
if (pass) {
  lines.push('- 可直接使用 ZIP 進行交付。')
} else {
  lines.push('- 先執行 `npm run closeout:phase5:fresh` 重新產出，再重跑驗證。')
}

writeFileSync(reportPath, lines.join('\n') + '\n', 'utf-8')

console.log(`[phase5-verify] report: ${reportPath}`)
console.log(`[phase5-verify] result: ${pass ? 'PASS' : 'FAIL'}`)
process.exit(pass ? 0 : 1)
