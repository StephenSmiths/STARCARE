import { buildPass12TopUpQueue, hasUnmetTarget } from './schedulingTargets'
import { assignResidentInPass } from './schedulingCoreResidentAssign'
import type { PassContext } from './schedulingPassContext'
import type { SchedulingConstraints, SchedulingResident, SchedulingSession } from './schedulingService'

export type { PassContext } from './schedulingPassContext'

export const sortBySC = (residents: SchedulingResident[]): SchedulingResident[] => {
  return [...residents].sort((a, b) => Number(b.isSpecialCareCase) - Number(a.isSpecialCareCase))
}

export const fillWeeklyTargets = (
  _sessions: SchedulingSession[],
  residents: SchedulingResident[],
  context: PassContext,
  constraints: SchedulingConstraints,
): void => {
  let shouldContinue = true
  while (shouldContinue) {
    shouldContinue = false
    const topUpQueue = buildPass12TopUpQueue(residents)
    for (const resident of topUpQueue) {
      const before = resident.weeklyCompletedCount
      assignResidentInPass(3, resident, context, constraints)
      if (resident.weeklyCompletedCount > before) shouldContinue = true
    }
  }
}

export const executePass = (
  pass: 1 | 2 | 3,
  residents: SchedulingResident[],
  _sessions: SchedulingSession[],
  context: PassContext,
  constraints: SchedulingConstraints,
): void => {
  for (const resident of residents) {
    if (pass === 3 && !hasUnmetTarget(resident)) continue
    assignResidentInPass(pass, resident, context, constraints)
  }
}
