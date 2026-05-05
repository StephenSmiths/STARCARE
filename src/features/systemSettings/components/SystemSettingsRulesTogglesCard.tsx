import type { UseSystemSettingsResult } from '../hooks/useSystemSettings'
import type { SystemSettingsSnapshot } from '../types'
import { uiTokens } from '../../shared/ui/uiTokens'

type DraftPick = Pick<
  SystemSettingsSnapshot,
  'rulesEngineEnabled' | 'fixedActivitiesEnabled' | 'serviceTypesEnabled'
>

/** 規則引擎與服務總開關（占位，待後端對齊） */
export type SystemSettingsRulesTogglesCardProps = {
  draft: DraftPick
  setField: UseSystemSettingsResult['setField']
}

export const SystemSettingsRulesTogglesCard = ({ draft, setField }: SystemSettingsRulesTogglesCardProps) => (
  <article className={uiTokens.surfaceCard}>
    <h2 className={uiTokens.pageSectionHeading}>規則與服務啟用</h2>
    <p className={uiTokens.sectionHelp}>規則引擎、固定活動與服務類型總開關（細項待後端對齊）。</p>
    <div className={uiTokens.settingsToggleStack}>
      <label className={uiTokens.formToggleLabel}>
        <input
          type="checkbox"
          checked={draft.rulesEngineEnabled}
          onChange={(e) => setField('rulesEngineEnabled', e.target.checked)}
        />
        啟用排班規則引擎（開啟時：智能排班與復康／認知乾跑套用上方排班視窗，並於非治療時段排除資助復康時段）
      </label>
      <label className={uiTokens.formToggleLabel}>
        <input
          type="checkbox"
          checked={draft.fixedActivitiesEnabled}
          onChange={(e) => setField('fixedActivitiesEnabled', e.target.checked)}
        />
        啟用固定活動
      </label>
      <label className={uiTokens.formToggleLabel}>
        <input
          type="checkbox"
          checked={draft.serviceTypesEnabled}
          onChange={(e) => setField('serviceTypesEnabled', e.target.checked)}
        />
        啟用服務類型（PT／OT／認知等總開關）
      </label>
    </div>
  </article>
)
