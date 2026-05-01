import { useMemo, useState } from 'react'
import type { FundingType } from '../../../services/schedulingService'

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

const fundingBadgeClass = (type: FundingType): string => {
  if (type === 'GradeA_Subsidized') return 'bg-blue-100 text-blue-800 ring-blue-600/20'
  if (type === 'Voucher') return 'bg-emerald-100 text-emerald-800 ring-emerald-600/20'
  return 'bg-slate-100 text-slate-700 ring-slate-500/15'
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-800">院友本週資助復康次數</h3>
      </div>
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            className="w-56 rounded border border-slate-300 px-2 py-1.5 text-sm"
            placeholder="搜尋院友姓名"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value)
              setPage(1)
            }}
          />
          <select
            className="rounded border border-slate-300 px-2 py-1.5 text-sm"
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
            className="rounded border border-slate-300 px-2 py-1.5 text-sm"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value))
              setPage(1)
            }}
          >
            <option value={20}>每頁 20</option>
            <option value={50}>每頁 50</option>
          </select>
          <span className="ml-auto text-slate-500">共 {filteredRows.length} 筆</span>
        </div>
      </div>
      <div className="max-h-[60vh] overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">院友姓名</th>
              <th className="px-4 py-3">資助類別</th>
              <th className="px-4 py-3">週目標</th>
              <th className="px-4 py-3">本週已完成</th>
              <th className="px-4 py-3">狀態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedRows.map((row) => (
              <tr
                key={row.id}
                className={row.isUnderTarget ? 'bg-red-50/80' : 'bg-white'}
              >
                <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${fundingBadgeClass(row.fundingType)}`}
                  >
                    {fundingLabel(row.fundingType)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{row.weeklyTarget}</td>
                <td className="px-4 py-3 text-slate-600">{row.weeklyCompleted}</td>
                <td className="px-4 py-3">
                  {row.isUnderTarget ? (
                    <span className="text-amber-700">待補齊</span>
                  ) : (
                    <span className="text-emerald-700">已達標</span>
                  )}
                </td>
              </tr>
            ))}
            {pagedRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  沒有符合條件的資料
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3 text-xs">
        <button
          className="rounded border border-slate-300 px-2 py-1 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={safePage <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          上一頁
        </button>
        <span className="text-slate-500">
          第 {safePage} / {pageCount} 頁
        </span>
        <button
          className="rounded border border-slate-300 px-2 py-1 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
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
