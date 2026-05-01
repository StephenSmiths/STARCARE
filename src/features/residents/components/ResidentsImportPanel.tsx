import { useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useResidentImportDryRun } from '../hooks/useResidentImportDryRun'
import { ImportRunHistoryList } from '../../shared/components/ImportRunHistoryList'
import { ImportRunSummaryCard } from '../../shared/components/ImportRunSummaryCard'

interface ResidentsImportPanelProps {
  actorId: string
  onImportCommitted: () => Promise<void>
}

export const ResidentsImportPanel = ({ actorId, onImportCommitted }: ResidentsImportPanelProps) => {
  const [showAllErrors, setShowAllErrors] = useState(false)
  const {
    isValidating,
    parseErrors,
    result,
    errorMessage,
    commitMessage,
    lastRunSummary,
    runHistory,
    validateCsv,
    commitValidatedRows,
  } = useResidentImportDryRun()

  const visibleErrors = result?.errors ?? []
  const hasHiddenErrors = visibleErrors.length > 20
  const renderErrors = showAllErrors ? visibleErrors : visibleErrors.slice(0, 20)

  return (
    <section className="rounded-md border border-slate-200 p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className={uiTokens.blockHeading}>預檢與確認匯入（Dry-run）</h3>
        <a className={uiTokens.linkDownload} href="/residents-import-template.csv" download>
          下載 CSV 範本
        </a>
      </div>
      <p className="mt-1 text-xs text-slate-600">
        CSV 欄位需含：name, bedNumber, area, gender, age, admissionDate, fundingType, serviceType, dementiaLevel,
        isSpecialCareCase, healthCondition, medicationRecord
      </p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">1. 上傳 CSV</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">2. 預檢錯誤</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">3. 確認匯入</span>
      </div>
      <p className="mt-2 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
        提示：若出現本地格式錯誤（例如欄位缺漏、數值格式錯誤），系統會先停止預檢，請先修正 CSV 後再重試。
      </p>
      <input
        className={`${uiTokens.formInput} mt-2`}
        type="file"
        accept=".csv,text/csv"
        disabled={isValidating}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void validateCsv(file)
        }}
      />
      {isValidating ? <p className="mt-2 text-xs text-slate-500">預檢中...</p> : null}
      {errorMessage ? <p className="mt-2 text-xs text-red-600">{errorMessage}</p> : null}
      {parseErrors.length > 0 ? (
        <ul className="mt-2 list-disc pl-5 text-xs text-red-700">
          {parseErrors.map((item) => (
            <li key={`${item.rowIndex}-${item.message}`}>第 {item.rowIndex} 行：{item.message}</li>
          ))}
        </ul>
      ) : null}
      {result ? (
        <div className="mt-2 rounded bg-slate-50 p-2 text-xs text-slate-700">
          <p className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] ${
                result.errors.length === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {result.errors.length === 0 ? '預檢通過' : '預檢有錯誤'}
            </span>
            預檢結果：總數 {result.summary.total}，可匯入 {result.summary.valid}，錯誤 {result.summary.invalid}
          </p>
          {result.errors.length > 0 ? (
            <>
              <ul className="mt-1 list-disc pl-5 text-red-700">
                {renderErrors.map((item) => (
                  <li key={`${item.rowIndex}-${item.field}-${item.message}`}>
                    第 {item.rowIndex} 行 / {item.field}：{item.message}
                  </li>
                ))}
              </ul>
              {hasHiddenErrors ? (
                <button className={`${uiTokens.btnCompact} mt-2`} type="button" onClick={() => setShowAllErrors((v) => !v)}>
                  {showAllErrors ? '收合錯誤列表' : `顯示全部錯誤（${visibleErrors.length}）`}
                </button>
              ) : null}
            </>
          ) : (
            <p className="mt-1 text-emerald-700">全部資料列通過，下一步可做確認匯入。</p>
          )}
          {result.errors.length === 0 && result.preview.length > 0 ? (
            <button
              className={`${uiTokens.btnSuccess} mt-2`}
              type="button"
              disabled={isValidating}
              onClick={async () => {
                await commitValidatedRows(actorId)
                await onImportCommitted()
                document.getElementById('residents-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              確認匯入有效資料
            </button>
          ) : null}
        </div>
      ) : null}
      {commitMessage ? <p className="mt-2 text-xs text-emerald-700">{commitMessage}</p> : null}
      {lastRunSummary ? <ImportRunSummaryCard summary={lastRunSummary} /> : null}
      <ImportRunHistoryList runs={runHistory} />
    </section>
  )
}
