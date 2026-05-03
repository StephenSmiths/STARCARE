import { useEffect, useRef, useState } from 'react'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import type { Resident, ResidentInput } from '../types/resident'
import { residentService } from '../services/residentService'
import { runResidentListRefresh } from '../services/residentListRefreshOutcome'

export const useResidents = () => {
  const auditTrail = useAuditTrailList()
  /** 防止軟刪除連點（對齊業務 PDF 防重覆提交） */
  const softDeleteLockRef = useRef(false)
  const [residents, setResidents] = useState<Resident[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [softDeleteBusyResidentId, setSoftDeleteBusyResidentId] = useState<string | null>(null)

  /** 01 §5／Seq 25：名單載入失敗須可辨識（閉環反饋）；邏輯見 `runResidentListRefresh`。 */
  const refresh = async () => {
    const out = await runResidentListRefresh(() => residentService.listActiveResidents())
    setResidents(out.residents)
    setErrorMessage(out.errorMessage)
  }

  useEffect(() => {
    queueMicrotask(() => {
      void refresh()
    })
  }, [])

  const createResident = async (actorId: string, input: ResidentInput) => {
    try {
      await residentService.createResident(actorId, input)
      await refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '新增院友失敗')
    }
  }

  const updateResident = async (actorId: string, id: string, input: ResidentInput) => {
    try {
      await residentService.updateResident(actorId, id, input)
      await refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '修改院友失敗')
    }
  }

  const softDeleteResident = async (actorId: string, id: string) => {
    if (softDeleteLockRef.current) return
    softDeleteLockRef.current = true
    setSoftDeleteBusyResidentId(id)
    try {
      await residentService.softDeleteResident(actorId, id)
      await refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '軟刪除院友失敗')
    } finally {
      softDeleteLockRef.current = false
      setSoftDeleteBusyResidentId(null)
    }
  }

  return {
    residents,
    errorMessage,
    createResident,
    updateResident,
    softDeleteResident,
    softDeleteBusyResidentId,
    refreshResidents: refresh,
    auditTrail,
  }
}
