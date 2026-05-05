import type { SchedulingSession } from '../../../services/schedulingService'
import { workSessionResponseStore } from '../../../services/workSessionResponseStore'
import type { WorkSessionLifecycleStatus, WorkSessionPlanRow } from './workSessionPlanTypes'

export const resolveLifecycleStatus = (sessionId: string): WorkSessionLifecycleStatus => {
  const r = workSessionResponseStore.get(sessionId)
  if (!r) return 'PENDING'
  if (r.status === 'ACCEPTED') return 'ACCEPTED'
  if (r.status === 'REJECTED') return 'REJECTED'
  return 'COMPLETED'
}

export const mergeSessionsWithResponses = (sessions: SchedulingSession[]): WorkSessionPlanRow[] =>
  sessions.map((session) => {
    const response = workSessionResponseStore.get(session.id) ?? null
    return {
      ...session,
      responseStatus: resolveLifecycleStatus(session.id),
      response,
    }
  })

export const filterWorkPlanRows = (
  rows: WorkSessionPlanRow[],
  dateYmd: string,
  status: 'all' | WorkSessionLifecycleStatus,
): WorkSessionPlanRow[] =>
  rows
    .filter((row) => (dateYmd ? row.date === dateYmd : true))
    .filter((row) => (status === 'all' ? true : row.responseStatus === status))
