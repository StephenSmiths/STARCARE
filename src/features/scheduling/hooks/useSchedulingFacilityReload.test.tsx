/** @vitest-environment happy-dom */
/** PDF 02【3】：院舍重載 hook 與 **`executeSchedulingPageReload`** 閉環。 */
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingResident } from '../../../services/schedulingService'
import { useSchedulingFacilityReload } from './useSchedulingFacilityReload'

vi.mock('../../systemSettings', () => ({
  useInvalidateOnSystemSettingsExternalChange: vi.fn(),
}))

vi.mock('./schedulingPageReloadExecutor', () => ({
  executeSchedulingPageReload: vi.fn(),
}))

import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import { executeSchedulingPageReload } from './schedulingPageReloadExecutor'

const sampleResident: SchedulingResident = {
  id: 'r-1',
  name: '載入測試',
  fundingType: 'Private',
  isSpecialCareCase: false,
  weeklyCompletedCount: 0,
  assignedDates: [],
}

describe('useSchedulingFacilityReload', () => {
  const clearPreviewState = vi.fn()

  beforeEach(() => {
    vi.mocked(executeSchedulingPageReload).mockReset()
    vi.mocked(useInvalidateOnSystemSettingsExternalChange).mockReset()
    clearPreviewState.mockClear()
    vi.mocked(executeSchedulingPageReload).mockImplementation(async (_fid, writers, options) => {
      writers.setLoadError('')
      writers.setResidents([sampleResident])
      writers.setSessionCount(2)
      writers.setStaffProfilesLoadDegraded(true)
      if (options?.clearPreview) {
        writers.clearPreviewState()
      }
    })
  })

  it('掛載後 queueMicrotask 觸發重載並寫入 state', async () => {
    const { result } = renderHook(() => useSchedulingFacilityReload('facility-main', clearPreviewState))
    await waitFor(() => {
      expect(result.current.residents).toEqual([sampleResident])
    })
    expect(result.current.sessionCount).toBe(2)
    expect(result.current.staffProfilesLoadDegraded).toBe(true)
    expect(executeSchedulingPageReload).toHaveBeenCalledWith(
      'facility-main',
      expect.objectContaining({
        setLoadError: expect.any(Function),
        setResidents: expect.any(Function),
        setSessionCount: expect.any(Function),
        setStaffProfilesLoadDegraded: expect.any(Function),
        clearPreviewState,
      }),
      undefined,
    )
    expect(useInvalidateOnSystemSettingsExternalChange).toHaveBeenCalled()
  })

  it('reloadSchedulingData({ clearPreview: true }) 轉發至 executor', async () => {
    const { result } = renderHook(() => useSchedulingFacilityReload('f-x', clearPreviewState))
    await waitFor(() => expect(result.current.sessionCount).toBe(2))
    vi.mocked(executeSchedulingPageReload).mockClear()
    await act(async () => {
      await result.current.reloadSchedulingData({ clearPreview: true })
    })
    expect(executeSchedulingPageReload).toHaveBeenCalledWith(
      'f-x',
      expect.any(Object),
      { clearPreview: true },
    )
    expect(clearPreviewState).toHaveBeenCalledTimes(1)
  })
})
