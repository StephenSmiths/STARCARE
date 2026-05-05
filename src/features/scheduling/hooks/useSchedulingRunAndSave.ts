import type { Dispatch, SetStateAction } from 'react'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingResident } from '../../../services/schedulingService'
import type { SchedulingViewModel } from '../types/schedule'
import { useSchedulingRunDryRun } from './useSchedulingRunDryRun'
import { useSchedulingSaveAssignments } from './useSchedulingSaveAssignments'

type S<T> = Dispatch<SetStateAction<T>>

/** PDF 02【3】：啟動排班乾跑與儲存指派（從 `useScheduling` 抽出以控行數） */
export const useSchedulingRunAndSave = (
  actorId: string,
  facilityId: string,
  result: SchedulingViewModel,
  setResidents: S<SchedulingResident[]>,
  setResult: S<SchedulingViewModel>,
  setLoadError: S<string>,
  setSaveSuccess: S<boolean>,
  setSaveError: S<string>,
  setIsRunning: S<boolean>,
  setIsSaving: S<boolean>,
  setKpiRunHistory: S<SchedulingKpiRunRecord[]>,
  appendKpiRunRecord: (record: SchedulingKpiRunRecord) => void,
  refreshLastBatchId: () => void,
) => {
  const { runScheduling } = useSchedulingRunDryRun(
    actorId,
    facilityId,
    setResidents,
    setResult,
    setLoadError,
    setSaveSuccess,
    setSaveError,
    setIsRunning,
    setKpiRunHistory,
    appendKpiRunRecord,
  )

  const { saveScheduleAssignments } = useSchedulingSaveAssignments(
    actorId,
    result,
    setSaveError,
    setSaveSuccess,
    setIsSaving,
    refreshLastBatchId,
  )

  return { runScheduling, saveScheduleAssignments }
}
