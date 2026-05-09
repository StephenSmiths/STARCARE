import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { ListSectionPanel } from '../../shared/components/ListSectionPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useShiftStartHandoverWorkspace } from '../hooks/useShiftStartHandoverWorkspace'
import { ShiftStartHandoverPanel } from './ShiftStartHandoverPanel'

/** PDF 02【5b】開工接更入口 */
export const ShiftStartHandoverHome = () => {
  const auditTrail = useAuditTrailList()
  const workspace = useShiftStartHandoverWorkspace()

  return (
    <div className={uiTokens.handoverHomeContentWidth}>
      <ListSectionPanel title="開工接更表單" defaultExpanded>
        <ShiftStartHandoverPanel workspace={workspace} />
      </ListSectionPanel>
      <AuditTrailPanel
        title="開工接更審計（全域）"
        help="含 SHIFT_START_HANDOVER_* 等（PDF 02【5b】／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
