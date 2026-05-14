import {
  countStaffGroupSessionsOnDate,
  isWithinGapDays,
  resolveStaffGroupDailyCap,
} from '../../../services/schedulingCoreSessionGates'
import type {
  ConflictType,
  SchedulingAssignment,
  SchedulingConstraints,
  SchedulingResident,
  SchedulingSession,
} from '../../../services/schedulingService'

/**
 * PDF 01 §3.1：與資助軌相同之二階段（先間隔，別無他選再放寬相鄰日）。
 * PDF 02【16】P1：小組活動（**`capacity > 1`**）每日場次上限與 **`evalSessionCoreForPick`** 共用 **`resolveStaffGroupDailyCap`**／**`countStaffGroupSessionsOnDate`**（**`Dementia_Service`**）。
 * 若母本提高週次，`pickDementiaSession` 之二階段間隔放寬與資助軌一致（01 §3.3）。
 */
export const pickDementiaSession = (
  resident: SchedulingResident,
  sessions: SchedulingSession[],
  sessionUsage: Map<string, number>,
  staffSlotSet: Set<string>,
  constraints: SchedulingConstraints,
  committedAssignments: readonly SchedulingAssignment[] = [],
): { session: SchedulingSession | null; conflictType: ConflictType; reason: string } => {
  let lastConflict: { conflictType: ConflictType; reason: string } = {
    conflictType: 'NO_ELIGIBLE_SESSION',
    reason: '沒有可用認知時段',
  }

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
      if (session.capacity > 1 && sessions.length > 0) {
        const roleCap = resolveStaffGroupDailyCap(session.staffRoleType, constraints)
        if (roleCap !== undefined && Number.isFinite(roleCap)) {
          const byId = new Map(sessions.map((s) => [s.id, s]))
          const used = countStaffGroupSessionsOnDate(
            committedAssignments,
            byId,
            session.staffId,
            session.date,
            'Dementia_Service',
          )
          const alreadyThisSlot = committedAssignments.some((a) => a.sessionId === session.id)
          const prospective = alreadyThisSlot ? used : used + 1
          if (prospective > roleCap) {
            if (recordCoreFailures) {
              lastConflict = {
                conflictType: 'STAFF_GROUP_DAILY_CAP',
                reason: '該員工於此日之小組活動場次已達每日上限',
              }
            }
            continue
          }
        }
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
