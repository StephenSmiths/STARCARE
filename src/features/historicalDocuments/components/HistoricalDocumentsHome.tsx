import { uiTokens } from '../../shared/ui/uiTokens'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { useHistoricalDocumentsWorkspace } from '../hooks/useHistoricalDocumentsWorkspace'
import { HistoricalDocumentsTable } from './HistoricalDocumentsTable'
import { HistoricalDocumentsToolbar } from './HistoricalDocumentsToolbar'

/** PDF 02【10】歷史文件（僅已核准服務表單） */
export const HistoricalDocumentsHome = () => {
  const workspace = useHistoricalDocumentsWorkspace()

  return (
    <div className={uiTokens.stackVertical}>
      <p className="text-sm text-slate-600">
        母本要求僅展示{' '}
        <span className="font-semibold text-slate-800">APPROVED</span> 鎖定紀錄；資料來源目前為本機（與服務表單共用），匯出為 UTF-8 CSV 可直接以 Excel 開啟。
      </p>
      <HistoricalDocumentsToolbar {...workspace} />
      <HistoricalDocumentsTable rows={workspace.rows} />
      <AuditTrailPanel
        title="匯出審計（含 HISTORICAL_DOCUMENTS_EXPORT）"
        help="與其他模組共用全域軌跡。"
        auditTrail={globalAuditTrailService.list()}
      />
    </div>
  )
}
