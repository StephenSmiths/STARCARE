import { useAuth } from '../../auth'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { ListSectionPanel } from '../../shared/components/ListSectionPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useSystemSettings } from '../hooks/useSystemSettings'
import { SystemSettingsRulesTogglesCard } from './SystemSettingsRulesTogglesCard'
import { SystemSettingsSchedulingWindowsCard } from './SystemSettingsSchedulingWindowsCard'
import { SystemSettingsSpecialCareCard } from './SystemSettingsSpecialCareCard'

export const SystemSettingsHome = () => {
  const { user } = useAuth()
  const auditTrail = useAuditTrailList()
  const actorId = user?.id ?? 'anonymous'
  const { draft, setField, validationErrors, savedMessage, save, isSaving } = useSystemSettings(actorId)

  return (
    <div className={uiTokens.stackVertical}>
      <ListSectionPanel title="排班時窗設定" defaultExpanded>
        <SystemSettingsSchedulingWindowsCard draft={draft} setField={setField} />
      </ListSectionPanel>
      <ListSectionPanel title="規則與開關設定" defaultExpanded={false}>
        <SystemSettingsRulesTogglesCard draft={draft} setField={setField} />
      </ListSectionPanel>
      <ListSectionPanel title="特殊照顧設定" defaultExpanded={false}>
        <SystemSettingsSpecialCareCard draft={draft} setField={setField} />
      </ListSectionPanel>

      {validationErrors.length > 0 ? (
        <div className={uiTokens.bannerDanger} role="alert">
          <ul className={uiTokens.listDiscInsideTight}>
            {validationErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {savedMessage ? <p className={uiTokens.inlineSuccessText}>{savedMessage}</p> : null}

      <div>
        <button type="button" className={uiTokens.btnPrimary} onClick={() => save()} disabled={isSaving}>
          儲存設定
        </button>
      </div>

      <AuditTrailPanel
        title="系統設定與相關審計（全域）"
        help="含 SYSTEM_SETTINGS_SAVE 等（PDF 02【16】／Seq 29／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
