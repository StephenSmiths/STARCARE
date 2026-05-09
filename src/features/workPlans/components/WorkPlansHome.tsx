import { uiTokens } from '../../shared/ui/uiTokens'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { ListSectionPanel } from '../../shared/components/ListSectionPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { WorkPlanComposerPanel } from './WorkPlanComposerPanel'

/** PDF 02【2】創建工作計劃入口（Seq 14） */
export const WorkPlansHome = () => {
  const auditTrail = useAuditTrailList()
  return (
    <div className={uiTokens.layoutSpaceY6}>
      <ListSectionPanel title="工作計劃建立與預覽" defaultExpanded>
        <WorkPlanComposerPanel />
      </ListSectionPanel>
      <AuditTrailPanel
        title="工作計劃發布審計（全域）"
        help="含 WORK_PLAN_SESSION_COMMIT 等（PDF 02【2】／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
