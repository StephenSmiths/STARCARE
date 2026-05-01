import type { ShiftStartHandoverRecord } from '../features/shiftStartHandover/types/shiftStartHandover'

const STORAGE_KEY = 'starcare-shift-start-handover-v1'

/** 開工接更紀錄（localStorage）；正式版應改 Repository／DB `is_deleted` */
export const loadShiftStartHandovers = (): ShiftStartHandoverRecord[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ShiftStartHandoverRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveShiftStartHandovers = (rows: ShiftStartHandoverRecord[]): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

export const upsertShiftStartHandoverRow = (row: ShiftStartHandoverRecord): ShiftStartHandoverRecord[] => {
  const all = loadShiftStartHandovers()
  const idx = all.findIndex((item) => item.id === row.id)
  const next = idx >= 0 ? [...all.slice(0, idx), row, ...all.slice(idx + 1)] : [row, ...all]
  saveShiftStartHandovers(next)
  return next
}
