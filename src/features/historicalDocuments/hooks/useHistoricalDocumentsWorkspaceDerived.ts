import { useMemo } from 'react'
import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'
import {
  filterApprovedServiceFormsForArchive,
  selectApprovedServiceForms,
} from '../services/historicalDocumentsDomainService'
import type { HistoricalDocumentsFilters } from '../types/historicalDocuments'

/** PDF 02【10】：核准集合與封存篩選後之列（供列表／CSV 同源）。 */
export const useHistoricalDocumentsWorkspaceDerived = (
  forms: ServiceFormRecord[],
  filters: HistoricalDocumentsFilters,
) => {
  const approved = useMemo(() => selectApprovedServiceForms(forms), [forms])
  const rows = useMemo(() => filterApprovedServiceFormsForArchive(approved, filters), [approved, filters])

  return {
    approvedCount: approved.length,
    rows,
  }
}
