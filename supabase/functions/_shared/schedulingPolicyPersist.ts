import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import type { SchedulingPolicyBundle } from './schedulingPolicyTypes.ts'

/** R-promote：立即生效前將舊 active 標 superseded 並寫 effective_until */
export async function persistSchedulingPolicyVersion(
  supabase: SupabaseClient,
  params: {
    facilityId: string
    effectiveFromIso: string
    userId: string
    bundle: SchedulingPolicyBundle
    isImmediate: boolean
  },
): Promise<{ ok: true; policyVersionId: string } | { ok: false; message: string }> {
  const { facilityId, effectiveFromIso, userId, bundle, isImmediate } = params
  const summary = bundle.policyVersion?.changeSummary ?? ''

  if (isImmediate) {
    const { error: upErr } = await supabase
      .from('facility_scheduling_policy_versions')
      .update({ status: 'superseded', effective_until: effectiveFromIso })
      .eq('facility_id', facilityId)
      .eq('status', 'active')
    if (upErr) return { ok: false, message: upErr.message }
  }

  const { data: ver, error: vErr } = await supabase
    .from('facility_scheduling_policy_versions')
    .insert({
      facility_id: facilityId,
      effective_from: effectiveFromIso,
      effective_until: null,
      status: isImmediate ? 'active' : 'scheduled',
      change_summary: summary,
      created_by_user_id: userId,
    })
    .select('id')
    .single()
  if (vErr || !ver?.id) return { ok: false, message: vErr?.message ?? '版本寫入失敗' }
  const vid = ver.id as string

  const { error: nErr } = await supabase.from('facility_policy_numeric_limits').insert({
    policy_version_id: vid,
    therapist_group_sessions_daily_cap: bundle.numericLimits.therapistGroupSessionsDailyCap,
    assistant_group_sessions_daily_cap: bundle.numericLimits.assistantGroupSessionsDailyCap,
    group_participant_cap: bundle.numericLimits.groupParticipantCap,
  })
  if (nErr) {
    await supabase.from('facility_scheduling_policy_versions').delete().eq('id', vid)
    return { ok: false, message: nErr.message }
  }

  if (bundle.nonTherapySlots.length) {
    const { error } = await supabase.from('facility_policy_non_therapy_slots').insert(
      bundle.nonTherapySlots.map((r) => ({
        policy_version_id: vid,
        slot_kind: r.slotKind,
        time_start: r.timeStart,
        time_end: r.timeEnd,
      })),
    )
    if (error) {
      await supabase.from('facility_scheduling_policy_versions').delete().eq('id', vid)
      return { ok: false, message: error.message }
    }
  }

  if (bundle.fixedActivities.length) {
    const { error } = await supabase.from('facility_policy_fixed_activities').insert(
      bundle.fixedActivities.map((r) => ({
        policy_version_id: vid,
        service_type: r.serviceType,
        time_start: r.timeStart,
        time_end: r.timeEnd,
        delivery_mode: r.deliveryMode,
        activity_name: r.activityName,
        role_pt: r.rolePt,
        role_pta: r.rolePta,
        role_ot: r.roleOt,
        role_ota: r.roleOta,
      })),
    )
    if (error) {
      await supabase.from('facility_scheduling_policy_versions').delete().eq('id', vid)
      return { ok: false, message: error.message }
    }
  }

  if (bundle.subsidizedTiers.length) {
    const { error } = await supabase.from('facility_policy_subsidized_tier').insert(
      bundle.subsidizedTiers.map((r) => ({
        policy_version_id: vid,
        funding_tier: r.fundingTier,
        enabled: r.enabled,
        weekly_min_sessions: r.weeklyMinSessions,
        special_care_therapist_only: r.specialCareTherapistOnly,
      })),
    )
    if (error) {
      await supabase.from('facility_scheduling_policy_versions').delete().eq('id', vid)
      return { ok: false, message: error.message }
    }
  }

  if (bundle.subsidizedRoleOfferings.length) {
    const { error } = await supabase.from('facility_policy_subsidized_role_offerings').insert(
      bundle.subsidizedRoleOfferings.map((r) => ({
        policy_version_id: vid,
        funding_tier: r.fundingTier,
        role_type: r.roleType,
        slot_variant: r.slotVariant,
        enabled: r.enabled,
      })),
    )
    if (error) {
      await supabase.from('facility_scheduling_policy_versions').delete().eq('id', vid)
      return { ok: false, message: error.message }
    }
  }

  if (bundle.subsidizedPassOrder.length) {
    const { error } = await supabase.from('facility_policy_subsidized_pass_order').insert(
      bundle.subsidizedPassOrder.map((r) => ({
        policy_version_id: vid,
        sort_order: r.sortOrder,
        funding_tier: r.fundingTier,
      })),
    )
    if (error) {
      await supabase.from('facility_scheduling_policy_versions').delete().eq('id', vid)
      return { ok: false, message: error.message }
    }
  }

  if (bundle.dementiaCore) {
    const { error } = await supabase.from('facility_policy_dementia_core').insert({
      policy_version_id: vid,
      enabled: bundle.dementiaCore.enabled,
      weekly_min_sessions: bundle.dementiaCore.weeklyMinSessions,
      special_care_therapist_only: bundle.dementiaCore.specialCareTherapistOnly,
    })
    if (error) {
      await supabase.from('facility_scheduling_policy_versions').delete().eq('id', vid)
      return { ok: false, message: error.message }
    }
  }

  if (bundle.dementiaRoleOfferings.length) {
    const { error } = await supabase.from('facility_policy_dementia_role_offerings').insert(
      bundle.dementiaRoleOfferings.map((r) => ({
        policy_version_id: vid,
        role_type: r.roleType,
        slot_variant: r.slotVariant,
        enabled: r.enabled,
      })),
    )
    if (error) {
      await supabase.from('facility_scheduling_policy_versions').delete().eq('id', vid)
      return { ok: false, message: error.message }
    }
  }

  return { ok: true, policyVersionId: vid }
}
