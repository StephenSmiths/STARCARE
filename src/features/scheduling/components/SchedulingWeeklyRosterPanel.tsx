import { useState, type ChangeEvent } from 'react'
import { useAuthActorId } from '../../auth'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useActivitySessionImportDryRun } from '../../activitySessions/hooks/useActivitySessionImportDryRun'

export interface SchedulingWeeklyRosterPanelProps {
  /** 週更表成功寫入後（清空預覽／重載時段） */
  onCommitSuccess?: () => void
}

/**
 * PDF 02【3】步驟一：週更表 CSV（與活動時段匯入同一預檢／提交鏈；Seq 15）。
 */
export const SchedulingWeeklyRosterPanel = ({ onCommitSuccess }: SchedulingWeeklyRosterPanelProps) => {
  const actorId = useAuthActorId()
  const [showAllErrors, setShowAllErrors] = useState(false)
  const {
    isBusy,
    errorMessage,
    parseErrors,
    result,
    commitMessage,
    validateCsvText,
    commitValidatedRows,
  } = useActivitySessionImportDryRun({ onCommitSuccess })

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    await validateCsvText(text)
  }

  const visibleErrors = result?.errors ?? []
  const renderErrors = showAllErrors ? visibleErrors : visibleErrors.slice(0, 15)
  const hasHiddenErrors = visibleErrors.length > 15

  return (
    <div className={`${uiTokens.surfaceCardCompact}`}>
      <h3 className={uiTokens.blockHeading}>① 導入週更表（活動時段 CSV）</h3>
      <p className={`${uiTokens.blockHelp}`}>
        欄位：id, facilityId, activityId, staffProfileId, sessionDate, timeSlot, capacity。亦可於「活動時段匯入」頁維護同一批資料。
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          type="file"
          accept=".csv,text/csv"
          disabled={isBusy}
          onChange={(event) => void onFileChange(event)}
          className={`${uiTokens.formInput} max-w-xs text-xs`}
        />
        <a className={uiTokens.linkDownload} href="/activity-sessions-import-template.csv" download>
          下載範本
        </a>
      </div>
      {isBusy ? <p className="mt-2 text-xs text-slate-600">處理中…</p> : null}
      {errorMessage ? <p className="mt-2 text-xs text-red-700">{errorMessage}</p> : null}
      {parseErrors.length > 0 ? (
        <ul className="mt-2 list-disc pl-5 text-xs text-red-700">
          {parseErrors.map((item) => (
            <li key={`${item.rowIndex}-${item.message}`}>第 {item.rowIndex} 行：{item.message}</li>
          ))}
        </ul>
      ) : null}
      {result ? (
        <div className="mt-3 rounded border border-slate-100 bg-slate-50 p-2 text-xs text-slate-700">
          <p>
            預檢：總數 {result.summary.total}，可匯入 {result.summary.valid}，錯誤 {result.summary.invalid}
          </p>
          {visibleErrors.length > 0 ? (
            <>
              <ul className="mt-1 list-disc pl-5 text-red-700">
                {renderErrors.map((item, index) => (
                  <li key={`${item.rowIndex}-${item.field}-${index}`}>
                    第 {item.rowIndex} 行（{item.field}）：{item.message}
                  </li>
                ))}
              </ul>
              {hasHiddenErrors ? (
                <button type="button" className={`${uiTokens.btnCompact} mt-2`} onClick={() => setShowAllErrors((v) => !v)}>
                  {showAllErrors ? '收合' : `顯示全部錯誤（${visibleErrors.length}）`}
                </button>
              ) : null}
            </>
          ) : (
            <button
              type="button"
              className={`${uiTokens.btnSuccess} mt-2`}
              disabled={isBusy || result.preview.length === 0}
              onClick={() => void commitValidatedRows(actorId)}
            >
              確認匯入（寫入時段）
            </button>
          )}
        </div>
      ) : null}
      {commitMessage ? <p className="mt-2 text-xs text-emerald-800">{commitMessage}</p> : null}
    </div>
  )
}
