import type { ConflictType, SchedulingConflict } from './schedulingService'

/** 排班衝突類型之簡短中文標籤（PDF 01 §3／02【16】；供 UI 與報表一致呈現） */
export const schedulingConflictTypeLabel = (type: ConflictType): string => {
  switch (type) {
    case 'NO_CAPACITY':
      return '容量已滿'
    case 'DAILY_LIMIT':
      return '同日服務上限'
    case 'INTERVAL_LIMIT':
      return '相鄰日間隔'
    case 'STAFF_SLOT_DUPLICATED':
      return '員工時段重複'
    case 'SKILL_MISMATCH':
      return '技能／職類不符'
    case 'NO_ELIGIBLE_SESSION':
      return '無可用時段'
    case 'STAFF_GROUP_DAILY_CAP':
      return '小組活動每日場次上限'
  }
}

/** 單筆衝突一行文案（院友名＋類型標籤＋引擎理由） */
export const formatSchedulingConflictLine = (c: SchedulingConflict): string =>
  `${c.residentName}：${schedulingConflictTypeLabel(c.type)}（${c.reason}）`
