import type { Dispatch, SetStateAction } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'

export type ResidentsListPanelPagerProps = {
  safePage: number
  pageCount: number
  setPage: Dispatch<SetStateAction<number>>
}

/** 院友列表分頁 */
export const ResidentsListPanelPager = ({ safePage, pageCount, setPage }: ResidentsListPanelPagerProps) => (
  <div className={uiTokens.residentListPager}>
    <button
      className={uiTokens.btnPager}
      type="button"
      disabled={safePage <= 1}
      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
    >
      上一頁
    </button>
    <span className={uiTokens.residentListPagerMeta}>
      第 {safePage} / {pageCount} 頁
    </span>
    <button
      className={uiTokens.btnPager}
      type="button"
      disabled={safePage >= pageCount}
      onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
    >
      下一頁
    </button>
  </div>
)
