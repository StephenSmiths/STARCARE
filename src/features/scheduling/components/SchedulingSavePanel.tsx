import { uiTokens } from '../../shared/ui/uiTokens'

interface SchedulingSavePanelProps {
  canSave: boolean
  hasConflicts: boolean
  isSaving: boolean
  onSave: () => void
}

/** 確認排班結果後之一鍵儲存（無衝突時才可寫入 scheduling_history） */
export const SchedulingSavePanel = ({ canSave, hasConflicts, isSaving, onSave }: SchedulingSavePanelProps) => {
  return (
    <div className={uiTokens.schedulingSavePanelShell}>
      <div>
        <h3 className={uiTokens.blockHeading}>資料閉環：儲存至後端</h3>
        <p className={uiTokens.blockHelp}>
          {hasConflicts
            ? '目前存在排班衝突，請勿儲存。請調整後重新執行智能排班。'
            : '須無衝突且已有指派時，方可批量寫入 scheduling_history 並觸發審計軌跡。'}
        </p>
      </div>
      <button
        type="button"
        disabled={!canSave || isSaving || hasConflicts}
        onClick={onSave}
        className={uiTokens.schedulingSavePrimaryButton}
      >
        {isSaving ? '儲存中…' : '一鍵儲存排班結果'}
      </button>
    </div>
  )
}
