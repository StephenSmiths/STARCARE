/**
 * Gate A READY 規則單點來源：
 * auto + 401 + 403 + doctor（完成度達滿）
 */
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv } from './gate-a-env-lib.mjs'

/** @returns {string[]} docs/evidence 內檔名 */
export function listEvidenceFilenames(evidenceDir = resolve(process.cwd(), 'docs/evidence')) {
  return readdirSync(evidenceDir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
}

export function latestEvidence(files, needle) {
  return files.filter((f) => f.includes(needle)).sort().at(-1)
}

/** @typedef {{ doctorDone: number, doctorTotal: number, doctorDisplay: string, parseOk: boolean, readOk: boolean }} DoctorParse */

/**
 * @param {string | undefined} doctorFile basename
 * @param {string} evidenceDir absolute path
 */
export function parseDoctorFile(doctorFile, evidenceDir) {
  /** @type {DoctorParse} */
  const out = {
    doctorDone: 0,
    doctorTotal: 0,
    doctorDisplay: '（未找到）',
    parseOk: false,
    readOk: false,
  }
  if (!doctorFile) return out
  let text = ''
  try {
    text = readFileSync(resolve(evidenceDir, doctorFile), 'utf8')
    out.readOk = true
  } catch {
    out.doctorDisplay = '（doctor 讀取失敗）'
    return out
  }
  const m = text.match(/完成度：\s*([0-9]+)\s*\/\s*([0-9]+)/)
  if (!m) {
    out.doctorDisplay = '（doctor 格式未匹配）'
    return out
  }
  out.doctorDone = Number(m[1])
  out.doctorTotal = Number(m[2])
  out.parseOk = true
  out.doctorDisplay = `${out.doctorDone} / ${out.doctorTotal}`
  return out
}

/**
 * @param {string} [evidenceDir]
 */
export function computeGateAReadyState(evidenceDir = resolve(process.cwd(), 'docs/evidence')) {
  const files = listEvidenceFilenames(evidenceDir)
  const auto = latestEvidence(files, 'gate-a-auto-evidence')
  const e401 = latestEvidence(files, 'd2-401-admin-user-role-set')
  const e403 = latestEvidence(files, 'd2-403-admin-user-role-set')
  const doctorFile = latestEvidence(files, 'gate-a-evidence-doctor-')
  const fillSnippet = latestEvidence(files, 'gate-a-fill-snippet-')
  const decisionRef = latestEvidence(files, 'gate-a-decision-ref-')
  const report = latestEvidence(files, 'gate-a-report-')

  const parsed = parseDoctorFile(doctorFile, evidenceDir)
  const manualReady = parsed.doctorTotal > 0 && parsed.doctorDone === parsed.doctorTotal
  const autoReady = Boolean(auto && e401 && e403)
  const ready = autoReady && manualReady

  return {
    evidenceDir,
    files,
    auto,
    e401,
    e403,
    doctorFile,
    fillSnippet,
    decisionRef,
    report,
    doctorDone: parsed.doctorDone,
    doctorTotal: parsed.doctorTotal,
    doctorDisplay: parsed.doctorDisplay,
    autoOk: Boolean(auto),
    ok401: Boolean(e401),
    ok403: Boolean(e403),
    manualReady,
    autoReady,
    ready,
  }
}

/**
 * 依目前狀態給出建議下一步命令與原因（單點來源）。
 * @param {ReturnType<typeof computeGateAReadyState>} state
 */
export function recommendNextCommand(state) {
  if (state.ready) {
    return {
      command: 'npm run gatea:evidence:report',
      reason: '已 READY，更新單檔收斂快照供簽核引用',
    }
  }
  if (!state.ok403) {
    const e = buildSpawnBaseEnv()
    const staffEmail = (e.GATEA_STAFF_EMAIL || '').trim()
    const staffPwd = (e.GATEA_STAFF_PASSWORD || '').trim()
    const staffTok = (e.GATEA_STAFF_ACCESS_TOKEN || '').trim()
    if (staffEmail && staffPwd) {
      return {
        command: 'npm run gatea:evidence:http:auth',
        reason: '缺 403，以 staff 帳密自動換 JWT 並呼叫 Edge',
      }
    }
    if (staffTok) {
      return {
        command: 'npm run gatea:evidence:http',
        reason: '缺 403，已具 staff JWT（環境或 `.env`），直接 POST 產生文字證據',
      }
    }
    return {
      command: 'npm run gatea:evidence:http:auth',
      reason:
        '缺 403；請先在 `.env` 設定 GATEA_STAFF_EMAIL／GATEA_STAFF_PASSWORD；或設定 GATEA_STAFF_ACCESS_TOKEN 後改跑 `npm run gatea:evidence:http`',
    }
  }
  if (!state.autoOk) {
    return {
      command: 'npm run gatea:evidence:auto',
      reason: '缺 auto evidence，先補 migration/functions 快照',
    }
  }
  if (!state.ok401) {
    return {
      command: 'npm run gatea:evidence:http',
      reason: '缺 401，先補未授權請求證據',
    }
  }
  return {
    command: 'npm run gatea:evidence:all',
    reason: '尚未 READY，先跑全流程再做 strict gate',
  }
}

/** 供 `gate-a-latest`／證據彙總與主命令並列（與 README／go-live 敘述一致）。 */
export function gateAPreflightStrictNextMarkdownLine() {
  return '- `npm run gatea:evidence:preflight:strict`（取證前嚴格環境檢查；與 README／go-live 並讀）'
}
