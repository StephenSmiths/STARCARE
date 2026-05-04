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

type ServiceSupabase = ReturnType<typeof getServiceClient>

/** 審計失敗時回溯本次 service_forms upsert（01 §5） */
const rollbackServiceFormUpsert = async (
  supabase: ServiceSupabase,
  prevDb: Record<string, unknown> | null,
  formId: string,
): Promise<void> => {
  if (prevDb) {
    await supabase.from('service_forms').upsert(prevDb, { onConflict: 'id' })
  } else {
    await supabase.from('service_forms').update({ is_deleted: true }).eq('id', formId).eq('is_deleted', false)
  }
}

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

    const occurredAt = new Date().toISOString()
    const audit = await insertAuditEvent(supabase, {
      action: plan.action,
      entity_type: 'Scheduling',
      entity_id: f.id,
      actor_id: staff.user.id,
      before_state: plan.beforeState,
      after_state: plan.afterState,
      detail: plan.detail,
      occurred_at: occurredAt,
    })
    if (!audit.ok) {
      await rollbackServiceFormUpsert(supabase, prevDb as Record<string, unknown> | null, f.id)
      return json({ error: `審計落庫失敗，已回溯本次 upsert：${audit.message}` }, 500)
    }

    if (plan.action === 'FORM_APPROVE') {
      const sessionId = (f.sessionId ?? '').trim()
      if (!sessionId) {
        await supabase.from('audit_events').update({ is_deleted: true }).eq('id', audit.id).eq('is_deleted', false)
        await rollbackServiceFormUpsert(supabase, prevDb as Record<string, unknown> | null, f.id)
        return json({ error: '表單缺少 sessionId，無法落庫 WORK_SESSION_COMPLETED 審計' }, 500)
      }
      const completion = await insertAuditEvent(supabase, {
        action: 'WORK_SESSION_COMPLETED',
        entity_type: 'Scheduling',
        entity_id: sessionId,
        actor_id: staff.user.id,
        before_state: JSON.stringify({ status: 'ACCEPTED' }),
        after_state: JSON.stringify({ status: 'COMPLETED' }),
        detail: '表單已核准：工作節標示為已完成（COMPLETED）（PDF 02【5】／Edge）',
        occurred_at: occurredAt,
      })
      if (!completion.ok) {
        await supabase.from('audit_events').update({ is_deleted: true }).eq('id', audit.id).eq('is_deleted', false)
        await rollbackServiceFormUpsert(supabase, prevDb as Record<string, unknown> | null, f.id)
        return json({ error: `審計落庫失敗，已回溯本次 upsert：${completion.message}` }, 500)
      }
    }

    return json({ ok: true })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
