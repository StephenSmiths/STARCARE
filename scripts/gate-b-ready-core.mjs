import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const evidenceDir = resolve(process.cwd(), 'docs/evidence')

function safeListEvidenceFiles() {
  try {
    return readdirSync(evidenceDir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => d.name)
  } catch {
    return []
  }
}

function hasExact(files, name) {
  return files.includes(name)
}

function hasPrefix(files, prefix) {
  return files.some((f) => f.startsWith(prefix))
}

export function computeGateBReadyState() {
  const files = safeListEvidenceFiles()
  const checks = [
    {
      key: 'gateb_core_flow',
      label: 'Gate B 主流程功能成功畫面',
      ok: hasExact(files, 'gateB-core-flow-success-2026-05-07.png'),
    },
    {
      key: 'gateb_access_control',
      label: 'Gate B 權限/角色限制畫面',
      ok: hasExact(files, 'gateB-access-control-ui-2026-05-07.png'),
    },
    {
      key: 'gateb_core_sql',
      label: 'Gate B 關鍵資料表 SQL 查核',
      ok: hasExact(files, 'gateB-core-table-sql-2026-05-07.png'),
    },
    {
      key: 'gateb_audit_sql',
      label: 'Gate B 審計/歷程 SQL 查核',
      ok: hasExact(files, 'gateB-audit-history-sql-2026-05-07.png'),
    },
    {
      key: 'gateb_smoke',
      label: 'Gate B 主要路徑 smoke 證據',
      ok: hasExact(files, 'gateB-smoke-check-2026-05-07.png') || hasExact(files, 'gateB-smoke-check-2026-05-07.md'),
    },
    {
      key: 'gateb_risk_note',
      label: 'Gate B 風險與處置紀錄',
      ok: hasExact(files, 'gateB-risk-note-2026-05-07.md'),
    },
    {
      key: 'gateb_summary',
      label: 'Gate B 證據彙總文件',
      ok: hasExact(files, 'gate-b-summary-2026-05-07.md'),
    },
    {
      key: 'gateb_report',
      label: 'Gate B 報告快照',
      ok: hasPrefix(files, 'gate-b-report-'),
    },
  ]

  const done = checks.filter((c) => c.ok).length
  const total = checks.length

  return {
    checks,
    done,
    total,
    missing: checks.filter((c) => !c.ok),
    ready: done === total,
  }
}

