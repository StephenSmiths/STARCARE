import type { ServiceFormRecord } from '../features/serviceForms/types/serviceForm'
import { loadServiceForms } from '../services/serviceFormStorage'

/** PDF 02【10】讀取來源（本地）；正式環境應改為後端僅回傳 APPROVED */
export const listServiceFormsForHistoricalDocuments = (): ServiceFormRecord[] => loadServiceForms()
