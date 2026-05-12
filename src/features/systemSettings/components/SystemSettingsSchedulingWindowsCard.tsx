import type { UseSystemSettingsResult } from '../hooks/useSystemSettings'
import type { SystemSettingsSnapshot } from '../types'
import { uiTokens } from '../../shared/ui/uiTokens'

type DraftPick = Pick<
  SystemSettingsSnapshot,
  | 'schedulingWindowStart'
  | 'schedulingWindowEnd'
  | 'nonTherapyWindowStart'
  | 'nonTherapyWindowEnd'
  | 'shiftPrepBlockEnabled'
>

/** PDF 02【16】Seq 29：排班視窗與非治療時段（占位 UI） */
export type SystemSettingsSchedulingWindowsCardProps = {
  draft: DraftPick
  setField: UseSystemSettingsResult['setField']
}

export const SystemSettingsSchedulingWindowsCard = ({
  draft,
  setField,
}: SystemSettingsSchedulingWindowsCardProps) => (
  <article className={uiTokens.surfaceCard}>
    <p className={uiTokens.sectionHelp}>
      PDF 02【16】§3.1「排班時間設定」：每日排班可用視窗、非治療時段（午休／LUNCH）與開工準備（SHIFT_PREP_BLOCK，最長 30
      分鐘且不超出排班視窗）；與 `facility_policy_non_therapy_slots` 對齊。
    </p>
    <div className={uiTokens.settingsFieldGrid}>
      <label className={uiTokens.formFieldStack}>
        <span className={uiTokens.formLabel}>排班開始（HH:mm）</span>
        <input
          type="text"
          inputMode="numeric"
          className={uiTokens.formInput}
          value={draft.schedulingWindowStart}
          onChange={(e) => setField('schedulingWindowStart', e.target.value)}
        />
      </label>
      <label className={uiTokens.formFieldStack}>
        <span className={uiTokens.formLabel}>排班結束（HH:mm）</span>
        <input
          type="text"
          inputMode="numeric"
          className={uiTokens.formInput}
          value={draft.schedulingWindowEnd}
          onChange={(e) => setField('schedulingWindowEnd', e.target.value)}
        />
      </label>
      <label className={uiTokens.formFieldStack}>
        <span className={uiTokens.formLabel}>非治療時段開始</span>
        <input
          type="text"
          inputMode="numeric"
          className={uiTokens.formInput}
          value={draft.nonTherapyWindowStart}
          onChange={(e) => setField('nonTherapyWindowStart', e.target.value)}
        />
      </label>
      <label className={uiTokens.formFieldStack}>
        <span className={uiTokens.formLabel}>非治療時段結束</span>
        <input
          type="text"
          inputMode="numeric"
          className={uiTokens.formInput}
          value={draft.nonTherapyWindowEnd}
          onChange={(e) => setField('nonTherapyWindowEnd', e.target.value)}
        />
      </label>
      <label className={uiTokens.formToggleLabel}>
        <input
          type="checkbox"
          checked={draft.shiftPrepBlockEnabled}
          onChange={(e) => setField('shiftPrepBlockEnabled', e.target.checked)}
        />
        啟用開工準備時段（自排班開始起 30 分鐘內，且不超出排班結束）
      </label>
    </div>
  </article>
)
