import type { Activity } from '../../../repositories/activityRepository'
import type { ActivitySessionImportRow } from '../../../repositories/activitySessionImportRepository'
import type { StaffProfileRoleType } from '../../../services/schedulingService'

/**
 * PDF 02【2】工作計劃草稿（創建後寫入 activity_sessions，供智能排班挑選時段）。
 * 對齊 01 §3：服務類型隔離——草稿列須標明資助復康或認知軌。
 */
export type WorkPlanActivityType = 'Individual' | 'Group' | 'Assessment' | 'Other'

export interface WorkPlanDraftLine {
  sessionDate: string
  staffProfileId: string
  /** 僅供預覽表顯示 */
  staffDisplayName: string
  staffRoleType: StaffProfileRoleType
  startTime: string
  durationMinutes: number
  endTime: string
  timeSlot: string
  activityType: WorkPlanActivityType
  residentIds: string[]
  activityContent: string
  activityContentOther?: string
  activityDetail?: string
  activityDetailOther?: string
  capacity: number
  serviceType: 'Subsidized_Rehab' | 'Dementia_Care'
}

const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/

export const formatRangeLabel = (startTime: string, endTime: string): string => `${startTime} - ${endTime}`

export const computeEndTime = (startTime: string, durationMinutes: number): string | null => {
  const hit = startTime.match(HHMM)
  if (!hit) return null
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) return null
  const hour = Number(hit[1])
  const minute = Number(hit[2])
  const startMinutes = hour * 60 + minute
  const endMinutes = (startMinutes + Math.floor(durationMinutes)) % (24 * 60)
  const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0')
  const endM = String(endMinutes % 60).padStart(2, '0')
  return `${endH}:${endM}`
}

export const validateWorkPlanDraftLine = (line: WorkPlanDraftLine): string | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(line.sessionDate.trim())) return '日期須為 YYYY-MM-DD'
  if (!line.staffProfileId.trim()) return '請選擇員工'
  if (!line.startTime.match(HHMM)) return '開始時間須為 HH:mm'
  if (!Number.isFinite(line.durationMinutes) || line.durationMinutes < 15 || line.durationMinutes % 15 !== 0) {
    return '時長須為 15 分鐘倍數'
  }
  if (!line.endTime.match(HHMM)) return '結束時間計算錯誤'
  if (line.timeSlot !== formatRangeLabel(line.startTime, line.endTime)) {
    return '時段字串需為「HH:mm - HH:mm」'
  }
  if (!line.activityContent.trim()) return '請填活動內容'
  if (line.activityContent === '其他' && !line.activityContentOther?.trim()) return '請填活動內容（其他）'
  if (line.activityDetail === '其他細項' && !line.activityDetailOther?.trim()) return '請填活動細項（其他）'
  if (line.activityType === 'Assessment' || line.activityType === 'Individual') {
    if (line.capacity !== 1) return '個別訓練／評估名額須固定 1'
    if (line.residentIds.length !== 1) return '個別訓練／評估需且僅可選 1 位院友'
  }
  if (line.activityType === 'Group' && line.residentIds.length < 1) return '小組訓練至少需選 1 位院友'
  if (!Number.isFinite(line.capacity) || line.capacity < 1) return '名額須為至少 1 的正整數'
  return null
}

/** 同服務類型之第一筆活動主檔（待產品提供「計劃模板」後可改為使用者自選 activity） */
export const pickDefaultActivityId = (
  activities: Activity[],
  serviceType: WorkPlanDraftLine['serviceType'],
  activityType: WorkPlanDraftLine['activityType'],
): string | null => {
  const byMode = activityType === 'Group' ? 'Group' : 'Individual'
  const byKind =
    activityType === 'Assessment' ? 'Assessment' : activityType === 'Other' ? 'Other' : 'Training'
  const hit = activities.find(
    (a) => a.serviceType === serviceType && a.deliveryMode === byMode && a.activityKind === byKind,
  )
  if (hit) return hit.id
  const fallback = activities.find((a) => a.serviceType === serviceType)
  if (fallback) return fallback.id
  return null
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
    const activityId = pickDefaultActivityId(activities, line.serviceType, line.activityType)
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
      startTime: line.startTime,
      durationMinutes: line.durationMinutes,
      endTime: line.endTime,
      activityType: line.activityType,
      activityContent: line.activityContent === '其他' ? line.activityContentOther?.trim() || '' : line.activityContent,
      activityDetail:
        line.activityDetail === '其他細項' ? line.activityDetailOther?.trim() || '' : line.activityDetail || '',
      residentIds: line.residentIds,
    })
  }
  return { ok: true, rows }
}
