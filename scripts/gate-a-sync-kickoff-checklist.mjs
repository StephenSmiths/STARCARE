import { artifacts, blockKickoff, syncMarkdownRegion } from './gate-a-ref-sync-lib.mjs'

syncMarkdownRegion(
  'docs/project-completion-kickoff-checklist-2026-05.md',
  /<!-- gatea-kickoff-auto-ref:start -->[\s\S]*?<!-- gatea-kickoff-auto-ref:end -->/m,
  blockKickoff(artifacts()),
)
