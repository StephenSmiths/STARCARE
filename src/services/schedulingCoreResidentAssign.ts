import { noteStaffGroupSessionAssignment } from './schedulingStaffGroupDailyCache'
import { pickSession } from './schedulingCorePick'
import type { PassContext } from './schedulingPassContext'
import type { SchedulingConstraints, SchedulingResident } from './schedulingService'

/** 單一院友於一輪 Pass 內嘗試指派（同步／非同步共用） */
export const assignResidentInPass = (
  pass: 1 | 2 | 3,
  resident: SchedulingResident,
  context: PassContext,
  constraints: SchedulingConstraints,
): void => {
  const attempt = pickSession(resident, context, constraints)
  if (!attempt.session) {
    context.conflicts.push({
      residentId: resident.id,
      residentName: resident.name,
      type: attempt.conflictType,
      reason: attempt.reason,
    })
    return
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
  context.assignedSessionIds.add(session.id)
  noteStaffGroupSessionAssignment(context.staffGroupDailyCache, session)
  resident.weeklyCompletedCount += 1
  resident.lastServiceDate = session.date
  resident.assignedDates.push(session.date)
  context.staffSlotSet.add(`${session.staffId}|${session.date}|${session.timeSlot}`)
}
