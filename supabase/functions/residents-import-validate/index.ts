import { guardTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'

type IncomingRow = Record<string, unknown>
type ErrorItem = { rowIndex: number; field: string; message: string }

const FUNDING = new Set(['GradeA_Subsidized', 'Voucher', 'Private'])
const SERVICE = new Set(['Subsidized_Rehab', 'Dementia_Service', 'Both'])
const DEMENTIA = new Set(['Severe', 'Moderate', 'Mild', 'None'])
const GENDER = new Set(['Male', 'Female'])

const toStr = (v: unknown): string => String(v ?? '').trim()
const toBool = (v: unknown): boolean => {
  const s = String(v ?? '').trim().toLowerCase()
  return s === 'true' || s === '1' || s === 'yes' || s === 'y'
}

const normalize = (row: IncomingRow) => {
  const dueRaw = toStr(row.assessmentNextDueDate ?? row.assessment_next_due_date)
  return {
    name: toStr(row.name),
    english_name: toStr(row.englishName ?? row.english_name),
    bed_number: toStr(row.bedNumber ?? row.bed_number),
    area: toStr(row.area),
    gender: toStr(row.gender),
    birth_date: toStr(row.birthDate ?? row.birth_date),
    age: Number(row.age),
    admission_date: toStr(row.admissionDate ?? row.admission_date),
    funding_type: toStr(row.fundingType ?? row.funding_type),
    service_type: toStr(row.serviceType ?? row.service_type),
    dementia_level: toStr(row.dementiaLevel ?? row.dementia_level),
    is_special_care: toBool(row.isSpecialCareCase ?? row.is_special_care),
    health_condition: toStr(row.healthCondition ?? row.health_condition),
    medication_record: toStr(row.medicationRecord ?? row.medication_record),
    assessment_next_due_date: dueRaw === '' ? null : dueRaw,
  }
}

const validateRow = (row: ReturnType<typeof normalize>, rowIndex: number): ErrorItem[] => {
  const errors: ErrorItem[] = []
  if (!row.name) errors.push({ rowIndex, field: 'name', message: '姓名不可為空' })
  if (!row.bed_number) errors.push({ rowIndex, field: 'bed_number', message: '床號不可為空' })
  if (!row.area) errors.push({ rowIndex, field: 'area', message: '區域不可為空' })
  if (!GENDER.has(row.gender)) errors.push({ rowIndex, field: 'gender', message: 'gender 僅允許 Male/Female' })
  if (row.birth_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.birth_date)) {
    errors.push({ rowIndex, field: 'birth_date', message: '須為 YYYY-MM-DD 或留空' })
  }
  if (!Number.isFinite(row.age) || row.age < 1 || row.age > 130) {
    errors.push({ rowIndex, field: 'age', message: '年齡需介乎 1-130' })
  }
  if (!row.admission_date) errors.push({ rowIndex, field: 'admission_date', message: '入院日期不可為空' })
  if (!FUNDING.has(row.funding_type)) {
    errors.push({ rowIndex, field: 'funding_type', message: 'funding_type 非法' })
  }
  if (!SERVICE.has(row.service_type)) {
    errors.push({ rowIndex, field: 'service_type', message: 'service_type 非法' })
  }
  if (!DEMENTIA.has(row.dementia_level)) {
    errors.push({ rowIndex, field: 'dementia_level', message: 'dementia_level 非法' })
  }
  if (
    row.assessment_next_due_date != null &&
    row.assessment_next_due_date !== '' &&
    !/^\d{4}-\d{2}-\d{2}$/.test(row.assessment_next_due_date)
  ) {
    errors.push({ rowIndex, field: 'assessment_next_due_date', message: '須為 YYYY-MM-DD 或留空' })
  }
  return errors
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const denied = await guardTeamLeadOrAdmin(req)
  if (denied) return denied
  try {
    const body = (await req.json()) as { rows?: IncomingRow[] }
    const incoming = body.rows ?? []
    if (incoming.length === 0) return json({ error: 'rows 不可為空' }, 400)

    const rows = incoming.map(normalize)
    const errors: ErrorItem[] = []
    rows.forEach((row, idx) => errors.push(...validateRow(row, idx + 1)))

    const seen = new Set<string>()
    for (let i = 0; i < rows.length; i += 1) {
      const bed = rows[i].bed_number
      if (!bed) continue
      if (seen.has(bed)) {
        errors.push({ rowIndex: i + 1, field: 'bed_number', message: 'CSV 內床號重覆' })
      } else {
        seen.add(bed)
      }
    }

    const supabase = getServiceClient()
    const bedNumbers = rows.map((r) => r.bed_number).filter(Boolean)
    if (bedNumbers.length > 0) {
      const { data, error } = await supabase
        .from('residents')
        .select('bed_number')
        .eq('is_deleted', false)
        .in('bed_number', bedNumbers)
      if (error) return json({ error: error.message }, 400)
      const occupied = new Set((data ?? []).map((r) => String(r.bed_number)))
      rows.forEach((row, idx) => {
        if (occupied.has(row.bed_number)) {
          errors.push({ rowIndex: idx + 1, field: 'bed_number', message: '床號已存在於系統' })
        }
      })
    }

    const invalidRows = new Set(errors.map((e) => e.rowIndex))
    const validRows = rows.filter((_, idx) => !invalidRows.has(idx + 1))
    return json({
      ok: errors.length === 0,
      summary: { total: rows.length, valid: validRows.length, invalid: invalidRows.size },
      errors,
      preview: validRows,
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
