import type { FundingType } from '../../../services/schedulingService'
import { uiTokens } from '../../shared/ui/uiTokens'

export const residentFundingLabel = (type: FundingType): string => {
  if (type === 'GradeA_Subsidized') return '甲一買位（EA1）'
  if (type === 'Voucher') return '院舍券'
  return '私位'
}

export const residentFundingBadgeClass = (type: FundingType): string => {
  if (type === 'GradeA_Subsidized') return uiTokens.residentTableFundingBadgeGradeA
  if (type === 'Voucher') return uiTokens.residentTableFundingBadgeVoucher
  return uiTokens.residentTableFundingBadgePrivate
}
