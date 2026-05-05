import { useCallback, useEffect, useState } from 'react'
import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import { DASHBOARD_OVERVIEW_FACILITY_ID } from '../constants/dashboardOverviewWorkspaceDefaults'
import { fetchDashboardOverviewSnapshot } from '../services/dashboardOverviewFetchSnapshot'
import type { DashboardSummary } from '../services/dashboardSummaryService'

/** PDF 02【1】儀表盤資料載入（Seq 13 骨架） */
export const useDashboardOverview = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [teamLeadWednesdayAlerts, setTeamLeadWednesdayAlerts] = useState<SchedulingComplianceAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const out = await fetchDashboardOverviewSnapshot(DASHBOARD_OVERVIEW_FACILITY_ID)
      setSummary(out.summary)
      setTeamLeadWednesdayAlerts(out.teamLeadWednesdayAlerts)
    } catch {
      setError('無法載入儀表盤資料，請檢查網路後重試。')
      setSummary(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useInvalidateOnSystemSettingsExternalChange(reload)

  useEffect(() => {
    // 首次載入延後至 microtask，避免 effect 內同步觸發 setState 之級聯渲染告警
    queueMicrotask(() => {
      void reload()
    })
  }, [reload])

  return { summary, teamLeadWednesdayAlerts, isLoading, error, reload }
}
