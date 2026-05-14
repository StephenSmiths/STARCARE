import type { Resident } from '../../residents/types/resident'

/** 乾跑快照衝突節錄列於 UI 之上限（與 `buildSubsidizedRehabTrackSnapshot`／`buildDementiaServiceTrackSnapshot` 一致） */
export const REHAB_TRACK_CONFLICT_SAMPLE_LIMIT = 10

/** PDF 02【8】完成列表列（單一軌道） */
export type RehabActivityTrackRow = {
  id: string
  name: string
  weeklyTarget: number
  weeklyCompleted: number
  isCompliant: boolean
  /** 認知軌道：嚴重度標示 */
  dementiaLevel?: Resident['dementiaLevel']
}

export type RehabActivityTrackSnapshot = {
  trackLabel: string
  cohortCount: number
  sessionCount: number
  compliantCount: number
  assignmentCount: number
  conflictCount: number
  /** 乾跑衝突節錄（`formatSchedulingConflictLine`，至多 `REHAB_TRACK_CONFLICT_SAMPLE_LIMIT` 筆）；與 `conflictCount` 併讀 */
  conflictSampleLines?: readonly string[]
  rows: RehabActivityTrackRow[]
}
