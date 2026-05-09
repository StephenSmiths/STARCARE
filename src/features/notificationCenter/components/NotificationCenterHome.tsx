import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { ListSectionPanel } from '../../shared/components/ListSectionPanel'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useNotificationCenter } from '../hooks/useNotificationCenter'

const badgeClass = (severity: 'high' | 'medium' | 'low') => {
  if (severity === 'high') return uiTokens.notificationSeverityBadgeHigh
  if (severity === 'medium') return uiTokens.notificationSeverityBadgeMedium
  return uiTokens.notificationSeverityBadgeLow
}

/** PDF 02【14】通知中心（骨架）：審計事件衍生通知 */
export const NotificationCenterHome = () => {
  const { items, unreadCount, markRead, markAllRead, reload, auditTrail } = useNotificationCenter()
  return (
    <div className={uiTokens.stackVertical}>
      <div className={uiTokens.surfaceCardCompact}>
        <div className={uiTokens.layoutFlexWrapBetweenGap2}>
          <p className={uiTokens.moduleDescriptionSlate700}>
            未讀通知 <span className={uiTokens.reviewQueueTitle}>{unreadCount}</span> 筆
          </p>
          <div className={uiTokens.layoutFlexGap2}>
            <button type="button" className={uiTokens.btnSecondary} onClick={reload}>
              重新整理
            </button>
            <button type="button" className={uiTokens.btnPrimary} onClick={markAllRead} disabled={items.length === 0}>
              全部標為已讀
            </button>
          </div>
        </div>
      </div>
      <ListSectionPanel title="通知清單" summary={`共 ${items.length} 筆`} defaultExpanded>
        <div className={uiTokens.layoutSpaceY3}>
          {items.length === 0 ? (
            <p className={uiTokens.moduleDescription}>暫無通知（尚未有對應事件）。</p>
          ) : (
            items.map((item) => (
              <article key={item.id} className={uiTokens.surfaceCardCompact}>
                <div className={uiTokens.layoutFlexWrapBetweenGap2}>
                  <p className={uiTokens.panelTitleSm}>{item.title}</p>
                  <span className={badgeClass(item.severity)}>
                    {item.severity.toUpperCase()}
                  </span>
                </div>
                <p className={uiTokens.moduleDescriptionMt2Slate700}>{item.message}</p>
                <div className={uiTokens.notificationMetaRow}>
                  <span>{item.occurredAt}</span>
                  <span>{item.sourceAction}</span>
                  {!item.isRead ? (
                    <button type="button" className={uiTokens.btnCompact} onClick={() => markRead(item.id)}>
                      標記已讀
                    </button>
                  ) : (
                    <span className={uiTokens.dryRunStatusPillPass}>已讀</span>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </ListSectionPanel>
      <AuditTrailPanel
        title="審計紀錄節錄（與通知同源資料）"
        help="上方為篩選後之通知；此處為可篩選之完整審計列（PDF 02【14】／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
