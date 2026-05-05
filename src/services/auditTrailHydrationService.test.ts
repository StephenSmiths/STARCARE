import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  recordAuditTrailThenHydrate,
  recordAuditTrailThenHydrateWithService,
} from './auditTrailHydrationService'
import { AuditTrailService, globalAuditTrailService, type AuditTrailRecord } from './auditTrailService'

describe('auditTrailHydrationService.recordAuditTrailThenHydrate', () => {
  const baseEv: AuditTrailRecord = {
    action: 'CREATE',
    entityType: 'Resident',
    entityId: 'r1',
    actorId: 'a1',
    beforeState: null,
    afterState: '{}',
    detail: 't',
    occurredAt: '2026-05-02T12:00:00.000Z',
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('委派至 globalAuditTrailService.record（預設 skipRemotePersist=false）', () => {
    const recordSpy = vi.spyOn(globalAuditTrailService, 'record').mockImplementation(() => {})

    recordAuditTrailThenHydrate(baseEv)

    expect(recordSpy).toHaveBeenCalledTimes(1)
    expect(recordSpy).toHaveBeenCalledWith(baseEv, false)
  })

  it('skipRemotePersist=true 時傳入第二參數', () => {
    const recordSpy = vi.spyOn(globalAuditTrailService, 'record').mockImplementation(() => {})

    recordAuditTrailThenHydrate(baseEv, true)

    expect(recordSpy).toHaveBeenCalledWith(baseEv, true)
  })
})

describe('auditTrailHydrationService.recordAuditTrailThenHydrateWithService', () => {
  const baseEv: AuditTrailRecord = {
    action: 'SCHEDULING_RUN',
    entityType: 'Scheduling',
    entityId: 'run-test',
    actorId: 'al',
    beforeState: null,
    afterState: '{}',
    detail: 't',
    occurredAt: '2026-05-02T12:00:00.000Z',
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('委派至傳入之 AuditTrailService（預設 skipRemotePersist=false）', () => {
    const svc = new AuditTrailService()
    const recordSpy = vi.spyOn(svc, 'record').mockImplementation(() => {})

    recordAuditTrailThenHydrateWithService(svc, baseEv)

    expect(recordSpy).toHaveBeenCalledTimes(1)
    expect(recordSpy).toHaveBeenCalledWith(baseEv, false)
  })

  it('skipRemotePersist=true 時傳入 record 第二參數', () => {
    const svc = new AuditTrailService()
    const recordSpy = vi.spyOn(svc, 'record').mockImplementation(() => {})

    recordAuditTrailThenHydrateWithService(svc, baseEv, true)

    expect(recordSpy).toHaveBeenCalledWith(baseEv, true)
  })
})
