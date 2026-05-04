import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'
import {
  dbRowToForm,
  formToDbRow,
  isServiceFormApiRecord,
  type ServiceFormApiRecord,
} from '../_shared/serviceFormMapping.ts'
import { deriveServiceFormUpsertAudit } from '../_shared/serviceFormUpsertAudit.ts'

type Body = { facilityId?: string; form?: unknown }

const assertAuditActor = (
  auditAction: string,
  staffUserId: string,
  staffRole: string,
  form: ServiceFormApiRecord,
): Response | null => {
  if (auditAction === 'FORM_APPROVE' || auditAction === 'FORM_REJECT_REVISION') {
    if (form.reviewerActorId !== staffUserId) {
      return json({ error: 'reviewer_actor_id 須為目前登入者' }, 403)
    }
    return null
  }
  if (staffRole === 'staff' && form.ownerActorId !== staffUserId) {
    return json({ error: 'Staff 僅可 upsert 本人為 owner 之表單' }, 403)
  }
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  try {
    const body = (await req.json()) as Body
    const facilityId = (body.facilityId ?? 'facility-main').trim()
    if (!isServiceFormApiRecord(body.form)) return json({ error: 'form 格式錯誤' }, 400)
    const f = body.form
    const supabase = getServiceClient()
    const { data: prevDb, error: selErr } = await supabase.from('service_forms').select('*').eq('id', f.id).maybeSingle()
    if (selErr) return json({ error: selErr.message }, 400)
    const prevApi = prevDb ? dbRowToForm(prevDb as Record<string, unknown>) : null
    const plan = deriveServiceFormUpsertAudit(prevApi, f)
    const actorDenied = assertAuditActor(plan.action, staff.user.id, staff.role, f)
    if (actorDenied) return actorDenied

    const row = formToDbRow(facilityId, f)
    const { error } = await supabase.from('service_forms').upsert(row, { onConflict: 'id' })
    if (error) return json({ error: error.message }, 400)

    const audit = await insertAuditEvent(supabase, {
      action: plan.action,
      entity_type: 'Scheduling',
      entity_id: f.id,
      actor_id: staff.user.id,
      before_state: plan.beforeState,
      after_state: plan.afterState,
      detail: plan.detail,
    })
    if (!audit.ok) {
      if (prevDb) {
        await supabase.from('service_forms').upsert(prevDb as Record<string, unknown>, { onConflict: 'id' })
      } else {
        await supabase.from('service_forms').update({ is_deleted: true }).eq('id', f.id).eq('is_deleted', false)
      }
      return json({ error: `審計落庫失敗，已回溯本次 upsert：${audit.message}` }, 500)
    }
    return json({ ok: true })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
