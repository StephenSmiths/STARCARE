import type { StarcareRole } from './authPermissionTypes'
import { hasPermission } from './permissionsMatrix'

/**
 * 01 §1：Staff 不可審批自己；TeamLead/Admin 亦不可審批自己。
 */
export const canApproveForm = (role: StarcareRole, actorId: string, formOwnerId: string): boolean => {
  if (!hasPermission(role, 'action:approve-form')) return false
  return actorId !== formOwnerId
}
