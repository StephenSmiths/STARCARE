import type { AuditTrailRecord } from '../../../services/auditTrailService'
import type { NotificationCenterItem } from '../types/notificationCenter'
import {
  NOTIFICATION_CENTER_RELEVANT_AUDIT_ACTIONS,
  notificationSeverityForAuditAction,
  notificationTitleForAuditAction,
} from './notificationCenterAuditTrailMapping'

/** 由 Audit Trail 衍生通知項（Seq 27 骨架） */
export const buildNotificationCenterItems = (
  logs: AuditTrailRecord[],
  readIds: Set<string>,
): NotificationCenterItem[] =>
  logs
    .filter((log) => NOTIFICATION_CENTER_RELEVANT_AUDIT_ACTIONS.includes(log.action))
    .map((log) => {
      const id = log.remoteId ?? `${log.action}:${log.entityId}:${log.occurredAt}`
      return {
        id,
        title: notificationTitleForAuditAction(log.action),
        message: log.detail,
        severity: notificationSeverityForAuditAction(log.action),
        occurredAt: log.occurredAt,
        sourceAction: log.action,
        sourceEntityId: log.entityId,
        isRead: readIds.has(id),
      }
    })
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 50)
