import { useMemo, useState } from 'react'
import type { Resident, ResidentInput } from '../types/resident'

export type ResidentsListFundingFilter = 'all' | ResidentInput['fundingType']

/** 院友列表：關鍵字／資助類別篩選與分頁（ResidentsDashboard） */
export const useResidentsListPanel = (residents: Resident[]) => {
  const [keyword, setKeyword] = useState('')
  const [fundingFilter, setFundingFilter] = useState<ResidentsListFundingFilter>('all')
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(1)

  const filteredResidents = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    return residents.filter((resident) => {
      const matchesKeyword =
        q.length === 0 ||
        resident.name.toLowerCase().includes(q) ||
        resident.bedNumber.toLowerCase().includes(q)
      const matchesFunding = fundingFilter === 'all' || resident.fundingType === fundingFilter
      return matchesKeyword && matchesFunding
    })
  }, [residents, keyword, fundingFilter])

  const pageCount = Math.max(1, Math.ceil(filteredResidents.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const pagedResidents = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredResidents.slice(start, start + pageSize)
  }, [filteredResidents, safePage, pageSize])

  const resetPage = () => setPage(1)

  return {
    keyword,
    setKeyword,
    fundingFilter,
    setFundingFilter,
    pageSize,
    setPageSize,
    page,
    setPage,
    filteredResidents,
    pageCount,
    safePage,
    pagedResidents,
    resetPage,
  }
}
