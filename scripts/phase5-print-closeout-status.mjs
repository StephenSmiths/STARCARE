import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const acceptancePath = 'docs/phase5-day1-automation-report.md'
const verifyPath = 'docs/phase5-day1-delivery-verification-report.md'
const summaryPath = 'docs/phase5-day1-closeout-summary.md'
const outputPath = 'docs/phase5-day1-closeout-status.md'
const bundleRoot = 'delivery'
const bundlePrefix = 'phase5-day1-'

const readResult = (path) => {
  if (!existsSync(path)) return 'MISSING'
  const text = readFileSync(path, 'utf-8')
  const match = text.match(/結果：([A-Z]+)/)
  return match?.[1] ?? 'UNKNOWN'
}

const pickLatest = (target) => {
  if (!existsSync(bundleRoot)) return ''
  const entries = readdirSync(bundleRoot).filter((name) => {
    if (!name.startsWith(bundlePrefix)) return false
    const fullPath = join(bundleRoot, name)
    const stats = statSync(fullPath)
    if (target === 'zip') return stats.isFile() && name.endsWith('.zip')
    if (target === 'bundle') return stats.isDirectory()
    return false
  })
  if (entries.length === 0) return ''
  const latest = entries.sort(
    (a, b) => statSync(join(bundleRoot, b)).mtimeMs - statSync(join(bundleRoot, a)).mtimeMs,
  )[0]
  return join(bundleRoot, latest)
}

const acceptanceResult = readResult(acceptancePath)
const verifyResult = readResult(verifyPath)
const summaryResult = readResult(summaryPath)
const latestZip = pickLatest('zip')
const latestBundle = pickLatest('bundle')

const allPass =
  acceptanceResult === 'PASS' &&
  verifyResult === 'PASS' &&
  summaryResult === 'PASS' &&
  Boolean(latestZip) &&
  Boolean(latestBundle)

const lines = []
lines.push('# Phase 5 Day 1 收口狀態快照')
lines.push('')
lines.push(`- 更新時間：${new Date().toISOString()}`)
lines.push(`- 狀態：${allPass ? 'READY_TO_SEND' : 'NOT_READY'}`)
lines.push('')
lines.push('## 結果總覽')
lines.push(`- 自動驗收：${acceptanceResult}（\`${acceptancePath}\`）`)
lines.push(`- 交付驗證：${verifyResult}（\`${verifyPath}\`）`)
lines.push(`- 收口摘要：${summaryResult}（\`${summaryPath}\`）`)
lines.push(`- 最新交付目錄：${latestBundle ? `\`${latestBundle}\`` : 'MISSING'}`)
lines.push(`- 最新 ZIP：${latestZip ? `\`${latestZip}\`` : 'MISSING'}`)
lines.push('')
lines.push('## 建議')
if (allPass) {
  lines.push('- 可直接使用最新 ZIP 進行發送。')
} else {
  lines.push('- 建議執行 `npm run closeout:phase5:fresh`，完成後再查看本快照。')
}

writeFileSync(outputPath, lines.join('\n') + '\n', 'utf-8')
console.log(`[phase5-status] output: ${outputPath}`)
console.log(`[phase5-status] state: ${allPass ? 'READY_TO_SEND' : 'NOT_READY'}`)
