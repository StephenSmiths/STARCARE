/** @vitest-environment happy-dom */
/** PDF 02【3】：排班儲存 hook（防連點）與 persistence 閉環。 */
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingViewModel } from '../types/schedule'
import { useSchedulingSaveAssignments } from './useSchedulingSaveAssignments'

vi.mock('../../../services/schedulingPersistenceService', () => ({
  schedulingPersistenceService: { saveScheduleAssignments: vi.fn() },
}))

import { schedulingPersistenceService } from '../../../services/schedulingPersistenceService'

const viewModel: SchedulingViewModel = {
  assignments: [{ residentId: 'r1', residentName: '甲', sessionId: 's1', staffId: 'st', pass: 1 }],
  conflicts: [],
  underTargetResidents: [],
  previewSessions: [],
}

const makeHook = (result: SchedulingViewModel = viewModel) => {
  const setSaveError = vi.fn()
  const setSaveSuccess = vi.fn()
  const setIsSaving = vi.fn()
  const refreshLastBatchId = vi.fn()
  const { result: hook } = renderHook(() =>
    useSchedulingSaveAssignments('actor-s', result, setSaveError, setSaveSuccess, setIsSaving, refreshLastBatchId),
  )
  return { hook, setSaveError, setSaveSuccess, setIsSaving, refreshLastBatchId }
}

describe('useSchedulingSaveAssignments', () => {
  beforeEach(() => {
    vi.mocked(schedulingPersistenceService.saveScheduleAssignments).mockReset()
  })

  it('儲存成功：清錯誤、標成功、刷新批次 id', async () => {
    vi.mocked(schedulingPersistenceService.saveScheduleAssignments).mockResolvedValue(undefined)
    const h = makeHook()
    await act(async () => {
      await h.hook.current.saveScheduleAssignments()
    })
    expect(h.setSaveError).toHaveBeenCalledWith('')
    expect(h.setSaveSuccess).toHaveBeenCalledWith(false)
    expect(h.setIsSaving).toHaveBeenCalledWith(true)
    expect(h.setIsSaving).toHaveBeenLastCalledWith(false)
    expect(schedulingPersistenceService.saveScheduleAssignments).toHaveBeenCalledWith(
      'actor-s',
      viewModel.assignments,
      viewModel.conflicts,
    )
    expect(h.setSaveSuccess).toHaveBeenLastCalledWith(true)
    expect(h.refreshLastBatchId).toHaveBeenCalledTimes(1)
  })

  it('儲存失敗：寫入錯誤訊息', async () => {
    vi.mocked(schedulingPersistenceService.saveScheduleAssignments).mockRejectedValue(new Error('db down'))
    const h = makeHook()
    await act(async () => {
      await h.hook.current.saveScheduleAssignments()
    })
    expect(h.setSaveError).toHaveBeenLastCalledWith('db down')
    expect(h.setSaveSuccess).not.toHaveBeenCalledWith(true)
    expect(h.refreshLastBatchId).not.toHaveBeenCalled()
  })

  it('非 Error 拋值：使用固定後援句', async () => {
    vi.mocked(schedulingPersistenceService.saveScheduleAssignments).mockRejectedValue('x')
    const h = makeHook()
    await act(async () => {
      await h.hook.current.saveScheduleAssignments()
    })
    expect(h.setSaveError).toHaveBeenLastCalledWith('儲存排班結果時發生錯誤，請稍後再試。')
  })

  it('連點鎖：前次儲存未完成時不重入 persistence', async () => {
    let resolveSave!: () => void
    const pending = new Promise<void>((res) => {
      resolveSave = res
    })
    vi.mocked(schedulingPersistenceService.saveScheduleAssignments).mockReturnValue(pending)
    const h = makeHook()
    await act(async () => {
      void h.hook.current.saveScheduleAssignments()
    })
    await act(async () => {
      void h.hook.current.saveScheduleAssignments()
    })
    expect(schedulingPersistenceService.saveScheduleAssignments).toHaveBeenCalledTimes(1)
    await act(async () => {
      resolveSave()
      await pending
    })
    expect(h.refreshLastBatchId).toHaveBeenCalledTimes(1)
  })
})
