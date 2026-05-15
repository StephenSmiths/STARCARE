/**
 * **`npm run gatea:evidence:decision-sync`**：更新 **`docs/gate-a-decision-draft-2026-05-06.md`** mini 區塊與 **`[updated]`** 列；stdout 於 mini／**`[updated]`** 之後附 **`gateAStandardCloseoutBlockquotes`** 兩行；marker 末行可為 **`gateAAutoRefClosingHintLine()`**（**`scripts/gate-a-markdown-footer.mjs`** **Export 契約**；**`docs/gate-a-status-2026-05-06-commands-appendix.md`** **`decision-sync`** 段）。
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv, gateAStrictHttpEnabled } from './gate-a-env-lib.mjs'
import { gateAAutoRefClosingHintLine, gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'

const evidenceDir = resolve(process.cwd(), 'docs/evidence')
const decisionDraftPath = resolve(process.cwd(), 'docs/gate-a-decision-draft-2026-05-06.md')

const files = readdirSync(evidenceDir, { withFileTypes: true })
  .filter((d) => d.isFile())
  .map((d) => d.name)

const latest = (needle) =>
  files
    .filter((f) => f.includes(needle))
    .sort()
    .at(-1)

const ref = latest('gate-a-decision-ref-')
const fill = latest('gate-a-fill-snippet-')

const line1 = `- decision ref：${ref ? `\`docs/evidence/${ref}\`` : '`<待補 decision ref>`'}`
const line2 = `- fill snippet：${fill ? `\`docs/evidence/${fill}\`` : '`<待補 fill snippet>`'}`
const strictLbl = gateAStrictHttpEnabled(process.argv, buildSpawnBaseEnv()) ? 'ON' : 'OFF'
const line3 = `- HTTP 嚴格取證：${strictLbl}`
const line4 = gateAAutoRefClosingHintLine()
const miniBlock = new RegExp(
  '^- decision ref：[^\\n]*\\n- fill snippet：[^\\n]*\\n- HTTP 嚴格取證：[^\\n]*(?:\\n- \\*\\*全案收尾與指令速查\\*\\*：[^\\n]*)?',
  'm',
)
const replacement = `${line1}\n${line2}\n${line3}\n${line4}`

const original = readFileSync(decisionDraftPath, 'utf8')
const updated = original.replace(miniBlock, replacement)

const changed = updated !== original
if (changed) {
  writeFileSync(decisionDraftPath, updated, 'utf8')
}

const out = [
  `${changed ? '[updated]' : '[skip]'} ${decisionDraftPath}`,
  replacement,
  '',
  ...gateAStandardCloseoutBlockquotes(),
].join('\n')
process.stdout.write(`${out}\n`)
