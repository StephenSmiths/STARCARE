import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
    if (error) return json({ error: error.message }, 400)
    return new Response(JSON.stringify(data ?? []), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
