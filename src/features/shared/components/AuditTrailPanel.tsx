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

/**
 * 與 `AuditTrailRecord['action']` 對齊供下拉篩選；
 * `satisfies` 確保每項合法，`Missing*` 確保涵蓋 Union 全集（新增 action 未補列會編譯失敗）。
 */
const ACTION_OPTIONS = [
  'CREATE',
  'UPDATE',
  'SOFT_DELETE',
  'SCHEDULING_RUN',
  'SCHEDULE_BATCH_SAVE',
  'SCHEDULING_HISTORY_BATCH_SOFT_DELETE',
  'COMPLIANCE_ALERT_EXPORT',
  'WEEKLY_COMPLIANCE_EXPORT',
  'STAFF_EXPORT',
  'RESIDENTS_EXPORT',
  'RESIDENTS_IMPORT_COMMIT',
  'STAFF_IMPORT_COMMIT',
  'ACTIVITY_SESSIONS_IMPORT_COMMIT',
  'SCHEDULING_KPI_HISTORY_APPEND',
  'SCHEDULING_KPI_HISTORY_CLEAR',
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
] as const satisfies readonly AuditTrailRecord['action'][]

type MissingAuditActionsForPanel = Exclude<AuditTrailRecord['action'], (typeof ACTION_OPTIONS)[number]>

const ENTITY_OPTIONS = ['Resident', 'Staff', 'Scheduling', 'Reporting'] as const satisfies readonly AuditTrailRecord['entityType'][]

type MissingEntityTypesForPanel = Exclude<AuditTrailRecord['entityType'], (typeof ENTITY_OPTIONS)[number]>

type _ExpectNeverForAuditPanel<T extends never> = T

/** 編譯期：下拉選項須涵蓋 audit action／entityType 全集（未補列時無法通過型別檢查） */
export type AuditTrailPanelFilterCoversUnions = _ExpectNeverForAuditPanel<
  MissingAuditActionsForPanel | MissingEntityTypesForPanel
>

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
    <section className={uiTokens.auditTrailPanel} aria-labelledby="audit-trail-heading">
      <div className={uiTokens.layoutFlexWrapItemsCenterGap2}>
        <h3 id="audit-trail-heading" className={uiTokens.panelTitleSm}>
          {title}
        </h3>
        <span className={uiTokens.metaChip}>
          顯示 {filtered.length} / {auditTrail.length}
        </span>
      </div>
      {help ? <p className={uiTokens.helpFinePrint}>{help}</p> : null}
      <div className={uiTokens.layoutFlexWrapItemsCenterGap2Mt2}>
        <select
          className={uiTokens.auditTrailFilterSelectMin9}
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
          className={uiTokens.auditTrailFilterSelectMin8}
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
          className={uiTokens.formInputMaxXsTextXs}
          placeholder="搜尋 actor / entity / detail"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>
      <div className={uiTokens.layoutSpaceY1Mt2}>
        {filtered.length === 0 ? (
          <p className={uiTokens.emptyStatePill}>沒有符合條件的審計紀錄。</p>
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
