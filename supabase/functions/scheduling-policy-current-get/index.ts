import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'
import { loadSchedulingPolicyBundle } from '../_shared/schedulingPolicyBundleLoad.ts'

/** 契約 §4.1：目前生效政策 bundle（asOf=now）；無版本時 policyVersion=null 並附 legacy */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const facilityId = new URL(req.url).searchParams.get('facilityId') ?? 'facility-main'
    const supabase = getServiceClient()
    const { data: fac, error: facErr } = await supabase.from('facilities').select('id').eq('id', facilityId).maybeSingle()
    if (facErr) return json({ error: facErr.message }, 400)
    if (!fac) return json({ error: '院舍不存在' }, 404)
    const bundle = await loadSchedulingPolicyBundle(supabase, facilityId, new Date())
    return new Response(JSON.stringify(bundle), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
