import { uiTokens } from '../../shared/ui/uiTokens'
import type { ResidentTableStatusFilter } from '../hooks/useSchedulingResidentTable'

export type SchedulingResidentTableToolbarProps = {
  keyword: string
  setKeyword: (value: string) => void
  resetPage: () => void
  statusFilter: ResidentTableStatusFilter
  setStatusFilter: (value: ResidentTableStatusFilter) => void
  pageSize: number
  setPageSize: (value: number) => void
  filteredCount: number
}

/** 排班院友表：搜尋、狀態篩選、分頁大小 */
export const SchedulingResidentTableToolbar = ({
  keyword,
  setKeyword,
  resetPage,
  statusFilter,
  setStatusFilter,
  pageSize,
  setPageSize,
  filteredCount,
}: SchedulingResidentTableToolbarProps) => (
  <div className={uiTokens.residentTableToolbarBar}>
    <div className={uiTokens.residentTableToolbarInner}>
      <input
        className={uiTokens.residentTableToolbarSearchInput}
        placeholder="搜尋院友姓名"
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value)
          resetPage()
        }}
      />
      <select
        className={uiTokens.residentTableToolbarSelect}
        value={statusFilter}
        onChange={(event) => {
          setStatusFilter(event.target.value as ResidentTableStatusFilter)
          resetPage()
        }}
      >
        <option value="all">全部狀態</option>
        <option value="under-target">待補齊</option>
        <option value="completed">已達標</option>
      </select>
      <select
        className={uiTokens.residentTableToolbarSelect}
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
