import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import type { PolicyVersionCamel, SchedulingPolicyBundle } from './schedulingPolicyTypes.ts'

const fmtTime = (t: string | null | undefined): string => {
  if (!t) return ''
  const s = String(t)
  return s.length >= 5 ? s.slice(0, 5) : s
}

export const mapVersionRow = (r: {
  id: string
  facility_id: string
  effective_from: string
  effective_until: string | null
  status: string
  change_summary: string
  created_at: string
}): PolicyVersionCamel => ({
  id: r.id,
  effectiveFrom: r.effective_from,
  effectiveUntil: r.effective_until,
  status: r.status as PolicyVersionCamel['status'],
  changeSummary: r.change_summary ?? '',
  createdAt: r.created_at,
})

/** 併行載入子表並組出 Bundle（不含 legacy；呼叫端併入 legacy） */
export async function fetchChildTablesAsBundle(
  supabase: SupabaseClient,
  facilityId: string,
  verRow: Parameters<typeof mapVersionRow>[0],
  legacy: Record<string, unknown> | null,
): Promise<SchedulingPolicyBundle> {
  const vid = verRow.id
  const [slots, nums, fixed, tiers, roles, pass, dem, demRo] = await Promise.all([
    supabase.from('facility_policy_non_therapy_slots').select('slot_kind, time_start, time_end').eq('policy_version_id', vid),
    supabase
      .from('facility_policy_numeric_limits')
      .select('therapist_group_sessions_daily_cap, assistant_group_sessions_daily_cap, group_participant_cap')
      .eq('policy_version_id', vid)
      .maybeSingle(),
    supabase
      .from('facility_policy_fixed_activities')
      .select(
        'service_type, time_start, time_end, delivery_mode, activity_name, role_pt, role_pta, role_ot, role_ota',
      )
      .eq('policy_version_id', vid),
    supabase
      .from('facility_policy_subsidized_tier')
      .select('funding_tier, enabled, weekly_min_sessions, special_care_therapist_only')
      .eq('policy_version_id', vid),
    supabase
      .from('facility_policy_subsidized_role_offerings')
      .select('funding_tier, role_type, slot_variant, enabled')
      .eq('policy_version_id', vid),
    supabase.from('facility_policy_subsidized_pass_order').select('sort_order, funding_tier').eq('policy_version_id', vid),
    supabase
      .from('facility_policy_dementia_core')
      .select('enabled, weekly_min_sessions, special_care_therapist_only')
      .eq('policy_version_id', vid)
      .maybeSingle(),
    supabase.from('facility_policy_dementia_role_offerings').select('role_type, slot_variant, enabled').eq('policy_version_id', vid),
  ])
  for (const x of [slots, nums, fixed, tiers, roles, pass, dem, demRo]) {
    if (x.error) throw new Error(x.error.message)
  }
  const n = nums.data
  return {
    facilityId,
    policyVersion: mapVersionRow(verRow),
    nonTherapySlots: (slots.data ?? []).map((x) => ({
      slotKind: x.slot_kind,
      timeStart: fmtTime(x.time_start as string),
      timeEnd: fmtTime(x.time_end as string),
    })),
    numericLimits: n
      ? {
          therapistGroupSessionsDailyCap: n.therapist_group_sessions_daily_cap,
          assistantGroupSessionsDailyCap: n.assistant_group_sessions_daily_cap,
          groupParticipantCap: n.group_participant_cap,
        }
      : {
          therapistGroupSessionsDailyCap: 8,
          assistantGroupSessionsDailyCap: 8,
          groupParticipantCap: 6,
        },
    fixedActivities: (fixed.data ?? []).map((x) => ({
      serviceType: x.service_type,
      timeStart: fmtTime(x.time_start as string),
      timeEnd: fmtTime(x.time_end as string),
      deliveryMode: x.delivery_mode,
      activityName: x.activity_name ?? '',
      rolePt: x.role_pt,
      rolePta: x.role_pta,
      roleOt: x.role_ot,
      roleOta: x.role_ota,
    })),
    subsidizedTiers: (tiers.data ?? []).map((x) => ({
      fundingTier: x.funding_tier,
      enabled: x.enabled,
      weeklyMinSessions: x.weekly_min_sessions,
      specialCareTherapistOnly: x.special_care_therapist_only,
    })),
    subsidizedRoleOfferings: (roles.data ?? []).map((x) => ({
      fundingTier: x.funding_tier,
      roleType: x.role_type,
      slotVariant: x.slot_variant,
      enabled: x.enabled,
    })),
    subsidizedPassOrder: (pass.data ?? [])
      .map((x) => ({ sortOrder: x.sort_order, fundingTier: x.funding_tier }))
      .sort((a, b) => a.sortOrder - b.sortOrder),
    dementiaCore: dem.data
      ? {
          enabled: dem.data.enabled,
          weeklyMinSessions: dem.data.weekly_min_sessions,
          specialCareTherapistOnly: dem.data.special_care_therapist_only,
        }
      : null,
    dementiaRoleOfferings: (demRo.data ?? []).map((x) => ({
      roleType: x.role_type,
      slotVariant: x.slot_variant,
      enabled: x.enabled,
    })),
    legacySchedulingRules: legacy,
  }
}
