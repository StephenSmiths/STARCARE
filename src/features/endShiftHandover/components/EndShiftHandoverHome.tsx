import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useEndShiftHandoverWorkspace } from '../hooks/useEndShiftHandoverWorkspace'
import { EndShiftHandoverPanel } from './EndShiftHandoverPanel'

/** PDF 02【6】收工交更入口 */
export const EndShiftHandoverHome = () => {
  const auditTrail = useAuditTrailList()
  const workspace = useEndShiftHandoverWorkspace()

  return (
    <div className={`mx-auto w-full max-w-5xl ${uiTokens.stackVertical}`}>
      <EndShiftHandoverPanel workspace={workspace} />
      <AuditTrailPanel
        title="收工交更審計（全域）"
        help="含 SHIFT_END_HANDOVER_* 等（PDF 02【6】／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
