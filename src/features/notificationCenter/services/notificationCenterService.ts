import type { AuditTrailRecord } from '../../../services/auditTrailService'
import type { NotificationCenterItem, NotificationSeverity } from '../types/notificationCenter'

const RELEVANT_ACTIONS: AuditTrailRecord['action'][] = [
  'COMPLIANCE_ALERT_EXPORT',
  'ASSESSMENT_DUE_EXPORT',
  'ASSESSMENT_COMPLETION_RECORD',
  'AI_REPORT_CENTER_DISTRIBUTE',
  'HISTORICAL_DOCUMENTS_EXPORT',
  'RESIDENTS_EXPORT',
  'STAFF_EXPORT',
  'SYSTEM_SETTINGS_SAVE',
  /** PDF 02【5】／【7】／Seq 17／20：表單生命週期審計 → 站內通知（Seq 27） */
  'FORM_SUBMIT',
  'FORM_APPROVE',
  'FORM_REJECT_REVISION',
  /** 01 §5／Seq 10 */
  'FORM_SOFT_DELETE',
  /** Seq 10／27：排班歷史批次軟刪 */
  'SCHEDULING_HISTORY_BATCH_SOFT_DELETE',
]

const severityByAction = (action: AuditTrailRecord['action']): NotificationSeverity => {
  if (action === 'COMPLIANCE_ALERT_EXPORT') return 'high'
  if (
    action === 'ASSESSMENT_DUE_EXPORT' ||
    action === 'ASSESSMENT_COMPLETION_RECORD' ||
    action === 'FORM_SUBMIT' ||
    action === 'FORM_REJECT_REVISION' ||
    action === 'FORM_SOFT_DELETE' ||
    action === 'SCHEDULING_HISTORY_BATCH_SOFT_DELETE'
  ) {
    return 'medium'
  }
  return 'low'
}

const titleByAction = (action: AuditTrailRecord['action']): string => {
  if (action === 'COMPLIANCE_ALERT_EXPORT') return '週三零次提醒'
  if (action === 'ASSESSMENT_DUE_EXPORT') return '評估到期待辦匯出'
  if (action === 'ASSESSMENT_COMPLETION_RECORD') return '評估完成更新'
  if (action === 'AI_REPORT_CENTER_DISTRIBUTE') return 'AI 報告已發放'
  if (action === 'HISTORICAL_DOCUMENTS_EXPORT') return '歷史文件已匯出'
  if (action === 'RESIDENTS_EXPORT') return '院友名單已匯出'
  if (action === 'SYSTEM_SETTINGS_SAVE') return '系統設定已儲存'
  if (action === 'FORM_SUBMIT') return '服務表單待審'
  if (action === 'FORM_APPROVE') return '服務表單已核准'
  if (action === 'FORM_REJECT_REVISION') return '服務表單已退回修改'
  if (action === 'FORM_SOFT_DELETE') return '服務表單已軟刪除'
  if (action === 'SCHEDULING_HISTORY_BATCH_SOFT_DELETE') return '排班歷史批次已軟刪除'
  return '員工概覽已匯出'
}

/** 由 Audit Trail 衍生通知項（Seq 27 骨架） */
export const buildNotificationCenterItems = (
  logs: AuditTrailRecord[],
  readIds: Set<string>,
): NotificationCenterItem[] =>
  logs
    .filter((log) => RELEVANT_ACTIONS.includes(log.action))
    .map((log) => {
      const id = log.remoteId ?? `${log.action}:${log.entityId}:${log.occurredAt}`
      return {
        id,
        title: titleByAction(log.action),
        message: log.detail,
        severity: severityByAction(log.action),
        occurredAt: log.occurredAt,
        sourceAction: log.action,
        sourceEntityId: log.entityId,
        isRead: readIds.has(id),
      }
    })
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 50)
