import { useState } from 'react'
import type { StaffImportValidationResult } from '../../../repositories/staffImportRepository'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import { ImportRunHistoryList } from '../../shared/components/ImportRunHistoryList'
import { ImportRunSummaryCard } from '../../shared/components/ImportRunSummaryCard'
import { uiTokens } from '../../shared/ui/uiTokens'

type ParseError = { rowIndex: number; message: string }

export type StaffImportDryRunCardProps = {
  actorId: string
  isLoading: boolean
  parseErrors: ParseError[]
  result: StaffImportValidationResult | null
  errorMessage: string
  commitMessage: string
  lastRunSummary: ImportRunSummary | null
  runHistory: ImportRunSummary[]
  validateCsv: (file: File) => Promise<void>
  commitValidatedRows: (actorId: string) => Promise<void>
}

/** PDF 02【13】員工批量匯入：Excel／CSV 預檢與確認（防連點於 hook） */
export const StaffImportDryRunCard = ({
  actorId,
  isLoading,
  parseErrors,
  result,
  errorMessage,
  commitMessage,
  lastRunSummary,
  runHistory,
  validateCsv,
  commitValidatedRows,
}: StaffImportDryRunCardProps) => {
  const [showAllErrors, setShowAllErrors] = useState(false)

  const allErrors = result?.errors ?? []
  const errors = showAllErrors ? allErrors : allErrors.slice(0, 20)
  const hasHidden = allErrors.length > 20

  return (
    <article className={uiTokens.surfaceCard}>
      <div className={uiTokens.layoutFlexBetweenGap2}>
        <h2 className={uiTokens.pageSectionHeading}>員工批量匯入</h2>
        <div className={uiTokens.layoutFlexItemsCenterGap2}>
          <a className={uiTokens.linkDownload} href="/staff-import-template.xlsx" download>
            下載 Excel 範本
          </a>
          <a className={uiTokens.linkDownload} href="/staff-import-template.csv" download>
            下載 CSV 範本
          </a>
        </div>
      </div>
      <p className={uiTokens.sectionHelp}>
        支援上傳 CSV 與 Excel（.csv/.xlsx/.xls）。欄位：員工編號（可空）、姓名、職位（PT／PTA／OT／OTA）、性別（男／女）、聯絡電話、電子郵箱。院舍與服務範圍由系統預設，無須填寫。
      </p>
      <div className={uiTokens.residentImportStepRow}>
        <span className={uiTokens.residentImportStepPill}>1. 上傳檔案</span>
        <span className={uiTokens.residentImportStepPill}>2. 預檢錯誤</span>
        <span className={uiTokens.residentImportStepPill}>3. 確認匯入</span>
      </div>
      <p className={uiTokens.inlineNoticeWarn}>
        提示：若出現本地格式錯誤（例如欄位缺漏、數值格式錯誤），系統會先停止預檢，請先修正後再重試。亦相容舊版英文 CSV 表頭。
      </p>
      <input
        className={uiTokens.formInputMt3}
        type="file"
        accept=".xlsx,.xls,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        disabled={isLoading}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void validateCsv(file)
        }}
      />
      {isLoading ? <p className={uiTokens.textSubtleXsMt2}>處理中...</p> : null}
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
            <span className={allErrors.length === 0 ? uiTokens.dryRunStatusPillPass : uiTokens.dryRunStatusPillWarn}>
              {allErrors.length === 0 ? '預檢通過' : '預檢有錯誤'}
            </span>
            預檢結果：總數 {result.summary.total}，可匯入 {result.summary.valid}，錯誤 {result.summary.invalid}
          </p>
          {allErrors.length > 0 ? (
            <>
              <ul className={uiTokens.listDiscErrorTight}>
                {errors.map((item) => (
                  <li key={`${item.rowIndex}-${item.field}-${item.message}`}>
                    第 {item.rowIndex} 行 / {item.field}：{item.message}
                  </li>
                ))}
              </ul>
              {hasHidden ? (
                <button className={uiTokens.btnCompactMt2} type="button" onClick={() => setShowAllErrors((v) => !v)}>
                  {showAllErrors ? '收合錯誤列表' : `顯示全部錯誤（${allErrors.length}）`}
                </button>
              ) : null}
            </>
          ) : (
            <p className={uiTokens.textSuccessSm}>全部資料列通過，下一步可做確認匯入。</p>
          )}
          {allErrors.length === 0 && result.preview.length > 0 ? (
            <button
              className={uiTokens.btnSuccessMt2}
              type="button"
              disabled={isLoading}
              onClick={() => void commitValidatedRows(actorId)}
            >
              確認匯入有效資料
            </button>
          ) : null}
        </div>
      ) : null}
      {commitMessage ? <p className={uiTokens.textCommitSuccess}>{commitMessage}</p> : null}
      {lastRunSummary ? <ImportRunSummaryCard summary={lastRunSummary} /> : null}
      <ImportRunHistoryList runs={runHistory} />
    </article>
  )
}
