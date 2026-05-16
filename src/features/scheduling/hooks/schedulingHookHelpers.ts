import type { SchedulingRules } from '../../../repositories/schedulingRulesRepository'
import { loadSystemSettings } from '../../systemSettings'
import type { SchedulingConstraints, SchedulingResident, SchedulingSession } from '../../../services/schedulingService'

export const cloneResidents = (source: SchedulingResident[]): SchedulingResident[] =>
  source.map((r) => ({ ...r, assignedDates: [...r.assignedDates] }))

export const cloneSessions = (sessions: SchedulingSession[]): SchedulingSession[] =>
  sessions.map((s) => ({ ...s }))

export const mapRulesToConstraints = (rules: SchedulingRules | null): SchedulingConstraints => ({
  dailySameServiceLimit: rules?.dailySameServiceLimit ?? 1,
  minGapDaysSameService: rules?.minGapDaysSameService ?? 1,
  groupCapacityLimit: rules?.groupCapacityLimit ?? Number.POSITIVE_INFINITY,
  allowScTherapistOnly: rules?.allowScTherapistOnly ?? false,
  therapistGroupSessionsDailyCap: rules?.therapistGroupSessionsDailyCap,
  assistantGroupSessionsDailyCap: rules?.assistantGroupSessionsDailyCap,
})

/** 合併 DB 排班規則與本機 P1「SC 僅治療師」；關閉時覆寫雲端，開啟時與 scheduling-rules-get OR 合併 */
export const buildEngineConstraintsFromRulesAndUi = (rules: SchedulingRules | null): SchedulingConstraints => {
  const base = mapRulesToConstraints(rules)
  const uiScTherapistOnly =
    typeof window !== 'undefined' ? loadSystemSettings().specialCareTherapistOnly : false
  const allowScTherapistOnly = uiScTherapistOnly
    ? Boolean(base.allowScTherapistOnly) || uiScTherapistOnly
    : false
  return {
    ...base,
    allowScTherapistOnly,
  }
}
