import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'
import { downloadSchedulingKpiTrendCsv } from '../../../services/schedulingKpiTrendCsvService'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingKpiHistoryFilter } from '../types/schedulingKpiHistoryFilter'
import { runSchedulingKpiHistoryRetryFlow } from './runSchedulingKpiHistoryRetryFlow'
import { SCHEDULING_KPI_HISTORY_LIMIT } from './schedulingKpiHistoryLimits'

type Params = {
  facilityId: string
  kpiRunHistory: SchedulingKpiRunRecord[]
  setKpiRunHistory: Dispatch<SetStateAction<SchedulingKpiRunRecord[]>>
  historyFilter: SchedulingKpiHistoryFilter
  setSyncError: Dispatch<SetStateAction<string>>
  setSyncNotice: Dispatch<SetStateAction<string>>
}

/** KPI 歷史：追加、匯出 CSV、清除、重試同步與 pending 佇列（防連點鎖於此）。 */
export const useSchedulingKpiHistoryMutations = ({
  facilityId,
  kpiRunHistory,
  setKpiRunHistory,
  historyFilter,
  setSyncError,
  setSyncNotice,
}: Params) => {
  const retrySyncLockRef = useRef(false)
  const [pendingUploadQueue, setPendingUploadQueue] = useState<SchedulingKpiRunRecord[]>([])
  const [pendingClear, setPendingClear] = useState(false)
  const [isRetryingSync, setIsRetryingSync] = useState(false)

  const appendKpiRunRecord = useCallback(
    (record: SchedulingKpiRunRecord) => {
      setKpiRunHistory((prev) => [record, ...prev].slice(0, SCHEDULING_KPI_HISTORY_LIMIT))
      void schedulingKpiHistorySyncService
        .appendRecord(facilityId, record)
        .then(() => {
          setSyncError('')
          setSyncNotice('')
        })
        .catch(() => {
          setPendingUploadQueue((prev) => [record, ...prev].slice(0, SCHEDULING_KPI_HISTORY_LIMIT))
          setSyncNotice('')
          setSyncError('KPI 歷史寫入伺服器失敗，請稍後按「重試同步」。')
        })
    },
    [facilityId, setKpiRunHistory, setSyncError, setSyncNotice],
  )

  const exportKpiTrendCsv = useCallback(() => {
    downloadSchedulingKpiTrendCsv(facilityId, kpiRunHistory)
  }, [facilityId, kpiRunHistory])

  const clearKpiTrendHistory = useCallback(() => {
    setKpiRunHistory([])
    setPendingUploadQueue([])
    setPendingClear(false)
    setSyncNotice('')
    void schedulingKpiHistorySyncService.clearHistory(facilityId).catch(() => {
      setPendingClear(true)
      setSyncError('KPI 歷史清除同步失敗，請稍後按「重試同步」。')
    })
  }, [facilityId, setKpiRunHistory, setSyncError, setSyncNotice])

  const retryKpiSync = useCallback(async () => {
    if (retrySyncLockRef.current) return
    retrySyncLockRef.current = true
    setIsRetryingSync(true)
    try {
      const rows = await runSchedulingKpiHistoryRetryFlow(
        facilityId,
        pendingClear,
        pendingUploadQueue,
        historyFilter,
      )
      setPendingClear(false)
      setPendingUploadQueue([])
      setKpiRunHistory(rows)
      setSyncError('')
      setSyncNotice('KPI 歷史已成功同步到伺服器。')
    } catch {
      setSyncNotice('')
      setSyncError('KPI 歷史重試同步仍失敗，請稍後再試。')
    } finally {
      retrySyncLockRef.current = false
      setIsRetryingSync(false)
    }
  }, [facilityId, historyFilter, pendingClear, pendingUploadQueue, setKpiRunHistory, setSyncError, setSyncNotice])

  return {
    appendKpiRunRecord,
    exportKpiTrendCsv,
    clearKpiTrendHistory,
    retryKpiSync,
    isRetryingSync,
    hasPendingSync: pendingClear || pendingUploadQueue.length > 0,
  }
}
