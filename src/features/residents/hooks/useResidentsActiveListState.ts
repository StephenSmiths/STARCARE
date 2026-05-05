import { useCallback, useEffect, useState } from 'react'
import type { Resident } from '../types/resident'
import { residentService } from '../services/residentService'
import { runResidentListRefresh } from '../services/residentListRefreshOutcome'

/** 01 §5／Seq 25：活躍院友名單載入與錯誤狀態（不含 CRUD）。 */
export const useResidentsActiveListState = () => {
  const [residents, setResidents] = useState<Resident[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  const refreshResidents = useCallback(async () => {
    const out = await runResidentListRefresh(() => residentService.listActiveResidents())
    setResidents(out.residents)
    setErrorMessage(out.errorMessage)
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void refreshResidents()
    })
  }, [refreshResidents])

  return {
    residents,
    errorMessage,
    setErrorMessage,
    refreshResidents,
  }
}
