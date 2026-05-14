import { describe, expect, it } from 'vitest'
import { uiTokens } from '../../shared/ui/uiTokens'
import { residentFundingBadgeClass, residentFundingLabel } from './residentTableFundingPresentation'

describe('residentTableFundingPresentation（院友表資助標籤）', () => {
  it('residentFundingLabel 對應三種資助類別文案', () => {
    expect(residentFundingLabel('GradeA_Subsidized')).toBe('甲一買位（EA1）')
    expect(residentFundingLabel('Voucher')).toBe('院舍券')
    expect(residentFundingLabel('Private')).toBe('私位')
  })

  it('residentFundingBadgeClass 與 uiTokens 一致', () => {
    expect(residentFundingBadgeClass('GradeA_Subsidized')).toBe(uiTokens.residentTableFundingBadgeGradeA)
    expect(residentFundingBadgeClass('Voucher')).toBe(uiTokens.residentTableFundingBadgeVoucher)
    expect(residentFundingBadgeClass('Private')).toBe(uiTokens.residentTableFundingBadgePrivate)
  })
})
