import { cloneResidents } from '../../scheduling/hooks/schedulingHookHelpers'
import { isWithinGapDays } from '../../../services/schedulingCoreSessionGates'
import type {
  ConflictType,
  SchedulingAssignment,
  SchedulingConflict,
  SchedulingConstraints,
  SchedulingResident,
  SchedulingSession,
} from '../../../services/schedulingService'

/**
 * 01 §3.3：認知軌單週目標（骨架；數值待客戶 PDF 對表）。
 * 若母本提高週次，`pickDementiaSession` 之二階段間隔放寬與資助軌一致。
 */
export const DEMENTIA_WEEKLY_TARGET = 1

const pickDementiaSession = (
  resident: SchedulingResident,
  sessions: SchedulingSession[],
  sessionUsage: Map<string, number>,
  staffSlotSet: Set<string>,
  constraints: SchedulingConstraints,
): { session: SchedulingSession | null; conflictType: ConflictType; reason: string } => {
  let lastConflict: { conflictType: ConflictType; reason: string } = {
    conflictType: 'NO_ELIGIBLE_SESSION',
    reason: '沒有可用認知時段',
  }

  /** PDF 01 §3.1：與資助軌相同之二階段（先間隔，別無他選再放寬相鄰日） */
  const tryPick = (relaxInterval: boolean, recordCoreFailures: boolean): SchedulingSession | null => {
    for (const session of sessions) {
      if (session.serviceType !== 'Dementia_Service') continue
      if (session.skillMatched === false) {
        if (recordCoreFailures) {
          lastConflict = { conflictType: 'SKILL_MISMATCH', reason: '員工技能不符合此活動要求' }
        }
        continue
      }
      const cap = Math.min(session.capacity, constraints.groupCapacityLimit)
      if ((sessionUsage.get(session.id) ?? 0) >= cap) {
        if (recordCoreFailures) {
          lastConflict = { conflictType: 'NO_CAPACITY', reason: '該時段容量已滿' }
        }
        continue
      }
      const sameDay = resident.assignedDates.filter((d) => d === session.date).length
      if (sameDay >= constraints.dailySameServiceLimit) {
        if (recordCoreFailures) {
          lastConflict = { conflictType: 'DAILY_LIMIT', reason: '院友同日不可重複安排同類服務' }
        }
        continue
      }
      const intervalBlocked =
        !!resident.lastServiceDate &&
        isWithinGapDays(resident.lastServiceDate, session.date, constraints.minGapDaysSameService)
      if (intervalBlocked && !relaxInterval) {
        if (recordCoreFailures) {
          lastConflict = { conflictType: 'INTERVAL_LIMIT', reason: '院友不可連續兩日安排同類服務' }
        }
        continue
      }
      const slotKey = `${session.staffId}|${session.date}|${session.timeSlot}`
      if (staffSlotSet.has(slotKey)) {
        if (recordCoreFailures) {
          lastConflict = { conflictType: 'STAFF_SLOT_DUPLICATED', reason: '同一員工同一時段不可重複安排' }
        }
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

/**
 * 認知軌道乾跑（僅 `Dementia_Service` 時段）；不寫審計。
 * PDF 01 §3.3：不讀資助類別做優先；**嚴重度排序**須由呼叫端（如 `buildDementiaServiceTrackSnapshot`）先排好 `residents` 再傳入。
 */
export const runDementiaTrackDryRun = (
  residents: SchedulingResident[],
  dementiaSessions: SchedulingSession[],
  constraints: SchedulingConstraints,
): {
  assignments: SchedulingAssignment[]
  conflicts: SchedulingConflict[]
  residentsOut: SchedulingResident[]
} => {
  const sessionUsage = new Map<string, number>()
  const staffSlotSet = new Set<string>()
  const assignments: SchedulingAssignment[] = []
  const conflicts: SchedulingConflict[] = []
  const clone = cloneResidents(residents)

  for (const resident of clone) {
    while (resident.weeklyCompletedCount < DEMENTIA_WEEKLY_TARGET) {
      const attempt = pickDementiaSession(resident, dementiaSessions, sessionUsage, staffSlotSet, constraints)
      if (!attempt.session) {
        conflicts.push({
          residentId: resident.id,
          residentName: resident.name,
          type: attempt.conflictType,
          reason: attempt.reason,
        })
        break
      }
      const session = attempt.session
      assignments.push({
        residentId: resident.id,
        residentName: resident.name,
        sessionId: session.id,
        staffId: session.staffId,
        pass: 1,
      })
      sessionUsage.set(session.id, (sessionUsage.get(session.id) ?? 0) + 1)
      resident.weeklyCompletedCount += 1
      resident.lastServiceDate = session.date
      resident.assignedDates.push(session.date)
      staffSlotSet.add(`${session.staffId}|${session.date}|${session.timeSlot}`)
    }
  }

  return { assignments, conflicts, residentsOut: clone }
}
