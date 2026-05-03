import type { StaffOverviewRow } from './staffManagementService'

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

/** 對齊 staff_profiles.role_type；無主檔資料時留空 */
const roleTypeCell = (row: StaffOverviewRow): string => escapeCsv(row.roleType ?? '')

/** PDF 02【13】員工概覽匯出（CSV + UTF-8 BOM，Excel 可開） */
export const buildStaffOverviewExportCsv = (rows: StaffOverviewRow[]): string => {
  const header = ['員工ID', '名稱', '職類', '可排時段數', '技能數']
  const lines = rows.map((row) => [
    escapeCsv(row.staffId),
    escapeCsv(row.staffName),
    roleTypeCell(row),
    escapeCsv(String(row.sessionCount)),
    escapeCsv(String(row.skillCount)),
  ])
  const bom = '\uFEFF'
  return bom + [header.join(','), ...lines.map((cols) => cols.join(','))].join('\n')
}

export const downloadStaffOverviewExportCsv = (rows: StaffOverviewRow[]): void => {
  const csv = buildStaffOverviewExportCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `員工概覽_${dateStamp()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
