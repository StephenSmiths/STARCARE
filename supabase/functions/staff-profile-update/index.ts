import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'

const ROLE_TYPES = new Set(['PT', 'OT', 'PTA', 'OTA', 'TeamLead'])
const SERVICE_SCOPES = new Set(['Subsidized_Rehab', 'Dementia_Care', 'Both'])

type Body = {
  id?: string
  display_name?: string
  role_type?: string
  service_scope?: string
  actorId?: string
}

/** PDF 02【13】單筆更新 staff_profiles（Seq 26）；禁止硬刪、僅更新未刪除列 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireTeamLeadOrAdmin(req)
  if (staff instanceof Response) return staff
  try {
    const body = (await req.json()) as Body
    const id = String(body.id ?? '').trim()
    const displayName = String(body.display_name ?? '').trim()
    const roleType = String(body.role_type ?? '').trim()
    const serviceScope = String(body.service_scope ?? '').trim()
    const actorId = String(body.actorId ?? '').trim()
    if (!id) return json({ error: '缺少 id' }, 400)
    if (!displayName) return json({ error: 'display_name 不可為空' }, 400)
    if (!ROLE_TYPES.has(roleType)) return json({ error: 'role_type 非法' }, 400)
    if (!SERVICE_SCOPES.has(serviceScope)) return json({ error: 'service_scope 非法' }, 400)
    if (!actorId) return json({ error: '缺少 actorId' }, 400)
    if (actorId !== staff.user.id) return json({ error: 'actorId 必須為目前登入者' }, 403)

    const supabase = getServiceClient()
    const { data: existing, error: selErr } = await supabase
      .from('staff_profiles')
      .select('id, display_name, role_type, service_scope')
      .eq('id', id)
      .eq('is_deleted', false)
      .maybeSingle()
    if (selErr) return json({ error: selErr.message }, 400)
    if (!existing) return json({ error: '找不到員工主檔或已刪除' }, 404)

    const { error: updErr } = await supabase
      .from('staff_profiles')
      .update({
        display_name: displayName,
        role_type: roleType,
        service_scope: serviceScope,
      })
      .eq('id', id)
      .eq('is_deleted', false)
    if (updErr) return json({ error: updErr.message }, 400)

    const auditBefore = {
      staffName: existing.display_name,
      roleType: existing.role_type,
      serviceScope: existing.service_scope,
    }
    const auditAfter = {
      staffName: displayName,
      roleType,
      serviceScope,
    }
    const audit = await insertAuditEvent(supabase, {
      action: 'UPDATE',
      entity_type: 'Staff',
      entity_id: id,
      actor_id: actorId,
      before_state: JSON.stringify(auditBefore),
      after_state: JSON.stringify(auditAfter),
      detail: '更新員工主檔（display_name／role_type／service_scope）',
    })
    if (!audit.ok) {
      await supabase
        .from('staff_profiles')
        .update({
          display_name: existing.display_name,
          role_type: existing.role_type,
          service_scope: existing.service_scope,
        })
        .eq('id', id)
      return json({ error: `審計落庫失敗，已回溯本次修改：${audit.message}` }, 500)
    }
    return json({ ok: true, id, actorId })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
