import { useState } from 'react'
import { useAuthActorId } from '../../auth'
import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'
import type {
  HistoricalDocumentsDataSource,
  HistoricalDocumentsFilters,
} from '../types/historicalDocuments'
import { createHistoricalDocumentsDefaultFilters } from '../constants/historicalDocumentsWorkspaceDefaults'
import { useHistoricalDocumentsWorkspaceDerived } from './useHistoricalDocumentsWorkspaceDerived'
import { useHistoricalDocumentsWorkspaceExport } from './useHistoricalDocumentsWorkspaceExport'
import { useHistoricalDocumentsWorkspaceLoad } from './useHistoricalDocumentsWorkspaceLoad'

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
  const { forms, isLoading, dataSource, loadError, reload } = useHistoricalDocumentsWorkspaceLoad()
  const [filters, setFilters] = useState<HistoricalDocumentsFilters>(createHistoricalDocumentsDefaultFilters)

  const { approvedCount, rows } = useHistoricalDocumentsWorkspaceDerived(forms, filters)
  const { exportCsv, isExporting } = useHistoricalDocumentsWorkspaceExport(actorId, rows, filters)

  return {
    rows,
    approvedCount,
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
