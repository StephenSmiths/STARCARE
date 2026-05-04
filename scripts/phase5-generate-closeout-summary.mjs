import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const acceptancePath = 'docs/phase5-day1-automation-report.md'
const verifyPath = 'docs/phase5-day1-delivery-verification-report.md'
const outputPath = 'docs/phase5-day1-closeout-summary.md'
const bundleRoot = 'delivery'
const bundlePrefix = 'phase5-day1-'

const readResult = (path) => {
  if (!existsSync(path)) return 'MISSING'
  const text = readFileSync(path, 'utf-8')
  const match = text.match(/結果：([A-Z]+)/)
  return match?.[1] ?? 'UNKNOWN'
}

const pickLatestZip = () => {
  if (!existsSync(bundleRoot)) return ''
  const entries = readdirSync(bundleRoot).filter((name) => {
    if (!name.startsWith(bundlePrefix) || !name.endsWith('.zip')) return false
    return statSync(join(bundleRoot, name)).isFile()
  })
  if (entries.length === 0) return ''
  const latest = entries.sort(
    (a, b) => statSync(join(bundleRoot, b)).mtimeMs - statSync(join(bundleRoot, a)).mtimeMs,
  )[0]
  return join(bundleRoot, latest)
}

const acceptanceResult = readResult(acceptancePath)
const verifyResult = readResult(verifyPath)
const latestZip = pickLatestZip()
const pass = acceptanceResult === 'PASS' && verifyResult === 'PASS' && Boolean(latestZip)

const lines = []
lines.push('# Phase 5 Day 1 收口摘要')
lines.push('')
lines.push(
  '> **對照**：**`docs/business-logic.md`** §0；**`docs/phase5-day1-delivery-index.md`**；本檔由 **`npm run closeout:phase5:summary`**（或等價收口鏈）依驗收／交付驗證報告彙整；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**。',
)
lines.push('')
lines.push(`- 產生時間：${new Date().toISOString()}`)
lines.push(`- 收口結果：${pass ? 'PASS' : 'FAIL'}`)
lines.push('')
lines.push('## 核心檢查')
lines.push(`- 自動驗收：${acceptanceResult}（\`${acceptancePath}\`）`)
lines.push(`- 交付驗證：${verifyResult}（\`${verifyPath}\`）`)
lines.push(`- 最新 ZIP：${latestZip ? `\`${latestZip}\`` : 'MISSING'}`)
lines.push('')
lines.push('## 建議動作')
if (pass) {
  lines.push('- 可直接以最新 ZIP 進行 Phase 5 Day 1 對外交付。')
} else {
  lines.push('- 建議執行 `npm run closeout:phase5:fresh` 後再重新產出本摘要。')
}

writeFileSync(outputPath, lines.join('\n') + '\n', 'utf-8')
console.log(`[phase5-closeout-summary] output: ${outputPath}`)
console.log(`[phase5-closeout-summary] result: ${pass ? 'PASS' : 'FAIL'}`)
