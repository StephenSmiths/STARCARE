import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { validateSchedulingPolicyDraft } from '../_shared/schedulingPolicyDraftValidate.ts'
import { persistSchedulingPolicyVersion } from '../_shared/schedulingPolicyPersist.ts'

const isDupKey = (msg: string) => msg.includes('duplicate key') || msg.includes('unique constraint')

/** 契約 §4.4：寫入版本＋子表；idempotencyKey；R-promote 於 persist */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const auth = await requireTeamLeadOrAdmin(req)
  if (auth instanceof Response) return auth
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'JSON 解析失敗' }, 400)
  }
  const idempotencyKey = String(body.idempotencyKey ?? body.idempotency_key ?? '').trim()
  if (!idempotencyKey) return json({ error: '缺少 idempotencyKey' }, 400)
  const supabase = getServiceClient()
  const serverNow = new Date()
  const facilityIdEarly = String(body.facilityId ?? body.facility_id ?? 'facility-main').trim()
  const { data: idemRow } = await supabase
    .from('scheduling_policy_commit_idempotency')
    .select('policy_version_id')
    .eq('facility_id', facilityIdEarly)
    .eq('idempotency_key', idempotencyKey)
    .maybeSingle()
  if (idemRow?.policy_version_id) {
    return json({ ok: false, policyVersionId: idemRow.policy_version_id, error: 'idempotency 重複' }, 409)
  }
  const v = await validateSchedulingPolicyDraft(supabase, body, serverNow)
  if (!v.ok) return json({ ok: false, errors: v.errors }, 400)
  const isImmediate = v.normalized.policyVersion?.status === 'active'
  const persisted = await persistSchedulingPolicyVersion(supabase, {
    facilityId: v.facilityId,
    effectiveFromIso: v.effectiveFromIso,
    userId: auth.user.id,
    bundle: v.normalized,
    isImmediate,
  })
  if (!persisted.ok) return json({ error: persisted.message }, 400)
  const vid = persisted.policyVersionId
  const { error: idemErr } = await supabase.from('scheduling_policy_commit_idempotency').insert({
    idempotency_key: idempotencyKey,
    facility_id: v.facilityId,
    policy_version_id: vid,
  })
  if (idemErr) {
    if (isDupKey(idemErr.message)) {
      const { data: canon } = await supabase
        .from('scheduling_policy_commit_idempotency')
        .select('policy_version_id')
        .eq('facility_id', v.facilityId)
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle()
      await supabase.from('facility_scheduling_policy_versions').delete().eq('id', vid)
      return json(
        { ok: false, policyVersionId: canon?.policy_version_id ?? null, error: 'idempotency 競態' },
        409,
      )
    }
    await supabase.from('facility_scheduling_policy_versions').delete().eq('id', vid)
    return json({ error: idemErr.message }, 400)
  }
  const audit = await insertAuditEvent(supabase, {
    action: 'scheduling_policy_version_commit',
    entity_type: 'Scheduling',
    entity_id: v.facilityId,
    actor_id: auth.user.id,
    before_state: null,
    after_state: JSON.stringify({ policyVersionId: vid, effectiveFrom: v.effectiveFromIso }),
    detail: v.normalized.policyVersion?.changeSummary ?? '',
  })
  if (!audit.ok) {
    return json({ ok: true, policyVersionId: vid, auditWarning: audit.message }, 201)
  }
  return json({ ok: true, policyVersionId: vid }, 201)
})
