import { useCallback, useRef, type Dispatch, type SetStateAction } from 'react'
import { schedulingPersistenceService } from '../../../services/schedulingPersistenceService'
import type { SchedulingViewModel } from '../types/schedule'

type S<T> = Dispatch<SetStateAction<T>>

/** PDF 02【3】：將試算指派落庫（防連點鎖）。 */
export const useSchedulingSaveAssignments = (
  actorId: string,
  result: SchedulingViewModel,
  setSaveError: S<string>,
  setSaveSuccess: S<boolean>,
  setIsSaving: S<boolean>,
  refreshLastBatchId: () => void,
) => {
  const saveLockRef = useRef(false)

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

  return { saveScheduleAssignments }
}
