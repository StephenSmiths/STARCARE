import { useMemo, useState } from 'react'
import type { ResidentTableRow } from '../types/residentTableRow'

export type ResidentTableStatusFilter = 'all' | 'under-target' | 'completed'

/** 院友週次數表：關鍵字／狀態篩選與分頁 */
export const useSchedulingResidentTable = (rows: ResidentTableRow[]) => {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<ResidentTableStatusFilter>('all')
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

  const resetPage = () => setPage(1)

  return {
    keyword,
    setKeyword,
    statusFilter,
    setStatusFilter,
    pageSize,
    setPageSize,
    page,
    setPage,
    filteredRows,
    pageCount,
    safePage,
    pagedRows,
    resetPage,
  }
}
