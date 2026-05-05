import { useMemo } from 'react'
import { useAuthActorId } from '../../auth'
import { buildEngineConstraintsFromRulesAndUi } from '../../scheduling/hooks/schedulingHookHelpers'
import { useSystemSettingsExternalVersion } from '../../systemSettings'
import {
  buildDementiaServiceTrackSnapshot,
  buildSubsidizedRehabTrackSnapshot,
  type RehabActivityTrackSnapshot,
} from '../services/rehabActivityTrackingSnapshotService'
import { useRehabActivityTrackingLoad } from './useRehabActivityTrackingLoad'

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
  const { residents, sessions, rules, loadError, isLoading, reload } = useRehabActivityTrackingLoad()

  const systemSettingsVersion = useSystemSettingsExternalVersion()
  const constraints = useMemo(() => {
    void systemSettingsVersion
    return buildEngineConstraintsFromRulesAndUi(rules)
  }, [rules, systemSettingsVersion])

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
