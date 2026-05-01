import type { SchedulingComplianceAlert } from './schedulingComplianceAlertService'
import type { FundingType } from './schedulingService'

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

const levelLabel = (level: SchedulingComplianceAlert['level']): string =>
  level === 'high' ? '高優先' : level

const todayStamp = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 匯出週三資助復康 0 次提醒清單（供 TeamLead 稽核）。 */
export const buildSchedulingComplianceAlertsCsv = (
  alerts: SchedulingComplianceAlert[],
  exportedAt: Date = new Date(),
): string => {
  const header = ['提醒代碼', '提醒等級', '院友ID', '院友姓名', '資助類別', '提醒內容', '匯出日期']
  const dateLabel = exportedAt.toISOString()
  const lines = alerts.map((alert) => [
    escapeCsv(alert.code),
    escapeCsv(levelLabel(alert.level)),
    escapeCsv(alert.residentId),
    escapeCsv(alert.residentName),
    escapeCsv(fundingLabel(alert.fundingType)),
    escapeCsv(alert.message),
    escapeCsv(dateLabel),
  ])
  const bom = '\uFEFF'
  return bom + [header.join(','), ...lines.map((cols) => cols.join(','))].join('\n')
}

export const downloadSchedulingComplianceAlertsCsv = (
  alerts: SchedulingComplianceAlert[],
): void => {
  const csv = buildSchedulingComplianceAlertsCsv(alerts)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `週三零次提醒_${todayStamp()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
