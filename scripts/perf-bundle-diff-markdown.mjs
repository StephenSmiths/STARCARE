import { readFile, writeFile } from 'node:fs/promises'

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
  const args = process.argv.slice(2)
  const outIndex = args.indexOf('--out')
  const outPath = outIndex === -1 ? undefined : args[outIndex + 1]
  const positional = args.filter((arg, index) => index !== outIndex && index !== outIndex + 1)
  const [basePath, currentPath] = positional
  if (!basePath || !currentPath) {
    console.log(
      'Usage: node scripts/perf-bundle-diff-markdown.mjs <base.json> <current.json> [--out <path.md>]',
    )
    process.exitCode = 1
    return
  }

  const base = await readJson(basePath)
  const current = await readJson(currentPath)
  const baseMap = toMap(base.keyChunks)
  const currentMap = toMap(current.keyChunks)
  const names = [...new Set([...baseMap.keys(), ...currentMap.keys()])].sort()

  const lines = []
  lines.push(`### Bundle Diff (${basePath} -> ${currentPath})`)
  lines.push('')
  lines.push('| Chunk | Base | Current | Delta |')
  lines.push('|---|---:|---:|---:|')
  for (const name of names) {
    const before = baseMap.get(name) ?? 0
    const after = currentMap.get(name) ?? 0
    const delta = after - before
    const sign = delta > 0 ? '+' : ''
    lines.push(`| \`${name}\` | ${toKB(before)} | ${toKB(after)} | ${sign}${toKB(delta)} |`)
  }

  const totalBefore = Number(base.totalBytes ?? 0)
  const totalAfter = Number(current.totalBytes ?? 0)
  const totalDelta = totalAfter - totalBefore
  const sign = totalDelta > 0 ? '+' : ''
  lines.push(`| \`total-js\` | ${toKB(totalBefore)} | ${toKB(totalAfter)} | ${sign}${toKB(totalDelta)} |`)

  const markdown = `${lines.join('\n')}\n`
  if (outPath) {
    await writeFile(outPath, markdown, 'utf8')
    console.log(`Wrote markdown diff to ${outPath}`)
    return
  }

  console.log(markdown)
}

await main()
