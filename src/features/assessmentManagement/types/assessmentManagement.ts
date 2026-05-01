/** PDF 02【9】評估紀錄：物理／職能版本標籤（骨架） */
export type AssessmentDiscipline = 'PT' | 'OT'

/** 單筆完成紀錄（本地；正式版應入 PostgreSQL） */
export interface AssessmentCompletionRecord {
  id: string
  residentId: string
  residentName: string
  /** 對齊之評估週期錨點（入住日起每 180 日） */
  cycleAnchorDate: string
  discipline: AssessmentDiscipline
  versionLabel: string
  recordedByActorId: string
  completedAt: string
}
