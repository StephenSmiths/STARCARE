import { useAuth } from '../../auth'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { ListSectionPanel } from '../../shared/components/ListSectionPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useSystemSettings } from '../hooks/useSystemSettings'
import { useSystemSettingsPolicySync } from '../hooks/useSystemSettingsPolicySync'
import { SystemSettingsNumericCapsCard } from './SystemSettingsNumericCapsCard'
import { SystemSettingsPdf16Section } from './SystemSettingsPdf16Section'
import { SystemSettingsCurrentPolicyVersionCard } from './SystemSettingsCurrentPolicyVersionCard'
import { SystemSettingsPolicyVersionsListCard } from './SystemSettingsPolicyVersionsListCard'
import { SystemSettingsPolicySubmitCard } from './SystemSettingsPolicySubmitCard'
import { SystemSettingsRulesTogglesCard } from './SystemSettingsRulesTogglesCard'
import { SystemSettingsSchedulingWindowsCard } from './SystemSettingsSchedulingWindowsCard'
import { SystemSettingsSpecialCareCard } from './SystemSettingsSpecialCareCard'

export const SystemSettingsHome = () => {
  const { user } = useAuth()
  const auditTrail = useAuditTrailList()
  const actorId = user?.id ?? 'anonymous'
  const { draft, setField, hydrateP1FromBundle, validationErrors, savedMessage, save, isSaving } =
    useSystemSettings(actorId)
  const policySync = useSystemSettingsPolicySync({ draft, hydrateP1FromBundle })

  return (
    <div className={uiTokens.stackVertical}>
      <SystemSettingsPdf16Section
        title="智能排班設定"
        description="母本 PDF 02【16】§3.1：排班時間設定、排班規則設定（P1 已含之欄位見下）"
      >
        <ListSectionPanel title="排班時間設定" titleHeadingLevel={3} defaultExpanded>
          <SystemSettingsSchedulingWindowsCard draft={draft} setField={setField} />
        </ListSectionPanel>
        <ListSectionPanel title="排班規則設定（P1）" titleHeadingLevel={3} defaultExpanded>
          <div className="flex flex-col gap-4">
            <SystemSettingsNumericCapsCard draft={draft} setField={setField} />
            <SystemSettingsRulesTogglesCard draft={draft} setField={setField} />
          </div>
        </ListSectionPanel>
      </SystemSettingsPdf16Section>

      <SystemSettingsPdf16Section
        title="復康服務基本設定"
        description="母本 PDF 02【16】§3.2：資助復康服務、認知障礙症服務等；P1 先含可交付子項"
      >
        <ListSectionPanel title="資助復康服務與認知障礙症服務（P1）" titleHeadingLevel={3} defaultExpanded={false}>
          <SystemSettingsSpecialCareCard draft={draft} setField={setField} />
        </ListSectionPanel>
      </SystemSettingsPdf16Section>

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
          儲存設定（本機）
        </button>
      </div>

      <ListSectionPanel title="政策版本（雲端提交）（P1）" defaultExpanded>
        <div className="flex flex-col gap-4">
          <SystemSettingsCurrentPolicyVersionCard
            edgeEnabled={policySync.edgeEnabled}
            loadError={policySync.loadError}
            isPolicyLoading={policySync.isPolicyLoading}
            version={policySync.currentPolicyVersion}
          />
          <SystemSettingsPolicyVersionsListCard
            edgeEnabled={policySync.edgeEnabled}
            loadError={policySync.loadError}
            isPolicyLoading={policySync.isPolicyLoading}
            versions={policySync.policyVersions}
          />
          <SystemSettingsPolicySubmitCard
            edgeEnabled={policySync.edgeEnabled}
            loadError={policySync.loadError}
            validateErrors={policySync.validateErrors}
            submitMessage={policySync.submitMessage}
            isSubmitting={policySync.isSubmitting}
            onSubmit={policySync.submitPolicyVersion}
          />
        </div>
      </ListSectionPanel>

      <AuditTrailPanel
        title="系統設定與相關審計（全域）"
        help="含 SYSTEM_SETTINGS_SAVE 等（PDF 02【16】／Seq 29／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
