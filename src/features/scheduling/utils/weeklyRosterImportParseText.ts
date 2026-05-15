import type { ActivitySessionImportRow } from '../../../repositories/activitySessionImportRepository'
import type { Activity } from '../../../repositories/activityRepository'
import { splitCsvLine } from '../../activitySessions/utils/activitySessionCsvParser'
import { ACTIVITY_SESSIONS_WORKSPACE_FACILITY_ID } from '../../activitySessions/constants/activitySessionsWorkspaceDefaults'
import {
  WEEKLY_ROSTER_DEFAULT_CAPACITY,
  WEEKLY_ROSTER_HEADER_DATE,
  WEEKLY_ROSTER_HEADER_END,
  WEEKLY_ROSTER_HEADER_NAME,
  WEEKLY_ROSTER_HEADER_ROLE,
  WEEKLY_ROSTER_HEADER_SCOPE,
  WEEKLY_ROSTER_HEADER_SERVICE,
  WEEKLY_ROSTER_HEADER_START,
  WEEKLY_ROSTER_REQUIRED_HEADERS,
  WEEKLY_ROSTER_SERVICE_TYPE_TO_ACTIVITY_ID,
  WEEKLY_ROSTER_VALID_SERVICE_LABELS,
} from '../constants/weeklyRosterImportConstants'
import { pickWeeklyRosterActivityId } from './weeklyRosterActivityIdPick'

type ParseErr = { rowIndex: number; message: string }

const ROLE_SET = new Set(['PT', 'PTA', 'OT', 'OTA'])

const dateRe = /^\d{4}-\d{2}-\d{2}$/

export const normalizeWeeklyRosterHm = (raw: string): string | null => {
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (!Number.isInteger(h) || !Number.isInteger(min) || h < 0 || h > 23 || min < 0 || min > 59) return null
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

const isValidYmd = (s: string): boolean => {
  if (!dateRe.test(s)) return false
  const d = new Date(`${s}T00:00:00`)
  return !Number.isNaN(d.getTime())
}

export type WeeklyRosterDraftRow = {
  rowIndex: number
  serviceLabel: string
  role: string
  displayName: string
  sessionDate: string
  startHm: string
  endHm: string
  residentScope: string
}

/** 由首頁工作表轉出之 CSV 字串解析週更表列（欄名以中文表頭辨識）。 */
export const parseWeeklyRosterSheetText = (
  text: string,
): { drafts: WeeklyRosterDraftRow[]; errors: ParseErr[] } => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  const errors: ParseErr[] = []
  if (lines.length <= 1) return { drafts: [], errors: [] }

  const headerCells = splitCsvLine(lines[0])
  const col: Record<string, number> = {}
  for (let i = 0; i < headerCells.length; i += 1) {
    const key = headerCells[i].trim()
    if ((WEEKLY_ROSTER_REQUIRED_HEADERS as readonly string[]).includes(key)) col[key] = i
  }
  for (const h of WEEKLY_ROSTER_REQUIRED_HEADERS) {
    if (col[h] === undefined) {
      errors.push({ rowIndex: 1, message: `表頭缺少欄位：${h}` })
      return { drafts: [], errors }
    }
  }

  const drafts: WeeklyRosterDraftRow[] = []
  for (let idx = 1; idx < lines.length; idx += 1) {
    const rowIndex = idx + 1
    const cells = splitCsvLine(lines[idx])
    const g = (name: string) => (cells[col[name]!] ?? '').trim()

    const serviceLabel = g(WEEKLY_ROSTER_HEADER_SERVICE)
    const role = g(WEEKLY_ROSTER_HEADER_ROLE)
    const displayName = g(WEEKLY_ROSTER_HEADER_NAME)
    const sessionDate = g(WEEKLY_ROSTER_HEADER_DATE)
    const startRaw = g(WEEKLY_ROSTER_HEADER_START)
    const endRaw = g(WEEKLY_ROSTER_HEADER_END)
    const residentScope = g(WEEKLY_ROSTER_HEADER_SCOPE)

    if (!serviceLabel) {
      errors.push({ rowIndex, message: '服務類型不可為空' })
      continue
    }
    if (!WEEKLY_ROSTER_VALID_SERVICE_LABELS.includes(serviceLabel)) {
      errors.push({
        rowIndex,
        message: `服務類型須為：${WEEKLY_ROSTER_VALID_SERVICE_LABELS.join('、')}`,
      })
      continue
    }
    if (!role || !ROLE_SET.has(role)) {
      errors.push({ rowIndex, message: '職位須為 PT、PTA、OT、OTA' })
      continue
    }
    if (!displayName) {
      errors.push({ rowIndex, message: '姓名不可為空' })
      continue
    }
    if (!sessionDate || !isValidYmd(sessionDate)) {
      errors.push({ rowIndex, message: '計劃日期須為 yyyy-mm-dd 且為有效日期' })
      continue
    }
    const startHm = normalizeWeeklyRosterHm(startRaw)
    const endHm = normalizeWeeklyRosterHm(endRaw)
    if (!startHm) {
      errors.push({ rowIndex, message: '計劃開始時間須為 hh:mm（24 小時制）' })
      continue
    }
    if (!endHm) {
      errors.push({ rowIndex, message: '計劃結束時間須為 hh:mm（24 小時制）' })
      continue
    }

    drafts.push({
      rowIndex,
      serviceLabel,
      role,
      displayName,
      sessionDate,
      startHm,
      endHm,
      residentScope,
    })
  }
  return { drafts, errors }
}

/** 草稿列＋員工主檔解析為 Edge 預檢用 `ActivitySessionImportRow`。若傳入 `activities`，活動 id 依 PDF 02【3】附錄自目錄∩主檔擇定；否則沿用固定對照表。 */
export const weeklyRosterDraftsToImportRows = (
  drafts: WeeklyRosterDraftRow[],
  staffByNameRole: Map<string, string>,
  activities?: readonly Activity[],
): { rows: ActivitySessionImportRow[]; errors: ParseErr[] } => {
  const rows: ActivitySessionImportRow[] = []
  const errors: ParseErr[] = []
  for (const d of drafts) {
    const key = `${d.displayName.trim()}\t${d.role}`
    const staffProfileId = staffByNameRole.get(key)
    if (!staffProfileId) {
      errors.push({
        rowIndex: d.rowIndex,
        message: `找不到與「${d.displayName}／${d.role}」相符的員工主檔（請確認姓名與職位與系統一致）`,
      })
      continue
    }
    const activityId =
      activities !== undefined && activities.length > 0
        ? pickWeeklyRosterActivityId(
            d.serviceLabel,
            d.role,
            staffProfileId,
            d.sessionDate,
            d.rowIndex,
            activities,
          )
        : WEEKLY_ROSTER_SERVICE_TYPE_TO_ACTIVITY_ID[d.serviceLabel] ?? ''
    rows.push({
      facilityId: ACTIVITY_SESSIONS_WORKSPACE_FACILITY_ID,
      activityId,
      staffProfileId,
      sessionDate: d.sessionDate,
      timeSlot: `${d.startHm}-${d.endHm}`,
      capacity: WEEKLY_ROSTER_DEFAULT_CAPACITY,
      startTime: d.startHm,
      endTime: d.endHm,
      activityDetail: d.residentScope,
    })
  }
  return { rows, errors }
}
