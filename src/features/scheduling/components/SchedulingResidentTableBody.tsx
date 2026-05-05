import { uiTokens } from '../../shared/ui/uiTokens'
import type { ResidentTableRow } from '../types/residentTableRow'
import { residentFundingBadgeClass, residentFundingLabel } from '../utils/residentTableFundingPresentation'

export type SchedulingResidentTableBodyProps = {
  pagedRows: ResidentTableRow[]
}

/** 排班院友表資料列（未達標列淡紅底） */
export const SchedulingResidentTableBody = ({ pagedRows }: SchedulingResidentTableBodyProps) => (
  <div className={uiTokens.residentTableBodyScroll}>
    <table className={uiTokens.residentTableData}>
      <thead className={uiTokens.residentTableHeadStickyZ}>
        <tr>
          <th className={uiTokens.residentTableCellLg}>院友姓名</th>
          <th className={uiTokens.residentTableCellLg}>資助類別</th>
          <th className={uiTokens.residentTableCellLg}>週目標</th>
          <th className={uiTokens.residentTableCellLg}>本週已完成</th>
          <th className={uiTokens.residentTableCellLg}>狀態</th>
        </tr>
      </thead>
      <tbody className={uiTokens.tableBodyDivideSlate100}>
        {pagedRows.map((row) => (
          <tr
            key={row.id}
            className={row.isUnderTarget ? uiTokens.residentTableRowUnderTarget : uiTokens.residentTableRowDefault}
          >
            <td className={uiTokens.residentTableCellLgStrong}>{row.name}</td>
            <td className={uiTokens.residentTableCellLg}>
              <span className={residentFundingBadgeClass(row.fundingType)}>
                {residentFundingLabel(row.fundingType)}
              </span>
            </td>
            <td className={uiTokens.residentTableCellLgMuted}>{row.weeklyTarget}</td>
            <td className={uiTokens.residentTableCellLgMuted}>{row.weeklyCompleted}</td>
            <td className={uiTokens.residentTableCellLg}>
              {row.isUnderTarget ? (
                <span className={uiTokens.rosterStatusUnderTarget}>待補齊</span>
              ) : (
                <span className={uiTokens.rosterStatusMet}>已達標</span>
              )}
            </td>
          </tr>
        ))}
        {pagedRows.length === 0 ? (
          <tr>
            <td colSpan={5} className={uiTokens.residentTableEmptyCell}>
              沒有符合條件的資料
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  </div>
)
