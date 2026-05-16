import { hasUnmetTarget } from './schedulingTargets'
import { assignResidentInPass } from './schedulingCoreResidentAssign'
import type { PassContext } from './schedulingPassContext'
import type { SchedulingConstraints, SchedulingResident, SchedulingSession } from './schedulingService'

export type { PassContext } from './schedulingPassContext'
export { runPassUntilTarget } from './schedulingCorePassLoop'
export { sortBySC } from './schedulingResidentSort'

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
