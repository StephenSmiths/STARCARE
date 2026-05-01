import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export type ActivitySessionImportRow = {
  id?: string
  facilityId?: string
  activityId: string
  staffProfileId: string
  sessionDate: string
  timeSlot: string
  capacity: number
}

export type ActivitySessionImportPreviewRow = {
  id?: string
  facility_id: string
  activity_id: string
  staff_profile_id: string
  session_date: string
  time_slot: string
  capacity: number
}

export type ActivitySessionImportValidationResult = {
  ok: boolean
  summary: { total: number; valid: number; invalid: number }
  errors: Array<{ rowIndex: number; field: string; message: string }>
  preview: ActivitySessionImportPreviewRow[]
}

export type ActivitySessionImportCommitResult = {
  ok: boolean
  inserted: number
  actorId: string
  sessionIds: string[]
}

export interface ActivitySessionImportRepository {
  validateRows: (rows: ActivitySessionImportRow[]) => Promise<ActivitySessionImportValidationResult>
  commitRows: (
    actorId: string,
    rows: ActivitySessionImportPreviewRow[],
  ) => Promise<ActivitySessionImportCommitResult>
}

class InMemoryActivitySessionImportRepository implements ActivitySessionImportRepository {
  async validateRows(rows: ActivitySessionImportRow[]): Promise<ActivitySessionImportValidationResult> {
    const preview = rows.map((row) => ({
      id: row.id,
      facility_id: row.facilityId ?? 'facility-main',
      activity_id: row.activityId,
      staff_profile_id: row.staffProfileId,
      session_date: row.sessionDate,
      time_slot: row.timeSlot,
      capacity: row.capacity,
    }))
    return { ok: true, summary: { total: rows.length, valid: rows.length, invalid: 0 }, errors: [], preview }
  }

  async commitRows(
    actorId: string,
    rows: ActivitySessionImportPreviewRow[],
  ): Promise<ActivitySessionImportCommitResult> {
    return { ok: true, inserted: rows.length, actorId, sessionIds: rows.map((_x, i) => `mock-${i}`) }
  }
}

class EdgeActivitySessionImportRepository implements ActivitySessionImportRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async validateRows(rows: ActivitySessionImportRow[]): Promise<ActivitySessionImportValidationResult> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const response = await fetch(`${this.supabaseUrl}/functions/v1/activity-sessions-import-validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ rows }),
    })
    if (!response.ok) throw new Error(`活動時段匯入預檢失敗（HTTP ${response.status}）`)
    return (await response.json()) as ActivitySessionImportValidationResult
  }

  async commitRows(
    actorId: string,
    rows: ActivitySessionImportPreviewRow[],
  ): Promise<ActivitySessionImportCommitResult> {
    const headers = await buildEdgeInvokeHeaders(
      this.anonKey,
      `activity-sessions-import-commit:${actorId}:${crypto.randomUUID()}`,
    )
    const response = await fetch(`${this.supabaseUrl}/functions/v1/activity-sessions-import-commit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ actorId, rows }),
    })
    if (!response.ok) throw new Error(`活動時段批量匯入失敗（HTTP ${response.status}）`)
    return (await response.json()) as ActivitySessionImportCommitResult
  }
}

export const createActivitySessionImportRepository = (): ActivitySessionImportRepository => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env ?? {}
  if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
    return new EdgeActivitySessionImportRepository({
      supabaseUrl: env.VITE_SUPABASE_URL,
      anonKey: env.VITE_SUPABASE_ANON_KEY,
    })
  }
  return new InMemoryActivitySessionImportRepository()
}
