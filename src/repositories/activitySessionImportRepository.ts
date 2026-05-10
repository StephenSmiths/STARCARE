import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'
import { readEdgeFunctionErrorDetail } from './readEdgeFunctionErrorDetail'

export type ActivitySessionImportRow = {
  id?: string
  facilityId?: string
  activityId: string
  staffProfileId: string
  sessionDate: string
  timeSlot: string
  capacity: number
  startTime?: string
  durationMinutes?: number
  endTime?: string
  activityType?: 'Individual' | 'Group' | 'Assessment' | 'Other'
  activityContent?: string
  activityDetail?: string
  residentIds?: string[]
}

export type ActivitySessionImportPreviewRow = {
  id?: string
  facility_id: string
  activity_id: string
  staff_profile_id: string
  session_date: string
  time_slot: string
  capacity: number
  start_time?: string
  duration_minutes?: number
  end_time?: string
  activity_type?: 'Individual' | 'Group' | 'Assessment' | 'Other'
  activity_content?: string
  activity_detail?: string
  resident_ids?: string[]
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

/** Edge：預設 CSV 為 ACTIVITY_SESSIONS_IMPORT_COMMIT；工作計劃發布為 WORK_PLAN_SESSION_COMMIT（PDF 02【2】） */
export type ActivitySessionImportCommitOptions = {
  auditAction?: 'ACTIVITY_SESSIONS_IMPORT_COMMIT' | 'WORK_PLAN_SESSION_COMMIT'
}

export interface ActivitySessionImportRepository {
  validateRows: (rows: ActivitySessionImportRow[]) => Promise<ActivitySessionImportValidationResult>
  commitRows: (
    actorId: string,
    rows: ActivitySessionImportPreviewRow[],
    options?: ActivitySessionImportCommitOptions,
  ) => Promise<ActivitySessionImportCommitResult>
}

class InMemoryActivitySessionImportRepository implements ActivitySessionImportRepository {
  async validateRows(rows: ActivitySessionImportRow[]): Promise<ActivitySessionImportValidationResult> {
    const preview = rows.map((row) => ({
      id: row.id,
      facility_id: row.facilityId ?? STARCARE_DEFAULT_FACILITY_ID,
      activity_id: row.activityId,
      staff_profile_id: row.staffProfileId,
      session_date: row.sessionDate,
      time_slot: row.timeSlot,
      capacity: row.capacity,
      start_time: row.startTime,
      duration_minutes: row.durationMinutes,
      end_time: row.endTime,
      activity_type: row.activityType,
      activity_content: row.activityContent,
      activity_detail: row.activityDetail,
      resident_ids: row.residentIds,
    }))
    return { ok: true, summary: { total: rows.length, valid: rows.length, invalid: 0 }, errors: [], preview }
  }

  async commitRows(
    actorId: string,
    rows: ActivitySessionImportPreviewRow[],
    _options?: ActivitySessionImportCommitOptions,
  ): Promise<ActivitySessionImportCommitResult> {
    void _options
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
    if (!response.ok) {
      const detail = await readEdgeFunctionErrorDetail(response)
      throw new Error(`活動時段匯入預檢失敗（HTTP ${response.status}）${detail ? `：${detail}` : ''}`.trim())
    }
    return (await response.json()) as ActivitySessionImportValidationResult
  }

  async commitRows(
    actorId: string,
    rows: ActivitySessionImportPreviewRow[],
    options?: ActivitySessionImportCommitOptions,
  ): Promise<ActivitySessionImportCommitResult> {
    const headers = await buildEdgeInvokeHeaders(
      this.anonKey,
      `activity-sessions-import-commit:${actorId}:${crypto.randomUUID()}`,
    )
    const payload: Record<string, unknown> = { actorId, rows }
    if (options?.auditAction) payload.auditAction = options.auditAction
    const response = await fetch(`${this.supabaseUrl}/functions/v1/activity-sessions-import-commit`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const detail = await readEdgeFunctionErrorDetail(response)
      throw new Error(`活動時段批量匯入失敗（HTTP ${response.status}）${detail ? `：${detail}` : ''}`.trim())
    }
    return (await response.json()) as ActivitySessionImportCommitResult
  }
}

export const createActivitySessionImportRepository = (): ActivitySessionImportRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new InMemoryActivitySessionImportRepository()
  }
  return new EdgeActivitySessionImportRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}
