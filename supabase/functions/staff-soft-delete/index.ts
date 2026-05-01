import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const body = (await req.json()) as { id?: string }
    const staffId = String(body.id ?? '').trim()
    if (!staffId) return json({ error: '缺少 id' }, 400)

    const supabase = getServiceClient()
    const now = new Date().toISOString()

    const { error: profileErr } = await supabase
      .from('staff_profiles')
      .update({ is_deleted: true, updated_at: now })
      .eq('id', staffId)
      .eq('is_deleted', false)
    if (profileErr) return json({ error: profileErr.message }, 400)

    const { error: skillsErr } = await supabase
      .from('staff_skills')
      .update({ is_deleted: true, updated_at: now })
      .eq('staff_profile_id', staffId)
      .eq('is_deleted', false)
    if (skillsErr) return json({ error: skillsErr.message }, 400)

    const { error: activitySessionsErr } = await supabase
      .from('activity_sessions')
      .update({ is_deleted: true, updated_at: now })
      .eq('staff_profile_id', staffId)
      .eq('is_deleted', false)
    if (activitySessionsErr) return json({ error: activitySessionsErr.message }, 400)

    const { error: schedulingSessionsErr } = await supabase
      .from('scheduling_sessions')
      .update({ is_deleted: true, updated_at: now })
      .eq('staff_id', staffId)
      .eq('is_deleted', false)
    if (schedulingSessionsErr) return json({ error: schedulingSessionsErr.message }, 400)

    return json({ ok: true, staffId })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
