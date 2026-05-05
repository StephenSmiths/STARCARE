import { readFile } from 'node:fs/promises'

const toKB = (bytes) => `${(bytes / 1024).toFixed(2)} kB`

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

const toMap = (rows) => {
  const map = new Map()
  for (const row of rows ?? []) {
    map.set(row.fileName, row.bytes)
  }
  return map
}

const main = async () => {
  const [basePath, currentPath] = process.argv.slice(2)
  if (!basePath || !currentPath) {
    console.log('Usage: node scripts/perf-bundle-diff-markdown.mjs <base.json> <current.json>')
    process.exitCode = 1
    return
  }

  const base = await readJson(basePath)
  const current = await readJson(currentPath)
  const baseMap = toMap(base.keyChunks)
  const currentMap = toMap(current.keyChunks)
  const names = [...new Set([...baseMap.keys(), ...currentMap.keys()])].sort()

  console.log(`### Bundle Diff (${basePath} -> ${currentPath})`)
  console.log('')
  console.log('| Chunk | Base | Current | Delta |')
  console.log('|---|---:|---:|---:|')
  for (const name of names) {
    const before = baseMap.get(name) ?? 0
    const after = currentMap.get(name) ?? 0
    const delta = after - before
    const sign = delta > 0 ? '+' : ''
    console.log(`| \`${name}\` | ${toKB(before)} | ${toKB(after)} | ${sign}${toKB(delta)} |`)
  }

  const totalBefore = Number(base.totalBytes ?? 0)
  const totalAfter = Number(current.totalBytes ?? 0)
  const totalDelta = totalAfter - totalBefore
  const sign = totalDelta > 0 ? '+' : ''
  console.log(`| \`total-js\` | ${toKB(totalBefore)} | ${toKB(totalAfter)} | ${sign}${toKB(totalDelta)} |`)
}

await main()
