import type { Dispatch, SetStateAction } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'

export type SchedulingResidentTablePagerProps = {
  safePage: number
  pageCount: number
  setPage: Dispatch<SetStateAction<number>>
}

/** 排班院友表分頁 */
export const SchedulingResidentTablePager = ({ safePage, pageCount, setPage }: SchedulingResidentTablePagerProps) => (
  <div className={uiTokens.residentTableFooterBar}>
    <button
      className={uiTokens.btnCompactDisabled}
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
      className={uiTokens.btnCompactDisabled}
      type="button"
      disabled={safePage >= pageCount}
      onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
    >
      下一頁
    </button>
  </div>
)
