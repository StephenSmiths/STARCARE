import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'

type Body = { facilityId?: string }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  const body = (await req.json()) as Body
  const facilityId = (body.facilityId ?? '').trim()
  if (!facilityId) return json({ error: 'facilityId 不可為空' }, 400)
  const supabase = getServiceClient()

  const { data: victims, error: selErr } = await supabase
    .from('scheduling_kpi_history')
    .select('id')
    .eq('facility_id', facilityId)
    .eq('is_deleted', false)
  if (selErr) return json({ error: selErr.message }, 400)
  const ids = (victims ?? []).map((r) => String(r.id))
  if (ids.length === 0) return json({ ok: true, cleared: 0 })

  const deletedAt = new Date().toISOString()
  const { error } = await supabase
    .from('scheduling_kpi_history')
    .update({ is_deleted: true, deleted_at: deletedAt })
    .eq('facility_id', facilityId)
    .eq('is_deleted', false)
  if (error) return json({ error: error.message }, 400)

  const audit = await insertAuditEvent(supabase, {
    action: 'SCHEDULING_KPI_HISTORY_CLEAR',
    entity_type: 'Scheduling',
    entity_id: facilityId,
    actor_id: staff.user.id,
    before_state: JSON.stringify({ facilityId, rowCount: ids.length }),
    after_state: JSON.stringify({ is_deleted: true, ids }),
    detail: '清除 facility 之排班 KPI 歷史（軟刪）',
  })
  if (!audit.ok) {
    await supabase
      .from('scheduling_kpi_history')
      .update({ is_deleted: false, deleted_at: null })
      .in('id', ids)
    return json({ error: `審計落庫失敗，已回溯清除：${audit.message}` }, 500)
  }
  return json({ ok: true, cleared: ids.length })
})
