import type { SchedulingSession } from '../../../services/schedulingService'
import {
  mergeSessionsWithResponses,
  type WorkSessionPlanRow,
} from '../../workSessionPlans/services/workSessionPlanService'
import type { ServiceFormRecord } from '../types/serviceForm'

export const deriveAcceptedOwnSessions = (
  sessions: SchedulingSession[],
  staffProfileId: string | null | undefined,
): WorkSessionPlanRow[] => {
  const merged = mergeSessionsWithResponses(sessions)
  if (!staffProfileId) return []
  return merged.filter(
    (row) => row.responseStatus === 'ACCEPTED' && row.staffId === staffProfileId,
  )
}

export const deriveMyForms = (
  forms: ServiceFormRecord[],
  actorId: string,
): ServiceFormRecord[] => forms.filter((item) => item.ownerActorId === actorId)

export const derivePendingReview = (forms: ServiceFormRecord[]): ServiceFormRecord[] =>
  forms.filter((item) => item.status === 'SUBMITTED')
