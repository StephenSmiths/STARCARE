import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { ListSectionPanel } from '../../shared/components/ListSectionPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { UserRoleAdminPanel } from './UserRoleAdminPanel'

export const UserRoleAdminHome = () => {
  const auditTrail = useAuditTrailList()
  return (
    <div className={uiTokens.stackVertical}>
      <ListSectionPanel title="角色調整操作" defaultExpanded>
        <UserRoleAdminPanel />
      </ListSectionPanel>
      <AuditTrailPanel
        title="角色變更審計"
        help="可將「實體」篩為 Auth、「動作」篩為 USER_RBAC_ROLE_SET（PDF 01 §1／01 §5）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
