import { useCallback, useRef, type Dispatch, type SetStateAction } from 'react'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import { schedulingPersistenceService } from '../../../services/schedulingPersistenceService'
import type { SchedulingResident } from '../../../services/schedulingService'
import { runSubsidizedRehabSchedulingOrchestration } from '../services/runSubsidizedRehabSchedulingOrchestration'
import { SCHEDULING_DATA_LOAD_ERROR_MESSAGE } from '../services/schedulingDataLoadMessage'
import type { SchedulingViewModel } from '../types/schedule'

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
  const runLockRef = useRef(false)
  const saveLockRef = useRef(false)

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
  }, [actorId, appendKpiRunRecord, facilityId, setKpiRunHistory, setLoadError, setResidents, setResult, setIsRunning, setSaveError, setSaveSuccess])

  const saveScheduleAssignments = useCallback(async () => {
    if (saveLockRef.current) return
    saveLockRef.current = true
    setSaveError('')
    setSaveSuccess(false)
    setIsSaving(true)
    try {
      await schedulingPersistenceService.saveScheduleAssignments(
        actorId,
        result.assignments,
        result.conflicts,
      )
      setSaveSuccess(true)
      refreshLastBatchId()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '儲存排班結果時發生錯誤，請稍後再試。'
      setSaveError(message)
    } finally {
      saveLockRef.current = false
      setIsSaving(false)
    }
  }, [actorId, refreshLastBatchId, result.assignments, result.conflicts, setSaveError, setSaveSuccess, setIsSaving])

  return { runScheduling, saveScheduleAssignments }
}
