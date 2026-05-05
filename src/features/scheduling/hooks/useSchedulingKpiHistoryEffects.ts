import { useEffect, type Dispatch, type SetStateAction } from 'react'
import { saveKpiRunHistory } from '../../../services/schedulingKpiHistoryStorage'
import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'

/** 本機 state 與 storage 雙寫 */
export const usePersistSchedulingKpiRunHistory = (
  facilityId: string,
  kpiRunHistory: SchedulingKpiRunRecord[],
): void => {
  useEffect(() => {
    saveKpiRunHistory(facilityId, kpiRunHistory)
  }, [facilityId, kpiRunHistory])
}

/** 成功提示約 4 秒後自動清除 */
export const useAutoClearKpiSyncNotice = (
  syncNotice: string,
  setSyncNotice: Dispatch<SetStateAction<string>>,
): void => {
  useEffect(() => {
    if (!syncNotice) return
    const timer = window.setTimeout(() => setSyncNotice(''), 4000)
    return () => window.clearTimeout(timer)
  }, [syncNotice, setSyncNotice])
}

/** 掛載時自伺服端 hydrate（失敗時保留 loadLocal 初始列） */
export const useSchedulingKpiHistoryMountHydrate = (
  facilityId: string,
  setKpiRunHistory: Dispatch<SetStateAction<SchedulingKpiRunRecord[]>>,
  setSyncError: Dispatch<SetStateAction<string>>,
  setSyncNotice: Dispatch<SetStateAction<string>>,
): void => {
  useEffect(() => {
    let cancelled = false
    const hydrate = async () => {
      try {
        const rows = await schedulingKpiHistorySyncService.hydrateFromServer(facilityId)
        if (cancelled) return
        setKpiRunHistory(rows)
        setSyncError('')
        setSyncNotice('')
      } catch {
        if (!cancelled) setSyncError('KPI 歷史同步失敗，目前顯示本機快取。')
      }
    }
    void hydrate()
    return () => {
      cancelled = true
    }
  }, [facilityId, setKpiRunHistory, setSyncError, setSyncNotice])
}
