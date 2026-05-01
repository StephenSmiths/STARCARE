import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'

type StaffSkillRow = {
  id: string
  facility_id: string
  staff_profile_id: string
  activity_id: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const facilityId = new URL(req.url).searchParams.get('facilityId')
    const supabase = getServiceClient()
    let query = supabase
      .from('staff_skills')
      .select('id, facility_id, staff_profile_id, activity_id')
      .eq('is_deleted', false)
    if (facilityId) query = query.eq('facility_id', facilityId)
    const { data, error } = await query
    if (error) return json({ error: error.message }, 400)
    const rows = ((data ?? []) as StaffSkillRow[]).map((row) => ({
      id: row.id,
      facilityId: row.facility_id,
      staffProfileId: row.staff_profile_id,
      activityId: row.activity_id,
    }))
    return new Response(JSON.stringify(rows), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
