import type { Activity } from '../../../repositories/activityRepository'
import type { ActivitySessionImportRow } from '../../../repositories/activitySessionImportRepository'

/**
 * PDF 02【2】工作計劃草稿（創建後寫入 activity_sessions，供智能排班挑選時段）。
 * 對齊 01 §3：服務類型隔離——草稿列須標明資助復康或認知軌。
 */
export interface WorkPlanDraftLine {
  sessionDate: string
  staffProfileId: string
  /** 僅供預覽表顯示 */
  staffDisplayName: string
  timeSlot: string
  capacity: number
  serviceType: 'Subsidized_Rehab' | 'Dementia_Care'
}

export const validateWorkPlanDraftLine = (line: WorkPlanDraftLine): string | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(line.sessionDate.trim())) return '日期須為 YYYY-MM-DD'
  if (!line.staffProfileId.trim()) return '請選擇員工'
  if (!line.timeSlot.trim()) return '請填工作節時段（例 09:00）'
  if (!Number.isFinite(line.capacity) || line.capacity < 1) return '名額須為至少 1 的正整數'
  return null
}

/** 同服務類型之第一筆活動主檔（待產品提供「計劃模板」後可改為使用者自選 activity） */
export const pickDefaultActivityId = (
  activities: Activity[],
  serviceType: WorkPlanDraftLine['serviceType'],
): string | null => {
  const hit = activities.find((a) => a.serviceType === serviceType)
  return hit?.id ?? null
}

export const buildActivitySessionImportRows = (
  lines: WorkPlanDraftLine[],
  activities: Activity[],
  facilityId: string,
): { ok: true; rows: ActivitySessionImportRow[] } | { ok: false; message: string } => {
  const rows: ActivitySessionImportRow[] = []
  for (const line of lines) {
    const err = validateWorkPlanDraftLine(line)
    if (err) return { ok: false, message: err }
    const activityId = pickDefaultActivityId(activities, line.serviceType)
    if (!activityId) {
      return {
        ok: false,
        message: `找不到與「${line.serviceType}」對應的活動主檔，請於 activities 先建立活動後再儲存。`,
      }
    }
    rows.push({
      facilityId,
      activityId,
      staffProfileId: line.staffProfileId.trim(),
      sessionDate: line.sessionDate.trim(),
      timeSlot: line.timeSlot.trim(),
      capacity: Math.floor(line.capacity),
    })
  }
  return { ok: true, rows }
}
