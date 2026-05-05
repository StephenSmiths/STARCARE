import type { Resident } from '../../residents/types/resident'

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
  rows: RehabActivityTrackRow[]
}
