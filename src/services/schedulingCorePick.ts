import { evalSessionCoreForPick, isWithinGapDays } from './schedulingCoreSessionGates'
import type { PassContext } from './schedulingPassContext'
import type {
  ConflictType,
  SchedulingConstraints,
  SchedulingResident,
  SchedulingSession,
} from './schedulingService'

/**
 * PDF 01 §3.1：先選「非相鄰日違規」時段；若僅剩相鄰日可排，則啟用「無其他可用時段」例外。
 * 僅掃描預先過濾之資助復康時段（`context.subsidizedSessions`）。
 */
export const pickSession = (
  resident: SchedulingResident,
  context: PassContext,
  constraints: SchedulingConstraints,
): { session: SchedulingSession | null; conflictType: ConflictType; reason: string } => {
  let lastConflict: { conflictType: ConflictType; reason: string } = {
    conflictType: 'NO_ELIGIBLE_SESSION',
    reason: '沒有可用時段',
  }
  const pickCache = {
    sessionsById: context.sessionsById,
    staffGroupDailyCache: context.staffGroupDailyCache,
    assignedSessionIds: context.assignedSessionIds,
  }

  const tryPick = (relaxInterval: boolean, recordCoreFailures: boolean): SchedulingSession | null => {
    for (const session of context.subsidizedSessions) {
      const core = evalSessionCoreForPick(
        resident,
        session,
        context.sessionUsage,
        context.staffSlotSet,
        constraints,
        context.assignments,
        [],
        pickCache,
      )
      if (core.tag === 'skip') continue
      if (core.tag === 'fail') {
        if (recordCoreFailures) {
          lastConflict = { conflictType: core.conflictType, reason: core.reason }
        }
        continue
      }
      const intervalBlocked =
        !!resident.lastServiceDate &&
        isWithinGapDays(resident.lastServiceDate, session.date, constraints.minGapDaysSameService)
      if (intervalBlocked && !relaxInterval) {
        lastConflict = { conflictType: 'INTERVAL_LIMIT', reason: '院友不可連續兩日安排同類服務' }
        continue
      }
      return session
    }
    return null
  }

  const strict = tryPick(false, true)
  if (strict) return { session: strict, conflictType: 'NO_ELIGIBLE_SESSION', reason: '' }

  const relaxed = tryPick(true, false)
  if (relaxed) return { session: relaxed, conflictType: 'NO_ELIGIBLE_SESSION', reason: '' }

  return { session: null, ...lastConflict }
}
