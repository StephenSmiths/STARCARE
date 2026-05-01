import type { Resident } from '../types/resident'

const escapeCsv = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const fundingLabel = (value: Resident['fundingType']): string => {
  if (value === 'GradeA_Subsidized') return '甲一買位（EA1）'
  if (value === 'Voucher') return '院舍券'
  return '私位'
}

const serviceTypeLabel = (value: Resident['serviceType']): string => {
  if (value === 'Subsidized_Rehab') return '資助復康'
  if (value === 'Dementia_Service') return '認知服務'
  return '雙軌'
}

const dateStamp = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** PDF 02【12】院友名單匯出（CSV + UTF-8 BOM，Excel 可開） */
export const buildResidentsExportCsv = (rows: Resident[]): string => {
  const header = [
    '院友ID',
    '姓名',
    '床號',
    '區域',
    '性別',
    '年齡',
    '入院日期',
    '資助類別',
    '服務類型',
    '認知程度',
    '特殊照護',
    '健康狀況',
    '用藥紀錄',
  ]
  const lines = rows.map((row) => [
    escapeCsv(row.id),
    escapeCsv(row.name),
    escapeCsv(row.bedNumber),
    escapeCsv(row.area),
    escapeCsv(row.gender),
    escapeCsv(String(row.age)),
    escapeCsv(row.admissionDate),
    escapeCsv(fundingLabel(row.fundingType)),
    escapeCsv(serviceTypeLabel(row.serviceType)),
    escapeCsv(row.dementiaLevel),
    escapeCsv(row.isSpecialCareCase ? '是' : '否'),
    escapeCsv(row.healthCondition),
    escapeCsv(row.medicationRecord),
  ])
  const bom = '\uFEFF'
  return bom + [header.join(','), ...lines.map((cols) => cols.join(','))].join('\n')
}

export const downloadResidentsExportCsv = (rows: Resident[]): void => {
  const csv = buildResidentsExportCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `院友名單_${dateStamp()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
