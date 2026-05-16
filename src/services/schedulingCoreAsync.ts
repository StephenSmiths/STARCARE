import { buildPass12TopUpQueue, hasUnmetTarget } from './schedulingTargets'
import { yieldToMain } from './schedulingYield'
import { assignResidentInPass } from './schedulingCoreResidentAssign'
import type { PassContext } from './schedulingPassContext'
import type { SchedulingConstraints, SchedulingResident } from './schedulingService'

const RESIDENT_YIELD_BATCH = 12

export const executePassAsync = async (
  pass: 1 | 2 | 3,
  residents: SchedulingResident[],
  context: PassContext,
  constraints: SchedulingConstraints,
): Promise<void> => {
  for (let index = 0; index < residents.length; index += 1) {
    if (index > 0 && index % RESIDENT_YIELD_BATCH === 0) await yieldToMain()
    const resident = residents[index]
    if (pass === 3 && !hasUnmetTarget(resident)) continue
    assignResidentInPass(pass, resident, context, constraints)
  }
}

export const fillWeeklyTargetsAsync = async (
  residents: SchedulingResident[],
  context: PassContext,
  constraints: SchedulingConstraints,
): Promise<void> => {
  let shouldContinue = true
  let round = 0
  while (shouldContinue) {
    shouldContinue = false
    round += 1
    const topUpQueue = buildPass12TopUpQueue(residents)
    for (let index = 0; index < topUpQueue.length; index += 1) {
      if (index > 0 && index % RESIDENT_YIELD_BATCH === 0) await yieldToMain()
      const resident = topUpQueue[index]
      const before = resident.weeklyCompletedCount
      assignResidentInPass(3, resident, context, constraints)
      if (resident.weeklyCompletedCount > before) shouldContinue = true
    }
    if (round % 2 === 0) await yieldToMain()
  }
}
