import { readFile, writeFile } from 'node:fs/promises'

const toKB = (bytes) => `${(Number(bytes) / 1024).toFixed(2)} kB`

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

const pickChunk = (rows, prefix) => rows.find((row) => row.fileName?.startsWith(prefix))

const main = async () => {
  const [reportPath, deltaPath, outPath] = process.argv.slice(2)
  if (!reportPath || !deltaPath || !outPath) {
    console.log(
      'Usage: node scripts/perf-bundle-ci-summary.mjs <bundle-report.json> <bundle-delta.json> <out.md>',
    )
    process.exitCode = 1
    return
  }

  const report = await readJson(reportPath)
  const delta = await readJson(deltaPath)

  const keyChunks = report.keyChunks ?? []
  const indexChunk = pickChunk(keyChunks, 'index-')
  const reactChunk = pickChunk(keyChunks, 'vendor-react-')
  const supabaseChunk = pickChunk(keyChunks, 'vendor-supabase-')

  const summary = [
    '## Bundle Governance Summary',
    '',
    `- Status: **${String(delta.status ?? 'unknown').toUpperCase()}**`,
    `- index: ${toKB(indexChunk?.bytes ?? 0)}`,
    `- total-js: ${toKB(report.totalBytes ?? 0)}`,
    `- vendor-react: ${toKB(reactChunk?.bytes ?? 0)}`,
    `- vendor-supabase: ${toKB(supabaseChunk?.bytes ?? 0)}`,
    `- index delta: ${toKB(delta.metrics?.indexDeltaBytes ?? 0)}`,
    `- total-js delta: ${toKB(delta.metrics?.totalDeltaBytes ?? 0)}`,
    '',
    '### Delta Thresholds',
    '',
    `- max index delta: ${delta.thresholds?.maxIndexDeltaKB ?? 'n/a'} kB`,
    `- max total-js delta: ${delta.thresholds?.maxTotalDeltaKB ?? 'n/a'} kB`,
    '',
    `詳見 artifacts：\`bundle-report.json\` / \`bundle-diff.md\` / \`bundle-delta.json\` / \`bundle-history.md\`。`,
    '',
  ].join('\n')

  await writeFile(outPath, summary, 'utf8')
  console.log(`Wrote summary: ${outPath}`)
}

await main()
