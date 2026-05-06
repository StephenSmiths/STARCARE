import {
  artifacts,
  blockEvidenceIndex,
  blockDailyLog,
  blockTracker,
  blockKickoff,
  syncMarkdownRegion,
} from './gate-a-ref-sync-lib.mjs'
import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'

const suppressCloseoutFooter = process.argv.includes('--suppress-closeout-footer')

const a = artifacts()

syncMarkdownRegion(
  'docs/project-completion-evidence-index-2026-05.md',
  /<!-- gatea-auto-ref:start -->[\s\S]*?<!-- gatea-auto-ref:end -->/m,
  blockEvidenceIndex(a),
)

syncMarkdownRegion(
  'docs/project-completion-daily-log-2026-05.md',
  /<!-- gatea-daily-auto-ref:start -->[\s\S]*?<!-- gatea-daily-auto-ref:end -->/m,
  blockDailyLog(a),
)

syncMarkdownRegion(
  'docs/project-completion-2week-tracker-2026-05-05.md',
  /<!-- gatea-tracker-auto-ref:start -->[\s\S]*?<!-- gatea-tracker-auto-ref:end -->/m,
  blockTracker(a),
)

syncMarkdownRegion(
  'docs/project-completion-kickoff-checklist-2026-05.md',
  /<!-- gatea-kickoff-auto-ref:start -->[\s\S]*?<!-- gatea-kickoff-auto-ref:end -->/m,
  blockKickoff(a),
)

if (!suppressCloseoutFooter) {
  process.stdout.write(['', ...gateAStandardCloseoutBlockquotes()].join('\n') + '\n')
}
