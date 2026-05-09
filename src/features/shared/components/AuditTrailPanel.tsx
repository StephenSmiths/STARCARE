import { useState } from 'react'
import type { AuditTrailRecord } from '../../../services/auditTrailService'
import { uiTokens } from '../ui/uiTokens'
import {
  AUDIT_TRAIL_PANEL_ACTION_OPTIONS,
  AUDIT_TRAIL_PANEL_ENTITY_OPTIONS,
} from './auditTrailPanelFilterMeta'
import { useAuditTrailPanelFilter } from '../hooks/useAuditTrailPanelFilter'

export type { AuditTrailPanelFilterCoversUnions } from './auditTrailPanelFilterMeta'

export interface AuditTrailPanelProps {
  /** 區塊標題 */
  title?: string
  /** 標題下方說明 */
  help?: string
  /** 是否預設展開（預設 false：降低主流程頁面干擾） */
  defaultExpanded?: boolean
  auditTrail: AuditTrailRecord[]
}

/** 全域審計列表：支援動作／實體類型／關鍵字篩選（Seq 12） */
export const AuditTrailPanel = ({
  title = '最近審計紀錄（Audit Trail）',
  help,
  defaultExpanded = false,
  auditTrail,
}: AuditTrailPanelProps) => {
  const vm = useAuditTrailPanelFilter(auditTrail)
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <section className={uiTokens.auditTrailPanel} aria-labelledby="audit-trail-heading">
      <div className={uiTokens.layoutFlexBetweenGap2}>
        <h3 id="audit-trail-heading" className={uiTokens.panelTitleSm}>
          {title}
        </h3>
        <div className={uiTokens.layoutFlexItemsCenterGap2}>
          <span className={uiTokens.metaChip}>顯示 {vm.filtered.length} / {auditTrail.length}</span>
          <button
            type="button"
            className={uiTokens.btnCompact}
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? '收合審計' : '展開審計'}
          </button>
        </div>
      </div>
      {help ? <p className={uiTokens.helpFinePrint}>{help}</p> : null}
      {expanded ? (
        <>
          <div className={uiTokens.layoutFlexWrapItemsCenterGap2Mt2}>
            <select
              className={uiTokens.auditTrailFilterSelectMin9}
              value={vm.actionFilter}
              onChange={(event) =>
                vm.setActionFilter(event.target.value as 'all' | AuditTrailRecord['action'])
              }
            >
              <option value="all">全部動作</option>
              {AUDIT_TRAIL_PANEL_ACTION_OPTIONS.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
            <select
              className={uiTokens.auditTrailFilterSelectMin8}
              value={vm.entityFilter}
              onChange={(event) =>
                vm.setEntityFilter(event.target.value as 'all' | AuditTrailRecord['entityType'])
              }
            >
              <option value="all">全部類型</option>
              {AUDIT_TRAIL_PANEL_ENTITY_OPTIONS.map((entity) => (
                <option key={entity} value={entity}>
                  {entity}
                </option>
              ))}
            </select>
            <input
              className={uiTokens.formInputMaxXsTextXs}
              placeholder="搜尋 actor / entity / detail"
              value={vm.keyword}
              onChange={(event) => vm.setKeyword(event.target.value)}
            />
          </div>
          <div className={uiTokens.layoutSpaceY1Mt2}>
            {vm.filtered.length === 0 ? (
              <p className={uiTokens.emptyStatePill}>沒有符合條件的審計紀錄。</p>
            ) : (
              vm.filtered.map((log, index) => (
                <p key={`${log.entityId}-${log.occurredAt}-${log.action}-${index}`}>
                  {log.occurredAt} · {log.action} / {log.entityType} / {log.actorId} / {log.detail}
                </p>
              ))
            )}
          </div>
        </>
      ) : null}
    </section>
  )
}
