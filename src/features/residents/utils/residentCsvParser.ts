import type { ResidentImportRow } from '../../../repositories/residentImportRepository'

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

const readBool = (value: string): boolean => {
  const raw = value.trim().toLowerCase()
  return raw === 'true' || raw === '1' || raw === 'yes' || raw === 'y'
}

export const parseResidentCsv = (
  text: string,
): { rows: ResidentImportRow[]; errors: ParseError[] } => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  if (lines.length <= 1) return { rows: [], errors: [] }
  const headers = splitCsvLine(lines[0])
  const rows: ResidentImportRow[] = []
  const errors: ParseError[] = []
  for (let idx = 1; idx < lines.length; idx += 1) {
    const cols = splitCsvLine(lines[idx])
    if (cols.length < headers.length) {
      errors.push({ rowIndex: idx + 1, message: '欄位數量不足' })
      continue
    }
    const map = Object.fromEntries(headers.map((h, i) => [h.trim(), cols[i] ?? '']))
    const age = Number(map.age)
    if (!Number.isFinite(age)) {
      errors.push({ rowIndex: idx + 1, message: 'age 需為數字' })
      continue
    }
    const dueRaw = (map.assessmentNextDueDate ?? map.assessment_next_due_date ?? '').trim()
    rows.push({
      name: map.name ?? '',
      bedNumber: map.bedNumber ?? '',
      area: map.area ?? '',
      gender: (map.gender as ResidentImportRow['gender']) ?? 'Female',
      age,
      admissionDate: map.admissionDate ?? '',
      ...(dueRaw ? { assessmentNextDueDate: dueRaw } : {}),
      fundingType: (map.fundingType as ResidentImportRow['fundingType']) ?? 'GradeA_Subsidized',
      serviceType: (map.serviceType as ResidentImportRow['serviceType']) ?? 'Subsidized_Rehab',
      dementiaLevel: (map.dementiaLevel as ResidentImportRow['dementiaLevel']) ?? 'None',
      isSpecialCareCase: readBool(map.isSpecialCareCase ?? ''),
      healthCondition: map.healthCondition ?? '',
      medicationRecord: map.medicationRecord ?? '',
    })
  }
  return { rows, errors }
}
