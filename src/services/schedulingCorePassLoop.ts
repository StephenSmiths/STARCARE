import { hasUnmetTarget } from './schedulingTargets'
import { assignResidentInPass } from './schedulingCoreResidentAssign'
import { sortBySC } from './schedulingResidentSort'
import type { PassContext } from './schedulingPassContext'
import type { SchedulingConstraints, SchedulingResident } from './schedulingService'

/** PDF 01 §3.2：單一 Pass 反覆補位直至該群皆達週目標或本輪無進展 */
export const runPassUntilTarget = (
  pass: 1 | 2,
  residents: SchedulingResident[],
  context: PassContext,
  constraints: SchedulingConstraints,
): void => {
  let shouldContinue = true
  while (shouldContinue) {
    shouldContinue = false
    const candidates = sortBySC(residents.filter(hasUnmetTarget))
    if (candidates.length === 0) break
    for (const resident of candidates) {
      const before = resident.weeklyCompletedCount
      assignResidentInPass(pass, resident, context, constraints)
      if (resident.weeklyCompletedCount > before) shouldContinue = true
    }
  }
}
