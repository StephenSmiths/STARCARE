import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { guardTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { validateSchedulingPolicyDraft } from '../_shared/schedulingPolicyDraftValidate.ts'

/** 契約 §4.3：校驗草稿不寫入；TeamLead／Admin */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const denied = await guardTeamLeadOrAdmin(req)
  if (denied) return denied
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'JSON 解析失敗' }, 400)
  }
  try {
    const supabase = getServiceClient()
    const v = await validateSchedulingPolicyDraft(supabase, body, new Date())
    if (!v.ok) return json({ ok: false, errors: v.errors }, 200)
    return json({ ok: true, errors: [], normalized: v.normalized }, 200)
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
