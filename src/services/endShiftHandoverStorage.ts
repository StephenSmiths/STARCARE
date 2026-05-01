import type { EndShiftHandoverRecord } from '../features/endShiftHandover/types/endShiftHandover'

const STORAGE_KEY = 'starcare-shift-end-handover-v1'

/** 收工交更紀錄（localStorage）；正式版應改 Repository／DB `is_deleted` */
export const loadEndShiftHandovers = (): EndShiftHandoverRecord[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as EndShiftHandoverRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveEndShiftHandovers = (rows: EndShiftHandoverRecord[]): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

export const upsertEndShiftHandoverRow = (row: EndShiftHandoverRecord): EndShiftHandoverRecord[] => {
  const all = loadEndShiftHandovers()
  const idx = all.findIndex((item) => item.id === row.id)
  const next = idx >= 0 ? [...all.slice(0, idx), row, ...all.slice(idx + 1)] : [row, ...all]
  saveEndShiftHandovers(next)
  return next
}
