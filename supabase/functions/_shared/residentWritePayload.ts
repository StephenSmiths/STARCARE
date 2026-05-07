/**
 * PDF 01 §4.3：`assessment_next_due_date` 與 `residents-import-validate` 同規則（YYYY-MM-DD 或空）。
 * 寫入白名單：阻擋任意 JSON 直寫 `residents`；**`is_deleted`** 僅能經 `residents-soft-delete` 變更。
 */

const FUNDING = new Set(['GradeA_Subsidized', 'Voucher', 'Private'])
const SERVICE = new Set(['Subsidized_Rehab', 'Dementia_Service', 'Both'])
const DEMENTIA = new Set(['Severe', 'Moderate', 'Mild', 'None'])
const GENDER = new Set(['Male', 'Female'])

const toStr = (v: unknown): string => {
  if (v === null || v === undefined) return ''
  return String(v).trim()
}
const toBool = (v: unknown): boolean => {
  const s = String(v ?? '').trim().toLowerCase()
  return s === 'true' || s === '1' || s === 'yes' || s === 'y'
}

const parseAssessmentNextDueDate = (v: unknown): { ok: true; value: string | null } | { ok: false; message: string } => {
  const raw = toStr(v)
  if (raw === '') return { ok: true, value: null }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return { ok: false, message: 'assessment_next_due_date 須為 YYYY-MM-DD 或留空' }
  }
  return { ok: true, value: raw }
}

const parseBirthDate = (v: unknown): { ok: true; value: string | null } | { ok: false; message: string } => {
  const raw = toStr(v)
  if (raw === '') return { ok: true, value: null }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return { ok: false, message: 'birth_date 須為 YYYY-MM-DD 或留空' }
  }
  return { ok: true, value: raw }
}

type ResidentWritable = {
  name: string
  english_name: string | null
  bed_number: string
  area: string
  gender: string
  birth_date: string | null
  age: number
  admission_date: string
  assessment_next_due_date: string | null
  funding_type: string
  service_type: string
  dementia_level: string
  is_special_care: boolean
  health_condition: string
  medication_record: string
}

const parseWritable = (body: Record<string, unknown>): { ok: true; row: ResidentWritable } | { ok: false; message: string } => {
  const name = toStr(body.name)
  const english_name = toStr(body.english_name)
  const bed_number = toStr(body.bed_number)
  const area = toStr(body.area)
  const gender = toStr(body.gender)
  const birth_date = toStr(body.birth_date)
  const age = Number(body.age)
  const admission_date = toStr(body.admission_date)
  const funding_type = toStr(body.funding_type)
  const service_type = toStr(body.service_type)
  const dementia_level = toStr(body.dementia_level)
  const is_special_care = toBool(body.is_special_care)
  const health_condition = toStr(body.health_condition ?? '')
  const medication_record = toStr(body.medication_record ?? '')

  if (!name) return { ok: false, message: '姓名不可為空' }
  if (!bed_number) return { ok: false, message: '床號不可為空' }
  if (!area) return { ok: false, message: '區域不可為空' }
  if (!GENDER.has(gender)) return { ok: false, message: 'gender 僅允許 Male/Female' }
  if (!Number.isFinite(age) || age < 1 || age > 130) {
    return { ok: false, message: '年齡需介乎 1-130' }
  }
  if (!admission_date) return { ok: false, message: '入院日期不可為空' }
  if (!FUNDING.has(funding_type)) return { ok: false, message: 'funding_type 非法' }
  if (!SERVICE.has(service_type)) return { ok: false, message: 'service_type 非法' }
  if (!DEMENTIA.has(dementia_level)) return { ok: false, message: 'dementia_level 非法' }

  const due = parseAssessmentNextDueDate(body.assessment_next_due_date)
  if (!due.ok) return due
  const birth = parseBirthDate(birth_date)
  if (!birth.ok) return birth

  return {
    ok: true,
    row: {
      name,
      english_name: english_name || null,
      bed_number,
      area,
      gender,
      birth_date: birth.value,
      age,
      admission_date,
      assessment_next_due_date: due.value,
      funding_type,
      service_type,
      dementia_level,
      is_special_care,
      health_condition,
      medication_record,
    },
  }
}

export type ResidentInsertPayload = ResidentWritable & { id: string; is_deleted: boolean }

export const buildResidentCreatePayload = (
  body: Record<string, unknown>,
): { ok: true; row: ResidentInsertPayload } | { ok: false; message: string } => {
  const id = toStr(body.id)
  if (!id) return { ok: false, message: '缺少 id' }
  const w = parseWritable(body)
  if (!w.ok) return w
  return { ok: true, row: { id, ...w.row, is_deleted: false } }
}

export const buildResidentUpdatePayload = (
  body: Record<string, unknown>,
): { ok: true; id: string; fields: ResidentWritable } | { ok: false; message: string } => {
  const id = toStr(body.id)
  if (!id) return { ok: false, message: '缺少 id' }
  const w = parseWritable(body)
  if (!w.ok) return w
  return { ok: true, id, fields: w.row }
}
