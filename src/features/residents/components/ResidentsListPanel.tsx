import { useMemo, useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { Resident, ResidentInput } from '../types/resident'

interface ResidentsListPanelProps {
  residents: Resident[]
  actorId: string
  /** 與 `view:residents`／Edge 寫入權限一致；false 時隱藏編輯／軟刪除 */
  canMaintainResidentRecords: boolean
  /** 非 null 時禁用所有軟刪除按鈕（進行中請求） */
  softDeleteBusyResidentId?: string | null
  onEdit: (residentId: string) => void
  onSoftDelete: (actorId: string, residentId: string) => Promise<void>
}

export const ResidentsListPanel = ({
  residents,
  actorId,
  canMaintainResidentRecords,
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
      <div className={uiTokens.residentListToolbar}>
        <div className={uiTokens.layoutFlexWrapItemsCenterGap2TextXs}>
          <input
            className={uiTokens.formInputSearchNarrow}
            placeholder="搜尋姓名或床號"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value)
              setPage(1)
            }}
          />
          <select
            className={uiTokens.formSelectAutoMin8rem}
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
            className={uiTokens.formSelectAutoMin8rem}
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value))
              setPage(1)
            }}
          >
            <option value={20}>每頁 20</option>
            <option value={50}>每頁 50</option>
          </select>
          <span className={uiTokens.residentListToolbarMeta}>共 {filteredResidents.length} 筆</span>
        </div>
      </div>
      <ul id="residents-list" className={uiTokens.residentListScroll}>
        {pagedResidents.map((resident) => (
          <li key={resident.id} className={uiTokens.residentListRow}>
            <p className={uiTokens.textWeightMedium}>{resident.name}（{resident.bedNumber}）</p>
            <p className={uiTokens.residentListRowMeta}>
              {resident.fundingType} / {resident.dementiaLevel} / {resident.isSpecialCareCase ? 'SC' : '非SC'}
            </p>
            <div className={uiTokens.layoutFlexGap2Mt2}>
              {canMaintainResidentRecords ? (
                <>
                  <button className={uiTokens.btnSecondary} type="button" onClick={() => onEdit(resident.id)}>
                    編輯
                  </button>
                  <button
                    className={uiTokens.btnDangerOutlineDisabled}
                    type="button"
                    disabled={softDeleteLocked}
                    onClick={() => void onSoftDelete(actorId, resident.id)}
                  >
                    {softDeleteBusyResidentId === resident.id ? '處理中…' : '軟刪除'}
                  </button>
                </>
              ) : (
                <span className={uiTokens.textSubtleXsMuted400}>—</span>
              )}
            </div>
          </li>
        ))}
        {pagedResidents.length === 0 ? (
          <li className={uiTokens.residentListEmptyRow}>
            沒有符合條件的院友資料
          </li>
        ) : null}
      </ul>
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
    </>
  )
}
