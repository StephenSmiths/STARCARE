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
  return raw === 'true' || raw === '1' || raw === 'yes' || raw === 'y' || raw === '是'
}

const headerValue = (map: Record<string, string>, aliases: string[]): string => {
  for (const key of aliases) {
    const hit = map[key]
    if (hit !== undefined) return hit
  }
  return ''
}

const normalizeGender = (value: string): string => {
  const raw = value.trim()
  if (raw === '男' || raw.toLowerCase() === 'male') return 'Male'
  if (raw === '女' || raw.toLowerCase() === 'female') return 'Female'
  return ''
}

const normalizeFundingType = (value: string): string => {
  const raw = value.trim()
  if (raw === '甲一買位' || raw === 'GradeA_Subsidized') return 'GradeA_Subsidized'
  if (raw === '院舍券' || raw === 'Voucher') return 'Voucher'
  if (raw === '私位' || raw === 'Private') return 'Private'
  return ''
}

const normalizeServiceType = (value: string): string => {
  const raw = value.trim()
  if (raw === '資助復康服務' || raw === 'Subsidized_Rehab') return 'Subsidized_Rehab'
  if (raw === '認知障礙症服務' || raw === 'Dementia_Service') return 'Dementia_Service'
  if (raw === 'Both') return 'Both'
  return ''
}

const splitServiceTypes = (value: string): string[] =>
  value
    .split(/[、,，;；/|+]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

const normalizeServiceTypes = (value: string): Array<'Subsidized_Rehab' | 'Dementia_Service'> => {
  const raw = value.trim()
  if (!raw) return []
  if (raw === 'Both') return ['Subsidized_Rehab', 'Dementia_Service']
  const picked = new Set<'Subsidized_Rehab' | 'Dementia_Service'>()
  for (const token of splitServiceTypes(raw)) {
    const normalized = normalizeServiceType(token)
    if (normalized === 'Subsidized_Rehab' || normalized === 'Dementia_Service') {
      picked.add(normalized)
    }
    if (normalized === 'Both') {
      picked.add('Subsidized_Rehab')
      picked.add('Dementia_Service')
    }
  }
  return Array.from(picked)
}

const deriveServiceType = (
  items: Array<'Subsidized_Rehab' | 'Dementia_Service'>,
  raw: string,
): ResidentImportRow['serviceType'] => {
  if (items.length >= 2) return 'Both'
  if (items.length === 1) return items[0]
  if (raw.trim() === '') return 'Subsidized_Rehab'
  return '' as ResidentImportRow['serviceType']
}

const normalizeDementiaLevel = (value: string): string => {
  const raw = value.trim()
  if (raw === '重度' || raw === 'Severe') return 'Severe'
  if (raw === '中度' || raw === 'Moderate') return 'Moderate'
  if (raw === '輕度' || raw === 'Mild') return 'Mild'
  if (raw === '沒有認知障礙' || raw === 'None') return 'None'
  return ''
}

const normalizeDateText = (value: string): string => {
  const raw = value.trim()
  if (!raw) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(raw)) return raw.replaceAll('/', '-')
  const zhMatch = raw.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/)
  if (!zhMatch) return raw
  const [, y, m, d] = zhMatch
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
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
    const ageRaw = headerValue(map, ['age', '年齡'])
    const age = Number(ageRaw)
    if (!Number.isFinite(age)) {
      errors.push({ rowIndex: idx + 1, message: '年齡需為數字' })
      continue
    }
    const dueRaw = normalizeDateText(
      headerValue(map, ['assessmentNextDueDate', 'assessment_next_due_date', '下次評估日期']),
    )
    const birthDateRaw = normalizeDateText(headerValue(map, ['birthDate', '出生日期']))
    const rawServiceType = headerValue(map, ['服務類型', 'serviceType'])
    const serviceTypes = normalizeServiceTypes(rawServiceType)
    rows.push({
      name: headerValue(map, ['中文姓名', 'name']),
      englishName: headerValue(map, ['英文姓名', 'englishName']),
      bedNumber: headerValue(map, ['床號', 'bedNumber']),
      area: headerValue(map, ['區域', 'area']),
      gender: normalizeGender(headerValue(map, ['性別', 'gender'])) as ResidentImportRow['gender'],
      ...(birthDateRaw ? { birthDate: birthDateRaw } : {}),
      age,
      admissionDate: normalizeDateText(headerValue(map, ['入院日期', 'admissionDate'])),
      ...(dueRaw ? { assessmentNextDueDate: dueRaw } : {}),
      fundingType: normalizeFundingType(headerValue(map, ['資助類別', 'fundingType'])) as ResidentImportRow['fundingType'],
      serviceTypes,
      serviceType: deriveServiceType(serviceTypes, rawServiceType),
      dementiaLevel: normalizeDementiaLevel(
        headerValue(map, ['認知障礙症程度', 'dementiaLevel']),
      ) as ResidentImportRow['dementiaLevel'],
      isSpecialCareCase: readBool(headerValue(map, ['是否Special Care Case', 'isSpecialCareCase'])),
      healthCondition: headerValue(map, ['健康狀況', 'healthCondition']),
      medicationRecord: headerValue(map, ['用藥記錄', 'medicationRecord']),
    })
  }
  return { rows, errors }
}
