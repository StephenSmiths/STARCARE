/** @vitest-environment happy-dom */
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'
import type { SchedulingResident } from '../../../services/schedulingService'
import { useSchedulingCsvExports } from './useSchedulingCsvExports'

vi.mock('../../../services/weeklyComplianceCsvService', () => ({
  downloadWeeklyComplianceCsv: vi.fn(),
}))

vi.mock('../../../services/schedulingComplianceAlertCsvService', () => ({
  downloadSchedulingComplianceAlertsCsv: vi.fn(),
}))

vi.mock('../services/schedulingCsvExportAuditService', () => ({
  recordWeeklyComplianceExportAudit: vi.fn(),
  recordComplianceAlertsExportAudit: vi.fn(),
}))

import { downloadWeeklyComplianceCsv } from '../../../services/weeklyComplianceCsvService'
import { downloadSchedulingComplianceAlertsCsv } from '../../../services/schedulingComplianceAlertCsvService'
import {
  recordComplianceAlertsExportAudit,
  recordWeeklyComplianceExportAudit,
} from '../services/schedulingCsvExportAuditService'

const resident: SchedulingResident = {
  id: 'r1',
  name: '王姑娘',
  fundingType: 'Voucher',
  isSpecialCareCase: false,
  weeklyCompletedCount: 2,
  assignedDates: [],
}

const alert: SchedulingComplianceAlert = {
  code: 'MIDWEEK_SUBSIDIZED_ZERO',
  level: 'high',
  residentId: 'r1',
  residentName: '王姑娘',
  fundingType: 'Voucher',
  message: '週三提醒',
}

describe('useSchedulingCsvExports', () => {
  beforeEach(() => {
    vi.mocked(downloadWeeklyComplianceCsv).mockClear()
    vi.mocked(downloadSchedulingComplianceAlertsCsv).mockClear()
    vi.mocked(recordWeeklyComplianceExportAudit).mockClear()
    vi.mocked(recordComplianceAlertsExportAudit).mockClear()
  })

  it('exportWeeklyComplianceCsv：下載列含達標旗標並寫審計', () => {
    const { result } = renderHook(() => useSchedulingCsvExports('actor-x', [resident], []))
    act(() => {
      result.current.exportWeeklyComplianceCsv()
    })
    expect(downloadWeeklyComplianceCsv).toHaveBeenCalledWith([
      { name: '王姑娘', fundingType: 'Voucher', isCompliant: true },
    ])
    expect(recordWeeklyComplianceExportAudit).toHaveBeenCalledWith('actor-x', 1)
  })

  it('exportComplianceAlertsCsv：無警示時不呼叫下載與審計', () => {
    const { result } = renderHook(() => useSchedulingCsvExports('actor-x', [resident], []))
    act(() => {
      result.current.exportComplianceAlertsCsv()
    })
    expect(downloadSchedulingComplianceAlertsCsv).not.toHaveBeenCalled()
    expect(recordComplianceAlertsExportAudit).not.toHaveBeenCalled()
  })

  it('exportComplianceAlertsCsv：有警示時下載並寫審計', () => {
    const { result } = renderHook(() => useSchedulingCsvExports('actor-y', [resident], [alert]))
    act(() => {
      result.current.exportComplianceAlertsCsv()
    })
    expect(downloadSchedulingComplianceAlertsCsv).toHaveBeenCalledWith([alert])
    expect(recordComplianceAlertsExportAudit).toHaveBeenCalledWith('actor-y', 1)
  })
})
