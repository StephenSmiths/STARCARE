/**
 * Gate C 一頁狀態（給 TL／PM）；不輸出密鑰。
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { computeGateCReadyState } from './gate-c-ready-core.mjs'
import { resolveGateCE2EEnv } from './gate-c-resolve-e2e-env.mjs'
import { buildSpawnBaseEnv } from './gate-a-env-lib.mjs'

const cwd = process.cwd()
const state = computeGateCReadyState(cwd)
const e = resolveGateCE2EEnv(buildSpawnBaseEnv(cwd)).env

const readSnippet = (rel, pattern) => {
  const p = resolve(cwd, rel)
  if (!existsSync(p)) return '—'
  const t = readFileSync(p, 'utf8')
  const m = t.match(pattern)
  return m ? m[1] : '—'
}

const gateA = readSnippet('docs/evidence/gate-a-latest.md', /判定狀態：`([^`]+)`/)
const gateC = readSnippet('docs/evidence/gate-c-latest.md', /判定狀態：`([^`]+)`/)
const e2e = readSnippet('docs/evidence/gate-c-e2e-auth-latest.md', /passed：(\d+)/)

const pat = ['1', 'true', 'yes'].includes(String(e.GATE_C_PAT_DONE ?? '').trim().toLowerCase())
const sign = ['1', 'true', 'yes'].includes(String(e.GATE_C_SIGNOFF_DONE ?? '').trim().toLowerCase())

const lines = [
  '# STARCARE Gate C 狀態（一頁）',
  '',
  `更新：${new Date().toISOString()}`,
  '',
  '| 閘門 | 狀態 |',
  '|------|------|',
  `| Gate A | ${gateA} |`,
  `| Gate B | 工程通過（ci 2026-05-15） |`,
  `| Gate C 工程 | ${state.engineeringReady ? '**READY**' : 'NOT_READY'} (${state.autoDone}/${state.autoTotal}) |`,
  `| Gate C 整體 | ${gateC} |`,
  `| E2E passed | ${e2e} |`,
  `| PAT (.env) | ${pat ? 'DONE' : '待辦'} |`,
  `| 簽核 (.env) | ${sign ? 'DONE' : '待辦'} |`,
  '',
  '## 阻塞',
  ...state.missing.map((m) => `- ${m.label}`),
  '',
  '## 下一步',
  `- ${state.engineeringReady ? '發起 UAT（uat-facilitator-runbook）' : 'npm run gatec:e2e:auth'}`,
  `- ${pat ? '—' : 'OPS：gate-c-pat-ops-runbook'}`,
  `- ${sign ? '—' : '三方：gate-c-section7-signoff-wording'}`,
  '',
  '固定入口：docs/evidence/gate-c-latest.md',
]

process.stdout.write(`${lines.join('\n')}\n`)
