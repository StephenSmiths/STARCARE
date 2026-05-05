import type { Resident, ResidentInput } from '../types/resident'

/** 院友總覽側欄：實體欄位映射為表單輸入（與 `RESIDENT_DASHBOARD_DEFAULT_FORM` 鍵一致）。 */
export const mapResidentToDashboardFormInput = (selected: Resident): ResidentInput => ({
  name: selected.name,
  bedNumber: selected.bedNumber,
  area: selected.area,
  gender: selected.gender,
  age: selected.age,
  admissionDate: selected.admissionDate,
  assessmentNextDueDate: selected.assessmentNextDueDate ?? null,
  fundingType: selected.fundingType,
  serviceType: selected.serviceType,
  dementiaLevel: selected.dementiaLevel,
  isSpecialCareCase: selected.isSpecialCareCase,
  healthCondition: selected.healthCondition,
  medicationRecord: selected.medicationRecord,
})
