import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const parseArgs = (argv) => {
  const options = {
    historyDir: 'docs/perf-baselines/history',
    out: '',
    limit: 20,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--out') {
      options.out = argv[i + 1] ?? ''
      i += 1
      continue
    }
    if (arg === '--limit') {
      const raw = Number(argv[i + 1] ?? '')
      options.limit = Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : options.limit
      i += 1
      continue
    }
  }
  return options
}

const formatKb = (bytes) => `${(bytes / 1024).toFixed(2)} kB`
const deltaKb = (current, prev) => {
  if (prev === undefined) return '—'
  const delta = (current - prev) / 1024
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toFixed(2)} kB`
}

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

const pickBytes = (report, key) =>
  report.keyChunks.find((item) => item.key === key || item.fileName.includes(key))?.bytes ?? 0

const main = async () => {
  const options = parseArgs(process.argv.slice(2))
  const historyAbsDir = join(process.cwd(), options.historyDir)
  const files = (await readdir(historyAbsDir))
    .filter((name) => name.endsWith('.json'))
    .sort()
    .slice(-options.limit)

  if (files.length === 0) {
    throw new Error(`No history json found in ${options.historyDir}`)
  }

  const rows = []
  for (const file of files) {
    const report = await readJson(join(historyAbsDir, file))
    rows.push({
      snapshot: file.replace('bundle-report-', '').replace('.json', ''),
      indexBytes: pickBytes(report, 'index'),
      totalBytes: report.totalBytes ?? 0,
      vendorReactBytes: pickBytes(report, 'vendor-react'),
      vendorSupabaseBytes: pickBytes(report, 'vendor-supabase'),
    })
  }

  const mdRows = rows.map((row, idx) => {
    const prev = idx > 0 ? rows[idx - 1] : undefined
    return `| ${row.snapshot} | ${formatKb(row.indexBytes)} | ${deltaKb(row.indexBytes, prev?.indexBytes)} | ${formatKb(row.totalBytes)} | ${deltaKb(row.totalBytes, prev?.totalBytes)} | ${formatKb(row.vendorReactBytes)} | ${formatKb(row.vendorSupabaseBytes)} |`
  })

  const output = [
    '# Bundle History Trend',
    '',
    `來源：\`${options.historyDir}\`（最近 ${rows.length} 筆）`,
    '',
    '| Snapshot (UTC) | index | index Δ | total-js | total-js Δ | vendor-react | vendor-supabase |',
    '|---|---:|---:|---:|---:|---:|---:|',
    ...mdRows,
    '',
  ].join('\n')

  if (options.out) {
    const outPath = join(process.cwd(), options.out)
    await writeFile(outPath, output, 'utf8')
    console.log(`Wrote markdown: ${outPath}`)
    return
  }

  console.log(output)
}

await main()
