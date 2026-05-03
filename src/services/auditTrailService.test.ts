import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  AuditTrailService,
  registerAuditTrailPersistence,
  type AuditTrailRecord,
} from './auditTrailService'

describe('AuditTrailService', () => {
  afterEach(() => {
    registerAuditTrailPersistence(null)
  })

  it('record 會呼叫已註冊之落庫函式且不阻斷記憶體寫入', async () => {
    const persist = vi.fn().mockResolvedValue(undefined)
    registerAuditTrailPersistence(persist)
    const svc = new AuditTrailService()
    const ev: AuditTrailRecord = {
      action: 'CREATE',
      entityType: 'Resident',
      entityId: 'r1',
      actorId: 'a1',
      beforeState: null,
      afterState: '{}',
      detail: 't',
      occurredAt: new Date().toISOString(),
    }
    svc.record(ev)
    expect(svc.list()[0]).toEqual(ev)
    await vi.waitFor(() => expect(persist).toHaveBeenCalledWith(ev))
  })

  it('record 會通知訂閱者；mergeRemoteRecords 合併遠端列', () => {
    const svc = new AuditTrailService()
    const sub = vi.fn()
    svc.subscribe(sub)
    svc.record({
      action: 'UPDATE',
      entityType: 'Staff',
      entityId: 's1',
      actorId: 'a1',
      beforeState: null,
      afterState: null,
      detail: 'local',
      occurredAt: '2026-05-02T10:00:00.000Z',
    })
    expect(sub).toHaveBeenCalled()
    svc.mergeRemoteRecords([
      {
        remoteId: 'uuid-1',
        action: 'CREATE',
        entityType: 'Resident',
        entityId: 'r9',
        actorId: 'a1',
        beforeState: null,
        afterState: null,
        detail: 'db',
        occurredAt: '2026-05-02T11:00:00.000Z',
      },
    ])
    expect(svc.list()[0].remoteId).toBe('uuid-1')
    expect(svc.list().some((r) => r.detail === 'local')).toBe(true)
  })
})
