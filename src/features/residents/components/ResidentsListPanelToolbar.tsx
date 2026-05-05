import { uiTokens } from '../../shared/ui/uiTokens'
import type { ResidentsListFundingFilter } from '../hooks/useResidentsListPanel'

export type ResidentsListPanelToolbarProps = {
  keyword: string
  setKeyword: (value: string) => void
  fundingFilter: ResidentsListFundingFilter
  setFundingFilter: (value: ResidentsListFundingFilter) => void
  pageSize: number
  setPageSize: (value: number) => void
  filteredCount: number
  resetPage: () => void
}

/** 院友列表：搜尋、資助篩選、每頁筆數 */
export const ResidentsListPanelToolbar = ({
  keyword,
  setKeyword,
  fundingFilter,
  setFundingFilter,
  pageSize,
  setPageSize,
  filteredCount,
  resetPage,
}: ResidentsListPanelToolbarProps) => (
  <div className={uiTokens.residentListToolbar}>
    <div className={uiTokens.layoutFlexWrapItemsCenterGap2TextXs}>
      <input
        className={uiTokens.formInputSearchNarrow}
        placeholder="搜尋姓名或床號"
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value)
          resetPage()
        }}
      />
      <select
        className={uiTokens.formSelectAutoMin8rem}
        value={fundingFilter}
        onChange={(event) => {
          setFundingFilter(event.target.value as ResidentsListFundingFilter)
          resetPage()
        }}
      >
        <option value="all">全部資助類別</option>
        <option value="GradeA_Subsidized">甲一買位</option>
        <option value="Voucher">院舍券</option>
        <option value="Private">私位</option>
      </select>
      <select
        className={uiTokens.formSelectAutoMin8rem}
        value={pageSize}
        onChange={(event) => {
          setPageSize(Number(event.target.value))
          resetPage()
        }}
      >
        <option value={20}>每頁 20</option>
        <option value={50}>每頁 50</option>
      </select>
      <span className={uiTokens.residentListToolbarMeta}>共 {filteredCount} 筆</span>
    </div>
  </div>
)
