import type { AuditTrailRecord } from '../../../services/auditTrailService'

export type NotificationSeverity = 'high' | 'medium' | 'low'

/** PDF 02【14】通知中心單筆通知 */
export interface NotificationCenterItem {
  id: string
  title: string
  message: string
  severity: NotificationSeverity
  occurredAt: string
  sourceAction: AuditTrailRecord['action']
  sourceEntityId: string
  isRead: boolean
}
