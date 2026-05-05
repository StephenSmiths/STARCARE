/** RBAC：維持既有 `./permissions` 匯入路徑（型別／矩陣／解析見子模組）。 */
export type { AuthPermission, StarcareRole } from './authPermissionTypes'
export { hasPermission } from './permissionsMatrix'
export { resolveStarcareRole } from './resolveStarcareRole'
export { canApproveForm } from './permissionsApproval'
