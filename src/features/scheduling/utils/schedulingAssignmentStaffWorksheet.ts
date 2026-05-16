/**
 * PDF 02【3】第一期：將試算指派聚合為「員工工作表」列（TL 預覽；日後可與員工端同步共用）。
 */
import type { SchedulingAssignment, SchedulingSession } from '../../../services/schedulingService'

export type StaffAssignmentWorksheetRow = {
  rowKey: string
  staffId: string
  staffName: string
  sessionDate: string
  dateLabel: string
  timeSlot: string
  deliveryModeLabel: string
  activityContentLabel: string
  residentNames: string[]
  passSummary: string
}

/** yyyy-mm-dd → d/m/yyyy（預覽用，與客戶工作表習慣一致） */
export const formatSchedulingWorksheetDateLabel = (ymd: string): string => {
  const m = ymd.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return ymd
  return `${Number(m[3])}/${Number(m[2])}/${m[1]}`
}

const sessionDeliveryModeLabel = (capacity: number): string =>
  capacity > 1 ? '小組活動' : '個別活動'

const activityContentForSession = (session: SchedulingSession): string => {
  if (session.activityName?.trim()) return session.activityName.trim()
  return '（活動內容依職位目錄匹配；尚無院友復康計劃）'
}

const timeSlotStartMinutes = (timeSlot: string): number => {
  const start = timeSlot.split('-')[0]?.trim() ?? ''
  const [h, min] = start.split(':').map((x) => Number(x))
  if (!Number.isFinite(h) || !Number.isFinite(min)) return 0
  return h * 60 + min
}

const compareWorksheetRows = (a: StaffAssignmentWorksheetRow, b: StaffAssignmentWorksheetRow): number => {
  const byStaff = a.staffName.localeCompare(b.staffName, 'zh-Hant')
  if (byStaff !== 0) return byStaff
  const byDate = a.sessionDate.localeCompare(b.sessionDate)
  if (byDate !== 0) return byDate
  return timeSlotStartMinutes(a.timeSlot) - timeSlotStartMinutes(b.timeSlot)
}

/** 依 session 聚合院友指派，排序：員工 → 日期 → 時段。 */
export const buildStaffAssignmentWorksheetRows = (
  assignments: SchedulingAssignment[],
  sessions: SchedulingSession[],
): StaffAssignmentWorksheetRow[] => {
  if (assignments.length === 0) return []
  const sessionById = new Map(sessions.map((s) => [s.id, s] as const))
  const bySession = new Map<string, SchedulingAssignment[]>()
  for (const a of assignments) {
    const prev = bySession.get(a.sessionId) ?? []
    prev.push(a)
    bySession.set(a.sessionId, prev)
  }

  const rows: StaffAssignmentWorksheetRow[] = []
  for (const [sessionId, group] of bySession) {
    const session = sessionById.get(sessionId)
    if (!session) continue
    const residentNames = [...new Set(group.map((g) => g.residentName))].sort((x, y) =>
      x.localeCompare(y, 'zh-Hant'),
    )
    const passes = [...new Set(group.map((g) => g.pass))].sort((x, y) => x - y)
    const passSummary = passes.map((p) => `Pass ${p}`).join('、')
    rows.push({
      rowKey: sessionId,
      staffId: session.staffId,
      staffName: session.staffName,
      sessionDate: session.date,
      dateLabel: formatSchedulingWorksheetDateLabel(session.date),
      timeSlot: session.timeSlot,
      deliveryModeLabel: sessionDeliveryModeLabel(session.capacity),
      activityContentLabel: activityContentForSession(session),
      residentNames,
      passSummary,
    })
  }
  return rows.sort(compareWorksheetRows)
}
