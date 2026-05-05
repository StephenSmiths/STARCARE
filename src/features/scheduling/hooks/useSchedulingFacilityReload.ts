import { useCallback, useEffect, useState } from 'react'
import type { SchedulingResident } from '../../../services/schedulingService'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import { executeSchedulingPageReload } from './schedulingPageReloadExecutor'

/** PDF 02【3】排班頁：院友／時段載入與系統設定變更後重載（預覽清空由呼叫端注入） */
export const useSchedulingFacilityReload = (
  facilityId: string,
  clearPreviewState: () => void,
) => {
  const [residents, setResidents] = useState<SchedulingResident[]>([])
  const [sessionCount, setSessionCount] = useState(0)
  const [loadError, setLoadError] = useState('')
  const [staffProfilesLoadDegraded, setStaffProfilesLoadDegraded] = useState(false)

  const reloadSchedulingData = useCallback(
    async (options?: { clearPreview?: boolean }) => {
      await executeSchedulingPageReload(
        facilityId,
        {
          setLoadError,
          setStaffProfilesLoadDegraded,
          setResidents,
          setSessionCount,
          clearPreviewState,
        },
        options,
      )
    },
    [facilityId, clearPreviewState],
  )

  const reloadAfterSettingsChange = useCallback(
    () => void reloadSchedulingData({ clearPreview: true }),
    [reloadSchedulingData],
  )
  useInvalidateOnSystemSettingsExternalChange(reloadAfterSettingsChange)

  useEffect(() => {
    queueMicrotask(() => {
      void reloadSchedulingData()
    })
  }, [reloadSchedulingData])

  return {
    residents,
    setResidents,
    sessionCount,
    loadError,
    setLoadError,
    staffProfilesLoadDegraded,
    reloadSchedulingData,
  }
}
