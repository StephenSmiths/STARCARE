import { uiTokens } from '../../shared/ui/uiTokens'
import type { StaffOverviewRow } from '../services/staffManagementService'

export type StaffOverviewTableProps = {
  rows: StaffOverviewRow[]
  canMaintainProfiles: boolean
  softDeleteLocked: boolean
  softDeleteBusyStaffId: string | null
  selectedIds: string[]
  actorId: string
  onToggleSelected: (staffId: string) => void
  onEditRow: (row: StaffOverviewRow) => void
  onSoftDeleteOne: (actorId: string, staffId: string) => void
}

export const StaffOverviewTable = ({
  rows,
  canMaintainProfiles,
  softDeleteLocked,
  softDeleteBusyStaffId,
  selectedIds,
  actorId,
  onToggleSelected,
  onEditRow,
  onSoftDeleteOne,
}: StaffOverviewTableProps) => {
  const selectedSet = new Set(selectedIds)

  return (
    <div className={uiTokens.tableScrollShort}>
      <table className={uiTokens.tableCompact}>
        <thead className={uiTokens.tableHeadSticky}>
          <tr>
            {canMaintainProfiles ? <th className={uiTokens.tableCell}>選</th> : null}
            <th className={uiTokens.tableCell}>員工 ID</th>
            <th className={uiTokens.tableCell}>名稱</th>
            <th className={uiTokens.tableCell}>職類</th>
            <th className={uiTokens.tableCell}>可排時段數</th>
            <th className={uiTokens.tableCell}>技能數</th>
            <th className={uiTokens.tableCell}>操作</th>
          </tr>
        </thead>
        <tbody className={uiTokens.tableBodyDivided}>
          {rows.map((item) => {
            const canEditRow = canMaintainProfiles && item.roleType && item.serviceScope
            return (
              <tr key={item.staffId}>
                {canMaintainProfiles ? (
                  <td className={uiTokens.tableCellNowrap}>
                    <input
                      type="checkbox"
                      checked={selectedSet.has(item.staffId)}
                      disabled={softDeleteLocked}
                      onChange={() => onToggleSelected(item.staffId)}
                      aria-label={`選取員工 ${item.staffName}`}
                    />
                  </td>
                ) : null}
                <td className={uiTokens.tableCellNowrap}>{item.staffId}</td>
                <td className={uiTokens.tableCell}>{item.staffName}</td>
                <td className={uiTokens.tableCellNowrapMuted}>{item.roleType ?? '—'}</td>
                <td className={uiTokens.tableCell}>{item.sessionCount}</td>
                <td className={uiTokens.tableCell}>{item.skillCount}</td>
                <td className={uiTokens.tableCellNowrap}>
                  {canMaintainProfiles ? (
                    <>
                      <button
                        type="button"
                        disabled={softDeleteLocked || !canEditRow}
                        title={!canEditRow ? '需有主檔職類與服務範圍（請部署 staff-profiles-list）' : undefined}
                        className={uiTokens.staffTableRowSecondaryAction}
                        onClick={() => onEditRow(item)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        disabled={softDeleteLocked}
                        onClick={() => void onSoftDeleteOne(actorId, item.staffId)}
                        className={uiTokens.btnDangerOutlineDisabled}
                      >
                        {softDeleteBusyStaffId === item.staffId ? '處理中…' : '軟刪除'}
                      </button>
                    </>
                  ) : (
                    <span className={uiTokens.textSubtleXsMuted400}>—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
