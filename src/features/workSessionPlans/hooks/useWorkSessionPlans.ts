import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SchedulingSession } from '../../../services/schedulingService'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { hydrateAuditTrailFromRemote } from '../../../services/auditTrailHydrationService'
import { isSupabaseBrowserConfigured } from '../../../services/supabaseBrowserEnv'
import { useAuth, useAuthActorId, resolveStaffProfileIdForWorkPlans } from '../../auth'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import {
  acceptWorkSession,
  bulkSoftDeleteWorkSessionsForTeam,
  filterWorkPlanRows,
  mergeSessionsWithResponses,
  rejectWorkSession,
  type WorkSessionLifecycleStatus,
} from '../services/workSessionPlanService'

const FACILITY_ID = 'facility-main'

const todayYmd = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** PDF 02【4】載入時段、篩選、接收／拒絕／主管批量軟刪（Seq 16） */
export const useWorkSessionPlans = () => {
  const actorId = useAuthActorId()
  const { user, role, isConfigured } = useAuth()
  const effectiveStaffProfileId = resolveStaffProfileIdForWorkPlans(user, isConfigured)
  const [baseSessions, setBaseSessions] = useState<SchedulingSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const loadSeqRef = useRef(0)
  const [storeTick, setStoreTick] = useState(0)
  const [selectedDate, setSelectedDate] = useState(todayYmd)
  const [showAllDates, setShowAllDates] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | WorkSessionLifecycleStatus>('all')

  const reload = useCallback(async () => {
    const seq = ++loadSeqRef.current
    setError('')
    setIsLoading(true)
    try {
      const sessions = await schedulingConfigService.listSchedulingSessions(FACILITY_ID)
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
  }, [])

  const mergedRows = useMemo(() => {
    void storeTick
    return mergeSessionsWithResponses(baseSessions)
  }, [baseSessions, storeTick])

  const dateKey = showAllDates ? '' : selectedDate

  const myRowsSource = useMemo(() => {
    if (!effectiveStaffProfileId) return []
    return mergedRows.filter((row) => row.staffId === effectiveStaffProfileId)
  }, [mergedRows, effectiveStaffProfileId])

  const filteredMyRows = useMemo(
    () => filterWorkPlanRows(myRowsSource, dateKey, statusFilter),
    [myRowsSource, dateKey, statusFilter],
  )

  const filteredTeamRows = useMemo(
    () => filterWorkPlanRows(mergedRows, dateKey, statusFilter),
    [mergedRows, dateKey, statusFilter],
  )

  const bumpStore = useCallback(() => setStoreTick((x) => x + 1), [])

  const accept = useCallback(
    (sessionId: string) => {
      try {
        acceptWorkSession(actorId, sessionId)
        bumpStore()
        if (isSupabaseBrowserConfigured()) {
          void hydrateAuditTrailFromRemote().catch(() => {})
        }
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '接收失敗')
      }
    },
    [actorId, bumpStore],
  )

  const reject = useCallback(
    (sessionId: string) => {
      try {
        rejectWorkSession(actorId, sessionId)
        bumpStore()
        if (isSupabaseBrowserConfigured()) {
          void hydrateAuditTrailFromRemote().catch(() => {})
        }
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '拒絕失敗')
      }
    },
    [actorId, bumpStore],
  )

  const bulkSoftDelete = useCallback(
    async (sessionIds: string[]) => {
      await bulkSoftDeleteWorkSessionsForTeam(actorId, sessionIds)
      bumpStore()
      await reload()
      if (isSupabaseBrowserConfigured()) {
        void hydrateAuditTrailFromRemote().catch(() => {})
      }
    },
    [actorId, bumpStore, reload],
  )

  useEffect(() => {
    queueMicrotask(() => {
      void reload()
    })
  }, [reload])

  useInvalidateOnSystemSettingsExternalChange(reload)

  return {
    role,
    actorId,
    effectiveStaffProfileId,
    isLoading,
    error,
    reload,
    selectedDate,
    setSelectedDate,
    showAllDates,
    setShowAllDates,
    statusFilter,
    setStatusFilter,
    filteredMyRows,
    filteredTeamRows,
    mergedRows,
    accept,
    reject,
    bulkSoftDelete,
  }
}
