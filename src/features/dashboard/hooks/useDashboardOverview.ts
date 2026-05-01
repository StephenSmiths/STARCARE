import { useCallback, useEffect, useState } from 'react'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'
import { residentService } from '../../residents/services/residentService'
import { staffManagementService } from '../../staff/services/staffManagementService'
import { buildAssessmentDueTasks } from '../../residents/services/assessmentDueTaskService'
import { buildDashboardSummary, type DashboardSummary } from '../services/dashboardSummaryService'

const FACILITY_ID = 'facility-main'

const localDateYmd = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** PDF 02【1】儀表盤資料載入（Seq 13 骨架） */
export const useDashboardOverview = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [residents, staffRows, sessions] = await Promise.all([
        residentService.listActiveResidents(),
        staffManagementService.listStaffOverview(FACILITY_ID),
        schedulingConfigService.listSchedulingSessions(FACILITY_ID),
      ])
      const kpiHistory = schedulingKpiHistorySyncService.loadLocal(FACILITY_ID)
      const dueTasks = buildAssessmentDueTasks(residents)
      setSummary(
        buildDashboardSummary({
          residentTotal: residents.length,
          staffRows,
          schedulingSessions: sessions,
          todayLocalYmd: localDateYmd(),
          kpiHistoryNewestFirst: kpiHistory,
          assessmentDueWithin14Count: dueTasks.length,
        }),
      )
    } catch {
      setError('無法載入儀表盤資料，請檢查網路後重試。')
      setSummary(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // 首次載入延後至 microtask，避免 effect 內同步觸發 setState 之級聯渲染告警
    queueMicrotask(() => {
      void reload()
    })
  }, [reload])

  return { summary, isLoading, error, reload }
}
