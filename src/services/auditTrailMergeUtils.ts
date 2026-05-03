/** 合併邏輯獨立檔，避免與 `auditTrailService` 循環依賴（Seq 12） */
export type AuditTrailMergeRow = {
  occurredAt: string
  action: string
  entityType: string
  entityId: string
  actorId: string
  detail: string
  remoteId?: string
}

export const auditTrailFingerprint = (r: AuditTrailMergeRow): string =>
  `${r.occurredAt}\t${r.action}\t${r.entityType}\t${r.entityId}\t${r.actorId}\t${r.detail.slice(0, 120)}`

export const mergeRemoteAuditTrail = <R extends AuditTrailMergeRow>(
  remote: R[],
  current: R[],
  maxRows = 400,
): R[] => {
  const remoteFp = new Set(remote.map((r) => auditTrailFingerprint(r)))
  const sessionOnly = current.filter((m) => {
    if (m.remoteId) return false
    return !remoteFp.has(auditTrailFingerprint(m))
  })
  return [...remote, ...sessionOnly]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, maxRows)
}
