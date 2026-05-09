import { useState, type ReactNode } from 'react'
import { uiTokens } from '../ui/uiTokens'

type ListSectionPanelProps = {
  title: string
  summary?: string
  defaultExpanded?: boolean
  children: ReactNode
}

/** 清單區塊：預設收合＋可展開（降低主流程頁面干擾）。 */
export const ListSectionPanel = ({
  title,
  summary,
  defaultExpanded = true,
  children,
}: ListSectionPanelProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <section>
      <div className={uiTokens.layoutFlexBetweenGap2}>
        <h2 className={uiTokens.blockHeading}>{title}</h2>
        <div className={uiTokens.layoutFlexItemsCenterGap2}>
          {summary ? <span className={uiTokens.metaChip}>{summary}</span> : null}
          <button
            type="button"
            className={uiTokens.btnCompact}
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? '收合' : '展開'}
          </button>
        </div>
      </div>
      {expanded ? children : null}
    </section>
  )
}
