import { uiTokens } from '../../shared/ui/uiTokens'
import type { Resident } from '../types/resident'
import {
  residentDementiaLevelLabelZh,
  residentFundingLabelZh,
  residentSpecialCareLabelZh,
} from '../utils/residentDisplayLabels'

export type ResidentsListPanelRowProps = {
  resident: Resident
  actorId: string
  canMaintainResidentRecords: boolean
  selected: boolean
  onToggleSelected: (residentId: string) => void
  softDeleteLocked: boolean
  softDeleteBusyResidentId: string | null
  onEdit: (residentId: string) => void
  onSoftDelete: (actorId: string, residentId: string) => Promise<void>
}

/** 院友列表單列（編輯／軟刪除與權限對齊 Edge） */
export const ResidentsListPanelRow = ({
  resident,
  actorId,
  canMaintainResidentRecords,
  selected,
  onToggleSelected,
  softDeleteLocked,
  softDeleteBusyResidentId,
  onEdit,
  onSoftDelete,
}: ResidentsListPanelRowProps) => (
  <li className={uiTokens.residentListRow}>
    {canMaintainResidentRecords ? (
      <label className={uiTokens.layoutFlexItemsCenterGap2}>
        <input type="checkbox" checked={selected} onChange={() => onToggleSelected(resident.id)} />
        <span className={uiTokens.textSubtleXs}>批量選取</span>
      </label>
    ) : null}
    <p className={uiTokens.textWeightMedium}>
      {resident.name}（{resident.bedNumber}）
    </p>
    <p className={uiTokens.residentListRowMeta}>
      {residentFundingLabelZh(resident.fundingType)} / {residentDementiaLevelLabelZh(resident.dementiaLevel)} /{' '}
      {residentSpecialCareLabelZh(resident.isSpecialCareCase)}
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
)
