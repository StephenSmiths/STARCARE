import { artifacts, blockDailyLog, syncMarkdownRegion } from './gate-a-ref-sync-lib.mjs'

syncMarkdownRegion(
  'docs/project-completion-daily-log-2026-05.md',
  /<!-- gatea-daily-auto-ref:start -->[\s\S]*?<!-- gatea-daily-auto-ref:end -->/m,
  blockDailyLog(artifacts()),
)
