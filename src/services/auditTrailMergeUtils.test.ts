import { describe, expect, it } from 'vitest'
import { mergeRemoteAuditTrail } from './auditTrailMergeUtils'
import type { AuditTrailRecord } from './auditTrailService'

describe('mergeRemoteAuditTrail', () => {
  it('應保留無 remoteId 且指紋不與遠端衝突之本機列', () => {
    const remote: AuditTrailRecord[] = [
      {
        remoteId: 'db-1',
        action: 'FORM_SUBMIT',
        entityType: 'Reporting',
        entityId: 'f1',
        actorId: 'u1',
        beforeState: null,
        afterState: null,
        detail: 'x',
        occurredAt: '2026-05-02T12:00:00.000Z',
      },
    ]
    const current: AuditTrailRecord[] = [
      ...remote,
      {
        action: 'SYSTEM_SETTINGS_SAVE',
        entityType: 'Scheduling',
        entityId: 'cfg',
        actorId: 'u1',
        beforeState: null,
        afterState: null,
        detail: '僅本機',
        occurredAt: '2026-05-02T12:30:00.000Z',
      },
    ]
    const merged = mergeRemoteAuditTrail(remote, current)
    expect(merged.find((r) => r.detail === '僅本機')).toBeTruthy()
    expect(merged[0].occurredAt >= merged[merged.length - 1].occurredAt).toBe(true)
  })
})
