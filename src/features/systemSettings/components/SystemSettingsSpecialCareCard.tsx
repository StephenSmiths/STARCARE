import type { UseSystemSettingsResult } from '../hooks/useSystemSettings'
import type { SystemSettingsSnapshot } from '../types'
import { uiTokens } from '../../shared/ui/uiTokens'

/** SC 個案承接規則占位（PDF 02【16】§3.2 Special Care） */
export type SystemSettingsSpecialCareCardProps = {
  draft: Pick<SystemSettingsSnapshot, 'specialCareTherapistOnly'>
  setField: UseSystemSettingsResult['setField']
}

export const SystemSettingsSpecialCareCard = ({ draft, setField }: SystemSettingsSpecialCareCardProps) => (
  <article className={uiTokens.surfaceCard}>
    <p className={uiTokens.sectionHelp}>
      PDF 02【16】§3.2：資助復康服務與認知障礙症服務項下之「Special Care 是否只限治療師」；與排班規則及員工主檔職類併用。變更後請先按本頁「儲存」，再回智能排班重新執行乾跑。
    </p>
    <label className={uiTokens.formToggleLabelMt4}>
      <input
        type="checkbox"
        checked={draft.specialCareTherapistOnly}
        onChange={(e) => setField('specialCareTherapistOnly', e.target.checked)}
      />
      Special Care 僅由治療師承接（PT／OT 活動時段）
    </label>
  </article>
)
