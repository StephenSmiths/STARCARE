import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export type StaffImportRow = {
  id?: string
  facilityId?: string
  displayName: string
  roleType: 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
  serviceScope: 'Subsidized_Rehab' | 'Dementia_Care' | 'Both'
}

export type StaffImportPreviewRow = {
  id?: string
  facility_id: string
  display_name: string
  role_type: 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
  service_scope: 'Subsidized_Rehab' | 'Dementia_Care' | 'Both'
}

export type StaffImportValidationResult = {
  ok: boolean
  summary: { total: number; valid: number; invalid: number }
  errors: Array<{ rowIndex: number; field: string; message: string }>
  preview: StaffImportPreviewRow[]
}

export type StaffImportCommitResult = {
  ok: boolean
  inserted: number
  actorId: string
  staffIds: string[]
}

export interface StaffImportRepository {
  validateRows: (rows: StaffImportRow[]) => Promise<StaffImportValidationResult>
  commitRows: (actorId: string, rows: StaffImportPreviewRow[]) => Promise<StaffImportCommitResult>
}

class InMemoryStaffImportRepository implements StaffImportRepository {
  async validateRows(rows: StaffImportRow[]): Promise<StaffImportValidationResult> {
    const preview = rows.map((row) => ({
      id: row.id,
      facility_id: row.facilityId ?? 'facility-main',
      display_name: row.displayName,
      role_type: row.roleType,
      service_scope: row.serviceScope,
    }))
    return {
      ok: true,
      summary: { total: rows.length, valid: rows.length, invalid: 0 },
      errors: [],
      preview,
    }
  }

  async commitRows(actorId: string, rows: StaffImportPreviewRow[]): Promise<StaffImportCommitResult> {
    return {
      ok: true,
      inserted: rows.length,
      actorId,
      staffIds: rows.map((_row, idx) => `mock-staff-${idx}`),
    }
  }
}

class EdgeStaffImportRepository implements StaffImportRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async validateRows(rows: StaffImportRow[]): Promise<StaffImportValidationResult> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const response = await fetch(`${this.supabaseUrl}/functions/v1/staff-import-validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ rows }),
    })
    if (!response.ok) throw new Error(`員工匯入預檢失敗（HTTP ${response.status}）`)
    return (await response.json()) as StaffImportValidationResult
  }

  async commitRows(actorId: string, rows: StaffImportPreviewRow[]): Promise<StaffImportCommitResult> {
    const headers = await buildEdgeInvokeHeaders(
      this.anonKey,
      `staff-import-commit:${actorId}:${crypto.randomUUID()}`,
    )
    const response = await fetch(`${this.supabaseUrl}/functions/v1/staff-import-commit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ actorId, rows }),
    })
    if (!response.ok) throw new Error(`員工批量匯入失敗（HTTP ${response.status}）`)
    return (await response.json()) as StaffImportCommitResult
  }
}

export const createStaffImportRepository = (): StaffImportRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new InMemoryStaffImportRepository()
  }
  return new EdgeStaffImportRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}
