/**
 * 一鍵：全流程取證 → 修剪舊快照 → 刷新 gate-a-latest.md。
 * 選項：`--keep=N`（僅給 prune，預設 2）；其餘旗標轉給 `gate-a-evidence-all.mjs`（如 `--no-preflight`、`--strict-http`）。
 */
import { spawnSync } from 'node:child_process'

import { buildSpawnBaseEnv } from './gate-a-env-lib.mjs'

const baseEnv = buildSpawnBaseEnv()
const raw = process.argv.slice(2)
const keepArg = raw.find((a) => a.startsWith('--keep='))
const keepNum = keepArg ? Number(keepArg.slice('--keep='.length)) : 2
if (!Number.isInteger(keepNum) || keepNum < 1) {
  throw new Error('`--keep` 必須為正整數，例如：--keep=2')
}
const allArgs = raw.filter((a) => !a.startsWith('--keep='))

const run = (label, cmd, args) => {
  process.stdout.write(`\n== ${label} ==\n`)
  const out = spawnSync(cmd, args, { stdio: 'inherit', env: baseEnv })
  const code = out.status ?? 1
  if (code !== 0) process.exit(code)
}

run('gatea evidence all', 'node', ['scripts/gate-a-evidence-all.mjs', ...allArgs])
run('gatea evidence prune', 'node', [
  'scripts/gate-a-evidence-prune.mjs',
  `--keep=${keepNum}`,
  '--apply',
])
run('gatea evidence latest', 'node', ['scripts/gate-a-update-latest-pointer.mjs'])
