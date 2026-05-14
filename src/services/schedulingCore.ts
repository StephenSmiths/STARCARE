import { buildTopUpQueue } from './schedulingTargets'
import { evalSessionCoreForPick, isWithinGapDays } from './schedulingCoreSessionGates'
import type {
  ConflictType,
  SchedulingAssignment,
  SchedulingConstraints,
  SchedulingConflict,
  SchedulingResident,
  SchedulingSession,
} from './schedulingService'

export interface PassContext {
  assignments: SchedulingAssignment[]
  conflicts: SchedulingConflict[]
  sessionUsage: Map<string, number>
  staffSlotSet: Set<string>
}

export const sortBySC = (residents: SchedulingResident[]): SchedulingResident[] => {
  return [...residents].sort((a, b) => Number(b.isSpecialCareCase) - Number(a.isSpecialCareCase))
}

export const fillWeeklyTargets = (
  sessions: SchedulingSession[],
  residents: SchedulingResident[],
  context: PassContext,
  constraints: SchedulingConstraints,
): void => {
  let shouldContinue = true
  while (shouldContinue) {
    shouldContinue = false
    const topUpQueue = buildTopUpQueue(residents)
    for (const resident of topUpQueue) {
      const before = resident.weeklyCompletedCount
      executePass(3, [resident], sessions, context, constraints)
      if (resident.weeklyCompletedCount > before) shouldContinue = true
    }
  }
}

export const executePass = (
  pass: 1 | 2 | 3,
  residents: SchedulingResident[],
  sessions: SchedulingSession[],
  context: PassContext,
  constraints: SchedulingConstraints,
): void => {
  for (const resident of residents) {
    const attempt = pickSession(
      resident,
      sessions,
      context.sessionUsage,
      context.staffSlotSet,
      constraints,
      context.assignments,
    )
    if (!attempt.session) {
      context.conflicts.push({
        residentId: resident.id,
        residentName: resident.name,
        type: attempt.conflictType,
        reason: attempt.reason,
      })
      continue
    }
    const session = attempt.session
    context.assignments.push({
      residentId: resident.id,
      residentName: resident.name,
      sessionId: session.id,
      staffId: session.staffId,
      pass,
    })
    context.sessionUsage.set(session.id, (context.sessionUsage.get(session.id) ?? 0) + 1)
    resident.weeklyCompletedCount += 1
    resident.lastServiceDate = session.date
    resident.assignedDates.push(session.date)
    context.staffSlotSet.add(`${session.staffId}|${session.date}|${session.timeSlot}`)
  }
}

/**
 * PDF 01 §3.1：先選「非相鄰日違規」時段；若僅剩相鄰日可排，則啟用「無其他可用時段」例外。
 */
const pickSession = (
  resident: SchedulingResident,
  sessions: SchedulingSession[],
  sessionUsage: Map<string, number>,
  staffSlotSet: Set<string>,
  constraints: SchedulingConstraints,
  committedAssignments: SchedulingAssignment[],
): { session: SchedulingSession | null; conflictType: ConflictType; reason: string } => {
  let lastConflict: { conflictType: ConflictType; reason: string } = {
    conflictType: 'NO_ELIGIBLE_SESSION',
    reason: '沒有可用時段',
  }

  const tryPick = (relaxInterval: boolean, recordCoreFailures: boolean): SchedulingSession | null => {
    for (const session of sessions) {
      const core = evalSessionCoreForPick(
        resident,
        session,
        sessionUsage,
        staffSlotSet,
        constraints,
        committedAssignments,
        sessions,
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
