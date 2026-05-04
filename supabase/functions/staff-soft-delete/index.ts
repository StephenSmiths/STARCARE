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
    const staffId = String(body.id ?? '').trim()
    if (!staffId) return json({ error: '缺少 id' }, 400)

    const supabase = getServiceClient()

    const { data: profileRow, error: profileSelErr } = await supabase
      .from('staff_profiles')
      .select('id')
      .eq('id', staffId)
      .eq('is_deleted', false)
      .maybeSingle()
    if (profileSelErr) return json({ error: profileSelErr.message }, 400)
    if (!profileRow) return json({ error: '找不到員工或已刪除' }, 404)

    const { data: skillRows, error: skillsSelErr } = await supabase
      .from('staff_skills')
      .select('id')
      .eq('staff_profile_id', staffId)
      .eq('is_deleted', false)
    if (skillsSelErr) return json({ error: skillsSelErr.message }, 400)
    const skillIds = (skillRows ?? []).map((r) => String(r.id))

    const { data: activityRows, error: actSelErr } = await supabase
      .from('activity_sessions')
      .select('id')
      .eq('staff_profile_id', staffId)
      .eq('is_deleted', false)
    if (actSelErr) return json({ error: actSelErr.message }, 400)
    const activitySessionIds = (activityRows ?? []).map((r) => String(r.id))

    const { data: schedRows, error: schedSelErr } = await supabase
      .from('scheduling_sessions')
      .select('id')
      .eq('staff_id', staffId)
      .eq('is_deleted', false)
    if (schedSelErr) return json({ error: schedSelErr.message }, 400)
    const schedulingSessionIds = (schedRows ?? []).map((r) => String(r.id))

    const { error: profileErr } = await supabase
      .from('staff_profiles')
      .update({ is_deleted: true })
      .eq('id', staffId)
      .eq('is_deleted', false)
    if (profileErr) return json({ error: profileErr.message }, 400)

    if (skillIds.length > 0) {
      const { error: skillsErr } = await supabase.from('staff_skills').update({ is_deleted: true }).in('id', skillIds)
      if (skillsErr) return json({ error: skillsErr.message }, 400)
    }

    if (activitySessionIds.length > 0) {
      const { error: activitySessionsErr } = await supabase
        .from('activity_sessions')
        .update({ is_deleted: true })
        .in('id', activitySessionIds)
      if (activitySessionsErr) return json({ error: activitySessionsErr.message }, 400)
    }

    if (schedulingSessionIds.length > 0) {
      const { error: schedulingSessionsErr } = await supabase
        .from('scheduling_sessions')
        .update({ is_deleted: true })
        .in('id', schedulingSessionIds)
      if (schedulingSessionsErr) return json({ error: schedulingSessionsErr.message }, 400)
    }

    const audit = await insertAuditEvent(supabase, {
      action: 'SOFT_DELETE',
      entity_type: 'Staff',
      entity_id: staffId,
      actor_id: actorId,
      before_state: JSON.stringify({ staffId, isDeleted: false }),
      after_state: JSON.stringify({ staffId, isDeleted: true }),
      detail: '軟刪除員工資料',
    })
    if (!audit.ok) {
      await supabase.from('staff_profiles').update({ is_deleted: false }).eq('id', staffId)
      if (skillIds.length > 0) await supabase.from('staff_skills').update({ is_deleted: false }).in('id', skillIds)
      if (activitySessionIds.length > 0) {
        await supabase.from('activity_sessions').update({ is_deleted: false }).in('id', activitySessionIds)
      }
      if (schedulingSessionIds.length > 0) {
        await supabase.from('scheduling_sessions').update({ is_deleted: false }).in('id', schedulingSessionIds)
      }
      return json({ error: `審計落庫失敗，已回溯軟刪：${audit.message}` }, 500)
    }
    return json({ ok: true, staffId })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
