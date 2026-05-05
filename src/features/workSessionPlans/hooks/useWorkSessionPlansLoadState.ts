import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SchedulingSession } from '../../../services/schedulingService'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import { mergeSessionsWithResponses } from '../services/workSessionPlanService'

/** PDF 02【4】時段列表載入、回應合併列與設定變更重載 */
export const useWorkSessionPlansLoadState = (facilityId: string) => {
  const [baseSessions, setBaseSessions] = useState<SchedulingSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const loadSeqRef = useRef(0)
  const [storeTick, setStoreTick] = useState(0)

  const reload = useCallback(async () => {
    const seq = ++loadSeqRef.current
    setError('')
    setIsLoading(true)
    try {
      const sessions = await schedulingConfigService.listSchedulingSessions(facilityId)
      if (seq !== loadSeqRef.current) return
      setBaseSessions(sessions)
    } catch {
      if (seq === loadSeqRef.current) {
        setError('無法載入工作計劃時段，請稍後重試。')
        setBaseSessions([])
      }
    } finally {
      if (seq === loadSeqRef.current) setIsLoading(false)
    }
  }, [facilityId])

  const mergedRows = useMemo(() => {
    void storeTick
    return mergeSessionsWithResponses(baseSessions)
  }, [baseSessions, storeTick])

  const bumpStore = useCallback(() => setStoreTick((x) => x + 1), [])

  useEffect(() => {
    queueMicrotask(() => {
      void reload()
    })
  }, [reload])

  useInvalidateOnSystemSettingsExternalChange(reload)

  return { mergedRows, isLoading, error, reload, bumpStore }
}
