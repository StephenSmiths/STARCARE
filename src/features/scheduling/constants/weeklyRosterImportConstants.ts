/**
 * PDF 02【3】智能排班週更表匯入：客戶欄位與主檔對照（對齊 `activities` seed：資助復康／認知軌分離）。
 * 服務類型字面與 `20260430143000_seed_default_activities`／`20260501140000_seed_dementia_activity` 一致。
 */
export const WEEKLY_ROSTER_HEADER_SERVICE = '服務類型'
export const WEEKLY_ROSTER_HEADER_ROLE = '職位'
export const WEEKLY_ROSTER_HEADER_NAME = '姓名'
export const WEEKLY_ROSTER_HEADER_DATE = '計劃日期'
export const WEEKLY_ROSTER_HEADER_START = '計劃開始時間'
export const WEEKLY_ROSTER_HEADER_END = '計劃結束時間'
export const WEEKLY_ROSTER_HEADER_SCOPE = '負責院友範圍'

export const WEEKLY_ROSTER_REQUIRED_HEADERS = [
  WEEKLY_ROSTER_HEADER_SERVICE,
  WEEKLY_ROSTER_HEADER_ROLE,
  WEEKLY_ROSTER_HEADER_NAME,
  WEEKLY_ROSTER_HEADER_DATE,
  WEEKLY_ROSTER_HEADER_START,
  WEEKLY_ROSTER_HEADER_END,
  WEEKLY_ROSTER_HEADER_SCOPE,
] as const

/** 客戶字面 → `activities.id`（預設各軌第一筆活動主檔） */
export const WEEKLY_ROSTER_SERVICE_TYPE_TO_ACTIVITY_ID: Record<string, string> = {
  資助復康服務: 'activity-rehab-01',
  認知障礙症服務: 'activity-dementia-01',
}

export const WEEKLY_ROSTER_VALID_SERVICE_LABELS = Object.keys(WEEKLY_ROSTER_SERVICE_TYPE_TO_ACTIVITY_ID)

/** 週更表未提供容量時之預設（與舊範本 CSV 小組活動一致） */
export const WEEKLY_ROSTER_DEFAULT_CAPACITY = 6
