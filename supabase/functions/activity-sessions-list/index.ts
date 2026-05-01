import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'

type ActivitySessionRow = {
  id: string
  facility_id: string
  activity_id: string
  staff_profile_id: string
  session_date: string
  time_slot: string
  capacity: number
  staff_profiles: { display_name: string } | null
  activities: { service_type: 'Subsidized_Rehab' | 'Dementia_Care' } | null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const url = new URL(req.url)
    const facilityId = url.searchParams.get('facilityId')
    const fromDate = url.searchParams.get('fromDate')
    const toDate = url.searchParams.get('toDate')
    const supabase = getServiceClient()
    let query = supabase
      .from('activity_sessions')
      .select(
        'id, facility_id, activity_id, staff_profile_id, session_date, time_slot, capacity, staff_profiles!inner(display_name), activities!inner(service_type)',
      )
      .eq('is_deleted', false)
      .order('session_date', { ascending: true })
    if (facilityId) query = query.eq('facility_id', facilityId)
    if (fromDate) query = query.gte('session_date', fromDate)
    if (toDate) query = query.lte('session_date', toDate)
    const { data, error } = await query
    if (error) return json({ error: error.message }, 400)
    const rows = ((data ?? []) as ActivitySessionRow[]).map((row) => ({
      id: row.id,
      facilityId: row.facility_id,
      activityId: row.activity_id,
      staffProfileId: row.staff_profile_id,
      staffName: row.staff_profiles?.display_name ?? row.staff_profile_id,
      sessionDate: row.session_date,
      timeSlot: row.time_slot,
      capacity: row.capacity,
      serviceType: row.activities?.service_type ?? 'Subsidized_Rehab',
    }))
    return new Response(JSON.stringify(rows), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
