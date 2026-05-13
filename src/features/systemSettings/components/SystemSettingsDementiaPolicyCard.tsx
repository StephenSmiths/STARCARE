import type {
  PolicyDementiaCore,
  PolicyDementiaRoleOfferingRow,
  PolicyDementiaRoleType,
  PolicySlotVariant,
} from '../../../repositories/schedulingPolicyTypes'
import { POLICY_DEMENTIA_ROLE_TYPES, POLICY_SLOT_VARIANTS } from '../../../repositories/schedulingPolicyTypes'
import { uiTokens } from '../../shared/ui/uiTokens'
import {
  DEFAULT_POLICY_DEMENTIA_ROLE_OFFERINGS,
  isValidPolicyDementiaRoleOfferings,
  sortDementiaRoleOfferingsCanonical,
} from '../domain/policyDementiaDraft'
import type { UseSystemSettingsResult } from '../hooks/useSystemSettings'
import type { SystemSettingsSnapshot } from '../types'

type Props = {
  draft: SystemSettingsSnapshot
  setField: UseSystemSettingsResult['setField']
}

const pushCoreHydrated = (setField: UseSystemSettingsResult['setField'], core: PolicyDementiaCore) => {
  setField('policyDementiaCore', core)
  setField('policyDementiaCoreHydrated', true)
}

const pushRoleHydrated = (setField: UseSystemSettingsResult['setField'], rows: PolicyDementiaRoleOfferingRow[]) => {
  setField('policyDementiaRoleOfferings', rows)
  setField('policyDementiaRoleOfferingsHydrated', true)
}

/** P2：雲端 `facility_policy_dementia_core`／`facility_policy_dementia_role_offerings`（須 Edge） */
export const SystemSettingsDementiaPolicyCard = ({ draft, setField }: Props) => {
  const core = draft.policyDementiaCore
  const roleReady = isValidPolicyDementiaRoleOfferings(draft.policyDementiaRoleOfferings)
  const roleSorted = roleReady ? sortDementiaRoleOfferingsCanonical(draft.policyDementiaRoleOfferings) : []

  const toggleRole = (role: PolicyDementiaRoleType, variant: PolicySlotVariant, enabled: boolean) => {
    const next = roleSorted.map((x) =>
      x.roleType === role && x.slotVariant === variant ? { ...x, enabled } : x,
    )
    pushRoleHydrated(setField, next)
  }

  return (
    <article className={uiTokens.surfaceCard}>
      <p className={uiTokens.sectionHelp}>
        與 <code>facility_policy_dementia_core</code>／<code>facility_policy_dementia_role_offerings</code> 對齊；提交「政策版本」時一併寫入。
      </p>
      <div className={`${uiTokens.settingsFieldGrid} mb-4`}>
        <label className={`${uiTokens.formFieldStack} flex flex-row items-center gap-2`}>
          <input
            type="checkbox"
            checked={core.enabled}
            onChange={(e) => pushCoreHydrated(setField, { ...core, enabled: e.target.checked })}
          />
          <span className={uiTokens.formLabel}>啟用認知障礙症服務政策</span>
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>每週最低節數（整數）</span>
          <input
            type="number"
            min={0}
            step={1}
            className={uiTokens.formInput}
            value={core.weeklyMinSessions}
            onChange={(e) => {
              const n = Number(e.target.value)
              const weeklyMinSessions =
                e.target.value === '' || !Number.isInteger(n) || n < 0 ? 0 : n
              pushCoreHydrated(setField, { ...core, weeklyMinSessions })
            }}
          />
        </label>
        <label className={`${uiTokens.formFieldStack} flex flex-row items-center gap-2`}>
          <input
            type="checkbox"
            checked={core.specialCareTherapistOnly}
            onChange={(e) =>
              pushCoreHydrated(setField, { ...core, specialCareTherapistOnly: e.target.checked })
            }
          />
          <span className={uiTokens.formLabel}>Special Care 僅限治療師（認知軌）</span>
        </label>
      </div>
      {!roleReady ? (
        <div className={uiTokens.formFieldStack}>
          <p className="text-sm text-slate-400">尚未載入完整 8 格時，可載入預設格再逐格勾選。</p>
          <button
            type="button"
            className={uiTokens.btnSecondary}
            onClick={() => pushRoleHydrated(setField, [...DEFAULT_POLICY_DEMENTIA_ROLE_OFFERINGS])}
          >
            載入認知職類格（8 格）
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[16rem] border-collapse text-left text-xs text-slate-200">
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
              {POLICY_DEMENTIA_ROLE_TYPES.map((role) => (
                <tr key={role}>
                  <th className="border border-slate-600/50 p-1 font-medium" scope="row">
                    {role}
                  </th>
                  {POLICY_SLOT_VARIANTS.map((variant) => {
                    const cell = roleSorted.find((x) => x.roleType === role && x.slotVariant === variant)
                    return (
                      <td key={variant} className="border border-slate-600/50 p-0.5 text-center">
                        <input
                          type="checkbox"
                          checked={cell?.enabled ?? false}
                          aria-label={`認知 ${role} ${variant}`}
                          onChange={(e) => toggleRole(role, variant, e.target.checked)}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  )
}
