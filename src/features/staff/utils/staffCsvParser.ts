import type { StaffImportRow } from '../../../repositories/staffImportRepository'
import { STAFF_WORKSPACE_FACILITY_ID } from '../constants/staffWorkspaceDefaults'

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

const headerValue = (map: Record<string, string>, aliases: string[]): string => {
  for (const key of aliases) {
    const hit = map[key]
    if (hit !== undefined) return hit
  }
  return ''
}

const normalizeRoleType = (value: string): StaffImportRow['roleType'] | string => {
  const raw = value.trim().toUpperCase()
  if (!raw) return ''
  if (raw === 'PT' || raw === 'PTA' || raw === 'OT' || raw === 'OTA') return raw as StaffImportRow['roleType']
  if (raw === 'TEAMLEAD') return 'TeamLead'
  return value.trim()
}

const normalizeGender = (
  value: string,
): { gender?: StaffImportRow['gender']; invalid?: boolean } => {
  const raw = value.trim()
  if (raw === '') return {}
  if (raw === '男' || raw.toLowerCase() === 'male') return { gender: 'Male' }
  if (raw === '女' || raw.toLowerCase() === 'female') return { gender: 'Female' }
  return { invalid: true }
}

export const parseStaffCsv = (text: string): { rows: StaffImportRow[]; errors: ParseError[] } => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  if (lines.length <= 1) return { rows: [], errors: [] }
  const headers = splitCsvLine(lines[0])
  const rows: StaffImportRow[] = []
  const errors: ParseError[] = []
  for (let idx = 1; idx < lines.length; idx += 1) {
    const cols = splitCsvLine(lines[idx])
    if (cols.length < headers.length) {
      errors.push({ rowIndex: idx + 1, message: '欄位數量不足' })
      continue
    }
    const map = Object.fromEntries(headers.map((h, i) => [h.trim(), cols[i] ?? '']))
    const idRaw = headerValue(map, ['員工編號', 'id', 'Id'])
    const facilityRaw = headerValue(map, ['facilityId', 'facility_id', '設備id', '院舍編號'])
    const displayName = headerValue(map, ['姓名', 'displayName', 'DisplayName'])
    const roleParsed = normalizeRoleType(headerValue(map, ['職位', 'roleType', 'RoleType']))
    const scopeRaw = headerValue(map, ['serviceScope', 'ServiceScope']).trim()
    const genderRaw = headerValue(map, ['性別', 'gender'])
    const genderParsed = normalizeGender(genderRaw)
    if (genderParsed.invalid) {
      errors.push({ rowIndex: idx + 1, message: '性別須為 男／女（或 Male／Female）' })
      continue
    }
    const phone = headerValue(map, ['聯絡電話', 'phone'])
    const email = headerValue(map, ['電子郵箱', '電子郵件', 'email'])

    const legacyScope =
      scopeRaw === 'Subsidized_Rehab' || scopeRaw === 'Dementia_Care' || scopeRaw === 'Both'
        ? (scopeRaw as StaffImportRow['serviceScope'])
        : ('Both' as const)

    const roleType = (roleParsed === '' ? 'PT' : roleParsed) as StaffImportRow['roleType']

    rows.push({
      id: idRaw || undefined,
      facilityId: facilityRaw || STAFF_WORKSPACE_FACILITY_ID,
      displayName,
      roleType,
      serviceScope: legacyScope,
      gender: genderParsed.gender,
      phone,
      email,
    })
  }
  return { rows, errors }
}
