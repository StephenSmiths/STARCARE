/**
 * **`npm run gatea:evidence:docs-sync`**：批量刷新四份 **`project-completion-*`** **`gatea-*-auto-ref`**；可傳 **`--suppress-closeout-footer`**（供 **`gate-a-evidence-all`** 避免與 **summary** 重複頁尾）。
 * stdout 末段附 **`gateAStandardCloseoutBlockquotes`** 兩行 blockquote（**第一行**併主日誌 **Gate A／stdout** 細列歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**；**第二行** 人工／strict-http／keep=1；**Export 契約**）。細目見 **`docs/gate-a-status-2026-05-06-commands-appendix.md`** **`docs-sync`** 段。
 */
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
