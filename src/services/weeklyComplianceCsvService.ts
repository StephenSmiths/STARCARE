import type { FundingType } from './schedulingService'

export interface WeeklyComplianceCsvRow {
  name: string
  fundingType: FundingType
  isCompliant: boolean
}

const fundingLabel = (type: FundingType): string => {
  if (type === 'GradeA_Subsidized') return '甲一買位（EA1）'
  if (type === 'Voucher') return '院舍券'
  return '私位'
}

const escapeCsv = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/** 產出含 UTF-8 BOM 之 CSV，利於 Excel 開啟 */
export const buildWeeklyComplianceCsv = (rows: WeeklyComplianceCsvRow[]): string => {
  const header = ['院友姓名', '資助類別', '是否達標']
  const lines = rows.map((row) => [
    escapeCsv(row.name),
    escapeCsv(fundingLabel(row.fundingType)),
    escapeCsv(row.isCompliant ? '是' : '否'),
  ])
  const bom = '\uFEFF'
  return bom + [header.join(','), ...lines.map((cols) => cols.join(','))].join('\n')
}

const weekStamp = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const downloadWeeklyComplianceCsv = (rows: WeeklyComplianceCsvRow[]): void => {
  const csv = buildWeeklyComplianceCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `本週合規報表_${weekStamp()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
