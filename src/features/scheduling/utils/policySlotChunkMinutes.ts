/**
 * PDF 02【16】P2：由 `facility_policy_subsidized_role_offerings` 解析節長（分鐘）。
 * 週更匯入／智能排班乾跑：長時段依此切分為多個工作節。
 */
import type { PolicySlotVariant, SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'

const VARIANT_MINUTES: Record<PolicySlotVariant, number> = {
  IND_15: 15,
  IND_30: 30,
  GRP_30: 30,
  GRP_60: 60,
}

const GROUP_VARIANT_ORDER: PolicySlotVariant[] = ['GRP_30', 'GRP_60', 'IND_30']
const INDIVIDUAL_VARIANT_ORDER: PolicySlotVariant[] = ['IND_30', 'IND_15', 'GRP_30']

/** 供測試與 UI 對照：節長變體之分鐘數 */
export const policySlotVariantMinutes = (variant: PolicySlotVariant): number => VARIANT_MINUTES[variant]

/** 依職位與小組／個別（容量）自 P2 政策擇節長；無政策時小組 30、個別 30。 */
export const resolvePolicySlotChunkMinutes = (
  role: string,
  isGroupSession: boolean,
  bundle: SchedulingPolicyBundle | null | undefined,
): number => {
  const offerings = bundle?.subsidizedRoleOfferings ?? []
  const order = isGroupSession ? GROUP_VARIANT_ORDER : INDIVIDUAL_VARIANT_ORDER
  for (const variant of order) {
    const hit = offerings.find(
      (o) => o.enabled && o.roleType === role && o.slotVariant === variant,
    )
    if (hit) return VARIANT_MINUTES[variant]
  }
  return 30
}
