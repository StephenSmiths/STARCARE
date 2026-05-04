import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { requireTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'

type PreviewRow = {
  id?: string
  facility_id: string
  activity_id: string
  staff_profile_id: string
  session_date: string
  time_slot: string
  capacity: number
}

type AuditAction = 'ACTIVITY_SESSIONS_IMPORT_COMMIT' | 'WORK_PLAN_SESSION_COMMIT'

const parseAuditAction = (raw: unknown): AuditAction =>
  raw === 'WORK_PLAN_SESSION_COMMIT' ? 'WORK_PLAN_SESSION_COMMIT' : 'ACTIVITY_SESSIONS_IMPORT_COMMIT'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const auth = await requireTeamLeadOrAdmin(req)
  if (auth instanceof Response) return auth
  try {
    const body = (await req.json()) as { rows?: PreviewRow[]; actorId?: string; auditAction?: unknown }
    const rows = body.rows ?? []
    const auditAction = parseAuditAction(body.auditAction)
    const actorId = String(body.actorId ?? '').trim()
    if (!actorId) return json({ error: '缺少 actorId' }, 400)
    if (actorId !== auth.user.id) return json({ error: 'actorId 必須為目前登入者' }, 403)
    if (rows.length === 0) return json({ error: 'rows 不可為空' }, 400)

    const ids = rows.map((row) => row.id).filter(Boolean) as string[]
    const supabase = getServiceClient()
    if (ids.length > 0) {
      const { data, error } = await supabase.from('activity_sessions').select('id').eq('is_deleted', false).in('id', ids)
      if (error) return json({ error: error.message }, 400)
      const existed = (data ?? []).map((item) => String(item.id))
      if (existed.length > 0) return json({ error: `id 已存在：${existed.join(', ')}` }, 409)
    }

    const batchId = `activity-sessions-import-${crypto.randomUUID()}`
    const insertRows = rows.map((row) => ({
      id: row.id?.trim() || `activity-session-${crypto.randomUUID()}`,
      facility_id: row.facility_id,
      activity_id: row.activity_id,
      staff_profile_id: row.staff_profile_id,
      session_date: row.session_date,
      time_slot: row.time_slot,
      capacity: row.capacity,
      is_deleted: false,
    }))
    const { error } = await supabase.from('activity_sessions').insert(insertRows)
    if (error) return json({ error: error.message }, 400)

    const sessionIds = insertRows.map((row) => row.id)
    const detail =
      auditAction === 'WORK_PLAN_SESSION_COMMIT'
        ? `工作計劃：批量發布活動時段（batch=${batchId}）`
        : `活動時段 CSV 批量匯入（batch=${batchId}）`
    const audit = await insertAuditEvent(supabase, {
      action: auditAction,
      entity_type: 'Scheduling',
      entity_id: batchId,
      actor_id: actorId,
      before_state: null,
      after_state: JSON.stringify({ count: insertRows.length, batchId, sessionIds }),
      detail,
    })
    if (!audit.ok) {
      await supabase.from('activity_sessions').update({ is_deleted: true }).in('id', sessionIds).eq('is_deleted', false)
      return json({ error: `審計落庫失敗，已回溯本次匯入（軟刪）：${audit.message}` }, 500)
    }

    return json({
      ok: true,
      inserted: insertRows.length,
      actorId,
      sessionIds,
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
