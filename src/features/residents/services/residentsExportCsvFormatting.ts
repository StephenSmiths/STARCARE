import type { Resident } from '../types/resident'

export const escapeCsvValue = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export const residentFundingExportLabel = (value: Resident['fundingType']): string => {
  if (value === 'GradeA_Subsidized') return '甲一買位（EA1）'
  if (value === 'Voucher') return '院舍券'
  return '私位'
}

export const residentServiceTypeExportLabel = (value: Resident['serviceType']): string => {
  if (value === 'Subsidized_Rehab') return '資助復康'
  if (value === 'Dementia_Service') return '認知服務'
  return '雙軌'
}

/** 與 `residents-import-template.csv` 末欄機讀代碼一致 */
export const residentSpecialCareCaseExportCode = (row: Resident): string =>
  row.isSpecialCareCase ? 'true' : 'false'

export const residentsExportCsvDateStamp = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
