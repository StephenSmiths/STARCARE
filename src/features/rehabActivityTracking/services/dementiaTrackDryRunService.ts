import { cloneResidents } from '../../scheduling/hooks/schedulingHookHelpers'
import type {
  SchedulingAssignment,
  SchedulingConflict,
  SchedulingConstraints,
  SchedulingResident,
  SchedulingSession,
} from '../../../services/schedulingService'
import { pickDementiaSession } from './dementiaTrackPickSession'

/**
 * 01 §3.3：認知軌單週目標（骨架；數值待客戶 PDF 對表）。
 * 若母本提高週次，選時邏輯見 **`dementiaTrackPickSession`**。
 */
export const DEMENTIA_WEEKLY_TARGET = 1

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
