import { readdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const evidenceDir = resolve(process.cwd(), 'docs/evidence')
const args = process.argv.slice(2)
const apply = args.includes('--apply')
const keepArg = args.find((a) => a.startsWith('--keep='))
const keep = keepArg ? Number(keepArg.slice('--keep='.length)) : 2

if (!Number.isInteger(keep) || keep < 1) {
  throw new Error('`--keep` 必須為正整數，例如：--keep=2')
}

const files = readdirSync(evidenceDir, { withFileTypes: true })
  .filter((d) => d.isFile())
  .map((d) => d.name)
  .sort()

const buckets = [
  { key: 'auto', needle: 'gate-a-auto-evidence-' },
  { key: '401', needle: 'gate-a-d2-401-admin-user-role-set-' },
  { key: '403', needle: 'gate-a-d2-403-admin-user-role-set-' },
  { key: 'doctor', needle: 'gate-a-evidence-doctor-' },
  { key: 'report', needle: 'gate-a-report-' },
  { key: 'fill', needle: 'gate-a-fill-snippet-' },
  { key: 'decision_ref', needle: 'gate-a-decision-ref-' },
]

const keepSet = new Set(['gate-a-latest.md'])
const deleteList = []

for (const b of buckets) {
  const matches = files.filter((f) => f.includes(b.needle)).sort()
  const kept = matches.slice(-keep)
  for (const k of kept) keepSet.add(k)
  const stale = matches.slice(0, Math.max(0, matches.length - keep))
  for (const s of stale) deleteList.push({ bucket: b.key, file: s })
}

const lines = []
lines.push('# Gate A Evidence Prune')
lines.push('')
lines.push(`- mode: ${apply ? 'apply' : 'dry-run'}`)
lines.push(`- keep per bucket: ${keep}`)
lines.push(`- candidate delete count: ${deleteList.length}`)
lines.push('')

for (const b of buckets) {
  const count = files.filter((f) => f.includes(b.needle)).length
  lines.push(`- ${b.key}: ${count} files`)
}

if (deleteList.length > 0) {
  lines.push('')
  lines.push('## stale files')
  for (const item of deleteList) {
    lines.push(`- [${item.bucket}] docs/evidence/${item.file}`)
  }
}

if (apply && deleteList.length > 0) {
  for (const item of deleteList) {
    if (keepSet.has(item.file)) continue
    rmSync(resolve(evidenceDir, item.file), { force: true })
  }
  lines.push('')
  lines.push(`deleted: ${deleteList.length}`)
} else if (!apply) {
  lines.push('')
  lines.push('> 這是 dry-run；加 `--apply` 才會實際刪除。')
}

process.stdout.write(`${lines.join('\n')}\n`)
