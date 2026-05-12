import { useCallback, useEffect, useState } from 'react'
import type { SchedulingRules } from '../../../repositories/schedulingRulesRepository'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { resolveSchedulingWindowSnapshot } from '../../../services/schedulingWindowSnapshotService'
import { residentService } from '../../residents/services/residentService'
import type { Resident } from '../../residents/types/resident'
import type { SchedulingSession } from '../../../services/schedulingService'
import { loadSystemSettings } from '../../systemSettings/repository/systemSettingsRepository'
import type { SystemSettingsSnapshot } from '../../systemSettings/types'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import { REHAB_ACTIVITY_TRACKING_WORKSPACE_FACILITY_ID } from '../constants/rehabActivityTrackingWorkspaceDefaults'

/** PDF 02【8】院友／時段／規則／有效視窗快照載入；設定變更時無效化重載。 */
export const useRehabActivityTrackingLoad = () => {
  const [residents, setResidents] = useState<Resident[]>([])
  const [sessions, setSessions] = useState<SchedulingSession[]>([])
  const [rules, setRules] = useState<SchedulingRules | null>(null)
  const [windowSnapshot, setWindowSnapshot] = useState<SystemSettingsSnapshot>(() => loadSystemSettings())
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoadError('')
    setIsLoading(true)
    try {
      const [resRows, sessRows, rulesRow, winSnap] = await Promise.all([
        residentService.listActiveResidents(),
        schedulingConfigService.listSchedulingSessions(REHAB_ACTIVITY_TRACKING_WORKSPACE_FACILITY_ID),
        schedulingConfigService.getRules(REHAB_ACTIVITY_TRACKING_WORKSPACE_FACILITY_ID),
        resolveSchedulingWindowSnapshot(REHAB_ACTIVITY_TRACKING_WORKSPACE_FACILITY_ID),
      ])
      setResidents(resRows)
      setSessions(sessRows)
      setRules(rulesRow)
      setWindowSnapshot(winSnap)
    } catch {
      setLoadError('無法載入院友或活動時段')
      setResidents([])
      setSessions([])
      setRules(null)
      setWindowSnapshot(loadSystemSettings())
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => void reload())
  }, [reload])

  useInvalidateOnSystemSettingsExternalChange(reload)

  return {
    residents,
    sessions,
    rules,
    windowSnapshot,
    loadError,
    isLoading,
    reload,
  }
}
