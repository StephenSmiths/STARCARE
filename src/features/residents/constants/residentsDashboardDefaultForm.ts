import type { ResidentInput } from '../types/resident'

/** 院友總覽新增表單初始值（PDF 01 §院友管理） */
export const RESIDENT_DASHBOARD_DEFAULT_FORM: ResidentInput = {
  name: '',
  bedNumber: '',
  area: '',
  gender: 'Female',
  age: 70,
  admissionDate: '',
  assessmentNextDueDate: null,
  fundingType: 'GradeA_Subsidized',
  serviceType: 'Subsidized_Rehab',
  dementiaLevel: 'None',
  isSpecialCareCase: false,
  healthCondition: '',
  medicationRecord: '',
}
