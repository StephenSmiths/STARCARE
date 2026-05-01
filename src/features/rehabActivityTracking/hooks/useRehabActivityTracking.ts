import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthActorId } from '../../auth'
import type { SchedulingRules } from '../../../repositories/schedulingRulesRepository'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { residentService } from '../../residents/services/residentService'
import type { Resident } from '../../residents/types/resident'
import type { SchedulingSession } from '../../../services/schedulingService'
import { mapRulesToConstraints } from '../../scheduling/hooks/schedulingHookHelpers'
import {
  buildDementiaServiceTrackSnapshot,
  buildSubsidizedRehabTrackSnapshot,
  type RehabActivityTrackSnapshot,
} from '../services/rehabActivityTrackingSnapshotService'

const FACILITY_ID = 'facility-main'

export type RehabActivityTrackingState = {
  loadError: string
  isLoading: boolean
  rehabSnapshot: RehabActivityTrackSnapshot
  dementiaSnapshot: RehabActivityTrackSnapshot
  reload: () => Promise<void>
}

/** PDF 02【8】兩軌快照（乾跑；不觸發正式排班審計） */
export const useRehabActivityTracking = (): RehabActivityTrackingState => {
  const actorId = useAuthActorId()
  const [residents, setResidents] = useState<Resident[]>([])
  const [sessions, setSessions] = useState<SchedulingSession[]>([])
  const [rules, setRules] = useState<SchedulingRules | null>(null)
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoadError('')
    setIsLoading(true)
    try {
      const [resRows, sessRows, rulesRow] = await Promise.all([
        residentService.listActiveResidents(),
        schedulingConfigService.listSchedulingSessions(FACILITY_ID),
        schedulingConfigService.getRules(FACILITY_ID),
      ])
      setResidents(resRows)
      setSessions(sessRows)
      setRules(rulesRow)
    } catch {
      setLoadError('無法載入院友或活動時段')
      setResidents([])
      setSessions([])
      setRules(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => void reload())
  }, [reload])

  const constraints = useMemo(() => mapRulesToConstraints(rules), [rules])

  const rehabSnapshot = useMemo(
    () => buildSubsidizedRehabTrackSnapshot(actorId, residents, sessions, constraints),
    [actorId, residents, sessions, constraints],
  )

  const dementiaSnapshot = useMemo(
    () => buildDementiaServiceTrackSnapshot(residents, sessions, constraints),
    [residents, sessions, constraints],
  )

  return {
    loadError,
    isLoading,
    rehabSnapshot,
    dementiaSnapshot,
    reload,
  }
}
