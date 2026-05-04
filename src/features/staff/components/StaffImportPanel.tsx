import { useState } from 'react'
import { useAuthActorId } from '../../auth'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { ImportRunHistoryList } from '../../shared/components/ImportRunHistoryList'
import { useStaffImportDryRun } from '../hooks/useStaffImportDryRun'
import { ImportRunSummaryCard } from '../../shared/components/ImportRunSummaryCard'
import { StaffOverviewPanel } from './StaffOverviewPanel'

export const StaffImportPanel = () => {
  const auditTrail = useAuditTrailList()
  const actorId = useAuthActorId()
  const [showAllErrors, setShowAllErrors] = useState(false)
  const {
    isLoading,
    parseErrors,
    result,
    errorMessage,
    commitMessage,
    lastRunSummary,
    runHistory,
    validateCsv,
    commitValidatedRows,
  } =
    useStaffImportDryRun()

  const allErrors = result?.errors ?? []
  const errors = showAllErrors ? allErrors : allErrors.slice(0, 20)
  const hasHidden = allErrors.length > 20

  return (
    <div className={uiTokens.stackVertical}>
      <StaffOverviewPanel actorId={actorId} />
      <article className={uiTokens.surfaceCard}>
        <div className={uiTokens.layoutFlexBetweenGap2}>
          <h2 className={uiTokens.pageSectionHeading}>員工批量匯入</h2>
          <a className={uiTokens.linkDownload} href="/staff-import-template.csv" download>
            下載 CSV 範本
          </a>
        </div>
        <p className={uiTokens.sectionHelp}>欄位：id(可空), facilityId, displayName, roleType, serviceScope</p>
        <div className={uiTokens.residentImportStepRow}>
          <span className={uiTokens.residentImportStepPill}>1. 上傳 CSV</span>
          <span className={uiTokens.residentImportStepPill}>2. 預檢錯誤</span>
          <span className={uiTokens.residentImportStepPill}>3. 確認匯入</span>
        </div>
        <p className={uiTokens.inlineNoticeWarn}>
          提示：若出現本地格式錯誤（例如欄位缺漏、數值格式錯誤），系統會先停止預檢，請先修正 CSV 後再重試。
        </p>
        <input className={uiTokens.formInputMt3} type="file"
          accept=".csv,text/csv"
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
              <li key={`${item.rowIndex}-${item.message}`}>第 {item.rowIndex} 行：{item.message}</li>
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
                onClick={async () => {
                  await commitValidatedRows(actorId)
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
      </article>
      <AuditTrailPanel
        title="員工與匯入審計（全域）"
        help="含 STAFF_EXPORT、排班／活動相關審計等（PDF 02【13】／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
