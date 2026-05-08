import type { Resident } from '../types/resident'

/** 院友卡片顯示用中文標籤（僅顯示層，資料儲存維持既有英碼）。 */
export const residentFundingLabelZh = (value: Resident['fundingType']): string => {
  if (value === 'GradeA_Subsidized') return '甲一買位'
  if (value === 'Voucher') return '院舍券'
  return '私位'
}

export const residentDementiaLevelLabelZh = (value: Resident['dementiaLevel']): string => {
  if (value === 'Severe') return '重度'
  if (value === 'Moderate') return '中度'
  if (value === 'Mild') return '輕度'
  return '沒有認知障礙'
}

export const residentSpecialCareLabelZh = (isSpecialCareCase: boolean): string =>
  isSpecialCareCase ? 'SC' : '非SC'
