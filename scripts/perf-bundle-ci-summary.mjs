import { readFile, writeFile } from 'node:fs/promises'

const toKB = (bytes) => `${(Number(bytes) / 1024).toFixed(2)} kB`

const readJsonSafe = async (path) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return undefined
  }
}
const readTextSafe = async (path) => {
  try {
    return await readFile(path, 'utf8')
  } catch {
    return ''
  }
}

const pickChunk = (rows, prefix) => rows.find((row) => row.fileName?.startsWith(prefix))
const parseDiffRows = (markdown) => {
  const lines = markdown.split('\n').filter((line) => line.startsWith('| `'))
  const rows = []
  for (const line of lines) {
    const cols = line.split('|').map((item) => item.trim())
    const chunk = cols[1]?.replaceAll('`', '') ?? ''
    const deltaText = cols[4] ?? ''
    const match = deltaText.match(/^([+-]?)(\d+(?:\.\d+)?)\s*kB$/)
    if (!chunk || !match) continue
    const sign = match[1] === '-' ? -1 : 1
    const value = Number(match[2])
    if (!Number.isFinite(value)) continue
    rows.push({ chunk, deltaKB: sign * value, deltaText })
  }
  return rows
}

const main = async () => {
  const [reportPath, deltaPath, diffPath, outPath] = process.argv.slice(2)
  if (!reportPath || !deltaPath || !diffPath || !outPath) {
    console.log(
      'Usage: node scripts/perf-bundle-ci-summary.mjs <bundle-report.json> <bundle-delta.json> <bundle-diff.md> <out.md>',
    )
    process.exitCode = 1
    return
  }

  const report = await readJsonSafe(reportPath)
  const delta = await readJsonSafe(deltaPath)
  const diffMarkdown = await readTextSafe(diffPath)

  const keyChunks = report?.keyChunks ?? []
  const indexChunk = pickChunk(keyChunks, 'index-')
  const reactChunk = pickChunk(keyChunks, 'vendor-react-')
  const supabaseChunk = pickChunk(keyChunks, 'vendor-supabase-')

  const topRegressions = parseDiffRows(diffMarkdown)
    .filter((row) => row.chunk !== 'total-js' && row.deltaKB > 0)
    .sort((a, b) => b.deltaKB - a.deltaKB)
    .slice(0, 3)
  const topImprovements = parseDiffRows(diffMarkdown)
    .filter((row) => row.chunk !== 'total-js' && row.deltaKB < 0)
    .sort((a, b) => a.deltaKB - b.deltaKB)
    .slice(0, 3)

  const summary = [
    '## Bundle Governance Summary',
    '',
    `- Status: **${String(delta?.status ?? 'unknown').toUpperCase()}**`,
    `- index: ${toKB(indexChunk?.bytes ?? 0)}`,
    `- total-js: ${toKB(report?.totalBytes ?? 0)}`,
    `- vendor-react: ${toKB(reactChunk?.bytes ?? 0)}`,
    `- vendor-supabase: ${toKB(supabaseChunk?.bytes ?? 0)}`,
    `- index delta: ${toKB(delta?.metrics?.indexDeltaBytes ?? 0)}`,
    `- total-js delta: ${toKB(delta?.metrics?.totalDeltaBytes ?? 0)}`,
    '',
    '### Delta Thresholds',
    '',
    `- max index delta: ${delta?.thresholds?.maxIndexDeltaKB ?? 'n/a'} kB`,
    `- max total-js delta: ${delta?.thresholds?.maxTotalDeltaKB ?? 'n/a'} kB`,
    '',
    '### Artifact Availability',
    '',
    `- bundle-report.json: ${report ? 'ready' : 'missing'}`,
    `- bundle-delta.json: ${delta ? 'ready' : 'missing'}`,
    `- bundle-diff.md: ${diffMarkdown ? 'ready' : 'missing'}`,
    '',
    '### Top Chunk Changes',
    '',
    ...(topRegressions.length > 0
      ? topRegressions.map((row) => `- regressed: \`${row.chunk}\` (${row.deltaText})`)
      : ['- regressed: none']),
    ...(topImprovements.length > 0
      ? topImprovements.map((row) => `- improved: \`${row.chunk}\` (${row.deltaText})`)
      : ['- improved: none']),
    '',
    `詳見 artifacts：\`bundle-report.json\` / \`bundle-diff.md\` / \`bundle-delta.json\` / \`bundle-history.md\`。`,
    '',
  ].join('\n')

  await writeFile(outPath, summary, 'utf8')
  console.log(`Wrote summary: ${outPath}`)
}

await main()
