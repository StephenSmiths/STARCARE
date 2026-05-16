import { useMemo } from 'react'
import type { SchedulingAssignment, SchedulingSession } from '../../../services/schedulingService'
import { uiTokens } from '../../shared/ui/uiTokens'
import { buildStaffAssignmentWorksheetRows } from '../utils/schedulingAssignmentStaffWorksheet'
import { SchedulingStaffWorksheetRows } from './SchedulingStaffWorksheetRows'

const PHASE1_PREVIEW_NOTE =
  '本期為 Team Lead 預覽（按員工工作表）；確認採用後將於後續版本同步至員工「我的工作計劃」。活動內容現階段依職位目錄匹配（PDF 02【3】§7.2）。'

/** 本次排班指派：員工工作表預覽（PDF 02【3】第一期） */
export const SchedulingAssignmentsList = ({
  assignments,
  previewSessions,
}: {
  assignments: SchedulingAssignment[]
  previewSessions: SchedulingSession[]
}) => {
  const worksheetRows = useMemo(
    () => buildStaffAssignmentWorksheetRows(assignments, previewSessions),
    [assignments, previewSessions],
  )
  const missingSessionCount = assignments.length > 0 && worksheetRows.length === 0

  return (
    <div className={uiTokens.surfaceCardCompact}>
      <h3 className={uiTokens.blockHeading}>本次排班指派（員工工作表預覽）</h3>
      <p className={uiTokens.textSubtleXsMt2}>{PHASE1_PREVIEW_NOTE}</p>
      {assignments.length === 0 ? (
        <p className={uiTokens.sectionHelp}>尚未執行排班，請點選右上角「啟動智能排班」。</p>
      ) : missingSessionCount ? (
        <p className={uiTokens.sectionHelp}>
          無法對照活動時段主檔，請重新載入頁面後再執行智能排班。
        </p>
      ) : (
        <SchedulingStaffWorksheetRows rows={worksheetRows} />
      )}
    </div>
  )
}
