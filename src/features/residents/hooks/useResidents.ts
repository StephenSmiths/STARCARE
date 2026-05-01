import { useEffect, useRef, useState } from 'react'
import type { Resident, ResidentInput } from '../types/resident'
import { residentService } from '../services/residentService'

export const useResidents = () => {
  /** 防止軟刪除連點（對齊業務 PDF 防重覆提交） */
  const softDeleteLockRef = useRef(false)
  const [residents, setResidents] = useState<Resident[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [softDeleteBusyResidentId, setSoftDeleteBusyResidentId] = useState<string | null>(null)

  const refresh = async () => {
    const result = await residentService.listActiveResidents()
    setResidents(result)
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
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '新增院友失敗')
    }
  }

  const updateResident = async (actorId: string, id: string, input: ResidentInput) => {
    try {
      await residentService.updateResident(actorId, id, input)
      await refresh()
      setErrorMessage('')
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
      setErrorMessage('')
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
    auditTrail: residentService.listAuditTrail(),
  }
}
