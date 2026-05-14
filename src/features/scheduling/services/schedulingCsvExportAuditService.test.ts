import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../services/auditTrailHydrationService', () => ({
  recordAuditTrailThenHydrate: vi.fn(),
}))

import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import {
  recordComplianceAlertsExportAudit,
  recordWeeklyComplianceExportAudit,
} from './schedulingCsvExportAuditService'

describe('schedulingCsvExportAuditService（排班 CSV 匯出審計）', () => {
  beforeEach(() => {
    vi.mocked(recordAuditTrailThenHydrate).mockClear()
  })

  it('recordWeeklyComplianceExportAudit：寫入本週合規匯出事件與院友人數', () => {
    recordWeeklyComplianceExportAudit('actor-1', 8)
    expect(recordAuditTrailThenHydrate).toHaveBeenCalledTimes(1)
    const ev = vi.mocked(recordAuditTrailThenHydrate).mock.calls[0][0]
    expect(ev.action).toBe('WEEKLY_COMPLIANCE_EXPORT')
    expect(ev.entityType).toBe('Reporting')
    expect(ev.actorId).toBe('actor-1')
    expect(ev.beforeState).toBe(null)
    expect(JSON.parse(ev.afterState!)).toEqual({ residentCount: 8 })
    expect(ev.detail).toContain('合規')
    expect(ev.entityId).toMatch(/^weekly-compliance-\d+$/)
  })

  it('recordComplianceAlertsExportAudit：寫入週三提醒匯出事件與警示筆數', () => {
    recordComplianceAlertsExportAudit('actor-2', 3)
    expect(recordAuditTrailThenHydrate).toHaveBeenCalledTimes(1)
    const ev = vi.mocked(recordAuditTrailThenHydrate).mock.calls[0][0]
    expect(ev.action).toBe('COMPLIANCE_ALERT_EXPORT')
    expect(ev.entityType).toBe('Reporting')
    expect(ev.actorId).toBe('actor-2')
    expect(JSON.parse(ev.afterState!)).toEqual({ alertCount: 3 })
    expect(ev.detail).toContain('週三')
    expect(ev.entityId).toMatch(/^midweek-alerts-\d+$/)
  })
})
