import { useMemo, useState } from 'react'
import type { AuditTrailRecord } from '../../../services/auditTrailService'
import { uiTokens } from '../ui/uiTokens'

export interface AuditTrailPanelProps {
  /** 區塊標題 */
  title?: string
  /** 標題下方說明 */
  help?: string
  auditTrail: AuditTrailRecord[]
}

/** 與 `AuditTrailRecord['action']` 對齊，供下拉篩選（缺漏會導致無法篩到該類紀錄） */
const ACTION_OPTIONS: Array<AuditTrailRecord['action']> = [
  'CREATE',
  'UPDATE',
  'SOFT_DELETE',
  'SCHEDULING_RUN',
  'SCHEDULE_BATCH_SAVE',
  'SCHEDULING_HISTORY_BATCH_SOFT_DELETE',
  'COMPLIANCE_ALERT_EXPORT',
  'STAFF_EXPORT',
  'RESIDENTS_EXPORT',
  'AI_REPORT_CENTER_DRAFT_CREATE',
  'AI_REPORT_CENTER_BODY_SAVE',
  'AI_REPORT_CENTER_ADOPT',
  'AI_REPORT_CENTER_DISTRIBUTE',
  'HISTORICAL_DOCUMENTS_EXPORT',
  'ASSESSMENT_DUE_EXPORT',
  'ASSESSMENT_COMPLETION_RECORD',
  'WORK_PLAN_SESSION_COMMIT',
  'WORK_SESSION_ACCEPT',
  'WORK_SESSION_REJECT',
  'WORK_SESSION_TEAM_BULK_SOFT_DELETE',
  'WORK_SESSION_COMPLETED',
  'FORM_DRAFT_UPSERT',
  'FORM_SUBMIT',
  'FORM_APPROVE',
  'FORM_REJECT_REVISION',
  'FORM_SOFT_DELETE',
  'SHIFT_START_HANDOVER_DRAFT_UPSERT',
  'SHIFT_START_HANDOVER_SUBMIT',
  'SHIFT_END_HANDOVER_DRAFT_UPSERT',
  'SHIFT_END_HANDOVER_SUBMIT',
  'SYSTEM_SETTINGS_SAVE',
]

const ENTITY_OPTIONS: Array<AuditTrailRecord['entityType']> = [
  'Resident',
  'Staff',
  'Scheduling',
  'Reporting',
]

/** 全域審計列表：支援動作／實體類型／關鍵字篩選（Seq 12） */
export const AuditTrailPanel = ({
  title = '最近審計紀錄（Audit Trail）',
  help,
  auditTrail,
}: AuditTrailPanelProps) => {
  const [actionFilter, setActionFilter] = useState<'all' | AuditTrailRecord['action']>('all')
  const [entityFilter, setEntityFilter] = useState<'all' | AuditTrailRecord['entityType']>('all')
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    return auditTrail
      .filter((log) => (actionFilter === 'all' ? true : log.action === actionFilter))
      .filter((log) => (entityFilter === 'all' ? true : log.entityType === entityFilter))
      .filter((log) => {
        if (!q) return true
        return (
          log.detail.toLowerCase().includes(q) ||
          log.actorId.toLowerCase().includes(q) ||
          log.entityId.toLowerCase().includes(q)
        )
      })
      .slice(0, 20)
  }, [actionFilter, auditTrail, entityFilter, keyword])

  return (
    <section className="rounded-md bg-slate-50 p-3 text-xs text-slate-600" aria-labelledby="audit-trail-heading">
      <div className="flex flex-wrap items-center gap-2">
        <h3 id="audit-trail-heading" className="text-sm font-semibold text-slate-800">
          {title}
        </h3>
        <span className="rounded bg-slate-200 px-2 py-0.5 text-[11px] text-slate-700">
          顯示 {filtered.length} / {auditTrail.length}
        </span>
      </div>
      {help ? <p className="mt-1 text-[11px] text-slate-500">{help}</p> : null}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <select
          className={`${uiTokens.formSelect} w-auto min-w-[9rem] text-xs`}
          value={actionFilter}
          onChange={(event) =>
            setActionFilter(event.target.value as 'all' | AuditTrailRecord['action'])
          }
        >
          <option value="all">全部動作</option>
          {ACTION_OPTIONS.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
        <select
          className={`${uiTokens.formSelect} w-auto min-w-[8rem] text-xs`}
          value={entityFilter}
          onChange={(event) =>
            setEntityFilter(event.target.value as 'all' | AuditTrailRecord['entityType'])
          }
        >
          <option value="all">全部類型</option>
          {ENTITY_OPTIONS.map((entity) => (
            <option key={entity} value={entity}>
              {entity}
            </option>
          ))}
        </select>
        <input
          className={`${uiTokens.formInput} max-w-xs text-xs`}
          placeholder="搜尋 actor / entity / detail"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>
      <div className="mt-2 space-y-1">
        {filtered.length === 0 ? (
          <p className="rounded border border-slate-200 bg-white px-2 py-1 text-slate-500">沒有符合條件的審計紀錄。</p>
        ) : (
          filtered.map((log, index) => (
            <p key={`${log.entityId}-${log.occurredAt}-${log.action}-${index}`}>
              {log.occurredAt} · {log.action} / {log.entityType} / {log.actorId} / {log.detail}
            </p>
          ))
        )}
      </div>
    </section>
  )
}
