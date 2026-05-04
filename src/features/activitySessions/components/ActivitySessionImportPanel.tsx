import { useState, type ChangeEvent } from 'react'
import { useAuth, useAuthActorId } from '../../auth'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { ImportRunHistoryList } from '../../shared/components/ImportRunHistoryList'
import { ImportRunSummaryCard } from '../../shared/components/ImportRunSummaryCard'
import { ActivitySessionListPanel } from './ActivitySessionListPanel'
import { useActivitySessionImportDryRun } from '../hooks/useActivitySessionImportDryRun'

export const ActivitySessionImportPanel = () => {
  const { hasPermission } = useAuth()
  const canMaintainSessions = hasPermission('view:activity-sessions-import')
  const auditTrail = useAuditTrailList()
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
    if (!canMaintainSessions) return
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    await validateCsvText(text)
  }

  const visibleErrors = result?.errors ?? []
  const renderErrors = showAllErrors ? visibleErrors : visibleErrors.slice(0, 20)
  const hasHiddenErrors = visibleErrors.length > 20

  return (
    <div className={uiTokens.stackVertical}>
    <article className={uiTokens.surfaceCard}>
      <header className={uiTokens.layoutMb4}>
        <h2 className={uiTokens.pageSectionHeading}>活動時段批量匯入</h2>
        <p className={uiTokens.sectionHelp}>流程：上傳 CSV {'->'} 預檢 {'->'} 確認匯入</p>
      </header>
      <div className={uiTokens.residentImportSection}>
        <div className={uiTokens.layoutFlexBetweenGap2}>
          <h3 className={uiTokens.blockHeading}>預檢（Dry-run）</h3>
          <a className={uiTokens.linkDownload} href="/activity-sessions-import-template.csv" download>
            下載 CSV 範本
          </a>
        </div>
        <p className={uiTokens.blockHelp}>欄位：id, facilityId, activityId, staffProfileId, sessionDate, timeSlot, capacity</p>
        <p className={uiTokens.inlineNoticeWarn}>
          提示：若出現本地格式錯誤（例如欄位缺漏、數值格式錯誤），系統會先停止預檢，請先修正 CSV 後再重試。
        </p>
        {canMaintainSessions ? (
          <>
            <input
              type="file"
              accept=".csv,text/csv"
              disabled={isBusy}
              onChange={(event) => void onFileChange(event)}
              className={uiTokens.formInputMt3TextXs}
            />
            {isBusy ? <p className={uiTokens.blockHelpMt2}>處理中...</p> : null}
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
                  預檢結果：總數 {result.summary.total}，可匯入 {result.summary.valid}，錯誤 {result.summary.invalid}
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
                      <button type="button" className={uiTokens.btnCompactMt2} onClick={() => setShowAllErrors((prev) => !prev)}>
                        {showAllErrors ? '收合錯誤列表' : `顯示全部錯誤（${visibleErrors.length}）`}
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
                    確認匯入有效資料
                  </button>
                )}
              </div>
            ) : null}
            {commitMessage ? <p className={uiTokens.textCommitSuccess}>{commitMessage}</p> : null}
            {lastRunSummary ? <ImportRunSummaryCard summary={lastRunSummary} /> : null}
            <ImportRunHistoryList runs={runHistory} />
          </>
        ) : (
          <p className={uiTokens.listCalloutAmber}>
            CSV 預檢與確認匯入僅限 TeamLead／Admin（與 Edge 授權一致）；下方仍可檢視活動時段列表。
          </p>
        )}
        <ActivitySessionListPanel actorId={actorId} canMaintainSessions={canMaintainSessions} />
      </div>
    </article>
    <AuditTrailPanel
      title="活動時段與排班審計（全域）"
      help="含活動時段軟刪、排班儲存等審計（PDF 02【3】／Seq 12）。"
      auditTrail={auditTrail}
    />
    </div>
  )
}
