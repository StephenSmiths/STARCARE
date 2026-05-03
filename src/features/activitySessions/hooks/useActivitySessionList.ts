import { useCallback, useEffect, useRef, useState } from 'react'
import type { ActivitySession } from '../../../repositories/activitySessionRepository'
import { activitySessionManagementService } from '../../../services/activitySessionManagementService'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'

export const useActivitySessionList = (facilityId = 'facility-main') => {
  const softDeleteLockRef = useRef(false)
  const loadSeqRef = useRef(0)
  const [rows, setRows] = useState<ActivitySession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [busySessionId, setBusySessionId] = useState<string | null>(null)

  const loadList = useCallback(async () => {
    const seq = ++loadSeqRef.current
    setIsLoading(true)
    setError('')
    try {
      const data = await activitySessionManagementService.listActivitySessions(facilityId)
      if (seq !== loadSeqRef.current) return
      setRows(data)
    } catch {
      if (seq === loadSeqRef.current) {
        setError('無法載入活動時段列表，請稍後重試。')
      }
    } finally {
      if (seq === loadSeqRef.current) setIsLoading(false)
    }
  }, [facilityId])

  useEffect(() => {
    queueMicrotask(() => void loadList())
  }, [loadList])

  useInvalidateOnSystemSettingsExternalChange(loadList)

  const softDeleteSession = async (actorId: string, session: ActivitySession): Promise<void> => {
    if (softDeleteLockRef.current) return
    softDeleteLockRef.current = true
    setBusySessionId(session.id)
    setError('')
    try {
      await activitySessionManagementService.softDeleteActivitySession(actorId, session)
      setRows((prev) => prev.filter((item) => item.id !== session.id))
    } catch {
      setError('活動時段軟刪除失敗，請稍後再試。')
    } finally {
      softDeleteLockRef.current = false
      setBusySessionId(null)
    }
  }

  return { rows, isLoading, error, busySessionId, softDeleteSession }
}
