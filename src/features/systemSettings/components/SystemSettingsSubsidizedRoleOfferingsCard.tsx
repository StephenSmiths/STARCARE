import type {
  PolicySubsidizedFundingTier,
  PolicySubsidizedRoleOfferingRow,
  PolicySubsidizedRoleType,
  PolicySlotVariant,
} from '../../../repositories/schedulingPolicyTypes'
import {
  POLICY_SLOT_VARIANTS,
  POLICY_SUBSIDIZED_FUNDING_TIERS,
  POLICY_SUBSIDIZED_ROLE_TYPES,
} from '../../../repositories/schedulingPolicyTypes'
import { uiTokens } from '../../shared/ui/uiTokens'
import {
  DEFAULT_POLICY_SUBSIDIZED_ROLE_OFFERINGS,
  isValidPolicySubsidizedRoleOfferings,
  sortRoleOfferingsCanonical,
} from '../domain/policySubsidizedRoleOfferingDraft'
import type { UseSystemSettingsResult } from '../hooks/useSystemSettings'
import type { SystemSettingsSnapshot } from '../types'

type Props = {
  draft: SystemSettingsSnapshot
  setField: UseSystemSettingsResult['setField']
}

const TIER_LABELS: Record<PolicySubsidizedFundingTier, string> = {
  GradeA_Subsidized: '甲一',
  Voucher: '院舍券',
  Private: '私位',
}

const pushHydrated = (setField: UseSystemSettingsResult['setField'], rows: PolicySubsidizedRoleOfferingRow[]) => {
  setField('policySubsidizedRoleOfferings', rows)
  setField('policySubsidizedRoleOfferingsHydrated', true)
}

/** P2：雲端 `facility_policy_subsidized_role_offerings`（48 格；須 Edge；見 PRD §6 P2） */
export const SystemSettingsSubsidizedRoleOfferingsCard = ({ draft, setField }: Props) => {
  const ready = isValidPolicySubsidizedRoleOfferings(draft.policySubsidizedRoleOfferings)
  const sorted = ready ? sortRoleOfferingsCanonical(draft.policySubsidizedRoleOfferings) : []

  const toggle = (
    tier: PolicySubsidizedFundingTier,
    role: PolicySubsidizedRoleType,
    variant: PolicySlotVariant,
    enabled: boolean,
  ) => {
    const next = sorted.map((x) =>
      x.fundingTier === tier && x.roleType === role && x.slotVariant === variant ? { ...x, enabled } : x,
    )
    pushHydrated(setField, next)
  }

  return (
    <article className={uiTokens.surfaceCard}>
      <p className={uiTokens.sectionHelp}>
        與 <code>facility_policy_subsidized_role_offerings</code> 對齊：3 資助列 × 4 職類 × 4 節長（共 48 格）。提交「政策版本」時一併寫入。
      </p>
      {!ready ? (
        <div className={uiTokens.formFieldStack}>
          <p className="text-sm text-slate-400">尚未載入完整矩陣時，可載入 48 格預設（全關）再逐格勾選。</p>
          <button
            type="button"
            className={uiTokens.btnSecondary}
            onClick={() => pushHydrated(setField, [...DEFAULT_POLICY_SUBSIDIZED_ROLE_OFFERINGS])}
          >
            載入完整職類矩陣（48 格）
          </button>
        </div>
      ) : (
        <div className={`${uiTokens.stackVertical} max-h-[min(70vh,32rem)] overflow-y-auto pr-1`}>
          {POLICY_SUBSIDIZED_FUNDING_TIERS.map((tier) => (
            <div key={tier} className="rounded border border-slate-700/40 p-2">
              <h4 className="mb-2 text-sm font-semibold text-slate-200">
                {TIER_LABELS[tier]}（{tier}）
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[20rem] border-collapse text-left text-xs text-slate-200">
                  <thead>
                    <tr>
                      <th className="border border-slate-600/50 p-1" scope="col" />
                      {POLICY_SLOT_VARIANTS.map((v) => (
                        <th key={v} className="border border-slate-600/50 p-1 font-medium" scope="col">
                          {v}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {POLICY_SUBSIDIZED_ROLE_TYPES.map((role) => (
                      <tr key={role}>
                        <th className="border border-slate-600/50 p-1 font-medium" scope="row">
                          {role}
                        </th>
                        {POLICY_SLOT_VARIANTS.map((variant) => {
                          const cell = sorted.find(
                            (x) => x.fundingTier === tier && x.roleType === role && x.slotVariant === variant,
                          )
                          const checked = cell?.enabled ?? false
                          return (
                            <td key={variant} className="border border-slate-600/50 p-0.5 text-center">
                              <input
                                type="checkbox"
                                checked={checked}
                                aria-label={`${tier} ${role} ${variant}`}
                                onChange={(e) => toggle(tier, role, variant, e.target.checked)}
                              />
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
