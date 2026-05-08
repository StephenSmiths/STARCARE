import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { ResidentInput } from '../types/resident'
import { residentService } from '../services/residentService'

/** 院友 CRUD（軟刪防連點）；錯誤寫入由呼叫端 `setErrorMessage`（對齊業務 PDF）。 */
export const useResidentsMutations = (
  refreshResidents: () => Promise<void>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
) => {
  const softDeleteLockRef = useRef(false)
  const batchLockRef = useRef(false)
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

  const batchSoftDeleteResidents = useCallback(
    async (actorId: string, ids: string[]) => {
      if (batchLockRef.current || ids.length === 0) return
      batchLockRef.current = true
      setSoftDeleteBusyResidentId('BATCH')
      try {
        for (const id of ids) {
          await residentService.softDeleteResident(actorId, id)
        }
        await refreshResidents()
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '批量軟刪除院友失敗')
      } finally {
        batchLockRef.current = false
        setSoftDeleteBusyResidentId(null)
      }
    },
    [refreshResidents, setErrorMessage],
  )

  const batchUpdateResidents = useCallback(
    async (actorId: string, updates: Array<{ id: string; input: ResidentInput }>) => {
      if (batchLockRef.current || updates.length === 0) return
      batchLockRef.current = true
      setSoftDeleteBusyResidentId('BATCH')
      try {
        for (const item of updates) {
          await residentService.updateResident(actorId, item.id, item.input)
        }
        await refreshResidents()
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '批量更新院友欄位失敗')
      } finally {
        batchLockRef.current = false
        setSoftDeleteBusyResidentId(null)
      }
    },
    [refreshResidents, setErrorMessage],
  )

  return {
    createResident,
    updateResident,
    softDeleteResident,
    batchSoftDeleteResidents,
    batchUpdateResidents,
    softDeleteBusyResidentId,
  }
}
