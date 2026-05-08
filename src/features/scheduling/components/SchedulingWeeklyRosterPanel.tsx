import { useState, type ChangeEvent } from 'react'
import { useAuthActorId } from '../../auth'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useActivitySessionImportDryRun } from '../../activitySessions/hooks/useActivitySessionImportDryRun'
import { parseStaffImportFileToCsvText } from '../../staff/utils/parseStaffImportFile'

export interface SchedulingWeeklyRosterPanelProps {
  /** 週更表成功寫入後（清空預覽／重載時段） */
  onCommitSuccess?: () => void
}

/**
 * PDF 02【3】步驟一：導入週更表（Excel／CSV；中文欄位；與活動時段匯入同一預檢／提交鏈；Seq 15）。
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
    validateWeeklyRosterSheetText,
    commitValidatedRows,
  } = useActivitySessionImportDryRun({ onCommitSuccess })

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await parseStaffImportFileToCsvText(file)
    await validateWeeklyRosterSheetText(text)
  }

  const visibleErrors = result?.errors ?? []
  const renderErrors = showAllErrors ? visibleErrors : visibleErrors.slice(0, 15)
  const hasHiddenErrors = visibleErrors.length > 15

  return (
    <div className={uiTokens.surfaceCardCompact}>
      <h3 className={uiTokens.blockHeading}>① 導入週更表（Excel／CSV）</h3>
      <p className={uiTokens.blockHelp}>
        範本為 Excel（.xlsx）；亦支援 .xls／.csv。表頭欄位：服務類型（資助復康服務、認知障礙症服務）、職位（PT／PTA／OT／OTA）、姓名、計劃日期（yyyy-mm-dd）、計劃開始／結束時間（hh:mm）、負責院友範圍。姓名與職位須與員工主檔一致；服務類型將對應預設活動主檔以利排班。
      </p>
      <div className={uiTokens.layoutFlexWrapItemsCenterGap2Mt2}>
        <input
          type="file"
          accept=".xlsx,.xls,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          disabled={isBusy}
          onChange={(event) => void onFileChange(event)}
          className={uiTokens.formInputMaxXsTextXs}
        />
        <a className={uiTokens.linkDownload} href="/scheduling-weekly-roster-import-template.xlsx" download>
          下載 Excel 範本
        </a>
      </div>
      {isBusy ? <p className={uiTokens.blockHelpMt2}>處理中…</p> : null}
      {errorMessage ? <p className={uiTokens.formInlineErrorMt2Xs}>{errorMessage}</p> : null}
      {parseErrors.length > 0 ? (
        <ul className={uiTokens.listDiscError}>
          {parseErrors.map((item) => (
            <li key={`${item.rowIndex}-${item.message}`}>第 {item.rowIndex} 行：{item.message}</li>
          ))}
        </ul>
      ) : null}
      {result ? (
        <div className={uiTokens.residentDryRunResultShell}>
          <p>
            預檢：總數 {result.summary.total}，可匯入 {result.summary.valid}，錯誤 {result.summary.invalid}
          </p>
          {visibleErrors.length > 0 ? (
            <>
              <ul className={uiTokens.listDiscErrorTight}>
                {renderErrors.map((item, index) => (
                  <li key={`${item.rowIndex}-${item.field}-${index}`}>
                    第 {item.rowIndex} 行（{item.field}）：{item.message}
                  </li>
                ))}
              </ul>
              {hasHiddenErrors ? (
                <button type="button" className={uiTokens.btnCompactMt2} onClick={() => setShowAllErrors((v) => !v)}>
                  {showAllErrors ? '收合' : `顯示全部錯誤（${visibleErrors.length}）`}
                </button>
              ) : null}
            </>
          ) : (
            <button
              type="button"
              className={uiTokens.btnSuccessMt2}
              disabled={isBusy || result.preview.length === 0}
              onClick={() => void commitValidatedRows(actorId)}
            >
              確認匯入（寫入時段）
            </button>
          )}
        </div>
      ) : null}
      {commitMessage ? <p className={uiTokens.textCommitSuccess}>{commitMessage}</p> : null}
    </div>
  )
}
