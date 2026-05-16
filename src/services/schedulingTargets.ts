import type { FundingType, SchedulingResident } from './schedulingService'

/**
 * PDF 01 §3.2 表：甲一（EA1）、院舍券之「每週最低／目標次數」於 MVP 固定為 **2**（與 PDF 02【3】Pass 2 客戶重申一致）。
 * 私位（Private）現程為每週 **1** 次；`pdf-alignment-p0-backlog` Seq 6 載 02 可能為「每週最多 2 次」—須客戶單一裁定前 **不得**逕改為 2。
 */
export const getWeeklyTargetByFundingType = (fundingType: FundingType): number => {
  if (fundingType === 'GradeA_Subsidized') return 2
  if (fundingType === 'Voucher') return 2
  return 1
}

export const hasUnmetTarget = (resident: SchedulingResident): boolean => {
  return resident.weeklyCompletedCount < getWeeklyTargetByFundingType(resident.fundingType)
}

const pass12FundingPriority = (fundingType: FundingType): number => {
  if (fundingType === 'GradeA_Subsidized') return 0
  if (fundingType === 'Voucher') return 1
  return 2
}

const sortResidentsByTargetDeficit = (residents: SchedulingResident[]): SchedulingResident[] => {
  return [...residents].sort((a, b) => {
    const fundingOrder =
      pass12FundingPriority(a.fundingType) - pass12FundingPriority(b.fundingType)
    if (fundingOrder !== 0) return fundingOrder
    const scOrder = Number(b.isSpecialCareCase) - Number(a.isSpecialCareCase)
    if (scOrder !== 0) return scOrder
    const deficitA = getWeeklyTargetByFundingType(a.fundingType) - a.weeklyCompletedCount
    const deficitB = getWeeklyTargetByFundingType(b.fundingType) - b.weeklyCompletedCount
    return deficitB - deficitA
  })
}

export const buildTopUpQueue = (residents: SchedulingResident[]): SchedulingResident[] => {
  return sortResidentsByTargetDeficit(residents.filter(hasUnmetTarget))
}

/** PDF 01 §3.2：`fillWeeklyTargets` 僅補甲一／院舍券週目標；私位由 Pass 3 處理 */
export const buildPass12TopUpQueue = (residents: SchedulingResident[]): SchedulingResident[] => {
  return sortResidentsByTargetDeficit(
    residents.filter((resident) => hasUnmetTarget(resident) && resident.fundingType !== 'Private'),
  )
}
