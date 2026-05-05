import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingKpiHistoryFilter } from '../types/schedulingKpiHistoryFilter'
import { toSchedulingKpiHistoryQuery } from './schedulingKpiHistoryFilter'

/**
 * 重試同步：待清除→待上傳佇列→依篩選 hydrate（與 hook 內原流程一致；PDF 防重覆提交由外層 lock 處理）。
 */
export const runSchedulingKpiHistoryRetryFlow = async (
  facilityId: string,
  pendingClear: boolean,
  pendingUploadQueue: SchedulingKpiRunRecord[],
  historyFilter: SchedulingKpiHistoryFilter,
): Promise<SchedulingKpiRunRecord[]> => {
  if (pendingClear) {
    await schedulingKpiHistorySyncService.clearHistory(facilityId)
  }
  if (pendingUploadQueue.length > 0) {
    const oldestFirst = [...pendingUploadQueue].reverse()
    for (const row of oldestFirst) {
      await schedulingKpiHistorySyncService.appendRecord(facilityId, row)
    }
  }
  return schedulingKpiHistorySyncService.hydrateFromServer(
    facilityId,
    toSchedulingKpiHistoryQuery(historyFilter),
  )
}
