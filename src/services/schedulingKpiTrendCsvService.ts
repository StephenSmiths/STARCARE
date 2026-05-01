import type { SchedulingKpiRunRecord } from './schedulingKpiService'

const escapeCsv = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const stamp = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}${m}${day}_${h}${min}`
}

/** Phase 4 Day 3：產出 KPI 趨勢 CSV（UTF-8 BOM，利於 Excel） */
export const buildSchedulingKpiTrendCsv = (
  facilityId: string,
  records: SchedulingKpiRunRecord[],
): string => {
  const header = [
    'facilityId',
    'ranAt',
    'coverageRate_pct',
    'conflictRatePer100_pct',
    'averageAssignmentsPerResident',
    'underTargetRate_pct',
    'residentCount',
    'assignmentCount',
    'conflictCount',
  ]
  const lines = records.map((row) => {
    const k = row.kpis
    return [
      escapeCsv(facilityId),
      escapeCsv(row.ranAt),
      String(k.coverageRate),
      String(k.conflictRatePer100),
      String(k.averageAssignmentsPerResident),
      String(k.underTargetRate),
      String(row.residentCount),
      String(row.assignmentCount),
      String(row.conflictCount),
    ].join(',')
  })
  const bom = '\uFEFF'
  return bom + [header.join(','), ...lines].join('\n')
}

export const downloadSchedulingKpiTrendCsv = (
  facilityId: string,
  records: SchedulingKpiRunRecord[],
): void => {
  if (records.length === 0) return
  const csv = buildSchedulingKpiTrendCsv(facilityId, records)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `排班KPI趨勢_${facilityId}_${stamp()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
