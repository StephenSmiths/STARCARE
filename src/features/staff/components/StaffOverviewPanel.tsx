import { useCallback, useState } from 'react'
import { useAuth } from '../../auth'
import { uiTokens } from '../../shared/ui/uiTokens'
import { downloadStaffOverviewExportCsv } from '../services/staffOverviewExportCsvService'
import { recordStaffOverviewExportAudit } from '../services/staffOverviewExportAuditService'
import type { StaffOverviewRow } from '../services/staffManagementService'
import { StaffProfileEditSheet } from './StaffProfileEditSheet'
import { StaffOverviewSelectionToolbar } from './StaffOverviewSelectionToolbar'
import { StaffOverviewTable } from './StaffOverviewTable'

export interface StaffOverviewPanelProps {
  actorId: string
  rows: StaffOverviewRow[]
  isLoading: boolean
  error: string
  softDeleteBusyStaffId: string | null
  reload: () => Promise<void>
  softDeleteStaff: (actorId: string, staffId: string) => Promise<void>
  batchSoftDeleteStaff: (actorId: string, staffIds: string[]) => Promise<boolean>
}

export const StaffOverviewPanel = ({
  actorId,
  rows,
  isLoading,
  error,
  softDeleteBusyStaffId,
  reload,
  softDeleteStaff,
  batchSoftDeleteStaff,
}: StaffOverviewPanelProps) => {
  const { hasPermission } = useAuth()
  const canMaintainProfiles = hasPermission('view:staff-import')
  const [editRow, setEditRow] = useState<StaffOverviewRow | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const softDeleteLocked = softDeleteBusyStaffId !== null

  const exportCsv = () => {
    if (rows.length === 0) return
    downloadStaffOverviewExportCsv(rows)
    recordStaffOverviewExportAudit(actorId, rows.length)
  }

  const toggleSelected = useCallback((staffId: string) => {
    setSelectedIds((prev) => (prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]))
  }, [])

  const selectAllVisible = useCallback(() => {
    setSelectedIds(rows.map((r) => r.staffId))
  }, [rows])

  const clearSelection = useCallback(() => setSelectedIds([]), [])

  const handleBatchSoftDelete = useCallback(
    async (staffIds: string[]) => {
      const ok = await batchSoftDeleteStaff(actorId, staffIds)
      if (ok) setSelectedIds([])
    },
    [actorId, batchSoftDeleteStaff],
  )

  return (
    <article className={uiTokens.surfaceCard}>
      <div className={uiTokens.layoutFlexBetweenGap2}>
        <h2 className={uiTokens.pageSectionHeading}>員工資料概覽</h2>
        <div className={uiTokens.layoutFlexItemsCenterGap2}>
          <span className={uiTokens.textSubtleXs}>共 {rows.length} 位</span>
          <button
            type="button"
            className={uiTokens.btnSecondary}
            onClick={exportCsv}
            disabled={rows.length === 0}
          >
            匯出 Excel（CSV）
          </button>
        </div>
      </div>
      <p className={uiTokens.sectionHelp}>
        依現有可排時段與技能資料整合（session 數 / 技能數）。匯出含「職類」欄（與 staff_profiles.role_type 一致；主檔未載入時可能空白）。
        {canMaintainProfiles ? ' TeamLead／Admin 可編輯主檔（顯示名、職類、服務範圍）；可勾選多位後「軟刪除已選」（與單筆相同連動標記）。' : null}
      </p>
      {canMaintainProfiles && rows.length > 0 ? (
        <div className={uiTokens.stackVerticalMt3}>
          <StaffOverviewSelectionToolbar
            rows={rows}
            selectedIds={selectedIds}
            disabled={softDeleteLocked}
            onSelectAllVisible={selectAllVisible}
            onClearSelection={clearSelection}
            onBatchSoftDelete={(ids) => {
              void handleBatchSoftDelete(ids)
            }}
          />
        </div>
      ) : null}
      {isLoading ? <p className={uiTokens.textSubtleXsMt3}>載入中...</p> : null}
      {error ? <p className={uiTokens.formInlineErrorMt3Xs}>{error}</p> : null}
      {!isLoading && !error && rows.length === 0 ? (
        <p className={uiTokens.textSubtleXsMt3}>目前尚無可顯示的員工資料。</p>
      ) : null}
      {rows.length > 0 ? (
        <StaffOverviewTable
          rows={rows}
          canMaintainProfiles={canMaintainProfiles}
          softDeleteLocked={softDeleteLocked}
          softDeleteBusyStaffId={softDeleteBusyStaffId}
          selectedIds={selectedIds}
          actorId={actorId}
          onToggleSelected={toggleSelected}
          onEditRow={setEditRow}
          onSoftDeleteOne={softDeleteStaff}
        />
      ) : null}
      <StaffProfileEditSheet
        open={editRow !== null}
        row={editRow}
        actorId={actorId}
        onClose={() => setEditRow(null)}
        onSaved={() => void reload()}
      />
    </article>
  )
}
