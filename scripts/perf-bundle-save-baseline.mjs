import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const sourcePath = join(process.cwd(), 'dist', 'bundle-report.json')

const main = async () => {
  const [targetArg] = process.argv.slice(2)
  const targetPath =
    targetArg ?? join(process.cwd(), 'docs', 'perf-baselines', 'bundle-report-latest.json')

  await mkdir(dirname(targetPath), { recursive: true })
  await copyFile(sourcePath, targetPath)
  console.log(`Saved baseline: ${targetPath}`)
}

await main()
