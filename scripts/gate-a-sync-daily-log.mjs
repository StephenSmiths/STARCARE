/**
 * 同步 **`docs/project-completion-daily-log-2026-05.md`** **`gatea-daily-auto-ref`**；stdout 末段附 **`gateAStandardCloseoutBlockquotes`** 兩行（**第一行** stdout 歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**；**第二行** 人工／strict-http／keep=1；**Export 契約**）。與 **`gate-a-sync-all-markdown.mjs`**、**`npm run gatea:evidence:docs-sync`** 併讀。
 */
import { artifacts, blockDailyLog, syncMarkdownRegion } from './gate-a-ref-sync-lib.mjs'
import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'

syncMarkdownRegion(
  'docs/project-completion-daily-log-2026-05.md',
  /<!-- gatea-daily-auto-ref:start -->[\s\S]*?<!-- gatea-daily-auto-ref:end -->/m,
  blockDailyLog(artifacts()),
)

process.stdout.write(['', ...gateAStandardCloseoutBlockquotes()].join('\n') + '\n')
