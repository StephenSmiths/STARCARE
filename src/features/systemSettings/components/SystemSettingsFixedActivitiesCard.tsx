import { uiTokens } from '../../shared/ui/uiTokens'
import { createEmptyPolicyFixedActivityRow } from '../domain/policyFixedActivityDraft'
import type { UseSystemSettingsResult } from '../hooks/useSystemSettings'
import type { SystemSettingsSnapshot } from '../types'
import type { PolicyFixedActivityRow } from '../../../repositories/schedulingPolicyTypes'

type Props = {
  draft: SystemSettingsSnapshot
  setField: UseSystemSettingsResult['setField']
}

const replaceRow = (rows: PolicyFixedActivityRow[], i: number, patch: Partial<PolicyFixedActivityRow>) =>
  rows.map((r, j) => (j === i ? { ...r, ...patch } : r))

/** P2：雲端政策 `facility_policy_fixed_activities` 多筆編輯（須 Edge；見 PRD §6 P2） */
export const SystemSettingsFixedActivitiesCard = ({ draft, setField }: Props) => {
  const rows = draft.policyFixedActivities

  return (
    <article className={uiTokens.surfaceCard}>
      <p className={uiTokens.sectionHelp}>
        與 <code>facility_policy_fixed_activities</code> 對齊；提交「政策版本」時一併寫入（須 Team Lead／Admin）。
      </p>
      <div className={uiTokens.stackVertical}>
        {rows.map((r, i) => (
          <fieldset key={i} className="rounded border border-slate-700/40 p-3">
            <legend className="text-sm font-medium text-slate-200">固定活動 {i + 1}</legend>
            <div className={`${uiTokens.settingsFieldGrid} mt-2`}>
              <label className={uiTokens.formFieldStack}>
                <span className={uiTokens.formLabel}>服務類型</span>
                <select
                  className={uiTokens.formInput}
                  value={r.serviceType}
                  onChange={(e) =>
                    setField('policyFixedActivities', replaceRow(rows, i, { serviceType: e.target.value }))
                  }
                >
                  <option value="Subsidized_Rehab">資助復康 Subsidized_Rehab</option>
                  <option value="Dementia_Care">認知障礙 Dementia_Care</option>
                </select>
              </label>
              <label className={uiTokens.formFieldStack}>
                <span className={uiTokens.formLabel}>模式</span>
                <select
                  className={uiTokens.formInput}
                  value={r.deliveryMode}
                  onChange={(e) =>
                    setField('policyFixedActivities', replaceRow(rows, i, { deliveryMode: e.target.value }))
                  }
                >
                  <option value="Individual">Individual</option>
                  <option value="Group">Group</option>
                </select>
              </label>
              <label className={uiTokens.formFieldStack}>
                <span className={uiTokens.formLabel}>開始（HH:mm）</span>
                <input
                  type="text"
                  className={uiTokens.formInput}
                  value={r.timeStart}
                  onChange={(e) =>
                    setField('policyFixedActivities', replaceRow(rows, i, { timeStart: e.target.value }))
                  }
                />
              </label>
              <label className={uiTokens.formFieldStack}>
                <span className={uiTokens.formLabel}>結束（HH:mm）</span>
                <input
                  type="text"
                  className={uiTokens.formInput}
                  value={r.timeEnd}
                  onChange={(e) =>
                    setField('policyFixedActivities', replaceRow(rows, i, { timeEnd: e.target.value }))
                  }
                />
              </label>
              <label className={`${uiTokens.formFieldStack} sm:col-span-2`}>
                <span className={uiTokens.formLabel}>活動名稱</span>
                <input
                  type="text"
                  className={uiTokens.formInput}
                  value={r.activityName}
                  onChange={(e) =>
                    setField('policyFixedActivities', replaceRow(rows, i, { activityName: e.target.value }))
                  }
                />
              </label>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              {(
                [
                  ['rolePt', 'PT'],
                  ['rolePta', 'PTA'],
                  ['roleOt', 'OT'],
                  ['roleOta', 'OTA'],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={r[k]}
                    onChange={(e) =>
                      setField('policyFixedActivities', replaceRow(rows, i, { [k]: e.target.checked }))
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="mt-2">
              <button
                type="button"
                className={uiTokens.btnSecondaryMt3}
                onClick={() => setField('policyFixedActivities', rows.filter((_, j) => j !== i))}
              >
                刪除此筆
              </button>
            </div>
          </fieldset>
        ))}
        <button
          type="button"
          className={uiTokens.btnSecondary}
          onClick={() => setField('policyFixedActivities', [...rows, createEmptyPolicyFixedActivityRow()])}
        >
          新增固定活動
        </button>
      </div>
    </article>
  )
}
