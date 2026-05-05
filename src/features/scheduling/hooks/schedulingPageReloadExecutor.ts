import type { SchedulingResident } from '../../../services/schedulingService'
import {
  getStaffProfilesUnavailableLastList,
  schedulingConfigService,
} from '../../../services/schedulingConfigService'
import { residentService } from '../../residents/services/residentService'
import { runSchedulingReloadPageData } from '../services/schedulingReloadPageData'
import { cloneResidents } from './schedulingHookHelpers'

/** 由 `useScheduling` 注入之 setter／清除預覽（PDF 02【3】載入院友與時段） */
export interface SchedulingPageReloadWriters {
  setLoadError: (message: string) => void
  setStaffProfilesLoadDegraded: (value: boolean) => void
  setResidents: (rows: SchedulingResident[]) => void
  setSessionCount: (count: number) => void
  clearPreviewState: () => void
}

/**
 * 重新載入排班頁資料：院友映射、時段筆數、員工設定降級旗標；
 * `clearPreview` 時清空指派預覽與儲存提示。
 */
export const executeSchedulingPageReload = async (
  facilityId: string,
  writers: SchedulingPageReloadWriters,
  options?: { clearPreview?: boolean },
): Promise<void> => {
  writers.setLoadError('')
  const outcome = await runSchedulingReloadPageData(facilityId, {
    listActiveResidents: () => residentService.listActiveResidents(),
    listSchedulingSessions: (id) => schedulingConfigService.listSchedulingSessions(id),
    prefetchRules: (id) => void schedulingConfigService.getRules(id),
  })
  if (!outcome.ok) {
    writers.setLoadError(outcome.loadError)
    writers.setStaffProfilesLoadDegraded(false)
    return
  }
  writers.setResidents(cloneResidents(outcome.schedulingResidents))
  writers.setSessionCount(outcome.sessionCount)
  writers.setStaffProfilesLoadDegraded(getStaffProfilesUnavailableLastList())
  if (options?.clearPreview) {
    writers.clearPreviewState()
  }
}
