import type { UseSystemSettingsResult } from '../hooks/useSystemSettings'
import type { SystemSettingsSnapshot } from '../types'
import { uiTokens } from '../../shared/ui/uiTokens'

type DraftPick = Pick<
  SystemSettingsSnapshot,
  'therapistGroupSessionsDailyCap' | 'assistantGroupSessionsDailyCap' | 'groupParticipantCap'
>

/** P1：小組節數／人數上限（與 Edge `numericLimits` 對齊） */
export type SystemSettingsNumericCapsCardProps = {
  draft: DraftPick
  setField: UseSystemSettingsResult['setField']
}

const capField = (
  label: string,
  value: number,
  onChange: (n: number) => void,
  min: number,
) => (
  <label className={uiTokens.formFieldStack}>
    <span className={uiTokens.formLabel}>{label}</span>
    <input
      type="number"
      min={min}
      className={uiTokens.formInput}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </label>
)

export const SystemSettingsNumericCapsCard = ({ draft, setField }: SystemSettingsNumericCapsCardProps) => (
  <article className={uiTokens.surfaceCard}>
    <h2 className={uiTokens.pageSectionHeading}>排班數字上限（P1）</h2>
    <p className={uiTokens.sectionHelp}>與院舍政策版本 `facility_policy_numeric_limits` 對齊；提交政策版本時一併寫入。</p>
    <div className={uiTokens.settingsFieldGrid}>
      {capField('治療師小組活動每日上限（節）', draft.therapistGroupSessionsDailyCap, (n) =>
        setField('therapistGroupSessionsDailyCap', n),
        0,
      )}
      {capField('治療助理小組活動每日上限（節）', draft.assistantGroupSessionsDailyCap, (n) =>
        setField('assistantGroupSessionsDailyCap', n),
        0,
      )}
      {capField('小組人數上限', draft.groupParticipantCap, (n) => setField('groupParticipantCap', n), 1)}
    </div>
  </article>
)
