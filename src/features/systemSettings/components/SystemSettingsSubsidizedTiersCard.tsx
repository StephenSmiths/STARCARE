import type { PolicySubsidizedFundingTier, PolicySubsidizedTierRow } from '../../../repositories/schedulingPolicyTypes'
import { uiTokens } from '../../shared/ui/uiTokens'
import {
  DEFAULT_POLICY_SUBSIDIZED_TIER_ROWS,
  isValidPolicySubsidizedTiers,
  sortTiersByCanonicalOrder,
} from '../domain/policySubsidizedTierDraft'
import type { UseSystemSettingsResult } from '../hooks/useSystemSettings'
import type { SystemSettingsSnapshot } from '../types'

type Props = {
  draft: SystemSettingsSnapshot
  setField: UseSystemSettingsResult['setField']
}

const TIER_LABELS: Record<PolicySubsidizedFundingTier, string> = {
  GradeA_Subsidized: '甲一買位',
  Voucher: '院舍券',
  Private: '私位',
}

const pushHydrated = (setField: UseSystemSettingsResult['setField'], rows: PolicySubsidizedTierRow[]) => {
  setField('policySubsidizedTiers', rows)
  setField('policySubsidizedTiersHydrated', true)
}

const patchTier = (
  rows: PolicySubsidizedTierRow[],
  tier: PolicySubsidizedFundingTier,
  patch: Partial<PolicySubsidizedTierRow>,
): PolicySubsidizedTierRow[] => rows.map((r) => (r.fundingTier === tier ? { ...r, ...patch } : r))

/** P2：雲端 `facility_policy_subsidized_tier` 三列（須 Edge；見 PRD §6 P2） */
export const SystemSettingsSubsidizedTiersCard = ({ draft, setField }: Props) => {
  const ready = isValidPolicySubsidizedTiers(draft.policySubsidizedTiers)
  const sorted = ready ? sortTiersByCanonicalOrder(draft.policySubsidizedTiers) : []

  return (
    <article className={uiTokens.surfaceCard}>
      <p className={uiTokens.sectionHelp}>
        與 <code>facility_policy_subsidized_tier</code> 對齊（甲一／院舍券／私位各一列）；提交「政策版本」時一併寫入。
      </p>
      {!ready ? (
        <div className={uiTokens.formFieldStack}>
          <p className="text-sm text-slate-400">尚未載入完整三列時，可套用預設列再編輯每週最低次數與 SC 規則。</p>
          <button
            type="button"
            className={uiTokens.btnSecondary}
            onClick={() => pushHydrated(setField, [...DEFAULT_POLICY_SUBSIDIZED_TIER_ROWS])}
          >
            載入預設資助三列
          </button>
        </div>
      ) : (
        <div className={uiTokens.stackVertical}>
          {sorted.map((row) => (
            <fieldset key={row.fundingTier} className="rounded border border-slate-700/40 p-3">
              <legend className="text-sm font-medium text-slate-200">
                {TIER_LABELS[row.fundingTier]}（{row.fundingTier}）
              </legend>
              <div className={`${uiTokens.settingsFieldGrid} mt-2`}>
                <label className={`${uiTokens.formFieldStack} flex flex-row items-center gap-2`}>
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    onChange={(e) =>
                      pushHydrated(setField, patchTier(sorted, row.fundingTier, { enabled: e.target.checked }))
                    }
                  />
                  <span className={uiTokens.formLabel}>啟用此資助列</span>
                </label>
                <label className={uiTokens.formFieldStack}>
                  <span className={uiTokens.formLabel}>每週最低次數（整數）</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    className={uiTokens.formInput}
                    value={row.weeklyMinSessions}
                    onChange={(e) => {
                      const n = Number(e.target.value)
                      const weeklyMinSessions =
                        e.target.value === '' || !Number.isInteger(n) || n < 0 ? 0 : n
                      pushHydrated(setField, patchTier(sorted, row.fundingTier, { weeklyMinSessions }))
                    }}
                  />
                </label>
                <label className={`${uiTokens.formFieldStack} flex flex-row items-center gap-2`}>
                  <input
                    type="checkbox"
                    checked={row.specialCareTherapistOnly}
                    onChange={(e) =>
                      pushHydrated(
                        setField,
                        patchTier(sorted, row.fundingTier, { specialCareTherapistOnly: e.target.checked }),
                      )
                    }
                  />
                  <span className={uiTokens.formLabel}>Special Care 僅限治療師</span>
                </label>
              </div>
            </fieldset>
          ))}
        </div>
      )}
    </article>
  )
}
