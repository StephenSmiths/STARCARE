import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuthActorId } from '../../auth'
import { loadApprovedServiceFormsDbPrimary } from '../../../repositories/serviceFormSyncService'
import { loadServiceForms } from '../../../services/serviceFormStorage'
import { hydrateAuditTrailAfterLocalRecord } from '../../../services/auditTrailHydrationService'
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

const FACILITY_ID = 'facility-main'

export type HistoricalDocumentsDataSource = 'db' | 'local-fallback'

export type HistoricalDocumentsWorkspace = {
  rows: ServiceFormRecord[]
  approvedCount: number
  filters: HistoricalDocumentsFilters
  setFilters: (next: HistoricalDocumentsFilters) => void
  reload: () => void
  exportCsv: () => void
  isExporting: boolean
  /** 遠端核准列載入中 */
  isLoading: boolean
  /** 展示主體：雲端表或本機快取（僅遠端失敗時） */
  dataSource: HistoricalDocumentsDataSource
  loadError: string
}

/** PDF 02【10】歷史文件：核准表單篩選與匯出 */
export const useHistoricalDocumentsWorkspace = (): HistoricalDocumentsWorkspace => {
  const actorId = useAuthActorId()
  const [forms, setForms] = useState<ServiceFormRecord[]>([])
  const [filters, setFilters] = useState<HistoricalDocumentsFilters>(defaultFilters)
  const [isExporting, setIsExporting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dataSource, setDataSource] = useState<HistoricalDocumentsDataSource>('db')
  const [loadError, setLoadError] = useState('')
  const exportLock = useRef(false)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setLoadError('')
    const remote = await loadApprovedServiceFormsDbPrimary(FACILITY_ID)
    if (remote !== null) {
      setForms(remote)
      setDataSource('db')
    } else {
      setForms(selectApprovedServiceForms(loadServiceForms()))
      setDataSource('local-fallback')
      setLoadError('無法自伺服器載入已核准表單，已改顯示本機快取（可能較舊）。')
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void reload()
    })
  }, [reload])

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
      hydrateAuditTrailAfterLocalRecord()
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
    isLoading,
    dataSource,
    loadError,
  }
}
