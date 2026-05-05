import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const DIST_ASSETS_DIR = join(process.cwd(), 'dist', 'assets')

const toKB = (bytes) => `${(bytes / 1024).toFixed(2)} kB`

const readAssetSizes = async () => {
  const fileNames = await readdir(DIST_ASSETS_DIR)
  const jsFiles = fileNames.filter((name) => name.endsWith('.js'))
  const rows = []

  for (const fileName of jsFiles) {
    const fullPath = join(DIST_ASSETS_DIR, fileName)
    const info = await stat(fullPath)
    rows.push({ fileName, bytes: info.size })
  }

  rows.sort((a, b) => b.bytes - a.bytes)
  return rows
}

const selectKeyChunks = (rows) => {
  const include = (prefix) => rows.find((row) => row.fileName.startsWith(prefix))
  return [
    include('index-'),
    include('vendor-react-'),
    include('vendor-supabase-'),
    include('scheduling-'),
    include('residents-'),
    include('AppMainViews-'),
  ].filter(Boolean)
}

const parseOptions = () => {
  const args = process.argv.slice(2)
  const getNumberArg = (name) => {
    const index = args.indexOf(name)
    if (index === -1) return undefined
    const raw = args[index + 1]
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return {
    maxIndexKB: getNumberArg('--max-index-kb'),
    maxTotalKB: getNumberArg('--max-total-kb'),
  }
}

const main = async () => {
  const options = parseOptions()
  const rows = await readAssetSizes()
  if (rows.length === 0) {
    console.log('No JS assets found. Run `npm run build:demo` first.')
    process.exitCode = 1
    return
  }

  console.log('Bundle report (dist/assets/*.js):')
  for (const row of selectKeyChunks(rows)) {
    console.log(`- ${row.fileName}: ${toKB(row.bytes)}`)
  }

  const indexChunk = rows.find((row) => row.fileName.startsWith('index-'))
  const total = rows.reduce((sum, row) => sum + row.bytes, 0)
  console.log(`- total-js: ${toKB(total)}`)

  const violations = []
  if (typeof options.maxIndexKB === 'number' && indexChunk) {
    if (indexChunk.bytes > options.maxIndexKB * 1024) {
      violations.push(
        `index chunk ${toKB(indexChunk.bytes)} > budget ${options.maxIndexKB.toFixed(2)} kB`,
      )
    }
  }
  if (typeof options.maxTotalKB === 'number' && total > options.maxTotalKB * 1024) {
    violations.push(`total-js ${toKB(total)} > budget ${options.maxTotalKB.toFixed(2)} kB`)
  }

  if (violations.length > 0) {
    console.log('Bundle budget check: FAILED')
    for (const item of violations) {
      console.log(`- ${item}`)
    }
    process.exitCode = 1
    return
  }

  if (typeof options.maxIndexKB === 'number' || typeof options.maxTotalKB === 'number') {
    console.log('Bundle budget check: PASSED')
  }
}

await main()
