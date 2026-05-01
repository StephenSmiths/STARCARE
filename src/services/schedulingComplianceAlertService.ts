import type { SchedulingResident } from './schedulingService'

export interface SchedulingComplianceAlert {
  code: 'MIDWEEK_SUBSIDIZED_ZERO'
  level: 'high'
  residentId: string
  residentName: string
  fundingType: SchedulingResident['fundingType']
  message: string
}

const isFundingInScope = (fundingType: SchedulingResident['fundingType']): boolean =>
  fundingType === 'GradeA_Subsidized' || fundingType === 'Voucher'

/**
 * 01 §4.1：若週三時甲一／院舍券院友之資助復康完成次數仍為 0，需觸發高優先 Alert。
 */
export const buildMidweekSubsidizedZeroAlerts = (
  residents: SchedulingResident[],
  now: Date = new Date(),
): SchedulingComplianceAlert[] => {
  const day = now.getDay()
  if (day !== 3) return []
  return residents
    .filter((resident) => isFundingInScope(resident.fundingType) && resident.weeklyCompletedCount === 0)
    .map((resident) => ({
      code: 'MIDWEEK_SUBSIDIZED_ZERO' as const,
      level: 'high' as const,
      residentId: resident.id,
      residentName: resident.name,
      fundingType: resident.fundingType,
      message: `週三提醒：${resident.name}（${resident.fundingType}）資助復康次數仍為 0，請 TeamLead 優先跟進。`,
    }))
}
