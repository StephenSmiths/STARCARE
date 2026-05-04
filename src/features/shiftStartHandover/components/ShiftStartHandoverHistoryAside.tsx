import { uiTokens } from '../../shared/ui/uiTokens'
import type { ShiftStartHandoverRecord } from '../types/shiftStartHandover'

type Props = {
  submittedHistory: ShiftStartHandoverRecord[]
  onSelect: (row: ShiftStartHandoverRecord) => void
}

/** PDF 02【5b】第五步：唯讀歷史查閱 */
export const ShiftStartHandoverHistoryAside = ({ submittedHistory, onSelect }: Props) => (
  <div className={uiTokens.handoverHistoryAside}>
    <h3 className={uiTokens.blockHeading}>⑤ 歷史紀錄</h3>
    <p className={uiTokens.blockHelp}>最近提交（唯讀查閱）</p>
    <ul className={uiTokens.handoverHistoryScrollList}>
      {submittedHistory.length === 0 ? (
        <li className={uiTokens.textSubtleXs}>尚無紀錄。</li>
      ) : (
        submittedHistory.slice(0, 12).map((row) => (
          <li key={row.id}>
            <button type="button" className={uiTokens.handoverHistoryItemButton} onClick={() => onSelect(row)}>
              <span className={uiTokens.textWeightMedium}>{row.shiftDate}</span>
              <span className={uiTokens.handoverHistorySignatureMeta}>{row.signatureName}</span>
            </button>
          </li>
        ))
      )}
    </ul>
  </div>
)
