import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'

type Row = {
  id: string
  resident_id: string
  resident_name: string
  cycle_anchor_date: string
  discipline: 'PT' | 'OT'
  version_label: string
  recorded_by_actor_id: string
  completed_at: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('assessment_completion_records')
      .select(
        'id, resident_id, resident_name, cycle_anchor_date, discipline, version_label, recorded_by_actor_id, completed_at',
      )
      .eq('is_deleted', false)
      .order('completed_at', { ascending: false })
      .limit(2000)
    if (error) return json({ error: error.message }, 400)
    const records = (data ?? []) as Row[]
    return new Response(JSON.stringify({ records }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
