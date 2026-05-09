import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { ListSectionPanel } from '../../shared/components/ListSectionPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useEndShiftHandoverWorkspace } from '../hooks/useEndShiftHandoverWorkspace'
import { EndShiftHandoverPanel } from './EndShiftHandoverPanel'

/** PDF 02【6】收工交更入口 */
export const EndShiftHandoverHome = () => {
  const auditTrail = useAuditTrailList()
  const workspace = useEndShiftHandoverWorkspace()

  return (
    <div className={uiTokens.handoverHomeContentWidth}>
      <ListSectionPanel title="收工交更表單" defaultExpanded>
        <EndShiftHandoverPanel workspace={workspace} />
      </ListSectionPanel>
      <AuditTrailPanel
        title="收工交更審計（全域）"
        help="含 SHIFT_END_HANDOVER_* 等（PDF 02【6】／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
