import type { FundingType, SchedulingResident } from './schedulingService'

export const getWeeklyTargetByFundingType = (fundingType: FundingType): number => {
  if (fundingType === 'GradeA_Subsidized') return 2
  if (fundingType === 'Voucher') return 2
  return 1
}

export const hasUnmetTarget = (resident: SchedulingResident): boolean => {
  return resident.weeklyCompletedCount < getWeeklyTargetByFundingType(resident.fundingType)
}

export const buildTopUpQueue = (residents: SchedulingResident[]): SchedulingResident[] => {
  return [...residents]
    .filter(hasUnmetTarget)
    .sort((a, b) => {
      const deficitA = getWeeklyTargetByFundingType(a.fundingType) - a.weeklyCompletedCount
      const deficitB = getWeeklyTargetByFundingType(b.fundingType) - b.weeklyCompletedCount
      return deficitB - deficitA
    })
}
