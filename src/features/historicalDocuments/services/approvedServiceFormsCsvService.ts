import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'

const escapeCsv = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const dateStamp = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** UTF-8 BOM，Excel 可直接開啟（PDF 02【10】匯出占位） */
export const buildApprovedServiceFormsCsv = (rows: ServiceFormRecord[]): string => {
  const header = [
    '表單ID',
    '工作節日期',
    '工作節ID',
    '院友ID',
    '院友姓名',
    '紀要',
    '核准時間',
    '審核者',
    '填表人',
    '員工檔ID',
  ]
  const lines = rows.map((row) => [
    escapeCsv(row.id),
    escapeCsv(row.sessionDate),
    escapeCsv(row.sessionId),
    escapeCsv(row.residentId),
    escapeCsv(row.residentName),
    escapeCsv(row.narrative),
    escapeCsv(row.reviewedAt ?? ''),
    escapeCsv(row.reviewerActorId ?? ''),
    escapeCsv(row.ownerActorId),
    escapeCsv(row.staffProfileId),
  ])
  const bom = '\uFEFF'
  return bom + [header.join(','), ...lines.map((cols) => cols.join(','))].join('\n')
}

export const downloadApprovedServiceFormsCsv = (rows: ServiceFormRecord[]): void => {
  const csv = buildApprovedServiceFormsCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `已核准服務紀錄_${dateStamp()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
