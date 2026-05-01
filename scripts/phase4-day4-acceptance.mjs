import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const startedAt = Date.now()

const requiredFiles = [
  'docs/phase3-day5-acceptance.md',
  'docs/phase3-day5-acceptance-result-2026-04-30.md',
  'docs/phase4-day4-ui-smoke-checklist.md',
  'docs/activity-sessions-import-verification.sql',
  'docs/residents-import-verification.sql',
  'docs/staff-import-200-valid.csv',
  'docs/activity-sessions-import-200-valid.csv',
]

const runCmd = (command, args) => {
  const started = Date.now()
  const out = spawnSync(command, args, { encoding: 'utf-8', stdio: 'pipe' })
  const elapsedMs = Date.now() - started
  return {
    command: `${command} ${args.join(' ')}`,
    ok: out.status === 0,
    elapsedMs,
    stdout: out.stdout ?? '',
    stderr: out.stderr ?? '',
  }
}

const fileChecks = requiredFiles.map((file) => ({
  file,
  ok: existsSync(file),
}))

const commandChecks = [
  runCmd('npm', ['run', 'lint']),
  runCmd('npm', ['run', 'test']),
  runCmd('npm', ['run', 'build']),
]

const canVerifySupabase = Boolean(process.env.SUPABASE_ACCESS_TOKEN)
const supabaseChecks = canVerifySupabase
  ? [runCmd('npx', ['supabase', 'migration', 'list']), runCmd('npx', ['supabase', 'functions', 'list'])]
  : []

const allChecks = [...fileChecks.map((f) => ({ ok: f.ok })), ...commandChecks, ...supabaseChecks]
const pass = allChecks.every((item) => item.ok === true)
const endedAt = Date.now()

const lines = []
lines.push('# Phase 4 Day 4 自動驗收報告')
lines.push('')
lines.push(`- 開始時間：${new Date(startedAt).toLocaleString()}`)
lines.push(`- 結束時間：${new Date(endedAt).toLocaleString()}`)
lines.push(`- 總耗時：${((endedAt - startedAt) / 1000).toFixed(2)} 秒`)
lines.push(`- 結果：${pass ? 'PASS' : 'FAIL'}`)
lines.push('')
lines.push('## 一、文件存在檢查')
for (const item of fileChecks) {
  lines.push(`- [${item.ok ? 'x' : ' '}] \`${item.file}\``)
}
lines.push('')
lines.push('## 二、本機品質閘門')
for (const item of commandChecks) {
  lines.push(`- [${item.ok ? 'x' : ' '}] \`${item.command}\`（${item.elapsedMs} ms）`)
}
lines.push('')
lines.push('## 三、Supabase 狀態（可選）')
if (!canVerifySupabase) {
  lines.push('- 已略過（未提供 `SUPABASE_ACCESS_TOKEN`）')
} else {
  for (const item of supabaseChecks) {
    lines.push(`- [${item.ok ? 'x' : ' '}] \`${item.command}\`（${item.elapsedMs} ms）`)
  }
}
lines.push('')
lines.push('## 四、手動 UI 檢核（人工）')
lines.push('- 參考：`docs/phase4-day4-ui-smoke-checklist.md`')
lines.push('- 此項不納入自動 PASS/FAIL，需由驗收人手動勾選。')
lines.push('')
lines.push('## 五、失敗摘要')
const failed = [...commandChecks, ...supabaseChecks].filter((item) => !item.ok)
if (failed.length === 0) {
  lines.push('- 無失敗項目')
} else {
  for (const item of failed) {
    lines.push(`### ${item.command}`)
    lines.push('```text')
    lines.push((item.stdout + '\n' + item.stderr).trim() || '(no output)')
    lines.push('```')
  }
}

if (!existsSync('docs')) mkdirSync('docs', { recursive: true })
const reportPath = 'docs/phase4-day4-automation-report.md'
writeFileSync(reportPath, lines.join('\n') + '\n', 'utf-8')

console.log(`[phase4-day4] report written: ${reportPath}`)
console.log(`[phase4-day4] result: ${pass ? 'PASS' : 'FAIL'}`)
process.exit(pass ? 0 : 1)
