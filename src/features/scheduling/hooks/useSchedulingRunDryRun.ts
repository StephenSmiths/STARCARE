import { useCallback, useRef, type Dispatch, type SetStateAction } from 'react'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingResident } from '../../../services/schedulingService'
import { runSubsidizedRehabSchedulingOrchestration } from '../services/runSubsidizedRehabSchedulingOrchestration'
import { SCHEDULING_DATA_LOAD_ERROR_MESSAGE } from '../services/schedulingDataLoadMessage'
import type { SchedulingViewModel } from '../types/schedule'

type S<T> = Dispatch<SetStateAction<T>>

/** PDF 02【3】：資助復康排班乾跑（防連點鎖）。 */
export const useSchedulingRunDryRun = (
  actorId: string,
  facilityId: string,
  setResidents: S<SchedulingResident[]>,
  setResult: S<SchedulingViewModel>,
  setLoadError: S<string>,
  setSaveSuccess: S<boolean>,
  setSaveError: S<string>,
  setIsRunning: S<boolean>,
  setKpiRunHistory: S<SchedulingKpiRunRecord[]>,
  appendKpiRunRecord: (record: SchedulingKpiRunRecord) => void,
) => {
  const runLockRef = useRef(false)

  const runScheduling = useCallback(async () => {
    if (runLockRef.current) return
    runLockRef.current = true
    setIsRunning(true)
    setSaveSuccess(false)
    setSaveError('')
    try {
      const outcome = await runSubsidizedRehabSchedulingOrchestration(actorId, facilityId)
      if (outcome.kind === 'error') {
        setLoadError(SCHEDULING_DATA_LOAD_ERROR_MESSAGE)
        return
      }
      if (outcome.kind === 'empty') {
        setResidents([])
        setResult({ assignments: [], conflicts: [], underTargetResidents: [] })
        setKpiRunHistory([])
        return
      }
      setResidents(outcome.nextResidents)
      setResult(outcome.viewModel)
      appendKpiRunRecord(outcome.kpiRecord)
    } finally {
      runLockRef.current = false
      setIsRunning(false)
    }
  }, [
    actorId,
    appendKpiRunRecord,
    facilityId,
    setKpiRunHistory,
    setLoadError,
    setResidents,
    setResult,
    setIsRunning,
    setSaveError,
    setSaveSuccess,
  ])

  return { runScheduling }
}
