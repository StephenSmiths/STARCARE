import { useState } from 'react'
import { useAuth } from '../../auth'
import { uiTokens } from '../../shared/ui/uiTokens'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { useStaffManagementOverview } from '../hooks/useStaffManagementOverview'
import { downloadStaffOverviewExportCsv } from '../services/staffOverviewExportCsvService'
import type { StaffOverviewRow } from '../services/staffManagementService'
import { StaffProfileEditSheet } from './StaffProfileEditSheet'

interface StaffOverviewPanelProps {
  actorId: string
}

export const StaffOverviewPanel = ({ actorId }: StaffOverviewPanelProps) => {
  const { hasPermission } = useAuth()
  const canMaintainProfiles = hasPermission('view:staff-import')
  const { rows, isLoading, error, softDeleteBusyStaffId, softDeleteStaff, reload } =
    useStaffManagementOverview('facility-main')
  const [editRow, setEditRow] = useState<StaffOverviewRow | null>(null)
  const softDeleteLocked = softDeleteBusyStaffId !== null
  const exportCsv = () => {
    if (rows.length === 0) return
    downloadStaffOverviewExportCsv(rows)
    globalAuditTrailService.record({
      action: 'STAFF_EXPORT',
      entityType: 'Staff',
      entityId: `staff-export-${Date.now()}`,
      actorId,
      beforeState: null,
      afterState: JSON.stringify({ count: rows.length }),
      detail: '匯出員工概覽（CSV／Excel 可開）',
      occurredAt: new Date().toISOString(),
    })
  }

  return (
    <article className={uiTokens.surfaceCard}>
      <div className="flex items-center justify-between gap-2">
        <h2 className={uiTokens.pageSectionHeading}>員工資料概覽</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">共 {rows.length} 位</span>
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
        {canMaintainProfiles ? ' TeamLead／Admin 可編輯主檔（顯示名、職類、服務範圍）。' : null}
      </p>
      {isLoading ? <p className="mt-3 text-xs text-slate-500">載入中...</p> : null}
      {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}
      {!isLoading && !error && rows.length === 0 ? (
        <p className="mt-3 text-xs text-slate-500">目前尚無可顯示的員工資料。</p>
      ) : null}
      {rows.length > 0 ? (
        <div className="mt-3 max-h-56 overflow-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-2 py-2">員工 ID</th>
                <th className="px-2 py-2">名稱</th>
                <th className="px-2 py-2">職類</th>
                <th className="px-2 py-2">可排時段數</th>
                <th className="px-2 py-2">技能數</th>
                <th className="px-2 py-2">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rows.map((item) => {
                const canEditRow = canMaintainProfiles && item.roleType && item.serviceScope
                return (
                  <tr key={item.staffId}>
                    <td className="whitespace-nowrap px-2 py-2">{item.staffId}</td>
                    <td className="px-2 py-2">{item.staffName}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-slate-600">{item.roleType ?? '—'}</td>
                    <td className="px-2 py-2">{item.sessionCount}</td>
                    <td className="px-2 py-2">{item.skillCount}</td>
                    <td className="whitespace-nowrap px-2 py-2">
                      {canMaintainProfiles ? (
                        <>
                          <button
                            type="button"
                            disabled={softDeleteLocked || !canEditRow}
                            title={!canEditRow ? '需有主檔職類與服務範圍（請部署 staff-profiles-list）' : undefined}
                            className={`${uiTokens.btnSecondary} mr-2 text-[11px] disabled:cursor-not-allowed disabled:opacity-50`}
                            onClick={() => setEditRow(item)}
                          >
                            編輯
                          </button>
                          <button
                            type="button"
                            disabled={softDeleteLocked}
                            onClick={() => void softDeleteStaff(actorId, item.staffId)}
                            className={`${uiTokens.btnDangerOutline} disabled:cursor-not-allowed disabled:opacity-50`}
                          >
                            {softDeleteBusyStaffId === item.staffId ? '處理中…' : '軟刪除'}
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
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
