import type { StarcareRole } from '../../auth/permissions'
import { uiTokens } from '../../shared/ui/uiTokens'

type Props = {
  role: StarcareRole
  lastBatchId: string | null
  isUndoing: boolean
  onUndo: () => void | Promise<void>
}

/** 01 §5／Seq 10：scheduling_history 批次軟刪入口（TeamLead／Admin） */
export const SchedulingHistoryUndoPanel = ({ role, lastBatchId, isUndoing, onUndo }: Props) => {
  if (role === 'Staff') {
    return (
      <section className={`${uiTokens.surfaceCardCompact} border-slate-100 bg-slate-50`}>
        <p className="text-xs text-slate-600">
          排班歷史批次撤銷僅 TeamLead／Admin 可操作（01 §5）；若誤存請聯絡組長。
        </p>
      </section>
    )
  }
  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h3 className={uiTokens.blockHeading}>排班歷史（批次軟刪）</h3>
      <p className="mt-1 text-xs text-slate-600">
        成功「一鍵儲存」後，本瀏覽器分頁會記住該次 batch id。可將該批次寫入之{' '}
        <span className="font-mono text-[11px]">scheduling_history</span> 標為已刪除（不影響其他批次）。
      </p>
      <p className="mt-2 font-mono text-[11px] text-slate-500 break-all">
        上次 batch：{lastBatchId ?? '（尚無，請先成功儲存）'}
      </p>
      <button
        type="button"
        className={`${uiTokens.btnDangerOutline} mt-3`}
        disabled={!lastBatchId || isUndoing}
        onClick={() => void onUndo()}
      >
        {isUndoing ? '處理中…' : '軟刪除上次儲存批次'}
      </button>
    </section>
  )
}
