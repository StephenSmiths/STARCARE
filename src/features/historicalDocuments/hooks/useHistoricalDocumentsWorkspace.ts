import { useCallback, useMemo, useRef, useState } from 'react'
import { useAuthActorId } from '../../auth'
import { listServiceFormsForHistoricalDocuments } from '../../../repositories/historicalDocumentsRepository'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'
import { downloadApprovedServiceFormsCsv } from '../services/approvedServiceFormsCsvService'
import {
  filterApprovedServiceFormsForArchive,
  selectApprovedServiceForms,
} from '../services/historicalDocumentsDomainService'
import type { HistoricalDocumentsFilters } from '../types/historicalDocuments'

const defaultFilters = (): HistoricalDocumentsFilters => ({
  dateFrom: '',
  dateTo: '',
  keyword: '',
})

export type HistoricalDocumentsWorkspace = {
  rows: ServiceFormRecord[]
  approvedCount: number
  filters: HistoricalDocumentsFilters
  setFilters: (next: HistoricalDocumentsFilters) => void
  reload: () => void
  exportCsv: () => void
  isExporting: boolean
}

/** PDF 02【10】歷史文件：核准表單篩選與匯出 */
export const useHistoricalDocumentsWorkspace = (): HistoricalDocumentsWorkspace => {
  const actorId = useAuthActorId()
  const [forms, setForms] = useState<ServiceFormRecord[]>(() => listServiceFormsForHistoricalDocuments())
  const [filters, setFilters] = useState<HistoricalDocumentsFilters>(defaultFilters)
  const [isExporting, setIsExporting] = useState(false)
  const exportLock = useRef(false)

  const reload = useCallback(() => {
    setForms(listServiceFormsForHistoricalDocuments())
  }, [])

  const approved = useMemo(() => selectApprovedServiceForms(forms), [forms])
  const rows = useMemo(() => filterApprovedServiceFormsForArchive(approved, filters), [approved, filters])

  const exportCsv = useCallback(() => {
    if (exportLock.current) return
    exportLock.current = true
    setIsExporting(true)
    try {
      downloadApprovedServiceFormsCsv(rows)
      globalAuditTrailService.record({
        action: 'HISTORICAL_DOCUMENTS_EXPORT',
        entityType: 'Reporting',
        entityId: `historical-forms-${Date.now()}`,
        actorId,
        beforeState: null,
        afterState: JSON.stringify({ rowCount: rows.length, filters }),
        detail: `匯出已核准服務紀錄（CSV／Excel 可開）：${rows.length} 筆`,
        occurredAt: new Date().toISOString(),
      })
    } finally {
      exportLock.current = false
      setIsExporting(false)
    }
  }, [actorId, filters, rows])

  return {
    rows,
    approvedCount: approved.length,
    filters,
    setFilters,
    reload,
    exportCsv,
    isExporting,
  }
}
