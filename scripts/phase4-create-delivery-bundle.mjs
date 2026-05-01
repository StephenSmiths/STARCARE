import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const today = new Date()
const dateTag = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
  today.getDate(),
).padStart(2, '0')}`

const bundleRoot = 'delivery'
const bundleDir = join(bundleRoot, `phase4-${dateTag}`)
const zipOutput = join(bundleRoot, `phase4-${dateTag}.zip`)
const shouldZip = process.argv.includes('--zip')

const files = [
  'docs/phase4-day5-completion-report.md',
  'docs/phase4-day5-external-summary.md',
  'docs/phase4-final-delivery-package.md',
  'docs/phase4-delivery-message-template.md',
  'docs/phase4-day4-delivery-index.md',
  'docs/phase4-day4-automation-runbook.md',
  'docs/phase4-day4-ui-smoke-checklist.md',
  'docs/phase4-day4-automation-report.md',
]

const ensureDir = (path) => {
  if (!existsSync(path)) mkdirSync(path, { recursive: true })
}

const copyWithParents = (sourcePath, targetRoot) => {
  const parts = sourcePath.split('/')
  const fileName = parts.pop()
  const parent = parts.join('/')
  const targetParent = join(targetRoot, parent)
  ensureDir(targetParent)
  copyFileSync(sourcePath, join(targetParent, fileName))
}

ensureDir(bundleRoot)
if (existsSync(bundleDir)) rmSync(bundleDir, { recursive: true, force: true })
ensureDir(bundleDir)

const copied = []
const missing = []

for (const file of files) {
  if (!existsSync(file)) {
    missing.push(file)
    continue
  }
  copyWithParents(file, bundleDir)
  copied.push(file)
}

const manifestLines = []
manifestLines.push('# Phase 4 Delivery Bundle Manifest')
manifestLines.push('')
manifestLines.push(`- bundle: ${bundleDir}`)
manifestLines.push(`- generatedAt: ${new Date().toISOString()}`)
manifestLines.push('')
manifestLines.push('## copied')
for (const file of copied) manifestLines.push(`- ${file}`)
manifestLines.push('')
manifestLines.push('## missing')
if (missing.length === 0) {
  manifestLines.push('- none')
} else {
  for (const file of missing) manifestLines.push(`- ${file}`)
}

writeFileSync(join(bundleDir, 'MANIFEST.md'), manifestLines.join('\n') + '\n', 'utf-8')

const tree = readdirSync(bundleDir)
console.log(`[phase4-bundle] output: ${bundleDir}`)
console.log(`[phase4-bundle] copied: ${copied.length}, missing: ${missing.length}`)
console.log(`[phase4-bundle] top-level: ${tree.join(', ')}`)

if (shouldZip) {
  if (existsSync(zipOutput)) rmSync(zipOutput, { force: true })
  const zipRun = spawnSync(
    'zip',
    ['-r', `phase4-${dateTag}.zip`, `phase4-${dateTag}`],
    { cwd: bundleRoot, encoding: 'utf-8' },
  )
  const zipOk = zipRun.status === 0
  if (zipOk) {
    console.log(`[phase4-bundle] zip: ${zipOutput}`)
  } else {
    console.error('[phase4-bundle] zip failed')
    if (zipRun.stdout) console.error(zipRun.stdout)
    if (zipRun.stderr) console.error(zipRun.stderr)
    process.exitCode = 1
  }
}

if (missing.length > 0) {
  process.exitCode = 1
}
