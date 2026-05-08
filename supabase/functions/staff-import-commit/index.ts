import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { requireTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'

type PreviewRow = {
  id?: string
  facility_id: string
  display_name: string
  role_type: 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
  service_scope: 'Subsidized_Rehab' | 'Dementia_Care' | 'Both'
  gender?: 'Male' | 'Female' | null
  phone?: string
  email?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const auth = await requireTeamLeadOrAdmin(req)
  if (auth instanceof Response) return auth
  try {
    const body = (await req.json()) as { rows?: PreviewRow[]; actorId?: string }
    const rows = body.rows ?? []
    const actorId = String(body.actorId ?? '').trim()
    if (!actorId) return json({ error: '缺少 actorId' }, 400)
    if (actorId !== auth.user.id) return json({ error: 'actorId 必須為目前登入者' }, 403)
    if (rows.length === 0) return json({ error: 'rows 不可為空' }, 400)

    const ids = rows.map((row) => row.id).filter(Boolean) as string[]
    const supabase = getServiceClient()
    if (ids.length > 0) {
      const { data, error } = await supabase.from('staff_profiles').select('id').eq('is_deleted', false).in('id', ids)
      if (error) return json({ error: error.message }, 400)
      const existed = (data ?? []).map((item) => String(item.id))
      if (existed.length > 0) return json({ error: `員工編號已存在：${existed.join(', ')}` }, 409)
    }

    const batchId = `staff-import-${crypto.randomUUID()}`
    const insertRows = rows.map((row) => ({
      id: row.id?.trim() || `staff-${crypto.randomUUID()}`,
      facility_id: row.facility_id,
      display_name: row.display_name,
      role_type: row.role_type,
      service_scope: row.service_scope,
      gender: row.gender ?? null,
      phone: row.phone ?? '',
      email: row.email ?? '',
      is_deleted: false,
    }))
    const { error } = await supabase.from('staff_profiles').insert(insertRows)
    if (error) return json({ error: error.message }, 400)

    const staffIds = insertRows.map((row) => row.id)
    const audit = await insertAuditEvent(supabase, {
      action: 'STAFF_IMPORT_COMMIT',
      entity_type: 'Staff',
      entity_id: batchId,
      actor_id: actorId,
      before_state: null,
      after_state: JSON.stringify({ count: insertRows.length, batchId, staffIds }),
      detail: `員工批量匯入（batch=${batchId}）`,
    })
    if (!audit.ok) {
      await supabase.from('staff_profiles').update({ is_deleted: true }).in('id', staffIds).eq('is_deleted', false)
      return json({ error: `審計落庫失敗，已回溯本次匯入（軟刪）：${audit.message}` }, 500)
    }

    return json({
      ok: true,
      inserted: insertRows.length,
      actorId,
      staffIds,
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
