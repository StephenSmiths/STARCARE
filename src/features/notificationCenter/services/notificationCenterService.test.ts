import { describe, expect, it } from 'vitest'
import { buildNotificationCenterItems } from './notificationCenterService'
import type { AuditTrailRecord } from '../../../services/auditTrailService'

const row = (action: AuditTrailRecord['action'], detail: string, occurredAt: string): AuditTrailRecord => ({
  action,
  entityType: 'Reporting',
  entityId: 'e1',
  actorId: 'u1',
  beforeState: null,
  afterState: null,
  detail,
  occurredAt,
})

describe('notificationCenterService', () => {
  it('應只取通知相關 action 並可標記已讀', () => {
    const logs = [
      row('CREATE', 'ignore', '2026-05-01T09:00:00.000Z'),
      row('AI_REPORT_CENTER_DISTRIBUTE', 'report', '2026-05-01T10:00:00.000Z'),
    ]
    const items = buildNotificationCenterItems(logs, new Set())
    expect(items).toHaveLength(1)
    expect(items[0].title).toContain('AI 報告')
    const read = buildNotificationCenterItems(logs, new Set([items[0].id]))
    expect(read[0].isRead).toBe(true)
  })
})
