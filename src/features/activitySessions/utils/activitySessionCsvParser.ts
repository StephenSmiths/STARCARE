import type { ActivitySessionImportRow } from '../../../repositories/activitySessionImportRepository'
import { ACTIVITY_SESSIONS_WORKSPACE_FACILITY_ID } from '../constants/activitySessionsWorkspaceDefaults'

type ParseError = { rowIndex: number; message: string }

const splitCsvLine = (line: string): string[] => {
  const out: string[] = []
  let current = ''
  let inQuote = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuote = !inQuote
      }
      continue
    }
    if (ch === ',' && !inQuote) {
      out.push(current.trim())
      current = ''
      continue
    }
    current += ch
  }
  out.push(current.trim())
  return out
}

export const parseActivitySessionCsv = (
  text: string,
): { rows: ActivitySessionImportRow[]; errors: ParseError[] } => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  if (lines.length <= 1) return { rows: [], errors: [] }
  const headers = splitCsvLine(lines[0])
  const rows: ActivitySessionImportRow[] = []
  const errors: ParseError[] = []
  for (let idx = 1; idx < lines.length; idx += 1) {
    const cols = splitCsvLine(lines[idx])
    if (cols.length < headers.length) {
      errors.push({ rowIndex: idx + 1, message: '欄位數量不足' })
      continue
    }
    const map = Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? '']))
    const capacity = Number(map.capacity)
    if (!Number.isFinite(capacity)) {
      errors.push({ rowIndex: idx + 1, message: 'capacity 需為數字' })
      continue
    }
    rows.push({
      id: map.id?.trim() || undefined,
      facilityId: map.facilityId?.trim() || ACTIVITY_SESSIONS_WORKSPACE_FACILITY_ID,
      activityId: map.activityId?.trim() ?? '',
      staffProfileId: map.staffProfileId?.trim() ?? '',
      sessionDate: map.sessionDate?.trim() ?? '',
      timeSlot: map.timeSlot?.trim() ?? '',
      capacity,
    })
  }
  return { rows, errors }
}
