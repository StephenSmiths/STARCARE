import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'
import { loadSchedulingPolicyBundle } from '../_shared/schedulingPolicyBundleLoad.ts'

type RuleRow = {
  facility_id: string
  enable_subsidized_rehab: boolean
  enable_dementia_care: boolean
  daily_same_service_limit: number
  min_gap_days_same_service: number
  sc_priority_enabled: boolean
  allow_sc_therapist_only: boolean
  group_capacity_limit: number
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const facilityId = new URL(req.url).searchParams.get('facilityId') ?? 'facility-main'
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('scheduling_rules')
      .select(
        'facility_id, enable_subsidized_rehab, enable_dementia_care, daily_same_service_limit, min_gap_days_same_service, sc_priority_enabled, allow_sc_therapist_only, group_capacity_limit',
      )
      .eq('facility_id', facilityId)
      .maybeSingle()
    if (error) return json({ error: error.message }, 400)
    if (!data) return json({ error: '找不到排班規則' }, 404)
    const row = data as RuleRow
    // PDF 02【16】Seq 29／PRD §7 **B**：無生效政策版本時以 `scheduling_rules` 為準；有版本時 P1 小組人數上限與啟用／SC 旗標與 `scheduling-policy-current-get` 子表語意對齊。`therapistGroupSessionsDailyCap`／`assistantGroupSessionsDailyCap` 僅見於 P1 **`facility_policy_numeric_limits`**（`public.scheduling_rules` 無對應欄），一律自 **`loadSchedulingPolicyBundle`** 之 **`numericLimits`** 輸出（無版本時與骨架預設 8 對齊）。
    const bundle = await loadSchedulingPolicyBundle(supabase, facilityId, new Date())
    const hasPolicy = bundle.policyVersion != null
    const groupCapacityLimit = hasPolicy ? bundle.numericLimits.groupParticipantCap : row.group_capacity_limit
    const tiers = bundle.subsidizedTiers ?? []
    let enableSubsidizedRehab = row.enable_subsidized_rehab
    if (hasPolicy && tiers.length > 0) {
      enableSubsidizedRehab = tiers.some((t) => t.enabled)
    }
    let enableDementiaCare = row.enable_dementia_care
    if (hasPolicy && bundle.dementiaCore != null) {
      enableDementiaCare = bundle.dementiaCore.enabled
    }
    const specialCareTherapistOnlyFromPolicy =
      tiers.some((t) => t.specialCareTherapistOnly) || Boolean(bundle.dementiaCore?.specialCareTherapistOnly)
    const allowScTherapistOnly = hasPolicy
      ? row.allow_sc_therapist_only || specialCareTherapistOnlyFromPolicy
      : row.allow_sc_therapist_only
    const mapped = {
      facilityId: row.facility_id,
      enableSubsidizedRehab,
      enableDementiaCare,
      dailySameServiceLimit: row.daily_same_service_limit,
      minGapDaysSameService: row.min_gap_days_same_service,
      scPriorityEnabled: row.sc_priority_enabled,
      allowScTherapistOnly,
      groupCapacityLimit,
      therapistGroupSessionsDailyCap: bundle.numericLimits.therapistGroupSessionsDailyCap,
      assistantGroupSessionsDailyCap: bundle.numericLimits.assistantGroupSessionsDailyCap,
    }
    return new Response(JSON.stringify(mapped), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
