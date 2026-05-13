import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import type { PolicyVersionCamel, SchedulingPolicyBundle } from './schedulingPolicyTypes.ts'
import { policyVersionOverlapsExisting, loadLegacySchedulingRules } from './schedulingPolicyBundleLoad.ts'
import { appendPolicyDraftCompletenessErrors } from './schedulingPolicyDraftCompleteness.ts'
import { parseDraftChildArrays } from './schedulingPolicyDraftMappers.ts'

const err = (code: string, message: string) => ({ code, message })

const asStr = (v: unknown): string | null => (typeof v === 'string' ? v : null)

/** PDF 02【16】／契約 §2：R-effective、R-overlap、Pass 三筆；回傳 validate 用之 normalized */
export async function validateSchedulingPolicyDraft(
  supabase: SupabaseClient,
  body: unknown,
  serverNow: Date,
): Promise<
  | { ok: true; normalized: SchedulingPolicyBundle; effectiveFromIso: string; facilityId: string }
  | { ok: false; errors: Array<{ code: string; message: string }> }
> {
  const errors: Array<{ code: string; message: string }> = []
  if (body == null || typeof body !== 'object') {
    return { ok: false, errors: [err('BAD_JSON', '請求體須為 JSON 物件')] }
  }
  const o = body as Record<string, unknown>
  const facilityId = String(o.facilityId ?? o.facility_id ?? 'facility-main').trim()
  const changeSummary = String(o.changeSummary ?? o.change_summary ?? '').trim()
  const effectiveRaw = asStr(o.effectiveFrom ?? o.effective_from)
  if (!facilityId) errors.push(err('MISSING_FIELD', 'facilityId 不可為空'))
  if (!changeSummary) errors.push(err('MISSING_FIELD', 'changeSummary 不可為空'))
  if (!effectiveRaw) errors.push(err('MISSING_FIELD', 'effectiveFrom 不可為空'))
  const effDate = effectiveRaw ? new Date(effectiveRaw) : null
  const effectiveFromIso = effDate && !Number.isNaN(effDate.getTime()) ? effDate.toISOString() : ''
  if (effectiveRaw && !effectiveFromIso) errors.push(err('BAD_EFFECTIVE', 'effectiveFrom 非合法 ISO 8601'))
  if (errors.length) return { ok: false, errors }

  if (effDate!.getTime() < serverNow.getTime() - 1500) {
    errors.push(err('R_EFFECTIVE', 'effective_from 不得早於伺服器現在（R-effective）'))
  }

  const { data: fac, error: facErr } = await supabase.from('facilities').select('id').eq('id', facilityId).maybeSingle()
  if (facErr) errors.push(err('FACILITY', facErr.message))
  else if (!fac) errors.push(err('FACILITY_NOT_FOUND', '院舍不存在'))
  if (errors.length) return { ok: false, errors }

  const arrays = parseDraftChildArrays(o, errors)
  if (errors.length) return { ok: false, errors }
  appendPolicyDraftCompletenessErrors(arrays, errors)
  if (errors.length) return { ok: false, errors }

  const overlap = await policyVersionOverlapsExisting(supabase, facilityId, effectiveFromIso, null)
  if (overlap) errors.push(err('R_OVERLAP', '與既有政策版本區間重疊（R-overlap）'))
  if (errors.length) return { ok: false, errors }

  const legacy = await loadLegacySchedulingRules(supabase, facilityId)
  const isActive = effDate!.getTime() <= serverNow.getTime()
  const draftPv: PolicyVersionCamel = {
    id: crypto.randomUUID(),
    effectiveFrom: effectiveFromIso,
    effectiveUntil: null,
    status: isActive ? 'active' : 'scheduled',
    changeSummary,
    createdAt: serverNow.toISOString(),
  }
  const normalized: SchedulingPolicyBundle = {
    facilityId,
    policyVersion: draftPv,
    ...arrays,
    legacySchedulingRules: legacy,
  }
  return { ok: true, normalized, effectiveFromIso, facilityId }
}
