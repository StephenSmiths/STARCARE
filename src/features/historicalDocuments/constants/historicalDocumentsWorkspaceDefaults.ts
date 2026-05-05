import { STARCARE_DEFAULT_FACILITY_ID } from '../../../constants/starcareDefaultFacilityId'
import type { HistoricalDocumentsFilters } from '../types/historicalDocuments'

export const HISTORICAL_DOCUMENTS_WORKSPACE_FACILITY_ID = STARCARE_DEFAULT_FACILITY_ID

export const createHistoricalDocumentsDefaultFilters = (): HistoricalDocumentsFilters => ({
  dateFrom: '',
  dateTo: '',
  keyword: '',
})
