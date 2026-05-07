import { useState } from 'react'
import type { ResidentImportValidationResult } from '../../../repositories/residentImportRepository'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import { ImportRunHistoryList } from '../../shared/components/ImportRunHistoryList'
import { ImportRunSummaryCard } from '../../shared/components/ImportRunSummaryCard'
import { uiTokens } from '../../shared/ui/uiTokens'

type ParseError = { rowIndex: number; message: string }

export type ResidentsImportDryRunSectionProps = {
  actorId: string
  onImportCommitted: () => void | Promise<void>
  isValidating: boolean
  parseErrors: ParseError[]
  result: ResidentImportValidationResult | null
  errorMessage: string
  commitMessage: string
  lastRunSummary: ImportRunSummary | null
  runHistory: ImportRunSummary[]
  validateCsv: (file: File) => Promise<void>
  commitValidatedRows: (actorId: string) => Promise<void>
}

/** 院友匯入：預檢與確認匯入（Dry-run；PDF 01／業務防連點於 hook） */
export const ResidentsImportDryRunSection = ({
  actorId,
  onImportCommitted,
  isValidating,
  parseErrors,
  result,
  errorMessage,
  commitMessage,
  lastRunSummary,
  runHistory,
  validateCsv,
  commitValidatedRows,
}: ResidentsImportDryRunSectionProps) => {
  const [showAllErrors, setShowAllErrors] = useState(false)

  const visibleErrors = result?.errors ?? []
  const hasHiddenErrors = visibleErrors.length > 20
  const renderErrors = showAllErrors ? visibleErrors : visibleErrors.slice(0, 20)

  return (
    <section className={uiTokens.residentImportSection}>
      <div className={uiTokens.layoutFlexBetweenGap2}>
        <h3 className={uiTokens.blockHeading}>預檢與確認匯入（Dry-run）</h3>
        <a className={uiTokens.linkDownload} href="/residents-import-template.xlsx" download>
          下載 Excel 範本
        </a>
      </div>
      <p className={uiTokens.blockHelp}>
        Excel/CSV 範本已改為中文欄位：中文姓名、床號、區域、性別、年齡、入院日期、下次評估日期、資助類別、
        服務類型、認知障礙症程度、是否Special Care Case、健康狀況、用藥記錄；另含英文姓名與出生日期（支援
        YYYY-MM-DD／YYYY/MM/DD／YYYY年MM月DD日）。
      </p>
      <div className={uiTokens.residentImportStepRow}>
        <span className={uiTokens.residentImportStepPill}>1. 上傳 Excel/CSV</span>
        <span className={uiTokens.residentImportStepPill}>2. 預檢錯誤</span>
        <span className={uiTokens.residentImportStepPill}>3. 確認匯入</span>
      </div>
      <p className={uiTokens.inlineNoticeWarn}>
        提示：若出現本地格式錯誤（例如欄位缺漏、數值格式錯誤），系統會先停止預檢，請先修正檔案後再重試。
      </p>
      <input
        className={uiTokens.formInputMt2}
        type="file"
        accept=".xlsx,.xls,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        disabled={isValidating}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void validateCsv(file)
        }}
      />
      {isValidating ? <p className={uiTokens.textSubtleXsMt2}>預檢中...</p> : null}
      {errorMessage ? <p className={uiTokens.formInlineErrorMt2Xs}>{errorMessage}</p> : null}
      {parseErrors.length > 0 ? (
        <ul className={uiTokens.listDiscError}>
          {parseErrors.map((item) => (
            <li key={`${item.rowIndex}-${item.message}`}>
              第 {item.rowIndex} 行：{item.message}
            </li>
          ))}
        </ul>
      ) : null}
      {result ? (
        <div className={uiTokens.residentDryRunResultShell}>
          <p className={uiTokens.layoutFlexItemsCenterGap2}>
            <span
              className={
                result.errors.length === 0 ? uiTokens.dryRunStatusPillPass : uiTokens.dryRunStatusPillWarn
              }
            >
              {result.errors.length === 0 ? '預檢通過' : '預檢有錯誤'}
            </span>
            預檢結果：總數 {result.summary.total}，可匯入 {result.summary.valid}，錯誤 {result.summary.invalid}
          </p>
          {result.errors.length > 0 ? (
            <>
              <ul className={uiTokens.listDiscErrorTight}>
                {renderErrors.map((item) => (
                  <li key={`${item.rowIndex}-${item.field}-${item.message}`}>
                    第 {item.rowIndex} 行 / {item.field}：{item.message}
                  </li>
                ))}
              </ul>
              {hasHiddenErrors ? (
                <button className={uiTokens.btnCompactMt2} type="button" onClick={() => setShowAllErrors((v) => !v)}>
                  {showAllErrors ? '收合錯誤列表' : `顯示全部錯誤（${visibleErrors.length}）`}
                </button>
              ) : null}
            </>
          ) : (
            <p className={uiTokens.textSuccessSm}>全部資料列通過，下一步可做確認匯入。</p>
          )}
          {result.errors.length === 0 && result.preview.length > 0 ? (
            <button
              className={uiTokens.btnSuccessMt2}
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
      {commitMessage ? <p className={uiTokens.textCommitSuccess}>{commitMessage}</p> : null}
      {lastRunSummary ? <ImportRunSummaryCard summary={lastRunSummary} /> : null}
      <ImportRunHistoryList runs={runHistory} />
    </section>
  )
}
