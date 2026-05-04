import { useMemo, useState } from 'react'
import type { FundingType } from '../../../services/schedulingService'
import { uiTokens } from '../../shared/ui/uiTokens'

export interface ResidentTableRow {
  id: string
  name: string
  fundingType: FundingType
  weeklyTarget: number
  weeklyCompleted: number
  isUnderTarget: boolean
}

type StatusFilter = 'all' | 'under-target' | 'completed'

const fundingLabel = (type: FundingType): string => {
  if (type === 'GradeA_Subsidized') return '甲一買位（EA1）'
  if (type === 'Voucher') return '院舍券'
  return '私位'
}

const residentFundingBadgeClass = (type: FundingType) => {
  if (type === 'GradeA_Subsidized') return uiTokens.residentTableFundingBadgeGradeA
  if (type === 'Voucher') return uiTokens.residentTableFundingBadgeVoucher
  return uiTokens.residentTableFundingBadgePrivate
}

interface SchedulingResidentTableProps {
  rows: ResidentTableRow[]
}

/** 院友週次數表格：未達標列淡紅底、資助類別標色 */
export const SchedulingResidentTable = ({ rows }: SchedulingResidentTableProps) => {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase()
    return rows.filter((row) => {
      const matchesKeyword =
        trimmedKeyword.length === 0 || row.name.toLowerCase().includes(trimmedKeyword)
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'under-target' && row.isUnderTarget) ||
        (statusFilter === 'completed' && !row.isUnderTarget)
      return matchesKeyword && matchesStatus
    })
  }, [rows, keyword, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, safePage, pageSize])

  return (
    <div className={uiTokens.surfaceTableShell}>
      <div className={uiTokens.residentTableHeaderBar}>
        <h3 className={uiTokens.panelTitleSm}>院友本週資助復康次數</h3>
      </div>
      <div className={uiTokens.residentTableToolbarBar}>
        <div className={uiTokens.residentTableToolbarInner}>
          <input
            className={uiTokens.residentTableToolbarSearchInput}
            placeholder="搜尋院友姓名"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value)
              setPage(1)
            }}
          />
          <select
            className={uiTokens.residentTableToolbarSelect}
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as StatusFilter)
              setPage(1)
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
              setPage(1)
            }}
          >
            <option value={20}>每頁 20</option>
            <option value={50}>每頁 50</option>
          </select>
          <span className={uiTokens.residentListToolbarMeta}>共 {filteredRows.length} 筆</span>
        </div>
      </div>
      <div className={uiTokens.residentTableBodyScroll}>
        <table className={uiTokens.residentTableData}>
          <thead className={uiTokens.residentTableHeadStickyZ}>
            <tr>
              <th className={uiTokens.residentTableCellLg}>院友姓名</th>
              <th className={uiTokens.residentTableCellLg}>資助類別</th>
              <th className={uiTokens.residentTableCellLg}>週目標</th>
              <th className={uiTokens.residentTableCellLg}>本週已完成</th>
              <th className={uiTokens.residentTableCellLg}>狀態</th>
            </tr>
          </thead>
          <tbody className={uiTokens.tableBodyDivideSlate100}>
            {pagedRows.map((row) => (
              <tr
                key={row.id}
                className={row.isUnderTarget ? uiTokens.residentTableRowUnderTarget : uiTokens.residentTableRowDefault}
              >
                <td className={uiTokens.residentTableCellLgStrong}>{row.name}</td>
                <td className={uiTokens.residentTableCellLg}>
                  <span className={residentFundingBadgeClass(row.fundingType)}>
                    {fundingLabel(row.fundingType)}
                  </span>
                </td>
                <td className={uiTokens.residentTableCellLgMuted}>{row.weeklyTarget}</td>
                <td className={uiTokens.residentTableCellLgMuted}>{row.weeklyCompleted}</td>
                <td className={uiTokens.residentTableCellLg}>
                  {row.isUnderTarget ? (
                    <span className={uiTokens.rosterStatusUnderTarget}>待補齊</span>
                  ) : (
                    <span className={uiTokens.rosterStatusMet}>已達標</span>
                  )}
                </td>
              </tr>
            ))}
            {pagedRows.length === 0 ? (
              <tr>
                <td colSpan={5} className={uiTokens.residentTableEmptyCell}>
                  沒有符合條件的資料
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
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
    </div>
  )
}
