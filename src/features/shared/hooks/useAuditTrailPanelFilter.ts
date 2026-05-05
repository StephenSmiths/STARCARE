import { useMemo, useState } from 'react'
import type { AuditTrailRecord } from '../../../services/auditTrailService'

/** 審計面板：動作／實體／關鍵字篩選（最多顯示 20 筆） */
export const useAuditTrailPanelFilter = (auditTrail: AuditTrailRecord[]) => {
  const [actionFilter, setActionFilter] = useState<'all' | AuditTrailRecord['action']>('all')
  const [entityFilter, setEntityFilter] = useState<'all' | AuditTrailRecord['entityType']>('all')
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    return auditTrail
      .filter((log) => (actionFilter === 'all' ? true : log.action === actionFilter))
      .filter((log) => (entityFilter === 'all' ? true : log.entityType === entityFilter))
      .filter((log) => {
        if (!q) return true
        return (
          log.detail.toLowerCase().includes(q) ||
          log.actorId.toLowerCase().includes(q) ||
          log.entityId.toLowerCase().includes(q)
        )
      })
      .slice(0, 20)
  }, [actionFilter, auditTrail, entityFilter, keyword])

  return {
    actionFilter,
    setActionFilter,
    entityFilter,
    setEntityFilter,
    keyword,
    setKeyword,
    filtered,
  }
}
