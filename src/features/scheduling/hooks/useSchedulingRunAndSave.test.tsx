/** @vitest-environment happy-dom */
/** PDF 02【3】：乾跑與儲存子 hook 委派參數與回傳透傳。 */
import type { Dispatch, SetStateAction } from 'react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingResident } from '../../../services/schedulingService'
import type { SchedulingViewModel } from '../types/schedule'
import { useSchedulingRunAndSave } from './useSchedulingRunAndSave'

vi.mock('./useSchedulingRunDryRun', () => ({
  useSchedulingRunDryRun: vi.fn(() => ({ runScheduling: vi.fn() })),
}))

vi.mock('./useSchedulingSaveAssignments', () => ({
  useSchedulingSaveAssignments: vi.fn(() => ({ saveScheduleAssignments: vi.fn() })),
}))

import { useSchedulingRunDryRun } from './useSchedulingRunDryRun'
import { useSchedulingSaveAssignments } from './useSchedulingSaveAssignments'

describe('useSchedulingRunAndSave', () => {
  it('將參數傳入乾跑與儲存子 hook，並回傳兩者之函式', () => {
    const runScheduling = vi.fn()
    const saveScheduleAssignments = vi.fn()
    vi.mocked(useSchedulingRunDryRun).mockReturnValue({ runScheduling })
    vi.mocked(useSchedulingSaveAssignments).mockReturnValue({ saveScheduleAssignments })

    const setResidents = vi.fn()
    const setResult = vi.fn()
    const setLoadError = vi.fn()
    const setSaveSuccess = vi.fn()
    const setSaveError = vi.fn()
    const setIsRunning = vi.fn()
    const setIsSaving = vi.fn()
    const setKpiRunHistory = vi.fn()
    const appendKpiRunRecord = vi.fn()
    const refreshLastBatchId = vi.fn()

    const result: SchedulingViewModel = {
      assignments: [],
      conflicts: [],
      underTargetResidents: [],
    }

    const { result: hook } = renderHook(() =>
      useSchedulingRunAndSave(
        'actor-r',
        'facility-r',
        result,
        setResidents as Dispatch<SetStateAction<SchedulingResident[]>>,
        setResult as Dispatch<SetStateAction<SchedulingViewModel>>,
        setLoadError,
        setSaveSuccess,
        setSaveError,
        setIsRunning,
        setIsSaving,
        setKpiRunHistory as Dispatch<SetStateAction<SchedulingKpiRunRecord[]>>,
        appendKpiRunRecord,
        refreshLastBatchId,
      ),
    )

    expect(useSchedulingRunDryRun).toHaveBeenCalledWith(
      'actor-r',
      'facility-r',
      setResidents,
      setResult,
      setLoadError,
      setSaveSuccess,
      setSaveError,
      setIsRunning,
      setKpiRunHistory,
      appendKpiRunRecord,
    )
    expect(useSchedulingSaveAssignments).toHaveBeenCalledWith(
      'actor-r',
      result,
      setSaveError,
      setSaveSuccess,
      setIsSaving,
      refreshLastBatchId,
    )
    expect(hook.current.runScheduling).toBe(runScheduling)
    expect(hook.current.saveScheduleAssignments).toBe(saveScheduleAssignments)
  })
})
