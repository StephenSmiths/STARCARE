import type { AuditTrailRecord } from '../../../services/auditTrailService'

/**
 * 與 `AuditTrailRecord['action']` 對齊供下拉篩選；
 * `satisfies` 確保每項合法，`Missing*` 確保涵蓋 Union 全集（新增 action 未補列會編譯失敗）。
 */
export const AUDIT_TRAIL_PANEL_ACTION_OPTIONS = [
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

type MissingAuditActionsForPanel = Exclude<
  AuditTrailRecord['action'],
  (typeof AUDIT_TRAIL_PANEL_ACTION_OPTIONS)[number]
>

export const AUDIT_TRAIL_PANEL_ENTITY_OPTIONS = ['Resident', 'Staff', 'Scheduling', 'Reporting'] as const satisfies readonly AuditTrailRecord['entityType'][]

type MissingEntityTypesForPanel = Exclude<
  AuditTrailRecord['entityType'],
  (typeof AUDIT_TRAIL_PANEL_ENTITY_OPTIONS)[number]
>

type ExpectNeverForAuditPanel<T extends never> = T

/** 編譯期：下拉選項須涵蓋 audit action／entityType 全集（未補列時無法通過型別檢查） */
export type AuditTrailPanelFilterCoversUnions = ExpectNeverForAuditPanel<
  MissingAuditActionsForPanel | MissingEntityTypesForPanel
>
