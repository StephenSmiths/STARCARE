/**
 * 同步 **`docs/project-completion-kickoff-checklist-2026-05.md`** **`gatea-kickoff-auto-ref`**；stdout 末段附 **`gateAStandardCloseoutBlockquotes`** 兩行（**Export 契約**；路徑同上歸檔檔）。與 **`gate-a-sync-all-markdown.mjs`** 併讀。
 */
import { artifacts, blockKickoff, syncMarkdownRegion } from './gate-a-ref-sync-lib.mjs'
import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'

syncMarkdownRegion(
  'docs/project-completion-kickoff-checklist-2026-05.md',
  /<!-- gatea-kickoff-auto-ref:start -->[\s\S]*?<!-- gatea-kickoff-auto-ref:end -->/m,
  blockKickoff(artifacts()),
)

process.stdout.write(['', ...gateAStandardCloseoutBlockquotes()].join('\n') + '\n')
