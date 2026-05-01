import { useCallback, useMemo, useState } from 'react'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { buildNotificationCenterItems } from '../services/notificationCenterService'
import {
  loadReadNotificationIds,
  saveReadNotificationIds,
} from '../services/notificationReadStateStorage'

/** PDF 02【14】通知中心：由審計事件衍生，支援已讀狀態 */
export const useNotificationCenter = () => {
  const [readIds, setReadIds] = useState<string[]>(() => loadReadNotificationIds())
  const [refreshTick, setRefreshTick] = useState(0)

  const logs = useMemo(() => {
    void refreshTick
    return globalAuditTrailService.list()
  }, [refreshTick])
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

  const reload = useCallback(() => setRefreshTick((v) => v + 1), [])

  return { items, unreadCount: items.filter((item) => !item.isRead).length, markRead, markAllRead, reload }
}
