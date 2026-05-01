import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'
import type { HistoricalDocumentsFilters } from '../types/historicalDocuments'

const reviewedSortKey = (row: ServiceFormRecord): string => row.reviewedAt ?? row.updatedAt

/** 01 §2.2：僅核准鎖定之紀錄可進入歷史文件匣（PDF 02【10】） */
export const selectApprovedServiceForms = (forms: ServiceFormRecord[]): ServiceFormRecord[] =>
  forms.filter((row) => row.status === 'APPROVED')

const inDateRange = (sessionDate: string, from: string, to: string): boolean => {
  if (from && sessionDate < from) return false
  if (to && sessionDate > to) return false
  return true
}

/** 篩選後依核准／更新時間新到舊排序 */
export const filterApprovedServiceFormsForArchive = (
  approved: ServiceFormRecord[],
  filters: HistoricalDocumentsFilters,
): ServiceFormRecord[] => {
  const kw = filters.keyword.trim().toLowerCase()
  const narrowed = approved.filter((row) => {
    if (!inDateRange(row.sessionDate, filters.dateFrom.trim(), filters.dateTo.trim())) return false
    if (!kw) return true
    return row.residentName.toLowerCase().includes(kw) || row.narrative.toLowerCase().includes(kw)
  })
  return [...narrowed].sort((a, b) => reviewedSortKey(b).localeCompare(reviewedSortKey(a)))
}
