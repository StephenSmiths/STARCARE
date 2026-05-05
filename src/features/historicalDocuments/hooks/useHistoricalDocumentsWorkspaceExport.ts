import { useCallback, useRef, useState } from 'react'
import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'
import { downloadApprovedServiceFormsCsv } from '../services/approvedServiceFormsCsvService'
import { recordHistoricalDocumentsExportAudit } from '../services/historicalDocumentsExportAuditService'
import type { HistoricalDocumentsFilters } from '../types/historicalDocuments'

/** PDF 02【10】：CSV 匯出防連點與審計（對齊業務 PDF）。 */
export const useHistoricalDocumentsWorkspaceExport = (
  actorId: string,
  rows: ServiceFormRecord[],
  filters: HistoricalDocumentsFilters,
) => {
  const exportLock = useRef(false)
  const [isExporting, setIsExporting] = useState(false)

  const exportCsv = useCallback(() => {
    if (exportLock.current) return
    exportLock.current = true
    setIsExporting(true)
    try {
      downloadApprovedServiceFormsCsv(rows)
      recordHistoricalDocumentsExportAudit(actorId, rows.length, filters)
    } finally {
      exportLock.current = false
      setIsExporting(false)
    }
  }, [actorId, filters, rows])

  return { exportCsv, isExporting }
}
