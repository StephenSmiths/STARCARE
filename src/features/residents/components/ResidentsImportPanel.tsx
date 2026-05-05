import { useResidentImportDryRun } from '../hooks/useResidentImportDryRun'
import { ResidentsImportDryRunSection } from './ResidentsImportDryRunSection'

interface ResidentsImportPanelProps {
  actorId: string
  onImportCommitted: () => void | Promise<void>
}

export const ResidentsImportPanel = ({ actorId, onImportCommitted }: ResidentsImportPanelProps) => {
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

  return (
    <ResidentsImportDryRunSection
      actorId={actorId}
      onImportCommitted={onImportCommitted}
      isValidating={isValidating}
      parseErrors={parseErrors}
      result={result}
      errorMessage={errorMessage}
      commitMessage={commitMessage}
      lastRunSummary={lastRunSummary}
      runHistory={runHistory}
      validateCsv={validateCsv}
      commitValidatedRows={commitValidatedRows}
    />
  )
}
