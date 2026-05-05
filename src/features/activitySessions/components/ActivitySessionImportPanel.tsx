import { useAuth, useAuthActorId } from '../../auth'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { ActivitySessionImportDryRunCard } from './ActivitySessionImportDryRunCard'
import { useActivitySessionImportDryRun } from '../hooks/useActivitySessionImportDryRun'

export const ActivitySessionImportPanel = () => {
  const { hasPermission } = useAuth()
  const canMaintainSessions = hasPermission('view:activity-sessions-import')
  const auditTrail = useAuditTrailList()
  const actorId = useAuthActorId()
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
  } = useActivitySessionImportDryRun()

  return (
    <div className={uiTokens.stackVertical}>
      <ActivitySessionImportDryRunCard
        canMaintainSessions={canMaintainSessions}
        actorId={actorId}
        isBusy={isBusy}
        errorMessage={errorMessage}
        parseErrors={parseErrors}
        result={result}
        commitMessage={commitMessage}
        lastRunSummary={lastRunSummary}
        runHistory={runHistory}
        validateCsvText={validateCsvText}
        commitValidatedRows={commitValidatedRows}
      />
      <AuditTrailPanel
        title="活動時段與排班審計（全域）"
        help="含活動時段軟刪、排班儲存等審計（PDF 02【3】／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
