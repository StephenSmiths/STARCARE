import type { SchedulingKpiRunRecord, SchedulingKpiSnapshot } from './schedulingKpiService'

const STORAGE_PREFIX = 'starcare:kpi_run_history:v1:'

export const schedulingKpiHistoryStorageKey = (facilityId: string): string =>
  `${STORAGE_PREFIX}${facilityId}`

const isKpiSnapshot = (value: unknown): value is SchedulingKpiSnapshot => {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.coverageRate === 'number' &&
    typeof v.conflictRatePer100 === 'number' &&
    typeof v.averageAssignmentsPerResident === 'number' &&
    typeof v.underTargetRate === 'number'
  )
}

const isRunRecord = (value: unknown): value is SchedulingKpiRunRecord => {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.ranAt === 'string' &&
    isKpiSnapshot(v.kpis) &&
    typeof v.residentCount === 'number' &&
    typeof v.assignmentCount === 'number' &&
    typeof v.conflictCount === 'number'
  )
}

/** Phase 4 Day 3：從 localStorage 還原 KPI 趨勢（僅本機瀏覽器） */
export const loadKpiRunHistory = (facilityId: string): SchedulingKpiRunRecord[] => {
  if (typeof window === 'undefined' || !window.localStorage) return []
  try {
    const raw = window.localStorage.getItem(schedulingKpiHistoryStorageKey(facilityId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    const rows = parsed.filter(isRunRecord).slice(0, 10)
    return rows
  } catch {
    return []
  }
}

/** Phase 4 Day 3：寫入 localStorage（最多 10 筆） */
export const saveKpiRunHistory = (facilityId: string, rows: SchedulingKpiRunRecord[]): void => {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.setItem(
      schedulingKpiHistoryStorageKey(facilityId),
      JSON.stringify(rows.slice(0, 10)),
    )
  } catch {
    /* ignore quota / private mode */
  }
}

/** Phase 4 Day 5：手動清除本機 KPI 趨勢歷史 */
export const clearKpiRunHistory = (facilityId: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.removeItem(schedulingKpiHistoryStorageKey(facilityId))
  } catch {
    /* ignore private mode */
  }
}
