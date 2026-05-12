import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import type { SchedulingPolicyBundle } from './schedulingPolicyTypes.ts'
import { fetchChildTablesAsBundle } from './schedulingPolicyBundleChildren.ts'

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

export type PolicyVersionDbRow = {
  id: string
  facility_id: string
  effective_from: string
  effective_until: string | null
  status: string
  change_summary: string
  created_at: string
}

/** 與 `scheduling-rules-get` 一致之 legacy 扁平欄位（過渡期併附） */
export async function loadLegacySchedulingRules(
  supabase: SupabaseClient,
  facilityId: string,
): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase
    .from('scheduling_rules')
    .select(
      'facility_id, enable_subsidized_rehab, enable_dementia_care, daily_same_service_limit, min_gap_days_same_service, sc_priority_enabled, allow_sc_therapist_only, group_capacity_limit',
    )
    .eq('facility_id', facilityId)
    .maybeSingle()
  if (error || !data) return null
  const row = data as RuleRow
  return {
    facilityId: row.facility_id,
    enableSubsidizedRehab: row.enable_subsidized_rehab,
    enableDementiaCare: row.enable_dementia_care,
    dailySameServiceLimit: row.daily_same_service_limit,
    minGapDaysSameService: row.min_gap_days_same_service,
    scPriorityEnabled: row.sc_priority_enabled,
    allowScTherapistOnly: row.allow_sc_therapist_only,
    groupCapacityLimit: row.group_capacity_limit,
  }
}

/** effective_from 由新到舊候選，再以 effective_until 篩 asOf 適用列 */
export async function findPolicyVersionRowAt(
  supabase: SupabaseClient,
  facilityId: string,
  asOf: Date,
): Promise<PolicyVersionDbRow | null> {
  const iso = asOf.toISOString()
  const { data: candidates, error } = await supabase
    .from('facility_scheduling_policy_versions')
    .select('id, facility_id, effective_from, effective_until, status, change_summary, created_at')
    .eq('facility_id', facilityId)
    .lte('effective_from', iso)
    .order('effective_from', { ascending: false })
    .limit(40)
  if (error) throw new Error(error.message)
  const rows = (candidates ?? []) as PolicyVersionDbRow[]
  const hit = rows.find((r) => !r.effective_until || new Date(r.effective_until) > asOf)
  return hit ?? null
}

const emptyBundle = (facilityId: string, legacy: Record<string, unknown> | null): SchedulingPolicyBundle => ({
  facilityId,
  policyVersion: null,
  nonTherapySlots: [],
  numericLimits: {
    therapistGroupSessionsDailyCap: 8,
    assistantGroupSessionsDailyCap: 8,
    groupParticipantCap: 6,
  },
  fixedActivities: [],
  subsidizedTiers: [],
  subsidizedRoleOfferings: [],
  subsidizedPassOrder: [],
  dementiaCore: null,
  dementiaRoleOfferings: [],
  legacySchedulingRules: legacy,
})

export async function loadSchedulingPolicyBundle(
  supabase: SupabaseClient,
  facilityId: string,
  asOf: Date,
): Promise<SchedulingPolicyBundle> {
  const legacy = await loadLegacySchedulingRules(supabase, facilityId)
  const verRow = await findPolicyVersionRowAt(supabase, facilityId, asOf)
  if (!verRow) return emptyBundle(facilityId, legacy)
  return fetchChildTablesAsBundle(supabase, facilityId, verRow, legacy)
}

/** R-overlap：新區間 [newStart, ∞) 與既有 [s,e) 是否相交（e 空視為無限） */
export async function policyVersionOverlapsExisting(
  supabase: SupabaseClient,
  facilityId: string,
  effectiveFromIso: string,
  excludeVersionId: string | null,
): Promise<boolean> {
  const newStart = new Date(effectiveFromIso).getTime()
  const newEnd = Number.POSITIVE_INFINITY
  const { data: rows, error } = await supabase
    .from('facility_scheduling_policy_versions')
    .select('id, effective_from, effective_until')
    .eq('facility_id', facilityId)
  if (error) throw new Error(error.message)
  for (const r of rows ?? []) {
    if (excludeVersionId && r.id === excludeVersionId) continue
    const s = new Date(r.effective_from as string).getTime()
    const e = r.effective_until == null ? Number.POSITIVE_INFINITY : new Date(r.effective_until as string).getTime()
    if (Math.max(newStart, s) < Math.min(newEnd, e)) return true
  }
  return false
}
