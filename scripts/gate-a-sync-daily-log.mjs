import { artifacts, blockDailyLog, syncMarkdownRegion } from './gate-a-ref-sync-lib.mjs'
import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'

syncMarkdownRegion(
  'docs/project-completion-daily-log-2026-05.md',
  /<!-- gatea-daily-auto-ref:start -->[\s\S]*?<!-- gatea-daily-auto-ref:end -->/m,
  blockDailyLog(artifacts()),
)

process.stdout.write(['', ...gateAStandardCloseoutBlockquotes()].join('\n') + '\n')
