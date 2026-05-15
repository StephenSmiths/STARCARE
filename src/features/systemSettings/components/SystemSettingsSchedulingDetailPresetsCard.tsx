import type { UseSystemSettingsResult } from '../hooks/useSystemSettings'
import type { SystemSettingsSnapshot } from '../types'
import { uiTokens } from '../../shared/ui/uiTokens'

type DraftPick = Pick<
  SystemSettingsSnapshot,
  'schedulingDetailPresetParam1' | 'schedulingDetailPresetParam2' | 'schedulingDetailPresetParam3'
>

/**
 * 排班細節參數（預留）：情況 A 僅本機快照與審計；待客戶補充 PDF 欄位定義後再接排班引擎／雲端政策。
 */
export type SystemSettingsSchedulingDetailPresetsCardProps = {
  draft: DraftPick
  setField: UseSystemSettingsResult['setField']
}

export const SystemSettingsSchedulingDetailPresetsCard = ({
  draft,
  setField,
}: SystemSettingsSchedulingDetailPresetsCardProps) => (
  <article className={uiTokens.surfaceCard}>
    <p className={uiTokens.sectionHelp}>
      目前僅儲存於瀏覽器本機 JSON 並隨「儲存設定」寫入審計；不併入雲端政策提交、亦不驅動排班引擎。待客戶交付排班細節後，再對照 SOP／PDF
      將各項映射至正式欄位。
    </p>
    <div className={uiTokens.settingsToggleStack}>
      <label className={uiTokens.formToggleLabel}>
        <input
          type="checkbox"
          checked={draft.schedulingDetailPresetParam1}
          onChange={(e) => setField('schedulingDetailPresetParam1', e.target.checked)}
        />
        排班細節參數 1（預留）
      </label>
      <label className={uiTokens.formToggleLabel}>
        <input
          type="checkbox"
          checked={draft.schedulingDetailPresetParam2}
          onChange={(e) => setField('schedulingDetailPresetParam2', e.target.checked)}
        />
        排班細節參數 2（預留）
      </label>
      <label className={uiTokens.formToggleLabel}>
        <input
          type="checkbox"
          checked={draft.schedulingDetailPresetParam3}
          onChange={(e) => setField('schedulingDetailPresetParam3', e.target.checked)}
        />
        排班細節參數 3（預留）
      </label>
    </div>
  </article>
)
