import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { requireTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireTeamLeadOrAdmin(req)
  if (staff instanceof Response) return staff
  const actorId = staff.user.id
  try {
    const body = (await req.json()) as { id?: string; is_deleted?: boolean }
    if (!body.id) return json({ error: '缺少 id' }, 400)
    const supabase = getServiceClient()
    const { data: prev, error: selErr } = await supabase
      .from('residents')
      .select('*')
      .eq('id', body.id)
      .eq('is_deleted', false)
      .maybeSingle()
    if (selErr) return json({ error: selErr.message }, 400)
    if (!prev) return json({ error: '找不到院友資料' }, 404)

    const { error } = await supabase.from('residents').update({ is_deleted: true }).eq('id', body.id)
    if (error) return json({ error: error.message }, 400)

    const after = { ...prev, is_deleted: true }
    const audit = await insertAuditEvent(supabase, {
      action: 'SOFT_DELETE',
      entity_type: 'Resident',
      entity_id: body.id,
      actor_id: actorId,
      before_state: JSON.stringify(prev),
      after_state: JSON.stringify(after),
      detail: '軟刪除院友資料',
    })
    if (!audit.ok) {
      await supabase.from('residents').update({ is_deleted: false }).eq('id', body.id)
      return json({ error: `審計落庫失敗，已回溯軟刪：${audit.message}` }, 500)
    }
    return json({ ok: true })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
