import type { AuditTrailRecord } from './auditTrailService'

const ENTITY = new Set<AuditTrailRecord['entityType']>(['Resident', 'Staff', 'Scheduling', 'Reporting', 'Auth'])

const isAction = (s: string): s is AuditTrailRecord['action'] =>
  /^[A-Z][A-Z0-9_]{1,79}$/.test(s)

/** 將 Edge `audit-trail-list` 列轉為前端審計列；無效列略過 */
export const mapAuditTrailApiRow = (row: unknown): AuditTrailRecord | null => {
  if (!row || typeof row !== 'object') return null
  const o = row as Record<string, unknown>
  const id = typeof o.id === 'string' ? o.id.trim() : ''
  const actionRaw = typeof o.action === 'string' ? o.action.trim() : ''
  const entityTypeRaw = o.entityType
  const entityId = typeof o.entityId === 'string' ? o.entityId.trim() : ''
  const actorId = typeof o.actorId === 'string' ? o.actorId.trim() : ''
  const detail = typeof o.detail === 'string' ? o.detail : ''
  const occurredAt = typeof o.occurredAt === 'string' ? o.occurredAt.trim() : ''
  if (!id || !actionRaw || !entityId || !actorId || !occurredAt) return null
  if (typeof entityTypeRaw !== 'string' || !ENTITY.has(entityTypeRaw as AuditTrailRecord['entityType'])) {
    return null
  }
  const entityType = entityTypeRaw as AuditTrailRecord['entityType']
  if (!isAction(actionRaw)) return null
  return {
    remoteId: id,
    action: actionRaw,
    entityType,
    entityId,
    actorId,
    beforeState: typeof o.beforeState === 'string' ? o.beforeState : null,
    afterState: typeof o.afterState === 'string' ? o.afterState : null,
    detail,
    occurredAt,
  }
}
