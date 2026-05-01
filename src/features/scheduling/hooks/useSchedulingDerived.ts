import { useMemo } from 'react'
import { getWeeklyTargetByFundingType } from '../../../services/schedulingTargets'
import { buildMidweekSubsidizedZeroAlerts } from '../../../services/schedulingComplianceAlertService'
import type { SchedulingResident } from '../../../services/schedulingService'
import { calculateSchedulingKpis } from '../../../services/schedulingKpiService'
import type { ResidentTableRow } from '../components/SchedulingResidentTable'
import type { SchedulingViewModel } from '../types/schedule'

/** 院友統計、表格列、即時 KPI（由 residents + 排班結果衍生） */
export const useSchedulingDerived = (
  residents: SchedulingResident[],
  result: SchedulingViewModel,
) => {
  const stats = useMemo(() => {
    const totalResidents = residents.length
    const compliantCount = residents.filter(
      (r) => r.weeklyCompletedCount >= getWeeklyTargetByFundingType(r.fundingType),
    ).length
    const pendingSlots = residents.reduce((acc, r) => {
      const t = getWeeklyTargetByFundingType(r.fundingType)
      return acc + Math.max(0, t - r.weeklyCompletedCount)
    }, 0)
    return { totalResidents, compliantCount, pendingSlots }
  }, [residents])

  const tableRows: ResidentTableRow[] = useMemo(
    () =>
      residents.map((r) => {
        const weeklyTarget = getWeeklyTargetByFundingType(r.fundingType)
        const isUnderTarget = r.weeklyCompletedCount < weeklyTarget
        return {
          id: r.id,
          name: r.name,
          fundingType: r.fundingType,
          weeklyTarget,
          weeklyCompleted: r.weeklyCompletedCount,
          isUnderTarget,
        }
      }),
    [residents],
  )

  const kpis = useMemo(
    () => calculateSchedulingKpis(residents, result.assignments, result.conflicts),
    [residents, result.assignments, result.conflicts],
  )
  const complianceAlerts = useMemo(() => buildMidweekSubsidizedZeroAlerts(residents), [residents])

  return { stats, tableRows, kpis, complianceAlerts }
}
