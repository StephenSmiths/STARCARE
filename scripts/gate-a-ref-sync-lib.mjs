/**
 * Gate A 自動引用區塊：共用於證據索引、日誌、追蹤板、啟動清單等 markdown。
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv, gateAStrictHttpEnabled } from './gate-a-env-lib.mjs'
import { computeGateAReadyState } from './gate-a-ready-core.mjs'

function gateLabel() {
  const g = computeGateAReadyState()
  return `\`${g.ready ? 'READY' : 'NOT_READY'}\``
}

function httpStrictLabel() {
  return gateAStrictHttpEnabled(process.argv, buildSpawnBaseEnv()) ? 'ON' : 'OFF'
}

export function evidenceFilenames() {
  const dir = resolve(process.cwd(), 'docs/evidence')
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
}

export function latest(files, needle) {
  return files.filter((f) => f.includes(needle)).sort().at(-1)
}

export function artifacts(files = evidenceFilenames()) {
  return {
    auto: latest(files, 'gate-a-auto-evidence'),
    e401: latest(files, 'd2-401-admin-user-role-set'),
    e403: latest(files, 'd2-403-admin-user-role-set'),
    decisionRef: latest(files, 'gate-a-decision-ref-'),
    fillSnippet: latest(files, 'gate-a-fill-snippet-'),
    doctorReport: latest(files, 'gate-a-evidence-doctor-'),
    report: latest(files, 'gate-a-report-'),
  }
}

function docPath(filename) {
  return filename ? `\`docs/evidence/${filename}\`` : null
}

function pick(filename, placeholderBackticked) {
  return docPath(filename) ?? placeholderBackticked
}

const PL = {
  auto: '`<待補 auto evidence>`',
  e401: '`<待補 401 text>`',
  e403: '`<待補 403 text>`',
  decisionRef: '`<待補 decision ref>`',
  fillSnippet: '`<待補 fill snippet>`',
  doctorReport: '`<待補 doctor report>`',
  report: '`<待補 report>`',
}

export function blockEvidenceIndex(a) {
  return [
    '<!-- gatea-auto-ref:start -->',
    `- 可否判定：${gateLabel()}（規則：scripts/gate-a-ready-core.mjs）`,
    `- HTTP 嚴格取證：${httpStrictLabel()}（\`--strict-http\`／\`GATEA_STRICT_HTTP\`）`,
    `- auto evidence：${pick(a.auto, PL.auto)}`,
    `- 401 text：${pick(a.e401, PL.e401)}`,
    `- 403 text：${pick(a.e403, PL.e403)}`,
    `- decision ref：${pick(a.decisionRef, PL.decisionRef)}`,
    `- fill snippet：${pick(a.fillSnippet, PL.fillSnippet)}`,
    `- report：${pick(a.report, PL.report)}`,
    '<!-- gatea-auto-ref:end -->',
  ].join('\n')
}

export function blockDailyLog(a) {
  return [
    '<!-- gatea-daily-auto-ref:start -->',
    `- Gate A 可否判定：${gateLabel()}`,
    `- Gate A HTTP 嚴格取證：${httpStrictLabel()}`,
    `- Gate A 自動證據：${pick(a.auto, PL.auto)}`,
    `- Gate A 401：${pick(a.e401, PL.e401)}`,
    `- Gate A 403：${pick(a.e403, PL.e403)}`,
    `- Gate A decision ref：${pick(a.decisionRef, PL.decisionRef)}`,
    `- Gate A fill snippet：${pick(a.fillSnippet, PL.fillSnippet)}`,
    `- Gate A report：${pick(a.report, PL.report)}`,
    '<!-- gatea-daily-auto-ref:end -->',
  ].join('\n')
}

function blockWithDoctorMarkers(markerStart, markerEnd, a) {
  return [
    markerStart,
    `- 可否判定：${gateLabel()}`,
    `- HTTP 嚴格取證：${httpStrictLabel()}`,
    `- auto evidence：${pick(a.auto, PL.auto)}`,
    `- 401 text：${pick(a.e401, PL.e401)}`,
    `- 403 text：${pick(a.e403, PL.e403)}`,
    `- decision ref：${pick(a.decisionRef, PL.decisionRef)}`,
    `- fill snippet：${pick(a.fillSnippet, PL.fillSnippet)}`,
    `- doctor report：${pick(a.doctorReport, PL.doctorReport)}`,
    `- report：${pick(a.report, PL.report)}`,
    markerEnd,
  ].join('\n')
}

export function blockTracker(a) {
  return blockWithDoctorMarkers(
    '<!-- gatea-tracker-auto-ref:start -->',
    '<!-- gatea-tracker-auto-ref:end -->',
    a,
  )
}

export function blockKickoff(a) {
  return blockWithDoctorMarkers(
    '<!-- gatea-kickoff-auto-ref:start -->',
    '<!-- gatea-kickoff-auto-ref:end -->',
    a,
  )
}

/** @param {string} relativePath 相對於專案根目錄 */
export function syncMarkdownRegion(relativePath, regionRegex, newBlock) {
  const abs = resolve(process.cwd(), relativePath)
  const original = readFileSync(abs, 'utf8')
  const updated = original.replace(regionRegex, newBlock)
  if (updated !== original) {
    writeFileSync(abs, updated, 'utf8')
  }
  process.stdout.write(`[updated] ${abs}\n${newBlock}\n`)
}
