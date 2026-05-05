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

const main = async () => {
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

  const total = rows.reduce((sum, row) => sum + row.bytes, 0)
  console.log(`- total-js: ${toKB(total)}`)
}

await main()
