import { uiTokens } from '../../shared/ui/uiTokens'
import type { EndShiftHandoverRecord } from '../types/endShiftHandover'

type Props = {
  submittedHistory: EndShiftHandoverRecord[]
  onSelect: (row: EndShiftHandoverRecord) => void
}

/** PDF 02【6】歷史提交紀錄（唯讀查閱） */
export const EndShiftHandoverHistoryAside = ({ submittedHistory, onSelect }: Props) => (
  <div className={uiTokens.handoverHistoryAside}>
    <h3 className={uiTokens.blockHeading}>歷史紀錄</h3>
    <p className={uiTokens.blockHelp}>最近提交（唯讀）</p>
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
