import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { ResidentInput } from '../types/resident'
import { residentService } from '../services/residentService'

/** 院友 CRUD（軟刪防連點）；錯誤寫入由呼叫端 `setErrorMessage`（對齊業務 PDF）。 */
export const useResidentsMutations = (
  refreshResidents: () => Promise<void>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
) => {
  const softDeleteLockRef = useRef(false)
  const [softDeleteBusyResidentId, setSoftDeleteBusyResidentId] = useState<string | null>(null)

  const createResident = useCallback(
    async (actorId: string, input: ResidentInput) => {
      try {
        await residentService.createResident(actorId, input)
        await refreshResidents()
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '新增院友失敗')
      }
    },
    [refreshResidents, setErrorMessage],
  )

  const updateResident = useCallback(
    async (actorId: string, id: string, input: ResidentInput) => {
      try {
        await residentService.updateResident(actorId, id, input)
        await refreshResidents()
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '修改院友失敗')
      }
    },
    [refreshResidents, setErrorMessage],
  )

  const softDeleteResident = useCallback(
    async (actorId: string, id: string) => {
      if (softDeleteLockRef.current) return
      softDeleteLockRef.current = true
      setSoftDeleteBusyResidentId(id)
      try {
        await residentService.softDeleteResident(actorId, id)
        await refreshResidents()
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '軟刪除院友失敗')
      } finally {
        softDeleteLockRef.current = false
        setSoftDeleteBusyResidentId(null)
      }
    },
    [refreshResidents, setErrorMessage],
  )

  return {
    createResident,
    updateResident,
    softDeleteResident,
    softDeleteBusyResidentId,
  }
}
