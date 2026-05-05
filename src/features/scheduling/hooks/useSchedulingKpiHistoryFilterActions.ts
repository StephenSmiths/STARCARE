import { useCallback, useState, type Dispatch, type SetStateAction } from 'react'
import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingKpiHistoryFilter } from '../types/schedulingKpiHistoryFilter'
import {
  EMPTY_SCHEDULING_KPI_HISTORY_FILTER,
  toSchedulingKpiHistoryQuery,
} from './schedulingKpiHistoryFilter'
import { SCHEDULING_KPI_HISTORY_LIMIT } from './schedulingKpiHistoryLimits'

/** KPI 歷史篩選：套用／重設後向伺服端 hydrate（PDF 03 可追溯查詢語意） */
export const useSchedulingKpiHistoryFilterActions = (
  facilityId: string,
  setKpiRunHistory: Dispatch<SetStateAction<SchedulingKpiRunRecord[]>>,
  setSyncError: Dispatch<SetStateAction<string>>,
) => {
  const [historyFilter, setHistoryFilter] = useState<SchedulingKpiHistoryFilter>(
    EMPTY_SCHEDULING_KPI_HISTORY_FILTER,
  )
  const [isApplyingFilter, setIsApplyingFilter] = useState(false)

  const applyHistoryFilter = useCallback(
    async (nextFilter: SchedulingKpiHistoryFilter) => {
      setIsApplyingFilter(true)
      setHistoryFilter(nextFilter)
      try {
        const rows = await schedulingKpiHistorySyncService.hydrateFromServer(
          facilityId,
          toSchedulingKpiHistoryQuery(nextFilter),
        )
        setKpiRunHistory(rows)
        setSyncError('')
      } catch {
        setSyncError('KPI 歷史查詢失敗，請檢查過濾條件後重試。')
      } finally {
        setIsApplyingFilter(false)
      }
    },
    [facilityId, setKpiRunHistory, setSyncError],
  )

  const resetHistoryFilter = useCallback(async () => {
    setIsApplyingFilter(true)
    setHistoryFilter(EMPTY_SCHEDULING_KPI_HISTORY_FILTER)
    try {
      const rows = await schedulingKpiHistorySyncService.hydrateFromServer(facilityId, {
        limit: SCHEDULING_KPI_HISTORY_LIMIT,
      })
      setKpiRunHistory(rows)
      setSyncError('')
    } catch {
      setSyncError('KPI 歷史查詢失敗，請稍後再試。')
    } finally {
      setIsApplyingFilter(false)
    }
  }, [facilityId, setKpiRunHistory, setSyncError])

  return { historyFilter, applyHistoryFilter, resetHistoryFilter, isApplyingFilter }
}
