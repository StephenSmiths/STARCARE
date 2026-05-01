import { useState, type ChangeEvent } from 'react'
import { useAuthActorId } from '../../auth'
import { uiTokens } from '../../shared/ui/uiTokens'
import { ImportRunHistoryList } from '../../shared/components/ImportRunHistoryList'
import { ImportRunSummaryCard } from '../../shared/components/ImportRunSummaryCard'
import { ActivitySessionListPanel } from './ActivitySessionListPanel'
import { useActivitySessionImportDryRun } from '../hooks/useActivitySessionImportDryRun'

export const ActivitySessionImportPanel = () => {
  const actorId = useAuthActorId()
  const [showAllErrors, setShowAllErrors] = useState(false)
  const {
    isBusy,
    errorMessage,
    parseErrors,
    result,
    commitMessage,
    lastRunSummary,
    runHistory,
    validateCsvText,
    commitValidatedRows,
  } =
    useActivitySessionImportDryRun()

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    await validateCsvText(text)
  }

  const visibleErrors = result?.errors ?? []
  const renderErrors = showAllErrors ? visibleErrors : visibleErrors.slice(0, 20)
  const hasHiddenErrors = visibleErrors.length > 20

  return (
    <article className={uiTokens.surfaceCard}>
      <header className="mb-4">
        <h2 className={uiTokens.pageSectionHeading}>活動時段批量匯入</h2>
        <p className={uiTokens.sectionHelp}>流程：上傳 CSV {'->'} 預檢 {'->'} 確認匯入</p>
      </header>
      <div className="rounded-md border border-slate-200 p-3 text-sm">
        <div className="flex items-center justify-between gap-2">
          <h3 className={uiTokens.blockHeading}>預檢（Dry-run）</h3>
          <a className={uiTokens.linkDownload} href="/activity-sessions-import-template.csv" download>
            下載 CSV 範本
          </a>
        </div>
        <p className="mt-1 text-xs text-slate-600">
          欄位：id, facilityId, activityId, staffProfileId, sessionDate, timeSlot, capacity
        </p>
        <p className="mt-2 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
          提示：若出現本地格式錯誤（例如欄位缺漏、數值格式錯誤），系統會先停止預檢，請先修正 CSV 後再重試。
        </p>
        <input
          type="file"
          accept=".csv,text/csv"
          disabled={isBusy}
          onChange={(event) => void onFileChange(event)}
          className={`${uiTokens.formInput} mt-3 text-xs`}
        />
        {isBusy ? <p className="mt-2 text-xs text-slate-600">處理中...</p> : null}
        {errorMessage ? <p className="mt-2 text-xs text-red-700">{errorMessage}</p> : null}
        {parseErrors.length > 0 ? (
          <ul className="mt-2 list-disc pl-5 text-xs text-red-700">
            {parseErrors.map((item) => (
              <li key={`${item.rowIndex}-${item.message}`}>第 {item.rowIndex} 行：{item.message}</li>
            ))}
          </ul>
        ) : null}
        {result ? (
          <div className="mt-3 rounded bg-slate-50 p-2 text-xs text-slate-700">
            <p>
              預檢結果：總數 {result.summary.total}，可匯入 {result.summary.valid}，錯誤 {result.summary.invalid}
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
                  <button type="button" className={`${uiTokens.btnCompact} mt-2`} onClick={() => setShowAllErrors((prev) => !prev)}>
                    {showAllErrors ? '收合錯誤列表' : `顯示全部錯誤（${visibleErrors.length}）`}
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
                確認匯入有效資料
              </button>
            )}
          </div>
        ) : null}
        {commitMessage ? <p className="mt-2 text-xs text-emerald-700">{commitMessage}</p> : null}
        {lastRunSummary ? <ImportRunSummaryCard summary={lastRunSummary} /> : null}
        <ImportRunHistoryList runs={runHistory} />
        <ActivitySessionListPanel actorId={actorId} />
      </div>
    </article>
  )
}
