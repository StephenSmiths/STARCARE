import { copyFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const sourcePath = join(process.cwd(), 'dist', 'bundle-report.json')
const snapshotsDir = join(process.cwd(), 'docs', 'perf-baselines', 'history')

const nowStamp = () => {
  const now = new Date()
  const yyyy = now.getUTCFullYear()
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(now.getUTCDate()).padStart(2, '0')
  const hh = String(now.getUTCHours()).padStart(2, '0')
  const min = String(now.getUTCMinutes()).padStart(2, '0')
  const sec = String(now.getUTCSeconds()).padStart(2, '0')
  return `${yyyy}${mm}${dd}-${hh}${min}${sec}Z`
}

const main = async () => {
  await mkdir(snapshotsDir, { recursive: true })
  const targetPath = join(snapshotsDir, `bundle-report-${nowStamp()}.json`)
  await copyFile(sourcePath, targetPath)
  console.log(`Saved snapshot: ${targetPath}`)
}

await main()
