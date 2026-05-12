import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'
import { loadSchedulingPolicyBundle } from '../_shared/schedulingPolicyBundleLoad.ts'

/** 契約 §4.2：asOf 瞬時政策 bundle（報表回溯） */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const sp = new URL(req.url).searchParams
    const facilityId = sp.get('facilityId') ?? 'facility-main'
    const asOfRaw = sp.get('asOf')
    if (!asOfRaw?.trim()) return json({ error: '缺少 asOf（ISO 8601）' }, 400)
    const asOf = new Date(asOfRaw)
    if (Number.isNaN(asOf.getTime())) return json({ error: 'asOf 非合法 ISO 8601' }, 400)
    const supabase = getServiceClient()
    const { data: fac, error: facErr } = await supabase.from('facilities').select('id').eq('id', facilityId).maybeSingle()
    if (facErr) return json({ error: facErr.message }, 400)
    if (!fac) return json({ error: '院舍不存在' }, 404)
    const bundle = await loadSchedulingPolicyBundle(supabase, facilityId, asOf)
    return new Response(JSON.stringify(bundle), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
