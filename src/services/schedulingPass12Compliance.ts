import { buildPass12TopUpQueue } from './schedulingTargets'
import type { SchedulingResident } from './schedulingService'

/** PDF 01 §3.2：甲一／院舍券未達週目標前不得進入 Pass 3（私位） */
export const hasPass12ResidentsUnmet = (residents: readonly SchedulingResident[]): boolean =>
  buildPass12TopUpQueue(residents).length > 0

export const resolvePass12TopUpPass = (resident: SchedulingResident): 1 | 2 =>
  resident.fundingType === 'GradeA_Subsidized' ? 1 : 2
