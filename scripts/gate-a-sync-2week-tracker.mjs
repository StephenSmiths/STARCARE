/**
 * 同步 **`docs/project-completion-2week-tracker-2026-05-05.md`** **`gatea-tracker-auto-ref`**；stdout 末段附 **`gateAStandardCloseoutBlockquotes`** 兩行（**Export 契約**；路徑同上歸檔檔）。與 **`gate-a-sync-all-markdown.mjs`** 併讀。
 */
import { artifacts, blockTracker, syncMarkdownRegion } from './gate-a-ref-sync-lib.mjs'
import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'

syncMarkdownRegion(
  'docs/project-completion-2week-tracker-2026-05-05.md',
  /<!-- gatea-tracker-auto-ref:start -->[\s\S]*?<!-- gatea-tracker-auto-ref:end -->/m,
  blockTracker(artifacts()),
)

process.stdout.write(['', ...gateAStandardCloseoutBlockquotes()].join('\n') + '\n')
