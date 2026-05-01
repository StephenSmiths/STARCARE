export type ImportRunStage = 'dry-run' | 'commit'

export type ImportRunSummary = {
  stage: ImportRunStage
  total: number
  success: number
  failed: number
  durationMs: number
  ranAt: string
}
