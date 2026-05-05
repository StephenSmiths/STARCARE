import { readFile } from 'node:fs/promises'

const toKB = (bytes) => `${(bytes / 1024).toFixed(2)} kB`

const parseArgs = (args) => {
  const result = {
    maxIndexDeltaKB: undefined,
    maxTotalDeltaKB: undefined,
  }

  const indexFlag = args.indexOf('--max-index-delta-kb')
  if (indexFlag !== -1) {
    const value = Number(args[indexFlag + 1])
    if (Number.isFinite(value)) result.maxIndexDeltaKB = value
  }

  const totalFlag = args.indexOf('--max-total-delta-kb')
  if (totalFlag !== -1) {
    const value = Number(args[totalFlag + 1])
    if (Number.isFinite(value)) result.maxTotalDeltaKB = value
  }

  return result
}

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

const pickChunkBytes = (report, prefix) =>
  report.keyChunks?.find((item) => item.fileName?.startsWith(prefix))?.bytes ?? 0

const main = async () => {
  const [basePath, currentPath, ...rest] = process.argv.slice(2)
  if (!basePath || !currentPath) {
    console.log(
      'Usage: node scripts/perf-bundle-delta-check.mjs <base.json> <current.json> [--max-index-delta-kb 8] [--max-total-delta-kb 30]',
    )
    process.exitCode = 1
    return
  }

  const options = parseArgs(rest)
  const base = await readJson(basePath)
  const current = await readJson(currentPath)

  const baseIndex = pickChunkBytes(base, 'index-')
  const currentIndex = pickChunkBytes(current, 'index-')
  const baseTotal = Number(base.totalBytes ?? 0)
  const currentTotal = Number(current.totalBytes ?? 0)

  const indexDelta = currentIndex - baseIndex
  const totalDelta = currentTotal - baseTotal

  console.log(`Delta check: ${basePath} -> ${currentPath}`)
  console.log(
    `- index delta: ${toKB(baseIndex)} -> ${toKB(currentIndex)} (${indexDelta >= 0 ? '+' : ''}${toKB(indexDelta)})`,
  )
  console.log(
    `- total-js delta: ${toKB(baseTotal)} -> ${toKB(currentTotal)} (${totalDelta >= 0 ? '+' : ''}${toKB(totalDelta)})`,
  )

  const violations = []
  if (typeof options.maxIndexDeltaKB === 'number' && indexDelta > options.maxIndexDeltaKB * 1024) {
    violations.push(`index delta ${toKB(indexDelta)} > ${options.maxIndexDeltaKB.toFixed(2)} kB`)
  }
  if (typeof options.maxTotalDeltaKB === 'number' && totalDelta > options.maxTotalDeltaKB * 1024) {
    violations.push(`total-js delta ${toKB(totalDelta)} > ${options.maxTotalDeltaKB.toFixed(2)} kB`)
  }

  if (violations.length > 0) {
    console.log('Bundle delta check: FAILED')
    for (const item of violations) {
      console.log(`- ${item}`)
    }
    process.exitCode = 1
    return
  }

  console.log('Bundle delta check: PASSED')
}

await main()
