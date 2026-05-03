import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useShiftStartHandoverWorkspace } from '../hooks/useShiftStartHandoverWorkspace'
import { ShiftStartHandoverPanel } from './ShiftStartHandoverPanel'

/** PDF 02【5b】開工接更入口 */
export const ShiftStartHandoverHome = () => {
  const auditTrail = useAuditTrailList()
  const workspace = useShiftStartHandoverWorkspace()

  return (
    <div className={`mx-auto w-full max-w-5xl ${uiTokens.stackVertical}`}>
      <ShiftStartHandoverPanel workspace={workspace} />
      <AuditTrailPanel
        title="開工接更審計（全域）"
        help="含 SHIFT_START_HANDOVER_* 等（PDF 02【5b】／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
