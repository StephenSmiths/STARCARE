import type { Resident } from '../types/resident'
import { buildResidentsExportCsv } from './residentsExportCsvBuild'
import { residentsExportCsvDateStamp } from './residentsExportCsvFormatting'

export const downloadResidentsExportCsv = (rows: Resident[]): void => {
  const csv = buildResidentsExportCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `院友名單_${residentsExportCsvDateStamp()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
