import { describe, expect, it, vi } from 'vitest'
import type { SchedulingKpiSnapshot } from '../../../services/schedulingKpiService'
import type { SchedulingAssignment, SchedulingConflict } from '../../../services/schedulingService'
import {
  buildSchedulingWorkspaceReturn,
  type BuildSchedulingWorkspaceReturnInput,
} from './buildSchedulingWorkspaceReturn'
import type { ResidentTableRow } from '../types/residentTableRow'
import type { SchedulingViewModel } from '../types/schedule'

const asyncNoop = async () => {}
const noop = () => {}

const emptyKpis: SchedulingKpiSnapshot = {
  coverageRate: 0,
  conflictRatePer100: 0,
  averageAssignmentsPerResident: 0,
  underTargetRate: 0,
}

const minimalInput = (over: Partial<BuildSchedulingWorkspaceReturnInput>): BuildSchedulingWorkspaceReturnInput => ({
  stats: { totalResidents: 0, compliantCount: 0, pendingSlots: 0 },
  sessionCount: 0,
  reloadSchedulingData: asyncNoop,
  tableRows: [] as ResidentTableRow[],
  result: {
    assignments: [],
    conflicts: [],
    underTargetResidents: [],
    previewSessions: [],
  } satisfies SchedulingViewModel,
  runScheduling: asyncNoop,
  saveScheduleAssignments: asyncNoop,
  isRunning: false,
  isSaving: false,
  loadError: '',
  saveError: '',
  saveSuccess: false,
  exportWeeklyComplianceCsv: noop,
  exportComplianceAlertsCsv: noop,
  exportKpiTrendCsv: noop,
  clearKpiTrendHistory: noop,
  kpiSyncError: '',
  kpiSyncNotice: '',
  hasPendingKpiSync: false,
  retryKpiSync: asyncNoop,
  isRetryingKpiSync: false,
  historyFilter: { from: '', to: '', actorId: '' },
  applyHistoryFilter: asyncNoop,
  resetHistoryFilter: asyncNoop,
  isApplyingKpiFilter: false,
  kpis: emptyKpis,
  kpiRunHistory: [],
  complianceAlerts: [],
  lastSchedulingBatchId: null,
  undoLastSchedulingBatch: asyncNoop,
  isUndoingSchedulingBatch: false,
  staffProfilesLoadDegraded: false,
  ...over,
})

describe('buildSchedulingWorkspaceReturn', () => {
  it('canSave：有指派且無衝突時為 true', () => {
    const a: SchedulingAssignment = {
      residentId: 'r1',
      residentName: '甲',
      sessionId: 's1',
      staffId: 'st1',
      pass: 1,
    }
    const ret = buildSchedulingWorkspaceReturn(
      minimalInput({
        result: { assignments: [a], conflicts: [], underTargetResidents: [], previewSessions: [] },
      }),
    )
    expect(ret.canSave).toBe(true)
    expect(ret.assignments).toEqual([a])
    expect(ret.conflicts).toEqual([])
  })

  it('canSave：有衝突時為 false（即使已有指派）', () => {
    const c: SchedulingConflict = {
      residentId: 'r1',
      residentName: '甲',
      type: 'NO_CAPACITY',
      reason: '滿額',
    }
    const ret = buildSchedulingWorkspaceReturn(
      minimalInput({
        result: {
          assignments: [
            {
              residentId: 'r1',
              residentName: '甲',
              sessionId: 's1',
              staffId: 'st1',
              pass: 1,
            },
          ],
          conflicts: [c],
          underTargetResidents: [],
          previewSessions: [],
        },
      }),
    )
    expect(ret.canSave).toBe(false)
    expect(ret.conflicts).toEqual([c])
  })

  it('透傳 stats、sessionCount 與 staffProfilesLoadDegraded', () => {
    const reload = vi.fn(async () => {})
    const ret = buildSchedulingWorkspaceReturn(
      minimalInput({
        stats: { totalResidents: 5, compliantCount: 2, pendingSlots: 1 },
        sessionCount: 3,
        staffProfilesLoadDegraded: true,
        reloadSchedulingData: reload,
      }),
    )
    expect(ret.totalResidents).toBe(5)
    expect(ret.compliantCount).toBe(2)
    expect(ret.pendingSlots).toBe(1)
    expect(ret.sessionCount).toBe(3)
    expect(ret.staffProfilesLoadDegraded).toBe(true)
    expect(ret.reloadSchedulingData).toBe(reload)
  })
})
