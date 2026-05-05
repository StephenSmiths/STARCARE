import { useAuthActorId } from '../../auth'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useStaffImportDryRun } from '../hooks/useStaffImportDryRun'
import { StaffImportDryRunCard } from './StaffImportDryRunCard'
import { StaffOverviewPanel } from './StaffOverviewPanel'

export const StaffImportPanel = () => {
  const auditTrail = useAuditTrailList()
  const actorId = useAuthActorId()
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
  } = useStaffImportDryRun()

  return (
    <div className={uiTokens.stackVertical}>
      <StaffOverviewPanel actorId={actorId} />
      <StaffImportDryRunCard
        actorId={actorId}
        isLoading={isLoading}
        parseErrors={parseErrors}
        result={result}
        errorMessage={errorMessage}
        commitMessage={commitMessage}
        lastRunSummary={lastRunSummary}
        runHistory={runHistory}
        validateCsv={validateCsv}
        commitValidatedRows={commitValidatedRows}
      />
      <AuditTrailPanel
        title="員工與匯入審計（全域）"
        help="含 STAFF_EXPORT、排班／活動相關審計等（PDF 02【13】／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
