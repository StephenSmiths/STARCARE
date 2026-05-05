import { useCallback, useState } from 'react'
import type { ServiceFormRecord } from '../types/serviceForm'
import { todayYmd } from '../utils/serviceFormLocalDate'

/** Staff 填表區：選日／時段／院友／敘事與編輯列 id */
export const useServiceFormStaffPanelFormState = () => {
  const [selectedDate, setSelectedDate] = useState(() => todayYmd())
  const [sessionId, setSessionId] = useState('')
  const [residentId, setResidentId] = useState('')
  const [narrative, setNarrative] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const loadForm = useCallback((row: ServiceFormRecord) => {
    setEditingId(row.id)
    setSessionId(row.sessionId)
    setSelectedDate(row.sessionDate)
    setResidentId(row.residentId)
    setNarrative(row.narrative)
  }, [])

  const resetEmpty = useCallback(() => {
    setEditingId(null)
    setSessionId('')
    setResidentId('')
    setNarrative('')
  }, [])

  return {
    selectedDate,
    setSelectedDate,
    sessionId,
    setSessionId,
    residentId,
    setResidentId,
    narrative,
    setNarrative,
    editingId,
    setEditingId,
    loadForm,
    resetEmpty,
  }
}
