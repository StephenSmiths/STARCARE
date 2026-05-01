interface SchedulingSavePanelProps {
  canSave: boolean
  hasConflicts: boolean
  isSaving: boolean
  onSave: () => void
}

/** 確認排班結果後之一鍵儲存（無衝突時才可寫入 scheduling_history） */
export const SchedulingSavePanel = ({ canSave, hasConflicts, isSaving, onSave }: SchedulingSavePanelProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-800">資料閉環：儲存至後端</h3>
        <p className="mt-1 text-xs text-slate-500">
          {hasConflicts
            ? '目前存在排班衝突，請勿儲存。請調整後重新執行智能排班。'
            : '須無衝突且已有指派時，方可批量寫入 scheduling_history 並觸發審計軌跡。'}
        </p>
      </div>
      <button
        type="button"
        disabled={!canSave || isSaving || hasConflicts}
        onClick={onSave}
        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? '儲存中…' : '一鍵儲存排班結果'}
      </button>
    </div>
  )
}
