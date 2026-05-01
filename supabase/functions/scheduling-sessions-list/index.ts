import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'

type SessionRow = {
  id: string
  staff_id: string
  staff_name: string
  date: string
  time_slot: string
  service_type: string
  capacity: number
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('scheduling_sessions')
      .select('id, staff_id, staff_name, date, time_slot, service_type, capacity')
      .eq('is_deleted', false)
      .order('date', { ascending: true })
    if (error) return json({ error: error.message }, 400)
    const sessions = ((data ?? []) as SessionRow[]).map((row) => ({
      id: row.id,
      staffId: row.staff_id,
      staffName: row.staff_name,
      date: row.date,
      timeSlot: row.time_slot,
      serviceType: row.service_type,
      capacity: row.capacity,
    }))
    return new Response(JSON.stringify(sessions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
