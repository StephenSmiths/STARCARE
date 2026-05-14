/** @vitest-environment happy-dom */
/** PDF 02【3】：乾跑 hook（防連點）與 orchestration 結果分支。 */
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingResident } from '../../../services/schedulingService'
import { SCHEDULING_DATA_LOAD_ERROR_MESSAGE } from '../services/schedulingDataLoadMessage'
import { useSchedulingRunDryRun } from './useSchedulingRunDryRun'
import type { SchedulingViewModel } from '../types/schedule'

vi.mock('../services/runSubsidizedRehabSchedulingOrchestration', () => ({
  runSubsidizedRehabSchedulingOrchestration: vi.fn(),
}))

import { runSubsidizedRehabSchedulingOrchestration } from '../services/runSubsidizedRehabSchedulingOrchestration'

const nextResident: SchedulingResident = {
  id: 'r1',
  name: '測',
  fundingType: 'Private',
  isSpecialCareCase: false,
  weeklyCompletedCount: 0,
  assignedDates: [],
}

const viewModel: SchedulingViewModel = {
  assignments: [{ residentId: 'r1', residentName: '測', sessionId: 's1', staffId: 'st', pass: 1 }],
  conflicts: [],
  underTargetResidents: [],
}

const kpiRecord: SchedulingKpiRunRecord = {
  ranAt: '2026-05-09T00:00:00.000Z',
  kpis: {
    coverageRate: 100,
    conflictRatePer100: 0,
    averageAssignmentsPerResident: 1,
    underTargetRate: 0,
  },
  residentCount: 1,
  assignmentCount: 1,
  conflictCount: 0,
  actorId: 'actor-1',
}

const makeHook = () => {
  const setResidents = vi.fn()
  const setResult = vi.fn()
  const setLoadError = vi.fn()
  const setSaveSuccess = vi.fn()
  const setSaveError = vi.fn()
  const setIsRunning = vi.fn()
  const setKpiRunHistory = vi.fn()
  const appendKpiRunRecord = vi.fn()
  const { result } = renderHook(() =>
    useSchedulingRunDryRun(
      'actor-1',
      'facility-main',
      setResidents,
      setResult,
      setLoadError,
      setSaveSuccess,
      setSaveError,
      setIsRunning,
      setKpiRunHistory,
      appendKpiRunRecord,
    ),
  )
  return {
    result,
    setResidents,
    setResult,
    setLoadError,
    setSaveSuccess,
    setSaveError,
    setIsRunning,
    setKpiRunHistory,
    appendKpiRunRecord,
  }
}

describe('useSchedulingRunDryRun', () => {
  beforeEach(() => {
    vi.mocked(runSubsidizedRehabSchedulingOrchestration).mockReset()
  })

  it('乾跑成功：更新院友、結果並附加 KPI 列', async () => {
    vi.mocked(runSubsidizedRehabSchedulingOrchestration).mockResolvedValue({
      kind: 'ok',
      nextResidents: [nextResident],
      viewModel,
      kpiRecord,
    })
    const h = makeHook()
    await act(async () => {
      await h.result.current.runScheduling()
    })
    expect(h.setSaveSuccess).toHaveBeenCalledWith(false)
    expect(h.setSaveError).toHaveBeenCalledWith('')
    expect(h.setIsRunning).toHaveBeenCalledWith(true)
    expect(h.setIsRunning).toHaveBeenLastCalledWith(false)
    expect(h.setResidents).toHaveBeenCalledWith([nextResident])
    expect(h.setResult).toHaveBeenCalledWith(viewModel)
    expect(h.appendKpiRunRecord).toHaveBeenCalledWith(kpiRecord)
    expect(h.setLoadError).not.toHaveBeenCalled()
  })

  it('無資助復康院友：清空院友、結果與 KPI 歷史', async () => {
    vi.mocked(runSubsidizedRehabSchedulingOrchestration).mockResolvedValue({ kind: 'empty' })
    const h = makeHook()
    await act(async () => {
      await h.result.current.runScheduling()
    })
    expect(h.setResidents).toHaveBeenCalledWith([])
    expect(h.setResult).toHaveBeenCalledWith({
      assignments: [],
      conflicts: [],
      underTargetResidents: [],
    })
    expect(h.setKpiRunHistory).toHaveBeenCalledWith([])
    expect(h.appendKpiRunRecord).not.toHaveBeenCalled()
  })

  it('編排解錯：寫入固定載入錯句', async () => {
    vi.mocked(runSubsidizedRehabSchedulingOrchestration).mockResolvedValue({ kind: 'error' })
    const h = makeHook()
    await act(async () => {
      await h.result.current.runScheduling()
    })
    expect(h.setLoadError).toHaveBeenCalledWith(SCHEDULING_DATA_LOAD_ERROR_MESSAGE)
    expect(h.setResidents).not.toHaveBeenCalled()
    expect(h.appendKpiRunRecord).not.toHaveBeenCalled()
  })

  it('連點鎖：前次乾跑未完成時不重入 orchestration', async () => {
    let resolveRun!: (v: { kind: 'ok'; nextResidents: SchedulingResident[]; viewModel: SchedulingViewModel; kpiRecord: SchedulingKpiRunRecord }) => void
    const pending = new Promise<{ kind: 'ok'; nextResidents: SchedulingResident[]; viewModel: SchedulingViewModel; kpiRecord: SchedulingKpiRunRecord }>((res) => {
      resolveRun = res
    })
    vi.mocked(runSubsidizedRehabSchedulingOrchestration).mockReturnValue(pending)
    const h = makeHook()
    await act(async () => {
      void h.result.current.runScheduling()
    })
    await act(async () => {
      void h.result.current.runScheduling()
    })
    expect(runSubsidizedRehabSchedulingOrchestration).toHaveBeenCalledTimes(1)
    await act(async () => {
      resolveRun({
        kind: 'ok',
        nextResidents: [nextResident],
        viewModel,
        kpiRecord,
      })
      await pending
    })
    expect(h.appendKpiRunRecord).toHaveBeenCalledTimes(1)
  })
})
