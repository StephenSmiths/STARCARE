import { uiTokens } from '../../shared/ui/uiTokens'
import { useNotificationCenter } from '../hooks/useNotificationCenter'

const badgeClass = (severity: 'high' | 'medium' | 'low'): string => {
  if (severity === 'high') return 'bg-red-100 text-red-700'
  if (severity === 'medium') return 'bg-amber-100 text-amber-700'
  return 'bg-slate-100 text-slate-700'
}

/** PDF 02【14】通知中心（骨架）：審計事件衍生通知 */
export const NotificationCenterHome = () => {
  const { items, unreadCount, markRead, markAllRead, reload } = useNotificationCenter()
  return (
    <div className={uiTokens.stackVertical}>
      <div className={uiTokens.surfaceCardCompact}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-700">
            未讀通知 <span className="font-semibold text-slate-900">{unreadCount}</span> 筆
          </p>
          <div className="flex gap-2">
            <button type="button" className={uiTokens.btnSecondary} onClick={reload}>
              重新整理
            </button>
            <button type="button" className={uiTokens.btnPrimary} onClick={markAllRead} disabled={items.length === 0}>
              全部標為已讀
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-600">暫無通知（尚未有對應事件）。</p>
        ) : (
          items.map((item) => (
            <article key={item.id} className={uiTokens.surfaceCardCompact}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs ${badgeClass(item.severity)}`}>
                  {item.severity.toUpperCase()}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{item.message}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>{item.occurredAt}</span>
                <span>{item.sourceAction}</span>
                {!item.isRead ? (
                  <button type="button" className={uiTokens.btnCompact} onClick={() => markRead(item.id)}>
                    標記已讀
                  </button>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">已讀</span>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
