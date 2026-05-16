import { hasUnmetTarget } from './schedulingTargets'
import { yieldToMain } from './schedulingYield'
import { runPassUntilTarget } from './schedulingCorePassLoop'
import { sortBySC } from './schedulingResidentSort'
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

export const runPassUntilTargetAsync = async (
  pass: 1 | 2,
  residents: SchedulingResident[],
  context: PassContext,
  constraints: SchedulingConstraints,
): Promise<void> => {
  let shouldContinue = true
  let round = 0
  while (shouldContinue) {
    shouldContinue = false
    round += 1
    const candidates = sortBySC(residents.filter(hasUnmetTarget))
    if (candidates.length === 0) break
    for (let index = 0; index < candidates.length; index += 1) {
      if (index > 0 && index % RESIDENT_YIELD_BATCH === 0) await yieldToMain()
      const resident = candidates[index]
      const before = resident.weeklyCompletedCount
      assignResidentInPass(pass, resident, context, constraints)
      if (resident.weeklyCompletedCount > before) shouldContinue = true
    }
    if (round % 2 === 0) await yieldToMain()
  }
}
