import type { AiReportRecord } from '../features/aiReportCenter/types/aiReportCenter'
import { loadAiReports, saveAiReports } from '../services/aiReportCenterStorage'

/** PDF 02【11】資料閘道：本地暫存；正式應改呼叫 Edge／Supabase */
export const listAiReports = (): AiReportRecord[] => loadAiReports()

export const persistAiReports = (rows: AiReportRecord[]): void => saveAiReports(rows)
