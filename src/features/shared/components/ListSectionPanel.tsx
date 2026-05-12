import { useState, type ReactNode } from 'react'
import { uiTokens } from '../ui/uiTokens'

type ListSectionPanelProps = {
  title: string
  summary?: string
  defaultExpanded?: boolean
  /** 巢狀於 PDF【16】等大節下時用 3，避免連續多個 h2。 */
  titleHeadingLevel?: 2 | 3
  children: ReactNode
}

/** 清單區塊：預設收合＋可展開（降低主流程頁面干擾）。 */
export const ListSectionPanel = ({
  title,
  summary,
  defaultExpanded = true,
  titleHeadingLevel = 2,
  children,
}: ListSectionPanelProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const TitleTag = titleHeadingLevel === 3 ? 'h3' : 'h2'

  return (
    <section>
      <div className={uiTokens.layoutFlexBetweenGap2}>
        <TitleTag className={uiTokens.blockHeading}>{title}</TitleTag>
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
