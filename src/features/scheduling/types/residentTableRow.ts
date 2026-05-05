import type { FundingType } from '../../../services/schedulingService'

/** 排班儀表「院友本週次數」表格列（對齊 SCH-07） */
export interface ResidentTableRow {
  id: string
  name: string
  fundingType: FundingType
  weeklyTarget: number
  weeklyCompleted: number
  isUnderTarget: boolean
}
