import { useCallback, useMemo, useState } from 'react'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { hydrateAuditTrailFromRemote } from '../../../services/auditTrailHydrationService'
import { buildNotificationCenterItems } from '../services/notificationCenterService'
import {
  loadReadNotificationIds,
  saveReadNotificationIds,
} from '../services/notificationReadStateStorage'

/** PDF 02【14】通知中心：由審計事件衍生，支援已讀狀態 */
export const useNotificationCenter = () => {
  const [readIds, setReadIds] = useState<string[]>(() => loadReadNotificationIds())
  const logs = useAuditTrailList()
  const readSet = useMemo(() => new Set(readIds), [readIds])
  const items = useMemo(() => buildNotificationCenterItems(logs, readSet), [logs, readSet])

  const markRead = useCallback(
    (id: string) => {
      if (readSet.has(id)) return
      const next = [...readIds, id]
      setReadIds(next)
      saveReadNotificationIds(next)
    },
    [readIds, readSet],
  )

  const markAllRead = useCallback(() => {
    const ids = items.map((item) => item.id)
    setReadIds(ids)
    saveReadNotificationIds(ids)
  }, [items])

  const reload = useCallback(() => {
    void hydrateAuditTrailFromRemote()
  }, [])

  return {
    items,
    unreadCount: items.filter((item) => !item.isRead).length,
    markRead,
    markAllRead,
    reload,
    auditTrail: logs,
  }
}
