/**
 * Gate C 就緒判定：可自動驗證之工程項 + 人工項標記。
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv } from './gate-a-env-lib.mjs'
import { resolveGateCE2EEnv } from './gate-c-resolve-e2e-env.mjs'

function pairReady(e, prefix) {
  return Boolean(String(e[`${prefix}_EMAIL`] ?? '').trim() && String(e[`${prefix}_PASSWORD`] ?? '').trim())
}

function gateAReadyFromLatest(cwd) {
  const p = resolve(cwd, 'docs/evidence/gate-a-latest.md')
  if (!existsSync(p)) return false
  return /判定狀態：`READY`/.test(readFileSync(p, 'utf8'))
}

function e2ePassEvidence(cwd) {
  const p = resolve(cwd, 'docs/evidence/gate-c-e2e-auth-latest.md')
  if (!existsSync(p)) return false
  return /結果：`PASS`/.test(readFileSync(p, 'utf8'))
}

function gateA403Evidence(cwd) {
  const p = resolve(cwd, 'docs/evidence/gate-a-latest.md')
  if (!existsSync(p)) return false
  const text = readFileSync(p, 'utf8')
  return /- 403：`docs\/evidence\//.test(text)
}

function engineeringBaselineDoc(cwd) {
  const p = resolve(cwd, 'docs/evidence/gate-c-engineering-baseline-latest.md')
  return existsSync(p) && /判定：`ACCEPTED`/.test(readFileSync(p, 'utf8'))
}

/** @param {string} [cwd] */
export function computeGateCReadyState(cwd = process.cwd()) {
  const e = resolveGateCE2EEnv(buildSpawnBaseEnv(cwd)).env
  const e2eMain = pairReady(e, 'E2E_AUTH')
  const e2eAdmin = pairReady(e, 'E2E_AUTH_ADMIN')
  const e2eStaff = pairReady(e, 'E2E_AUTH_STAFF')
  const e2eTl = pairReady(e, 'E2E_AUTH_TEAMLEAD')
  const viteOk =
    Boolean(String(e.VITE_SUPABASE_URL ?? '').trim()) &&
    Boolean(String(e.VITE_SUPABASE_ANON_KEY ?? '').trim())
  const patDone = ['1', 'true', 'yes'].includes(String(e.GATE_C_PAT_DONE ?? '').trim().toLowerCase())
  const signoffDone = ['1', 'true', 'yes'].includes(String(e.GATE_C_SIGNOFF_DONE ?? '').trim().toLowerCase())
  const gateAReady = gateAReadyFromLatest(cwd)
  const e2ePass = e2ePassEvidence(cwd)
  const baselineWaiver =
    gateAReady && e2ePass && gateA403Evidence(cwd) && e2eStaff && !e2eAdmin && !e2eTl

  const checks = [
    { key: 'gate_a', label: 'Gate A READY', ok: gateAReady, auto: true },
    { key: 'vite', label: 'VITE_SUPABASE_*', ok: viteOk, auto: true },
    { key: 'e2e_main', label: 'E2E_AUTH_*（主路徑）', ok: e2eMain, auto: true },
    {
      key: 'e2e_admin_staff',
      label: 'E2E_AUTH_ADMIN+STAFF（或 Gate A 403 基線）',
      ok: (e2eAdmin && e2eStaff) || baselineWaiver,
      auto: true,
    },
    {
      key: 'e2e_tl',
      label: 'E2E_AUTH_TEAMLEAD/ADMIN P2（或 Gate A 基線）',
      ok: e2eTl || e2eAdmin || baselineWaiver,
      auto: true,
    },
    { key: 'e2e_pass', label: 'gatec:e2e:auth PASS', ok: e2ePass, auto: true },
    { key: 'pat', label: '§6 PAT 輪替', ok: patDone, auto: false },
    { key: 'signoff', label: '§7 三方簽核', ok: signoffDone, auto: false },
  ]

  const autoChecks = checks.filter((c) => c.auto)
  const autoDone = autoChecks.filter((c) => c.ok).length
  const engineeringReady = autoDone === autoChecks.length
  const engineeringBaselineReady = engineeringReady
  const ready = checks.every((c) => c.ok)

  return {
    checks,
    autoDone,
    autoTotal: autoChecks.length,
    engineeringReady,
    engineeringBaselineReady,
    baselineWaiver,
    ready,
    missing: checks.filter((c) => !c.ok),
    e2eMain,
  }
}

export function recommendGateCNextCommand(state) {
  if (!state.checks.find((c) => c.key === 'gate_a')?.ok) {
    return { command: 'npm run gatea:evidence:refresh:strict-http', reason: 'Gate A 未 READY' }
  }
  if (!state.e2eMain) {
    return { command: 'npm run gatec:preflight', reason: '補 .env 內 E2E_AUTH_* 後 gatec:e2e:auth' }
  }
  if (!state.checks.find((c) => c.key === 'e2e_pass')?.ok) {
    return { command: 'npm run gatec:e2e:auth', reason: '執行真庫 Playwright 並寫入 PASS 證據' }
  }
  if (state.engineeringReady && !engineeringBaselineDoc(process.cwd())) {
    return { command: 'npm run gatec:baseline:accept', reason: '寫入 Staff+Gate A 工程基線認可證據' }
  }
  if (!state.checks.find((c) => c.key === 'pat')?.ok) {
    return { command: 'docs/security-token-rotation-checklist.md §A', reason: 'OPS 完成 PAT 後設 GATE_C_PAT_DONE=1' }
  }
  if (!state.checks.find((c) => c.key === 'signoff')?.ok) {
    return { command: 'docs/gate-c-go-live-signoff-draft-2026-05-15.md §4', reason: '三方簽名後設 GATE_C_SIGNOFF_DONE=1' }
  }
  return { command: 'docs/go-live-checklist.md §7', reason: 'Gate C 工程+營運項已齊，可 go-live' }
}
