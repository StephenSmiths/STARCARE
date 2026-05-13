import type { UseSystemSettingsResult } from '../hooks/useSystemSettings'
import type { SubsidizedRehabNonTherapyInterval, SystemSettingsSnapshot } from '../types'
import { uiTokens } from '../../shared/ui/uiTokens'

type DraftPick = Pick<
  SystemSettingsSnapshot,
  | 'nonTherapyWindowStart'
  | 'nonTherapyWindowEnd'
  | 'schedulingWindowStart'
  | 'schedulingWindowEnd'
  | 'shiftPrepBlockEnabled'
  | 'subsidizedRehabNonTherapyIntervals'
>

/** PDF 02【16】Seq 29：資助復康「非治療排除」多段（本機；提交 policy 時寫入 **OTHER**） */
export type SystemSettingsNonTherapyIntervalsEditorProps = {
  draft: DraftPick
  setField: UseSystemSettingsResult['setField']
}

const defaultRow = (): SubsidizedRehabNonTherapyInterval => ({ timeStart: '12:00', timeEnd: '13:00' })

export const SystemSettingsNonTherapyIntervalsEditor = ({
  draft,
  setField,
}: SystemSettingsNonTherapyIntervalsEditorProps) => {
  const multiOn = draft.subsidizedRehabNonTherapyIntervals !== undefined
  const rows = draft.subsidizedRehabNonTherapyIntervals ?? []

  const syncFromLunch = () => {
    setField('subsidizedRehabNonTherapyIntervals', [
      { timeStart: draft.nonTherapyWindowStart.trim(), timeEnd: draft.nonTherapyWindowEnd.trim() },
    ])
  }

  return (
    <div className={`${uiTokens.stackVertical} border-t border-slate-200 pt-4 dark:border-slate-700`}>
      <p className={uiTokens.sectionHelp}>
        與 facility_policy_non_therapy_slots 對齊：啟用後可編多段 HH:mm（午休／開工準備以外之區間於送審時寫為 OTHER；MORNING_DOC／AFTERNOON_DOC
        仍由雲端列保留）。
      </p>
      <label className={uiTokens.formToggleLabel}>
        <input
          type="checkbox"
          checked={multiOn}
          onChange={(e) => {
            if (e.target.checked) {
              syncFromLunch()
            } else {
              setField('subsidizedRehabNonTherapyIntervals', undefined)
            }
          }}
        />
        啟用多段「資助復康非治療排除」
      </label>
      {multiOn ? (
        <div className={uiTokens.stackVertical}>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={uiTokens.btnSecondary} onClick={syncFromLunch}>
              與午休兩欄同步為一段
            </button>
            <button
              type="button"
              className={uiTokens.btnSecondary}
              onClick={() => setField('subsidizedRehabNonTherapyIntervals', [...rows, defaultRow()])}
            >
              新增一段
            </button>
          </div>
          <ul className="flex flex-col gap-3">
            {rows.map((row, i) => (
              <li key={`nt-${i}-${row.timeStart}`} className={uiTokens.settingsFieldGrid}>
                <label className={uiTokens.formFieldStack}>
                  <span className={uiTokens.formLabel}>開始（HH:mm）</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={uiTokens.formInput}
                    value={row.timeStart}
                    onChange={(e) => {
                      const next = rows.map((r, j) => (j === i ? { ...r, timeStart: e.target.value } : r))
                      setField('subsidizedRehabNonTherapyIntervals', next)
                    }}
                  />
                </label>
                <label className={uiTokens.formFieldStack}>
                  <span className={uiTokens.formLabel}>結束（HH:mm）</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={uiTokens.formInput}
                    value={row.timeEnd}
                    onChange={(e) => {
                      const next = rows.map((r, j) => (j === i ? { ...r, timeEnd: e.target.value } : r))
                      setField('subsidizedRehabNonTherapyIntervals', next)
                    }}
                  />
                </label>
                <div className="flex items-end">
                  <button
                    type="button"
                    className={uiTokens.btnSecondaryMt3}
                    disabled={rows.length <= 1}
                    onClick={() =>
                      setField(
                        'subsidizedRehabNonTherapyIntervals',
                        rows.filter((_, j) => j !== i),
                      )
                    }
                  >
                    刪除此段
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
