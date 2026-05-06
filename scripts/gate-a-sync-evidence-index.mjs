import {
  artifacts,
  blockEvidenceIndex,
  syncMarkdownRegion,
} from './gate-a-ref-sync-lib.mjs'
import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'

syncMarkdownRegion(
  'docs/project-completion-evidence-index-2026-05.md',
  /<!-- gatea-auto-ref:start -->[\s\S]*?<!-- gatea-auto-ref:end -->/m,
  blockEvidenceIndex(artifacts()),
)

process.stdout.write(['', ...gateAStandardCloseoutBlockquotes()].join('\n') + '\n')
