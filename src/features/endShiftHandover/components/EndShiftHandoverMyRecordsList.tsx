import { uiTokens } from '../../shared/ui/uiTokens'
import type { EndShiftHandoverRecord } from '../types/endShiftHandover'

/** 我的交更草稿與紀錄（列表載入／檢視） */
export const EndShiftHandoverMyRecordsList = ({
  records,
  onLoadRow,
}: {
  records: EndShiftHandoverRecord[]
  onLoadRow: (row: EndShiftHandoverRecord) => void
}) => (
  <div className={uiTokens.layoutSpacerMt8}>
    <h3 className={uiTokens.blockHeading}>我的草稿與紀錄</h3>
    {records.length === 0 ? (
      <p className={uiTokens.recordsEmptyHint}>尚無紀錄。</p>
    ) : (
      <ul className={uiTokens.myFormsList}>
        {records.map((row) => (
          <li key={row.id} className={uiTokens.myFormsListRow}>
            <div>
              <span className={uiTokens.textWeightMedium}>{row.shiftDate}</span>
              <span className={uiTokens.metaChipMl2}>{row.status === 'DRAFT' ? '草稿' : '已提交'}</span>
            </div>
            <button type="button" className={uiTokens.linkDownload} onClick={() => onLoadRow(row)}>
              {row.status === 'SUBMITTED' ? '檢視' : '載入'}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
)
