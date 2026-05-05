import { ResidentsListPanelPager } from './ResidentsListPanelPager'
import { ResidentsListPanelRow } from './ResidentsListPanelRow'
import { ResidentsListPanelToolbar } from './ResidentsListPanelToolbar'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { Resident } from '../types/resident'
import { useResidentsListPanel } from '../hooks/useResidentsListPanel'

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
  const {
    keyword,
    setKeyword,
    fundingFilter,
    setFundingFilter,
    pageSize,
    setPageSize,
    pageCount,
    safePage,
    setPage,
    pagedResidents,
    filteredResidents,
    resetPage,
  } = useResidentsListPanel(residents)

  return (
    <>
      <ResidentsListPanelToolbar
        keyword={keyword}
        setKeyword={setKeyword}
        fundingFilter={fundingFilter}
        setFundingFilter={setFundingFilter}
        pageSize={pageSize}
        setPageSize={setPageSize}
        filteredCount={filteredResidents.length}
        resetPage={resetPage}
      />
      <ul id="residents-list" className={uiTokens.residentListScroll}>
        {pagedResidents.map((resident) => (
          <ResidentsListPanelRow
            key={resident.id}
            resident={resident}
            actorId={actorId}
            canMaintainResidentRecords={canMaintainResidentRecords}
            softDeleteLocked={softDeleteLocked}
            softDeleteBusyResidentId={softDeleteBusyResidentId}
            onEdit={onEdit}
            onSoftDelete={onSoftDelete}
          />
        ))}
        {pagedResidents.length === 0 ? (
          <li className={uiTokens.residentListEmptyRow}>沒有符合條件的院友資料</li>
        ) : null}
      </ul>
      <ResidentsListPanelPager safePage={safePage} pageCount={pageCount} setPage={setPage} />
    </>
  )
}
