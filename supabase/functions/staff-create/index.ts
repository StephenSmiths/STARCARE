import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'

const ROLE_THERAPIST = new Set(['PT', 'OT', 'PTA', 'OTA'])

/** PDF 02【13】單筆新增員工主檔；預設 service_scope=Both（與無 ServiceScope 範本一致）。 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const auth = await requireTeamLeadOrAdmin(req)
  if (auth instanceof Response) return auth
  try {
    const body = (await req.json()) as Record<string, unknown>
    const actorId = String(body.actorId ?? '').trim()
    const displayName = String(body.display_name ?? body.displayName ?? '').trim()
    const roleType = String(body.role_type ?? body.roleType ?? '').trim()
    const genderRaw = String(body.gender ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    const email = String(body.email ?? '').trim()
    const idRaw = String(body.id ?? '').trim()
    const facilityId = String(body.facility_id ?? body.facilityId ?? 'facility-main').trim()

    if (!actorId) return json({ error: '缺少 actorId' }, 400)
    if (actorId !== auth.user.id) return json({ error: 'actorId 必須為目前登入者' }, 403)
    if (!displayName) return json({ error: '姓名不可為空' }, 400)
    if (!ROLE_THERAPIST.has(roleType)) return json({ error: '職位僅允許 PT、PTA、OT、OTA' }, 400)

    let gender: 'Male' | 'Female'
    if (genderRaw === 'Male' || genderRaw === '男') gender = 'Male'
    else if (genderRaw === 'Female' || genderRaw === '女') gender = 'Female'
    else return json({ error: '性別須為 男／女' }, 400)

    const id = idRaw || `staff-${crypto.randomUUID()}`
    const supabase = getServiceClient()
    const { data: dup } = await supabase.from('staff_profiles').select('id').eq('id', id).eq('is_deleted', false).maybeSingle()
    if (dup) return json({ error: '員工編號已存在' }, 409)

    const row = {
      id,
      facility_id: facilityId,
      display_name: displayName,
      role_type: roleType,
      service_scope: 'Both' as const,
      gender,
      phone,
      email,
      is_deleted: false,
    }
    const { error: insErr } = await supabase.from('staff_profiles').insert(row)
    if (insErr) return json({ error: insErr.message }, 400)

    const audit = await insertAuditEvent(supabase, {
      action: 'CREATE',
      entity_type: 'Staff',
      entity_id: id,
      actor_id: actorId,
      before_state: null,
      after_state: JSON.stringify(row),
      detail: '單筆新增員工主檔',
    })
    if (!audit.ok) {
      await supabase.from('staff_profiles').update({ is_deleted: true }).eq('id', id).eq('is_deleted', false)
      return json({ error: `審計落庫失敗，已回溯新增（軟刪）：${audit.message}` }, 500)
    }
    return json({ ok: true, id }, 201)
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
