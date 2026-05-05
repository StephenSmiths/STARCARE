import type { Resident, ResidentInput } from '../types/resident'

/** 合併後院友主檔：§4.3 錨點空白字串正規化為 null（與 `normalizeResidentInput` 一致） */
export const normalizeResidentAssessmentAnchor = (resident: Resident): Resident => {
  const raw = resident.assessmentNextDueDate
  if (raw === undefined || raw === null) {
    return { ...resident, assessmentNextDueDate: null }
  }
  const t = String(raw).trim()
  return { ...resident, assessmentNextDueDate: t === '' ? null : t }
}

export const residentToInput = (resident: Resident): ResidentInput => ({
  name: resident.name,
  bedNumber: resident.bedNumber,
  area: resident.area,
  gender: resident.gender,
  age: resident.age,
  admissionDate: resident.admissionDate,
  assessmentNextDueDate: resident.assessmentNextDueDate ?? null,
  fundingType: resident.fundingType,
  serviceType: resident.serviceType,
  dementiaLevel: resident.dementiaLevel,
  isSpecialCareCase: resident.isSpecialCareCase,
  healthCondition: resident.healthCondition,
  medicationRecord: resident.medicationRecord,
})

/** 空白評估錨點正規化為 null，供 DB／Edge 寫入 */
export const normalizeResidentInput = (input: ResidentInput): ResidentInput => {
  const raw = input.assessmentNextDueDate
  if (raw === undefined || raw === null) {
    return { ...input, assessmentNextDueDate: null }
  }
  const t = String(raw).trim()
  return { ...input, assessmentNextDueDate: t === '' ? null : t }
}

export const validateResidentInput = (input: ResidentInput): void => {
  if (!input.name.trim() || !input.bedNumber.trim() || !input.area.trim()) {
    throw new Error('姓名、床號與區域不可為空')
  }
  if (!input.admissionDate) {
    throw new Error('請提供入院日期')
  }
  if (input.age < 1 || input.age > 130) {
    throw new Error('年齡格式不正確')
  }
  if (!['GradeA_Subsidized', 'Voucher', 'Private'].includes(input.fundingType)) {
    throw new Error('funding_type 僅允許 GradeA_Subsidized、Voucher、Private')
  }
  const rawDue = input.assessmentNextDueDate
  let due: string | null = null
  if (rawDue != null) {
    const t = String(rawDue).trim()
    if (t !== '') due = t
  }
  if (due != null && !/^\d{4}-\d{2}-\d{2}$/.test(due)) {
    throw new Error('下次評估到期日須為 YYYY-MM-DD')
  }
}
