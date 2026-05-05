import type { UseSystemSettingsResult } from '../hooks/useSystemSettings'
import type { SystemSettingsSnapshot } from '../types'
import { uiTokens } from '../../shared/ui/uiTokens'

/** SC 個案承接規則占位（PDF 02【16】與排班規則對齊說明） */
export type SystemSettingsSpecialCareCardProps = {
  draft: Pick<SystemSettingsSnapshot, 'specialCareTherapistOnly'>
  setField: UseSystemSettingsResult['setField']
}

export const SystemSettingsSpecialCareCard = ({ draft, setField }: SystemSettingsSpecialCareCardProps) => (
  <article className={uiTokens.surfaceCard}>
    <h2 className={uiTokens.pageSectionHeading}>特別照護（SC）</h2>
    <p className={uiTokens.sectionHelp}>
      勾選時與資料庫排班規則之「僅治療師」併用：SC 院友僅能使用職類為 PT／OT 之活動時段（須有員工主檔職類）。
    </p>
    <label className={uiTokens.formToggleLabelMt4}>
      <input
        type="checkbox"
        checked={draft.specialCareTherapistOnly}
        onChange={(e) => setField('specialCareTherapistOnly', e.target.checked)}
      />
      SC 個案僅由治療師承接
    </label>
  </article>
)
