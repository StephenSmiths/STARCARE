import { buildTopUpQueue } from './schedulingTargets'
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

const pickSession = (
  resident: SchedulingResident,
  sessions: SchedulingSession[],
  sessionUsage: Map<string, number>,
  staffSlotSet: Set<string>,
  constraints: SchedulingConstraints,
): { session: SchedulingSession | null; conflictType: ConflictType; reason: string } => {
  let lastConflict: { conflictType: ConflictType; reason: string } = {
    conflictType: 'NO_ELIGIBLE_SESSION',
    reason: '沒有可用時段',
  }
  for (const session of sessions) {
    if (session.serviceType !== 'Subsidized_Rehab') continue
    if (session.skillMatched === false) {
      lastConflict = { conflictType: 'SKILL_MISMATCH', reason: '員工技能不符合此活動要求' }
      continue
    }
    const effectiveCapacity = Math.min(session.capacity, constraints.groupCapacityLimit)
    if ((sessionUsage.get(session.id) ?? 0) >= effectiveCapacity) {
      lastConflict = { conflictType: 'NO_CAPACITY', reason: '該時段容量已滿' }
      continue
    }
    const sameDayCount = resident.assignedDates.filter((date) => date === session.date).length
    if (sameDayCount >= constraints.dailySameServiceLimit) {
      lastConflict = { conflictType: 'DAILY_LIMIT', reason: '院友同日不可重複安排同類服務' }
      continue
    }
    if (
      resident.lastServiceDate &&
      isWithinGapDays(resident.lastServiceDate, session.date, constraints.minGapDaysSameService)
    ) {
      lastConflict = { conflictType: 'INTERVAL_LIMIT', reason: '院友不可連續兩日安排同類服務' }
      continue
    }
    if (staffSlotSet.has(`${session.staffId}|${session.date}|${session.timeSlot}`)) {
      lastConflict = { conflictType: 'STAFF_SLOT_DUPLICATED', reason: '同一員工同一時段不可重複安排' }
      continue
    }
    return { session, conflictType: 'NO_ELIGIBLE_SESSION', reason: '' }
  }
  return { session: null, ...lastConflict }
}

const isWithinGapDays = (previousDate: string, nextDate: string, minGapDays: number): boolean => {
  if (minGapDays <= 0) return false
  const oneDayMs = 24 * 60 * 60 * 1000
  const diff = Math.abs(new Date(nextDate).getTime() - new Date(previousDate).getTime())
  return diff > 0 && diff <= oneDayMs * minGapDays
}
