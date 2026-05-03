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
  it('應納入 FORM_SOFT_DELETE（Seq 10／通知中心）', () => {
    const logs = [row('FORM_SOFT_DELETE', '軟刪除服務表單', '2026-05-01T11:00:00.000Z')]
    const items = buildNotificationCenterItems(logs, new Set())
    expect(items).toHaveLength(1)
    expect(items[0].title).toContain('軟刪除')
    expect(items[0].severity).toBe('medium')
  })

  it('應納入 SCHEDULING_HISTORY_BATCH_SOFT_DELETE（Seq 10／27）', () => {
    const logs = [
      row('SCHEDULING_HISTORY_BATCH_SOFT_DELETE', '軟刪除 scheduling_history 批次', '2026-05-02T08:00:00.000Z'),
    ]
    const items = buildNotificationCenterItems(logs, new Set())
    expect(items).toHaveLength(1)
    expect(items[0].title).toContain('排班歷史')
    expect(items[0].severity).toBe('medium')
  })

  it('應納入表單提交／核准／退回（Seq 17／20／27）', () => {
    const logs = [
      row('FORM_SUBMIT', '提交服務表單待審', '2026-05-01T12:00:00.000Z'),
      row('FORM_APPROVE', '核准', '2026-05-01T12:01:00.000Z'),
      row('FORM_REJECT_REVISION', '退回', '2026-05-01T12:02:00.000Z'),
    ]
    const items = buildNotificationCenterItems(logs, new Set())
    expect(items).toHaveLength(3)
    expect(items.map((i) => i.title)).toEqual([
      '服務表單已退回修改',
      '服務表單已核准',
      '服務表單待審',
    ])
    expect(items.find((i) => i.sourceAction === 'FORM_SUBMIT')?.severity).toBe('medium')
    expect(items.find((i) => i.sourceAction === 'FORM_APPROVE')?.severity).toBe('low')
  })

  it('有 remoteId 時通知 id 應使用 remoteId（跨工作階段穩定）', () => {
    const logs: AuditTrailRecord[] = [
      {
        remoteId: 'evt-uuid',
        action: 'FORM_SUBMIT',
        entityType: 'Reporting',
        entityId: 'e1',
        actorId: 'u1',
        beforeState: null,
        afterState: null,
        detail: 'd',
        occurredAt: '2026-05-02T13:00:00.000Z',
      },
    ]
    const items = buildNotificationCenterItems(logs, new Set())
    expect(items[0].id).toBe('evt-uuid')
  })

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
