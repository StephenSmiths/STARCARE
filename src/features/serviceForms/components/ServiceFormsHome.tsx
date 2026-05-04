import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useServiceFormsWorkspace } from '../hooks/useServiceFormsWorkspace'
import { ServiceFormStaffPanel } from './ServiceFormStaffPanel'
import { ServiceFormReviewPanel } from './ServiceFormReviewPanel'

/** PDF 02【5】服務表單入口（Seq 17） */
export const ServiceFormsHome = () => {
  const auditTrail = useAuditTrailList()
  const workspace = useServiceFormsWorkspace()

  if (workspace.isLoading) {
    return <p className={uiTokens.moduleDescription}>載入服務表單模組…</p>
  }

  if (workspace.loadError) {
    return <p className={uiTokens.formInlineError}>{workspace.loadError}</p>
  }

  return (
    <div className={uiTokens.stackVertical}>
      <ServiceFormStaffPanel workspace={workspace} />
      <ServiceFormReviewPanel workspace={workspace} />
      <AuditTrailPanel
        title="服務表單相關審計（全域）"
        help="含 FORM_* 與雲端合併紀錄（01 §2.2／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
