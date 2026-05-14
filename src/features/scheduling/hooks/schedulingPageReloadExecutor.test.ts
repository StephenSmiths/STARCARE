import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/schedulingReloadPageData', () => ({
  runSchedulingReloadPageData: vi.fn(),
}))

vi.mock('../../../services/schedulingConfigService', () => ({
  getStaffProfilesUnavailableLastList: vi.fn(),
  schedulingConfigService: {},
}))

import { getStaffProfilesUnavailableLastList } from '../../../services/schedulingConfigService'
import { runSchedulingReloadPageData } from '../services/schedulingReloadPageData'
import { SCHEDULING_DATA_LOAD_ERROR_MESSAGE } from '../services/schedulingDataLoadMessage'
import { executeSchedulingPageReload } from './schedulingPageReloadExecutor'
import type { SchedulingResident } from '../../../services/schedulingService'

const residentRow: SchedulingResident = {
  id: 'r-1',
  name: '測',
  fundingType: 'Private',
  isSpecialCareCase: false,
  weeklyCompletedCount: 0,
  assignedDates: [],
}

const writers = () => ({
  setLoadError: vi.fn(),
  setStaffProfilesLoadDegraded: vi.fn(),
  setResidents: vi.fn(),
  setSessionCount: vi.fn(),
  clearPreviewState: vi.fn(),
})

describe('executeSchedulingPageReload', () => {
  beforeEach(() => {
    vi.mocked(runSchedulingReloadPageData).mockReset()
    vi.mocked(getStaffProfilesUnavailableLastList).mockReturnValue(false)
  })

  it('成功時寫入院友副本、時段筆數與員工主檔降級旗標', async () => {
    vi.mocked(runSchedulingReloadPageData).mockResolvedValue({
      ok: true,
      schedulingResidents: [residentRow],
      sessionCount: 4,
    })
    const w = writers()
    await executeSchedulingPageReload('facility-main', w)
    expect(runSchedulingReloadPageData).toHaveBeenCalledWith(
      'facility-main',
      expect.objectContaining({
        listActiveResidents: expect.any(Function),
        listSchedulingSessions: expect.any(Function),
        prefetchRules: expect.any(Function),
      }),
    )
    expect(w.setLoadError).toHaveBeenNthCalledWith(1, '')
    expect(w.setResidents).toHaveBeenCalledTimes(1)
    expect(w.setResidents.mock.calls[0][0]).toEqual([residentRow])
    expect(w.setSessionCount).toHaveBeenCalledWith(4)
    expect(w.setStaffProfilesLoadDegraded).toHaveBeenCalledWith(false)
    expect(w.clearPreviewState).not.toHaveBeenCalled()
  })

  it('clearPreview 為 true 時清空預覽狀態', async () => {
    vi.mocked(runSchedulingReloadPageData).mockResolvedValue({
      ok: true,
      schedulingResidents: [residentRow],
      sessionCount: 1,
    })
    const w = writers()
    await executeSchedulingPageReload('facility-main', w, { clearPreview: true })
    expect(w.clearPreviewState).toHaveBeenCalledTimes(1)
  })

  it('載入失敗時寫入錯誤句並重置降級旗標，不更新院友／時段', async () => {
    vi.mocked(runSchedulingReloadPageData).mockResolvedValue({
      ok: false,
      loadError: SCHEDULING_DATA_LOAD_ERROR_MESSAGE,
    })
    const w = writers()
    await executeSchedulingPageReload('facility-main', w)
    expect(w.setLoadError).toHaveBeenLastCalledWith(SCHEDULING_DATA_LOAD_ERROR_MESSAGE)
    expect(w.setStaffProfilesLoadDegraded).toHaveBeenLastCalledWith(false)
    expect(w.setResidents).not.toHaveBeenCalled()
    expect(w.setSessionCount).not.toHaveBeenCalled()
  })
})
