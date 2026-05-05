import { useEffect, useMemo, useState } from 'react'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { useScheduling } from './useScheduling'

/** 排班儀表板：整合 `useScheduling`、審計列表與五步 gate（02【3】） */
export const useSchedulingDashboardViewModel = () => {
  const scheduling = useScheduling()
  const auditTrail = useAuditTrailList()
  const [rosterConfirmed, setRosterConfirmed] = useState(false)

  useEffect(() => {
    if (scheduling.sessionCount > 0) return
    queueMicrotask(() => setRosterConfirmed(false))
  }, [scheduling.sessionCount])

  const runBlockedReason = useMemo(() => {
    if (scheduling.sessionCount === 0) return '請先匯入週更表或建立活動時段（步驟①）'
    if (!rosterConfirmed) return '請先勾選「確認本週更表／已載入時段」（步驟②）'
    if (scheduling.totalResidents === 0) return '目前沒有在住院友可排班'
    return undefined
  }, [scheduling.sessionCount, rosterConfirmed, scheduling.totalResidents])

  return {
    ...scheduling,
    auditTrail,
    rosterConfirmed,
    setRosterConfirmed,
    runBlockedReason,
  }
}
