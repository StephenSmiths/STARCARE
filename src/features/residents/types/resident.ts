export type FundingType = 'GradeA_Subsidized' | 'Voucher' | 'Private'

export type DementiaLevel = 'Severe' | 'Moderate' | 'Mild' | 'None'

export type Gender = 'Male' | 'Female'

export type ServiceType = 'Subsidized_Rehab' | 'Dementia_Service' | 'Both'

export interface Resident {
  id: string
  name: string
  bedNumber: string
  area: string
  gender: Gender
  age: number
  admissionDate: string
  /** DB `assessment_next_due_date`；有值且落在 14 天視窗內時優先於入住週期估算（Seq 9） */
  assessmentNextDueDate?: string | null
  fundingType: FundingType
  serviceType: ServiceType
  dementiaLevel: DementiaLevel
  isSpecialCareCase: boolean
  healthCondition: string
  medicationRecord: string
  isDeleted: boolean
}

export interface ResidentInput {
  name: string
  bedNumber: string
  area: string
  gender: Gender
  age: number
  admissionDate: string
  assessmentNextDueDate?: string | null
  fundingType: FundingType
  serviceType: ServiceType
  dementiaLevel: DementiaLevel
  isSpecialCareCase: boolean
  healthCondition: string
  medicationRecord: string
}

export interface ResidentRecord {
  id: string
  name: string
  bed_number: string
  area: string
  gender: Gender
  age: number
  admission_date: string
  assessment_next_due_date?: string | null
  funding_type: FundingType
  service_type: ServiceType
  dementia_level: DementiaLevel
  is_special_care: boolean
  health_condition: string
  medication_record: string
  is_deleted: boolean
}
