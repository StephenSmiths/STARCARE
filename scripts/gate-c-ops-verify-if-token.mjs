/**
 * 若已設 SUPABASE_ACCESS_TOKEN 則執行 ops:verify（PAT 煙霧）；否則提示 runbook。
 */
import { spawnSync } from 'node:child_process'

const token = String(process.env.SUPABASE_ACCESS_TOKEN ?? '').trim()
if (!token) {
  process.stderr.write(
    '[gatec:ops:verify] 未設 SUPABASE_ACCESS_TOKEN。見 docs/gate-c-pat-ops-runbook-2026-05-15.md\n',
  )
  process.exit(2)
}

const r = spawnSync('npm', ['run', 'ops:verify'], {
  stdio: 'inherit',
  env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
  shell: true,
})
process.exit(r.status ?? 1)
