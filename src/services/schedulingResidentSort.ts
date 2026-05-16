import type { SchedulingResident } from './schedulingService'

/** PDF 01 §3.2：SC 院友於同 Pass 內享有最高優先序 */
export const sortBySC = (residents: SchedulingResident[]): SchedulingResident[] => {
  return [...residents].sort((a, b) => Number(b.isSpecialCareCase) - Number(a.isSpecialCareCase))
}
