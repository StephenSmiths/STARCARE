import { useCallback, useState } from 'react'
import { listAiReports, persistAiReports } from '../../../repositories/aiReportCenterRepository'
import type { AiReportRecord } from '../types/aiReportCenter'

/** PDF 02【11】報告列表：本機讀寫與 reload（Repository 抽象之上） */
export const useAiReportCenterWorkspaceModel = () => {
  const [reports, setReports] = useState<AiReportRecord[]>(() => listAiReports())

  const reload = useCallback(() => {
    setReports(listAiReports())
  }, [])

  const persistAndSet = useCallback((next: AiReportRecord[]) => {
    persistAiReports(next)
    setReports(next)
  }, [])

  return { reports, reload, persistAndSet }
}
