/**
 * 執行 `test:e2e:auth`；若全 skip 或 failed>0 則 exit 1；通過則寫入 gate-c-e2e-auth-latest.md。
 */
import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv } from './gate-a-env-lib.mjs'
import { computeGateCReadyState } from './gate-c-ready-core.mjs'

const e = buildSpawnBaseEnv()
const email = String(e.E2E_AUTH_EMAIL ?? '').trim()
const password = String(e.E2E_AUTH_PASSWORD ?? '').trim()
if (!email || !password) {
  process.stderr.write(
    '[gatec:e2e:auth] 略過：未設 E2E_AUTH_EMAIL／E2E_AUTH_PASSWORD。請複製 .env.gate-c.example → .env 並填入 Staging 測試帳。\n',
  )
  process.exitCode = 2
  process.exit(2)
}

const r = spawnSync('npm', ['run', 'test:e2e:auth'], {
  encoding: 'utf8',
  env: { ...process.env, ...e },
  shell: true,
  maxBuffer: 10 * 1024 * 1024,
})

const out = `${r.stdout ?? ''}\n${r.stderr ?? ''}`
process.stdout.write(r.stdout ?? '')
process.stderr.write(r.stderr ?? '')

const passed = Number(/(\d+) passed/.exec(out)?.[1] ?? 0)
const failed = Number(/(\d+) failed/.exec(out)?.[1] ?? 0)
const skipped = Number(/(\d+) skipped/.exec(out)?.[1] ?? 0)

if (r.status !== 0 || failed > 0 || passed === 0) {
  process.stderr.write(
    `[gatec:e2e:auth] 未通過：passed=${passed} failed=${failed} skipped=${skipped} exit=${r.status ?? 'null'}\n`,
  )
  process.exitCode = 1
  process.exit(1)
}

const stamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)
const body = [
  '# Gate C E2E Auth Latest',
  '',
  `- 更新時間：${new Date().toISOString()}`,
  '- 結果：`PASS`',
  `- passed：${passed}`,
  `- failed：${failed}`,
  `- skipped：${skipped}`,
  '- 指令：`npm run gatec:e2e:auth`',
  '',
  '## 摘要（末段）',
  '```',
  ...out.trim().split('\n').slice(-12),
  '```',
].join('\n')

const outPath = resolve(process.cwd(), 'docs/evidence/gate-c-e2e-auth-latest.md')
writeFileSync(outPath, `${body}\n`, 'utf8')
process.stdout.write(`[gatec] wrote ${outPath} (${passed} passed)\n`)

const state = computeGateCReadyState()
process.stdout.write(`engineering: ${state.engineeringReady ? 'READY' : 'NOT_READY'}\n`)
