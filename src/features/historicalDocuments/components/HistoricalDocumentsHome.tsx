import { uiTokens } from '../../shared/ui/uiTokens'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { useHistoricalDocumentsWorkspace } from '../hooks/useHistoricalDocumentsWorkspace'
import { HistoricalDocumentsTable } from './HistoricalDocumentsTable'
import { HistoricalDocumentsToolbar } from './HistoricalDocumentsToolbar'

/** PDF 02【10】歷史文件（僅已核准服務表單） */
export const HistoricalDocumentsHome = () => {
  const workspace = useHistoricalDocumentsWorkspace()
  const auditTrail = useAuditTrailList()

  return (
    <div className={uiTokens.stackVertical}>
      {workspace.loadError ? (
        <p className={uiTokens.bannerWarn}>{workspace.loadError}</p>
      ) : null}
      <p className={uiTokens.moduleDescription}>
        母本要求僅展示 <span className={uiTokens.textSemiboldSlate800}>APPROVED</span> 鎖定紀錄。
        {workspace.dataSource === 'db' ? (
          <>目前以<strong className={uiTokens.proseStrongInset}>雲端資料庫</strong>為展示主體（Edge `approvedOnly`）；本機快取會同步更新供離線參考。</>
        ) : (
          <>目前以<strong className={uiTokens.proseStrongInset}>本機已核准快取</strong>顯示（遠端不可用時之備援）。</>
        )}
        匯出為 UTF-8 CSV，可直接以 Excel 開啟。
      </p>
      <HistoricalDocumentsToolbar {...workspace} />
      <HistoricalDocumentsTable rows={workspace.rows} isLoading={workspace.isLoading} />
      <AuditTrailPanel
        title="匯出審計（含 HISTORICAL_DOCUMENTS_EXPORT）"
        help="與其他模組共用全域軌跡。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
