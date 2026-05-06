import { artifacts, blockKickoff, syncMarkdownRegion } from './gate-a-ref-sync-lib.mjs'
import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'

syncMarkdownRegion(
  'docs/project-completion-kickoff-checklist-2026-05.md',
  /<!-- gatea-kickoff-auto-ref:start -->[\s\S]*?<!-- gatea-kickoff-auto-ref:end -->/m,
  blockKickoff(artifacts()),
)

process.stdout.write(['', ...gateAStandardCloseoutBlockquotes()].join('\n') + '\n')
