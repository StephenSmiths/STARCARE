import { useId, useState, type ReactNode } from 'react'
import { uiTokens } from '../ui/uiTokens'

type ListSectionPanelProps = {
  title: string
  summary?: string
  defaultExpanded?: boolean
  /** 巢狀於 PDF【16】等大節下時用 3，避免連續多個 h2。 */
  titleHeadingLevel?: 2 | 3
  children: ReactNode
}

/** 清單區塊：預設收合＋可展開（降低主流程頁面干擾）。**`section`** 以 **`aria-labelledby`** 與標題 **`id`** 關聯；展開鈕以 **`aria-controls`** 指向內容區 **`id`**，收合時內容區 **`hidden`** 仍保留節點以維持參照（無障礙）。 */
export const ListSectionPanel = ({
  title,
  summary,
  defaultExpanded = true,
  titleHeadingLevel = 2,
  children,
}: ListSectionPanelProps) => {
  const headingId = useId()
  const contentId = useId()
  const [expanded, setExpanded] = useState(defaultExpanded)
  const TitleTag = titleHeadingLevel === 3 ? 'h3' : 'h2'

  return (
    <section aria-labelledby={headingId}>
      <div className={uiTokens.layoutFlexBetweenGap2}>
        <TitleTag id={headingId} className={uiTokens.blockHeading}>
          {title}
        </TitleTag>
        <div className={uiTokens.layoutFlexItemsCenterGap2}>
          {summary ? <span className={uiTokens.metaChip}>{summary}</span> : null}
          <button
            type="button"
            className={uiTokens.btnCompact}
            aria-expanded={expanded}
            aria-controls={contentId}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? '收合' : '展開'}
          </button>
        </div>
      </div>
      <div id={contentId} hidden={!expanded}>
        {expanded ? children : null}
      </div>
    </section>
  )
}
