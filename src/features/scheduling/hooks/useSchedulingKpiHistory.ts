import { useCallback, useEffect, useRef, useState } from 'react'
import type { SchedulingKpiHistoryQuery } from '../../../repositories/schedulingKpiHistoryRepository'
import { saveKpiRunHistory } from '../../../services/schedulingKpiHistoryStorage'
import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'
import { downloadSchedulingKpiTrendCsv } from '../../../services/schedulingKpiTrendCsvService'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'

export interface SchedulingKpiHistoryFilter {
  from: string
  to: string
  actorId: string
}

const EMPTY_FILTER: SchedulingKpiHistoryFilter = { from: '', to: '', actorId: '' }

const toQuery = (filter: SchedulingKpiHistoryFilter): SchedulingKpiHistoryQuery => ({
  limit: 10,
  from: filter.from || undefined,
  to: filter.to || undefined,
  actorId: filter.actorId || undefined,
})

export const useSchedulingKpiHistory = (facilityId: string) => {
  /** 防止「重試同步」連點（對齊業務 PDF 防重覆提交） */
  const retrySyncLockRef = useRef(false)
  const [kpiRunHistory, setKpiRunHistory] = useState<SchedulingKpiRunRecord[]>(() =>
    schedulingKpiHistorySyncService.loadLocal(facilityId),
  )
  const [pendingUploadQueue, setPendingUploadQueue] = useState<SchedulingKpiRunRecord[]>([])
  const [pendingClear, setPendingClear] = useState(false)
  const [syncError, setSyncError] = useState('')
  const [syncNotice, setSyncNotice] = useState('')
  const [isRetryingSync, setIsRetryingSync] = useState(false)
  const [isApplyingFilter, setIsApplyingFilter] = useState(false)
  const [historyFilter, setHistoryFilter] = useState<SchedulingKpiHistoryFilter>(EMPTY_FILTER)

  useEffect(() => {
    saveKpiRunHistory(facilityId, kpiRunHistory)
  }, [facilityId, kpiRunHistory])

  useEffect(() => {
    if (!syncNotice) return
    const timer = window.setTimeout(() => setSyncNotice(''), 4000)
    return () => window.clearTimeout(timer)
  }, [syncNotice])

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
  }, [facilityId])

  const applyHistoryFilter = useCallback(
    async (nextFilter: SchedulingKpiHistoryFilter) => {
      setIsApplyingFilter(true)
      setHistoryFilter(nextFilter)
      try {
        const rows = await schedulingKpiHistorySyncService.hydrateFromServer(
          facilityId,
          toQuery(nextFilter),
        )
        setKpiRunHistory(rows)
        setSyncError('')
      } catch {
        setSyncError('KPI 歷史查詢失敗，請檢查過濾條件後重試。')
      } finally {
        setIsApplyingFilter(false)
      }
    },
    [facilityId],
  )

  const resetHistoryFilter = useCallback(async () => {
    setIsApplyingFilter(true)
    setHistoryFilter(EMPTY_FILTER)
    try {
      const rows = await schedulingKpiHistorySyncService.hydrateFromServer(facilityId, { limit: 10 })
      setKpiRunHistory(rows)
      setSyncError('')
    } catch {
      setSyncError('KPI 歷史查詢失敗，請稍後再試。')
    } finally {
      setIsApplyingFilter(false)
    }
  }, [facilityId])

  const appendKpiRunRecord = useCallback(
    (record: SchedulingKpiRunRecord) => {
      setKpiRunHistory((prev) => [record, ...prev].slice(0, 10))
      void schedulingKpiHistorySyncService
        .appendRecord(facilityId, record)
        .then(() => {
          setSyncError('')
          setSyncNotice('')
        })
        .catch(() => {
          setPendingUploadQueue((prev) => [record, ...prev].slice(0, 10))
          setSyncNotice('')
          setSyncError('KPI 歷史寫入伺服器失敗，請稍後按「重試同步」。')
        })
    },
    [facilityId],
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
  }, [facilityId])

  const retryKpiSync = useCallback(async () => {
    if (retrySyncLockRef.current) return
    retrySyncLockRef.current = true
    setIsRetryingSync(true)
    try {
      if (pendingClear) {
        await schedulingKpiHistorySyncService.clearHistory(facilityId)
        setPendingClear(false)
        setPendingUploadQueue([])
      }
      if (pendingUploadQueue.length > 0) {
        const oldestFirst = [...pendingUploadQueue].reverse()
        for (const row of oldestFirst) {
          await schedulingKpiHistorySyncService.appendRecord(facilityId, row)
        }
        setPendingUploadQueue([])
      }
      const rows = await schedulingKpiHistorySyncService.hydrateFromServer(
        facilityId,
        toQuery(historyFilter),
      )
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
  }, [facilityId, historyFilter, pendingClear, pendingUploadQueue])

  return {
    kpiRunHistory,
    exportKpiTrendCsv,
    clearKpiTrendHistory,
    appendKpiRunRecord,
    setKpiRunHistory,
    syncError,
    syncNotice,
    hasPendingSync: pendingClear || pendingUploadQueue.length > 0,
    retryKpiSync,
    isRetryingSync,
    historyFilter,
    applyHistoryFilter,
    resetHistoryFilter,
    isApplyingFilter,
  }
}
