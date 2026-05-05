import { useCallback, useEffect, useState } from 'react'
import { loadApprovedServiceFormsDbPrimary } from '../../../repositories/serviceFormSyncService'
import { loadServiceForms } from '../../../services/serviceFormStorage'
import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'
import { selectApprovedServiceForms } from '../services/historicalDocumentsDomainService'
import type { HistoricalDocumentsDataSource } from '../types/historicalDocuments'
import { HISTORICAL_DOCUMENTS_WORKSPACE_FACILITY_ID } from '../constants/historicalDocumentsWorkspaceDefaults'

/** PDF 02【10】已核准表單載入（雲端優先，失敗回落本機） */
export const useHistoricalDocumentsWorkspaceLoad = () => {
  const [forms, setForms] = useState<ServiceFormRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dataSource, setDataSource] = useState<HistoricalDocumentsDataSource>('db')
  const [loadError, setLoadError] = useState('')

  const reload = useCallback(async () => {
    setIsLoading(true)
    setLoadError('')
    const remote = await loadApprovedServiceFormsDbPrimary(HISTORICAL_DOCUMENTS_WORKSPACE_FACILITY_ID)
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

  return { forms, isLoading, dataSource, loadError, reload }
}
