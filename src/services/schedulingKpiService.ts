import { getWeeklyTargetByFundingType } from './schedulingTargets'
import type { SchedulingAssignment, SchedulingConflict, SchedulingResident } from './schedulingService'

export interface SchedulingKpiSnapshot {
  coverageRate: number
  conflictRatePer100: number
  averageAssignmentsPerResident: number
  underTargetRate: number
}

/** 單次排班後 KPI 快照（供趨勢列表） */
export interface SchedulingKpiRunRecord {
  ranAt: string
  kpis: SchedulingKpiSnapshot
  residentCount: number
  assignmentCount: number
  conflictCount: number
  actorId?: string
}

const toPercent = (numerator: number, denominator: number): number => {
  if (denominator <= 0) return 0
  return (numerator / denominator) * 100
}

export const calculateSchedulingKpis = (
  residents: SchedulingResident[],
  assignments: SchedulingAssignment[],
  conflicts: SchedulingConflict[],
): SchedulingKpiSnapshot => {
  const totalResidents = residents.length
  if (totalResidents === 0) {
    return {
      coverageRate: 0,
      conflictRatePer100: 0,
      averageAssignmentsPerResident: 0,
      underTargetRate: 0,
    }
  }

  const compliantCount = residents.filter(
    (resident) => resident.weeklyCompletedCount >= getWeeklyTargetByFundingType(resident.fundingType),
  ).length
  const underTargetCount = residents.filter(
    (resident) => resident.weeklyCompletedCount < getWeeklyTargetByFundingType(resident.fundingType),
  ).length

  return {
    coverageRate: toPercent(compliantCount, totalResidents),
    conflictRatePer100: toPercent(conflicts.length, totalResidents),
    averageAssignmentsPerResident: assignments.length / totalResidents,
    underTargetRate: toPercent(underTargetCount, totalResidents),
  }
}
