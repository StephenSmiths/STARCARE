import type { PolicySubsidizedFundingTier, PolicySubsidizedPassOrderRow } from '../../../repositories/schedulingPolicyTypes'
import { uiTokens } from '../../shared/ui/uiTokens'
import {
  DEFAULT_POLICY_SUBSIDIZED_PASS_ORDER,
  reorderPassOrderSwapAdjacent,
} from '../domain/policyPassOrderDraft'
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

const pushHydrated = (setField: UseSystemSettingsResult['setField'], rows: PolicySubsidizedPassOrderRow[]) => {
  setField('policySubsidizedPassOrder', rows)
  setField('policySubsidizedPassOrderHydrated', true)
}

/** P2：雲端 `facility_policy_subsidized_pass_order`（須 Edge；見 PRD §6 P2） */
export const SystemSettingsPassOrderCard = ({ draft, setField }: Props) => {
  const sorted = [...draft.policySubsidizedPassOrder].sort((a, b) => a.sortOrder - b.sortOrder)
  const ready = sorted.length === 3

  return (
    <article className={uiTokens.surfaceCard}>
      <p className={uiTokens.sectionHelp}>
        與 <code>facility_policy_subsidized_pass_order</code> 對齊；Pass 1 為最優先。提交「政策版本」時一併寫入。
      </p>
      {!ready ? (
        <div className={uiTokens.formFieldStack}>
          <p className="text-sm text-slate-400">
            尚未載入完整三列時，可套用預設順序（甲一 → 院舍券 → 私位）再微調。
          </p>
          <button
            type="button"
            className={uiTokens.btnSecondary}
            onClick={() => pushHydrated(setField, [...DEFAULT_POLICY_SUBSIDIZED_PASS_ORDER])}
          >
            載入預設 Pass 順序
          </button>
        </div>
      ) : (
        <ol className={`${uiTokens.stackVertical} list-none pl-0`}>
          {sorted.map((row, displayIdx) => (
            <li
              key={row.fundingTier}
              className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-700/40 px-3 py-2"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-xs font-medium text-slate-400">Pass {row.sortOrder}</span>
                <span className="truncate font-medium text-slate-100">{TIER_LABELS[row.fundingTier]}</span>
                <span className="truncate font-mono text-xs text-slate-500">{row.fundingTier}</span>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  className={uiTokens.btnSecondary}
                  disabled={displayIdx === 0}
                  aria-label={`Pass ${row.sortOrder} 上移`}
                  onClick={() => pushHydrated(setField, reorderPassOrderSwapAdjacent(sorted, displayIdx - 1))}
                >
                  上移
                </button>
                <button
                  type="button"
                  className={uiTokens.btnSecondary}
                  disabled={displayIdx === sorted.length - 1}
                  aria-label={`Pass ${row.sortOrder} 下移`}
                  onClick={() => pushHydrated(setField, reorderPassOrderSwapAdjacent(sorted, displayIdx))}
                >
                  下移
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </article>
  )
}
