import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'
import { listPolicyVersionSummaries } from '../_shared/schedulingPolicyBundleLoad.ts'

/** 契約補充：院舍政策版本列（新→舊）；PRD §4 已排程／歷程檢視 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const sp = new URL(req.url).searchParams
    const facilityId = sp.get('facilityId') ?? 'facility-main'
    const limitRaw = sp.get('limit')
    const limit = limitRaw ? Number(limitRaw) : 50
    const supabase = getServiceClient()
    const { data: fac, error: facErr } = await supabase.from('facilities').select('id').eq('id', facilityId).maybeSingle()
    if (facErr) return json({ error: facErr.message }, 400)
    if (!fac) return json({ error: '院舍不存在' }, 404)
    const versions = await listPolicyVersionSummaries(supabase, facilityId, limit)
    return new Response(JSON.stringify({ facilityId, versions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
