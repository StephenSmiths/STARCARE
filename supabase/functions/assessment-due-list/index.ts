import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'
import { buildAssessmentDueTasksFromAdmissionRows } from '../_shared/assessmentDueFromAdmission.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  const url = new URL(req.url)
  const leadRaw = url.searchParams.get('lead_days')
  const leadDays = Math.min(Math.max(leadRaw ? parseInt(leadRaw, 10) : 14, 1), 90)
  if (Number.isNaN(leadDays)) return json({ error: 'lead_days 無效' }, 400)

  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('residents')
      .select('id, name, bed_number, admission_date, assessment_next_due_date')
      .eq('is_deleted', false)
    if (error) return json({ error: error.message }, 400)
    const rows = (data ?? []) as {
      id: string
      name: string
      bed_number: string
      admission_date: string
      assessment_next_due_date?: string | null
    }[]
    const tasks = buildAssessmentDueTasksFromAdmissionRows(rows, new Date(), leadDays)
    return new Response(JSON.stringify({ tasks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
