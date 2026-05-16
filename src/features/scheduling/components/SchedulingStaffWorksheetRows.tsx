import type { StaffAssignmentWorksheetRow } from '../utils/schedulingAssignmentStaffWorksheet'
import { uiTokens } from '../../shared/ui/uiTokens'

/** 員工工作表預覽列（第一期 TL；PDF 02【3】） */
export const SchedulingStaffWorksheetRows = ({ rows }: { rows: StaffAssignmentWorksheetRow[] }) => (
  <ul className={uiTokens.schedulingAssignmentList}>
    {rows.map((row) => (
      <li key={row.rowKey} className={`${uiTokens.layoutListItemPy2} border-b border-slate-100 last:border-0`}>
        <p className={uiTokens.reviewQueueTitle}>
          {row.staffName} · {row.dateLabel} · {row.timeSlot}
        </p>
        <p className={uiTokens.textSubtleXsMt2}>
          {row.deliveryModeLabel} · {row.activityContentLabel}
        </p>
        <p className={uiTokens.textSubtleXsMt2}>
          參與院友：{row.residentNames.length > 0 ? row.residentNames.join('、') : '—'}
        </p>
        <p className={uiTokens.textSubtleXsMl2Slate400}>{row.passSummary}</p>
      </li>
    ))}
  </ul>
)
