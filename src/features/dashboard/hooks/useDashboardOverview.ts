import { useCallback, useEffect, useState } from 'react'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'
import { residentService } from '../../residents/services/residentService'
import { staffManagementService } from '../../staff/services/staffManagementService'
import { assessmentDueTaskRepository } from '../../../repositories/assessmentDueTaskRepository'
import { buildMidweekSubsidizedZeroAlerts } from '../../../services/schedulingComplianceAlertService'
import { mapActiveResidentsToSubsidizedSchedulingResidents } from '../../scheduling/utils/mapActiveResidentsToSubsidizedSchedulingResidents'
import { buildDashboardSummary, type DashboardSummary } from '../services/dashboardSummaryService'
import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'

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
  const [teamLeadWednesdayAlerts, setTeamLeadWednesdayAlerts] = useState<SchedulingComplianceAlert[]>([])
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
      const dueTasks = await assessmentDueTaskRepository.listDueWithinLeadDays(residents)
      const subsidizedRehabResidents = mapActiveResidentsToSubsidizedSchedulingResidents(residents)
      setTeamLeadWednesdayAlerts(buildMidweekSubsidizedZeroAlerts(subsidizedRehabResidents))
      setSummary(
        buildDashboardSummary({
          residentTotal: residents.length,
          subsidizedRehabCohortCount: subsidizedRehabResidents.length,
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

  useInvalidateOnSystemSettingsExternalChange(reload)

  useEffect(() => {
    // 首次載入延後至 microtask，避免 effect 內同步觸發 setState 之級聯渲染告警
    queueMicrotask(() => {
      void reload()
    })
  }, [reload])

  return { summary, teamLeadWednesdayAlerts, isLoading, error, reload }
}
