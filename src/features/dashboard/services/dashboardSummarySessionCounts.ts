import type { SchedulingSession } from '../../../services/schedulingService'

/** 指定曆日之時段筆數（不分軌；測試與舊邏輯用） */
export const countSessionsOnLocalDate = (sessions: SchedulingSession[], localDateYmd: string): number =>
  sessions.filter((s) => s.date === localDateYmd).length

/** PDF 01 §4.2：指定曆日依服務類型分軌計數（絕不混算） */
export const countSessionsOnLocalDateByTrack = (
  sessions: SchedulingSession[],
  localDateYmd: string,
): { subsidizedRehab: number; dementiaService: number } => {
  const onDate = sessions.filter((s) => s.date === localDateYmd)
  return {
    subsidizedRehab: onDate.filter((s) => s.serviceType === 'Subsidized_Rehab').length,
    dementiaService: onDate.filter((s) => s.serviceType === 'Dementia_Service').length,
  }
}
