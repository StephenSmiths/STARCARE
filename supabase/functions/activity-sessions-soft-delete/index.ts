import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireTeamLeadOrAdmin(req)
  if (staff instanceof Response) return staff
  const actorId = staff.user.id
  try {
    const body = (await req.json()) as { id?: string }
    const id = String(body.id ?? '').trim()
    if (!id) return json({ error: '缺少 id' }, 400)
    const supabase = getServiceClient()
    const { data: prev, error: selErr } = await supabase.from('activity_sessions').select('*').eq('id', id).eq('is_deleted', false).maybeSingle()
    if (selErr) return json({ error: selErr.message }, 400)
    if (!prev) return json({ error: '找不到活動時段或已刪除' }, 404)

    const { error } = await supabase.from('activity_sessions').update({ is_deleted: true }).eq('id', id).eq('is_deleted', false)
    if (error) return json({ error: error.message }, 400)

    const after = { ...prev, is_deleted: true }
    const audit = await insertAuditEvent(supabase, {
      action: 'SOFT_DELETE',
      entity_type: 'Scheduling',
      entity_id: id,
      actor_id: actorId,
      before_state: JSON.stringify(prev),
      after_state: JSON.stringify(after),
      detail: '軟刪除活動時段',
    })
    if (!audit.ok) {
      await supabase.from('activity_sessions').update({ is_deleted: false }).eq('id', id)
      return json({ error: `審計落庫失敗，已回溯軟刪：${audit.message}` }, 500)
    }
    return json({ ok: true, id })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
