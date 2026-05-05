import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import type { HistoricalDocumentsFilters } from '../types/historicalDocuments'

/** PDF 02【10】已核准服務紀錄匯出審計 */
export const recordHistoricalDocumentsExportAudit = (
  actorId: string,
  rowCount: number,
  filters: HistoricalDocumentsFilters,
): void => {
  recordAuditTrailThenHydrate({
    action: 'HISTORICAL_DOCUMENTS_EXPORT',
    entityType: 'Reporting',
    entityId: `historical-forms-${Date.now()}`,
    actorId,
    beforeState: null,
    afterState: JSON.stringify({ rowCount, filters }),
    detail: `匯出已核准服務紀錄（CSV／Excel 可開）：${rowCount} 筆`,
    occurredAt: new Date().toISOString(),
  })
}
