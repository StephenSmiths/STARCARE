import { useCallback, useEffect, useRef, useState } from 'react'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import { createActivityRepository } from '../../../repositories/activityRepository'
import type { Activity } from '../../../repositories/activityRepository'
import { staffManagementService } from '../../staff/services/staffManagementService'
import type { StaffOverviewRow } from '../../staff/services/staffManagementService'

/** PDF 02【2】員工／活動主檔載入（Seq 14）；設定變更時重新 prefetch */
export const useWorkPlanComposerMeta = (facilityId: string) => {
  const [staffRows, setStaffRows] = useState<StaffOverviewRow[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [metaLoading, setMetaLoading] = useState(true)
  const [metaError, setMetaError] = useState('')
  const loadMetaSeqRef = useRef(0)

  const loadMeta = useCallback(async () => {
    const seq = ++loadMetaSeqRef.current
    setMetaLoading(true)
    setMetaError('')
    try {
      const activityRepo = createActivityRepository()
      const [staff, acts] = await Promise.all([
        staffManagementService.listStaffOverview(facilityId),
        activityRepo.listActivities(facilityId),
      ])
      if (seq !== loadMetaSeqRef.current) return
      setStaffRows(staff)
      setActivities(acts)
    } catch {
      if (seq === loadMetaSeqRef.current) {
        setMetaError('無法載入員工或活動主檔，請稍後重試。')
      }
    } finally {
      if (seq === loadMetaSeqRef.current) setMetaLoading(false)
    }
  }, [facilityId])

  useEffect(() => {
    queueMicrotask(() => void loadMeta())
  }, [loadMeta])

  useInvalidateOnSystemSettingsExternalChange(loadMeta)

  return { staffRows, activities, metaLoading, metaError, loadMeta }
}
