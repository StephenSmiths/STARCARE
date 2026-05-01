import type { SchedulingRules } from '../../../repositories/schedulingRulesRepository'
import type { SchedulingResident, SchedulingSession } from '../../../services/schedulingService'

export const cloneResidents = (source: SchedulingResident[]): SchedulingResident[] =>
  source.map((r) => ({ ...r, assignedDates: [...r.assignedDates] }))

export const cloneSessions = (sessions: SchedulingSession[]): SchedulingSession[] =>
  sessions.map((s) => ({ ...s }))

export const mapRulesToConstraints = (rules: SchedulingRules | null) => ({
  dailySameServiceLimit: rules?.dailySameServiceLimit ?? 1,
  minGapDaysSameService: rules?.minGapDaysSameService ?? 1,
  groupCapacityLimit: rules?.groupCapacityLimit ?? Number.POSITIVE_INFINITY,
})
