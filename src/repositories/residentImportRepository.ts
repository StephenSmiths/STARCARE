import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export type ResidentImportRow = {
  name: string
  /** 批量匯入附加欄位：目前僅作輸入留存，不入 residents 主檔。 */
  englishName?: string
  bedNumber: string
  area: string
  gender: 'Male' | 'Female'
  /** 批量匯入附加欄位：目前僅作輸入留存，不入 residents 主檔。 */
  birthDate?: string
  age: number
  admissionDate: string
  /** PDF 01 §4.3；可選，YYYY-MM-DD */
  assessmentNextDueDate?: string
  fundingType: 'GradeA_Subsidized' | 'Voucher' | 'Private'
  serviceTypes?: Array<'Subsidized_Rehab' | 'Dementia_Service'>
  serviceType: 'Subsidized_Rehab' | 'Dementia_Service' | 'Both'
  dementiaLevel: 'Severe' | 'Moderate' | 'Mild' | 'None'
  isSpecialCareCase: boolean
  healthCondition: string
  medicationRecord: string
}

export type ResidentImportValidationResult = {
  ok: boolean
  summary: { total: number; valid: number; invalid: number }
  errors: Array<{ rowIndex: number; field: string; message: string }>
  preview: ResidentImportPreviewRow[]
}

export type ResidentImportPreviewRow = {
  name: string
  english_name?: string | null
  bed_number: string
  area: string
  gender: 'Male' | 'Female'
  birth_date?: string | null
  age: number
  admission_date: string
  funding_type: 'GradeA_Subsidized' | 'Voucher' | 'Private'
  service_types?: Array<'Subsidized_Rehab' | 'Dementia_Service'>
  service_type: 'Subsidized_Rehab' | 'Dementia_Service' | 'Both'
  dementia_level: 'Severe' | 'Moderate' | 'Mild' | 'None'
  is_special_care: boolean
  health_condition: string
  medication_record: string
}

export type ResidentImportCommitResult = {
  ok: boolean
  inserted: number
  actorId: string
  residentIds: string[]
}

export interface ResidentImportRepository {
  validateRows: (rows: ResidentImportRow[]) => Promise<ResidentImportValidationResult>
  commitRows: (
    actorId: string,
    rows: ResidentImportPreviewRow[],
  ) => Promise<ResidentImportCommitResult>
}

class InMemoryResidentImportRepository implements ResidentImportRepository {
  async validateRows(rows: ResidentImportRow[]): Promise<ResidentImportValidationResult> {
    const preview: ResidentImportPreviewRow[] = rows.map((row) => ({
      name: row.name,
      english_name: row.englishName?.trim() ? row.englishName.trim() : null,
      bed_number: row.bedNumber,
      area: row.area,
      gender: row.gender,
      birth_date: row.birthDate?.trim() ? row.birthDate.trim() : null,
      age: row.age,
      admission_date: row.admissionDate,
      funding_type: row.fundingType,
      service_types: row.serviceTypes,
      service_type: row.serviceType,
      dementia_level: row.dementiaLevel,
      is_special_care: row.isSpecialCareCase,
      health_condition: row.healthCondition,
      medication_record: row.medicationRecord,
      assessment_next_due_date: row.assessmentNextDueDate?.trim()
        ? row.assessmentNextDueDate.trim()
        : null,
    }))
    return {
      ok: true,
      summary: { total: rows.length, valid: rows.length, invalid: 0 },
      errors: [],
      preview,
    }
  }

  async commitRows(actorId: string, rows: ResidentImportPreviewRow[]): Promise<ResidentImportCommitResult> {
    return { ok: true, inserted: rows.length, actorId, residentIds: rows.map((_r, idx) => `mock-${idx}`) }
  }
}

class EdgeResidentImportRepository implements ResidentImportRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async validateRows(rows: ResidentImportRow[]): Promise<ResidentImportValidationResult> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const response = await fetch(`${this.supabaseUrl}/functions/v1/residents-import-validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ rows }),
    })
    if (!response.ok) {
      throw new Error(`院友匯入預檢失敗（HTTP ${response.status}）`)
    }
    return (await response.json()) as ResidentImportValidationResult
  }

  async commitRows(
    actorId: string,
    rows: ResidentImportPreviewRow[],
  ): Promise<ResidentImportCommitResult> {
    const headers = await buildEdgeInvokeHeaders(
      this.anonKey,
      `residents-import-commit:${actorId}:${crypto.randomUUID()}`,
    )
    const response = await fetch(`${this.supabaseUrl}/functions/v1/residents-import-commit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ actorId, rows }),
    })
    if (!response.ok) {
      throw new Error(`院友批量匯入失敗（HTTP ${response.status}）`)
    }
    return (await response.json()) as ResidentImportCommitResult
  }
}

export const createResidentImportRepository = (): ResidentImportRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new InMemoryResidentImportRepository()
  }
  return new EdgeResidentImportRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}
