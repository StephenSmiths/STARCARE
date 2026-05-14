/** @vitest-environment happy-dom */
/** PDF 02【3】：智能排班儀表板主內容（Seq 15；`useSchedulingDashboardViewModel` 窄 mock）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthContextValue } from '../../auth/context/authContext'
import type { AuditTrailRecord } from '../../../services/auditTrailService'
import type { SchedulingWorkspaceReturn } from '../utils/buildSchedulingWorkspaceReturn'
import { SchedulingDashboard } from './SchedulingDashboard'

vi.mock('../hooks/useSchedulingDashboardViewModel', () => ({
  useSchedulingDashboardViewModel: vi.fn(),
}))

vi.mock('../../auth', () => ({
  useAuth: vi.fn(),
  useAuthActorId: vi.fn(() => 'actor-dashboard'),
}))

vi.mock('../../activitySessions/hooks/useActivitySessionImportDryRun', () => ({
  useActivitySessionImportDryRun: vi.fn(() => ({
    isBusy: false,
    errorMessage: '',
    parseErrors: [],
    result: null,
    commitMessage: '',
    lastRunSummary: null,
    runHistory: [],
    validateCsvText: vi.fn(),
    validateWeeklyRosterSheetText: vi.fn(),
    commitValidatedRows: vi.fn(),
    reset: vi.fn(),
  })),
}))

import { useAuth } from '../../auth'
import { useSchedulingDashboardViewModel } from '../hooks/useSchedulingDashboardViewModel'

type DashboardVm = SchedulingWorkspaceReturn & {
  rosterConfirmed: boolean
  setRosterConfirmed: (v: boolean) => void
  runBlockedReason: string | undefined
  auditTrail: AuditTrailRecord[]
}

const buildAuth = (overrides: Partial<AuthContextValue>): AuthContextValue => ({
  session: null,
  user: null,
  role: 'Admin',
  isLoading: false,
  isConfigured: false,
  hasPermission: () => true,
  canApproveForm: () => false,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  ...overrides,
})

const vmBase = (): DashboardVm => ({
  totalResidents: 2,
  compliantCount: 1,
  pendingSlots: 1,
  sessionCount: 1,
  reloadSchedulingData: vi.fn(),
  tableRows: [],
  assignments: [],
  conflicts: [],
  underTargetResidents: [],
  runScheduling: vi.fn(),
  saveScheduleAssignments: vi.fn(),
  isRunning: false,
  isSaving: false,
  loadError: '',
  saveError: '',
  saveSuccess: false,
  canSave: false,
  exportWeeklyComplianceCsv: vi.fn(),
  exportComplianceAlertsCsv: vi.fn(),
  exportKpiTrendCsv: vi.fn(),
  clearKpiTrendHistory: vi.fn(),
  kpiSyncError: '',
  kpiSyncNotice: '',
  hasPendingKpiSync: false,
  retryKpiSync: vi.fn(),
  isRetryingKpiSync: false,
  historyFilter: { from: '', to: '', actorId: '' },
  applyHistoryFilter: vi.fn(),
  resetHistoryFilter: vi.fn(),
  isApplyingKpiFilter: false,
  kpis: { coverageRate: 5, conflictRatePer100: 0, averageAssignmentsPerResident: 0.2, underTargetRate: 10 },
  kpiRunHistory: [],
  complianceAlerts: [],
  lastSchedulingBatchId: null,
  undoLastSchedulingBatch: vi.fn(),
  isUndoingSchedulingBatch: false,
  staffProfilesLoadDegraded: false,
  rosterConfirmed: true,
  setRosterConfirmed: vi.fn(),
  runBlockedReason: undefined,
  auditTrail: [],
})

afterEach(() => {
  cleanup()
})

describe('SchedulingDashboard', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(buildAuth({ role: 'Admin' }))
    vi.mocked(useSchedulingDashboardViewModel).mockReturnValue(vmBase())
  })

  it('渲染工具列、院友表與審計標題', () => {
    render(<SchedulingDashboard />)
    expect(screen.getByRole('heading', { name: '智能排班儀表板' })).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('院友本週資助復康次數')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('排班與相關操作審計')).toBeInstanceOf(HTMLElement)
  })

  it('loadError 透傳至警示區', () => {
    vi.mocked(useSchedulingDashboardViewModel).mockReturnValue({
      ...vmBase(),
      loadError: '載入期間發生錯誤',
    })
    render(<SchedulingDashboard />)
    expect(screen.getByText('載入期間發生錯誤')).toBeInstanceOf(HTMLElement)
  })

  it('runBlockedReason 透傳為啟動按鈕 title', () => {
    vi.mocked(useSchedulingDashboardViewModel).mockReturnValue({
      ...vmBase(),
      runBlockedReason: '請先完成步驟②',
    })
    render(<SchedulingDashboard />)
    const runBtn = screen.getByRole('button', { name: '啟動智能排班' }) as HTMLButtonElement
    expect(runBtn.disabled).toBe(true)
    expect(runBtn.getAttribute('title')).toBe('請先完成步驟②')
  })

  it('勾選週更確認會呼叫 setRosterConfirmed', () => {
    const setRosterConfirmed = vi.fn()
    vi.mocked(useSchedulingDashboardViewModel).mockReturnValue({
      ...vmBase(),
      rosterConfirmed: false,
      setRosterConfirmed,
    })
    render(<SchedulingDashboard />)
    const box = screen.getByRole('checkbox', { name: /我已確認本週更表/ }) as HTMLInputElement
    expect(box.disabled).toBe(false)
    fireEvent.click(box)
    expect(setRosterConfirmed).toHaveBeenCalledWith(true)
  })
})
