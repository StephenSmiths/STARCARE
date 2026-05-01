import { uiTokens } from '../../shared/ui/uiTokens'
import type { ShiftStartHandoverRecord } from '../types/shiftStartHandover'

type Props = {
  submittedHistory: ShiftStartHandoverRecord[]
  onSelect: (row: ShiftStartHandoverRecord) => void
}

/** PDF 02【5b】第五步：唯讀歷史查閱 */
export const ShiftStartHandoverHistoryAside = ({ submittedHistory, onSelect }: Props) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
    <h3 className={uiTokens.blockHeading}>⑤ 歷史紀錄</h3>
    <p className="mt-1 text-xs text-slate-600">最近提交（唯讀查閱）</p>
    <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-xs">
      {submittedHistory.length === 0 ? (
        <li className="text-slate-500">尚無紀錄。</li>
      ) : (
        submittedHistory.slice(0, 12).map((row) => (
          <li key={row.id}>
            <button
              type="button"
              className="w-full rounded border border-slate-200 bg-white px-2 py-2 text-left hover:bg-violet-50"
              onClick={() => onSelect(row)}
            >
              <span className="font-medium">{row.shiftDate}</span>
              <span className="mt-1 block text-slate-600">{row.signatureName}</span>
            </button>
          </li>
        ))
      )}
    </ul>
  </div>
)
