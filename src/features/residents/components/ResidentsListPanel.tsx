import { useMemo, useState } from 'react'
import { ResidentsListPanelPager } from './ResidentsListPanelPager'
import { ResidentsListPanelRow } from './ResidentsListPanelRow'
import { ResidentsListPanelToolbar } from './ResidentsListPanelToolbar'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { Resident, ResidentInput } from '../types/resident'
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
  onBatchSoftDelete: (residentIds: string[]) => Promise<void>
  onBatchUpdate: (
    residentIds: string[],
    patch: Partial<Pick<ResidentInput, 'fundingType' | 'serviceType'>>,
  ) => Promise<void>
  onExportSelected: (residentIds: string[]) => void
}

export const ResidentsListPanel = ({
  residents,
  actorId,
  canMaintainResidentRecords,
  softDeleteBusyResidentId = null,
  onEdit,
  onSoftDelete,
  onBatchSoftDelete,
  onBatchUpdate,
  onExportSelected,
}: ResidentsListPanelProps) => {
  const softDeleteLocked = softDeleteBusyResidentId !== null
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [batchFundingType, setBatchFundingType] = useState<'unchanged' | ResidentInput['fundingType']>('unchanged')
  const [batchServiceType, setBatchServiceType] = useState<'unchanged' | ResidentInput['serviceType']>('unchanged')
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
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const selectedCount = selectedIds.length
  const toggleSelected = (residentId: string) => {
    setSelectedIds((prev) =>
      prev.includes(residentId) ? prev.filter((id) => id !== residentId) : [...prev, residentId],
    )
  }
  const selectAllPage = () => setSelectedIds((prev) => Array.from(new Set([...prev, ...pagedResidents.map((r) => r.id)])))
  const clearSelected = () => setSelectedIds([])
  const applyBatchUpdate = async () => {
    const patch: Partial<Pick<ResidentInput, 'fundingType' | 'serviceType'>> = {}
    if (batchFundingType !== 'unchanged') patch.fundingType = batchFundingType
    if (batchServiceType !== 'unchanged') patch.serviceType = batchServiceType
    if (!patch.fundingType && !patch.serviceType) return
    await onBatchUpdate(selectedIds, patch)
    clearSelected()
  }
  const applyBatchSoftDelete = async () => {
    await onBatchSoftDelete(selectedIds)
    clearSelected()
  }

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
      {canMaintainResidentRecords ? (
        <div className={uiTokens.layoutFlexWrapItemsCenterGap2TextXs}>
          <span className={uiTokens.textSubtleXs}>已選 {selectedCount} 位</span>
          <button type="button" className={uiTokens.btnCompact} onClick={selectAllPage}>
            全選本頁
          </button>
          <button type="button" className={uiTokens.btnCompact} onClick={clearSelected}>
            清空勾選
          </button>
          <select
            className={uiTokens.formSelectAutoMin8rem}
            value={batchFundingType}
            onChange={(event) =>
              setBatchFundingType(event.target.value as 'unchanged' | ResidentInput['fundingType'])
            }
          >
            <option value="unchanged">資助類別（不變更）</option>
            <option value="GradeA_Subsidized">甲一買位</option>
            <option value="Voucher">院舍券</option>
            <option value="Private">私位</option>
          </select>
          <select
            className={uiTokens.formSelectAutoMin8rem}
            value={batchServiceType}
            onChange={(event) =>
              setBatchServiceType(event.target.value as 'unchanged' | ResidentInput['serviceType'])
            }
          >
            <option value="unchanged">服務類型（不變更）</option>
            <option value="Subsidized_Rehab">資助復康服務</option>
            <option value="Dementia_Service">認知障礙症服務</option>
            <option value="Both">兩者皆有</option>
          </select>
          <button
            type="button"
            className={uiTokens.btnSecondary}
            onClick={() => void applyBatchUpdate()}
            disabled={selectedCount === 0 || (batchFundingType === 'unchanged' && batchServiceType === 'unchanged')}
          >
            批量更新欄位
          </button>
          <button
            type="button"
            className={uiTokens.btnDangerOutlineDisabled}
            onClick={() => void applyBatchSoftDelete()}
            disabled={selectedCount === 0 || softDeleteLocked}
          >
            批量軟刪除
          </button>
          <button
            type="button"
            className={uiTokens.btnSecondary}
            onClick={() => onExportSelected(selectedIds)}
            disabled={selectedCount === 0}
          >
            匯出已選（CSV）
          </button>
        </div>
      ) : null}
      <ul id="residents-list" className={uiTokens.residentListScroll}>
        {pagedResidents.map((resident) => (
          <ResidentsListPanelRow
            key={resident.id}
            resident={resident}
            actorId={actorId}
            canMaintainResidentRecords={canMaintainResidentRecords}
            selected={selectedSet.has(resident.id)}
            onToggleSelected={toggleSelected}
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
