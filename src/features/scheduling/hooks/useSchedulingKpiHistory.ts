import { useState } from 'react'
import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import { useSchedulingKpiHistoryFilterActions } from './useSchedulingKpiHistoryFilterActions'
import {
  useAutoClearKpiSyncNotice,
  usePersistSchedulingKpiRunHistory,
  useSchedulingKpiHistoryMountHydrate,
} from './useSchedulingKpiHistoryEffects'
import { useSchedulingKpiHistoryMutations } from './useSchedulingKpiHistoryMutations'

export type { SchedulingKpiHistoryFilter } from '../types/schedulingKpiHistoryFilter'

export const useSchedulingKpiHistory = (facilityId: string) => {
  const [kpiRunHistory, setKpiRunHistory] = useState<SchedulingKpiRunRecord[]>(() =>
    schedulingKpiHistorySyncService.loadLocal(facilityId),
  )
  const [syncError, setSyncError] = useState('')
  const [syncNotice, setSyncNotice] = useState('')

  const { historyFilter, applyHistoryFilter, resetHistoryFilter, isApplyingFilter } =
    useSchedulingKpiHistoryFilterActions(facilityId, setKpiRunHistory, setSyncError)

  const {
    appendKpiRunRecord,
    exportKpiTrendCsv,
    clearKpiTrendHistory,
    retryKpiSync,
    isRetryingSync,
    hasPendingSync,
  } = useSchedulingKpiHistoryMutations({
    facilityId,
    kpiRunHistory,
    setKpiRunHistory,
    historyFilter,
    setSyncError,
    setSyncNotice,
  })

  usePersistSchedulingKpiRunHistory(facilityId, kpiRunHistory)
  useAutoClearKpiSyncNotice(syncNotice, setSyncNotice)
  useSchedulingKpiHistoryMountHydrate(facilityId, setKpiRunHistory, setSyncError, setSyncNotice)

  return {
    kpiRunHistory,
    exportKpiTrendCsv,
    clearKpiTrendHistory,
    appendKpiRunRecord,
    setKpiRunHistory,
    syncError,
    syncNotice,
    hasPendingSync,
    retryKpiSync,
    isRetryingSync,
    historyFilter,
    applyHistoryFilter,
    resetHistoryFilter,
    isApplyingFilter,
  }
}
