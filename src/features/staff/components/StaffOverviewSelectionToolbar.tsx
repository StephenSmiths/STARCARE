import { uiTokens } from '../../shared/ui/uiTokens'
import { confirmStaffBatchSoftDelete } from '../utils/confirmStaffBatchSoftDelete'
import type { StaffOverviewRow } from '../services/staffManagementService'

export type StaffOverviewSelectionToolbarProps = {
  rows: StaffOverviewRow[]
  selectedIds: string[]
  disabled: boolean
  onSelectAllVisible: () => void
  onClearSelection: () => void
  onBatchSoftDelete: (staffIds: string[]) => void
}

export const StaffOverviewSelectionToolbar = ({
  rows,
  selectedIds,
  disabled,
  onSelectAllVisible,
  onClearSelection,
  onBatchSoftDelete,
}: StaffOverviewSelectionToolbarProps) => {
  const count = selectedIds.length
  const allIds = rows.map((r) => r.staffId)
  const isEntireVisibleList = count > 0 && allIds.length > 0 && count === allIds.length

  const runBatch = () => {
    if (count === 0 || disabled) return
    const nameById = new Map(rows.map((r) => [r.staffId, r.staffName]))
    const sampleNames = selectedIds.map((id) => nameById.get(id) ?? id)
    if (
      !confirmStaffBatchSoftDelete({
        count,
        isEntireVisibleList,
        sampleNames,
      })
    ) {
      return
    }
    onBatchSoftDelete(selectedIds)
  }

  return (
    <div className={uiTokens.layoutFlexWrapItemsCenterGap2TextXs}>
      <span className={uiTokens.textSubtleXs}>已選 {count} 位</span>
      <button type="button" className={uiTokens.btnCompact} disabled={disabled || rows.length === 0} onClick={onSelectAllVisible}>
        全選目前清單
      </button>
      <button type="button" className={uiTokens.btnCompact} disabled={disabled || count === 0} onClick={onClearSelection}>
        清空勾選
      </button>
      <button
        type="button"
        className={uiTokens.btnDangerOutlineDisabled}
        disabled={disabled || count === 0}
        onClick={() => runBatch()}
      >
        軟刪除已選
      </button>
    </div>
  )
}
