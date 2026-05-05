import { uiTokens } from '../../shared/ui/uiTokens'
import type { Resident } from '../types/resident'

export type ResidentsListPanelRowProps = {
  resident: Resident
  actorId: string
  canMaintainResidentRecords: boolean
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
  softDeleteLocked,
  softDeleteBusyResidentId,
  onEdit,
  onSoftDelete,
}: ResidentsListPanelRowProps) => (
  <li className={uiTokens.residentListRow}>
    <p className={uiTokens.textWeightMedium}>
      {resident.name}（{resident.bedNumber}）
    </p>
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
)
