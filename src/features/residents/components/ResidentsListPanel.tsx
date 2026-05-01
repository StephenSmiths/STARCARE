import { useMemo, useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { Resident, ResidentInput } from '../types/resident'

interface ResidentsListPanelProps {
  residents: Resident[]
  actorId: string
  /** 非 null 時禁用所有軟刪除按鈕（進行中請求） */
  softDeleteBusyResidentId?: string | null
  onEdit: (residentId: string) => void
  onSoftDelete: (actorId: string, residentId: string) => Promise<void>
}

export const ResidentsListPanel = ({
  residents,
  actorId,
  softDeleteBusyResidentId = null,
  onEdit,
  onSoftDelete,
}: ResidentsListPanelProps) => {
  const softDeleteLocked = softDeleteBusyResidentId !== null
  const [keyword, setKeyword] = useState('')
  const [fundingFilter, setFundingFilter] = useState<'all' | ResidentInput['fundingType']>('all')
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

  return (
    <>
      <div className="mt-4 rounded-md border border-slate-200 p-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            className={`${uiTokens.formInput} max-w-xs sm:max-w-[14rem]`}
            placeholder="搜尋姓名或床號"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value)
              setPage(1)
            }}
          />
          <select
            className={`${uiTokens.formSelect} w-auto min-w-[8rem]`}
            value={fundingFilter}
            onChange={(event) => {
              setFundingFilter(event.target.value as 'all' | ResidentInput['fundingType'])
              setPage(1)
            }}
          >
            <option value="all">全部資助類別</option>
            <option value="GradeA_Subsidized">甲一買位</option>
            <option value="Voucher">院舍券</option>
            <option value="Private">私位</option>
          </select>
          <select
            className={`${uiTokens.formSelect} w-auto min-w-[8rem]`}
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value))
              setPage(1)
            }}
          >
            <option value={20}>每頁 20</option>
            <option value={50}>每頁 50</option>
          </select>
          <span className="ml-auto text-slate-500">共 {filteredResidents.length} 筆</span>
        </div>
      </div>
      <ul id="residents-list" className="mt-3 max-h-[60vh] space-y-2 overflow-auto pr-1">
        {pagedResidents.map((resident) => (
          <li key={resident.id} className="rounded-md border border-slate-200 p-3 text-sm">
            <p className="font-medium">{resident.name}（{resident.bedNumber}）</p>
            <p className="text-slate-600">
              {resident.fundingType} / {resident.dementiaLevel} / {resident.isSpecialCareCase ? 'SC' : '非SC'}
            </p>
            <div className="mt-2 flex gap-2">
              <button className={uiTokens.btnSecondary} type="button" onClick={() => onEdit(resident.id)}>
                編輯
              </button>
              <button
                className={`${uiTokens.btnDangerOutline} disabled:cursor-not-allowed disabled:opacity-50`}
                type="button"
                disabled={softDeleteLocked}
                onClick={() => void onSoftDelete(actorId, resident.id)}
              >
                {softDeleteBusyResidentId === resident.id ? '處理中…' : '軟刪除'}
              </button>
            </div>
          </li>
        ))}
        {pagedResidents.length === 0 ? (
          <li className="rounded-md border border-slate-200 p-3 text-center text-sm text-slate-500">
            沒有符合條件的院友資料
          </li>
        ) : null}
      </ul>
      <div className="mt-2 flex items-center justify-end gap-2 text-xs">
        <button
          className={`${uiTokens.btnSecondary} text-xs disabled:cursor-not-allowed disabled:opacity-50`}
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
          className={`${uiTokens.btnSecondary} text-xs disabled:cursor-not-allowed disabled:opacity-50`}
          type="button"
          disabled={safePage >= pageCount}
          onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
        >
          下一頁
        </button>
      </div>
    </>
  )
}
