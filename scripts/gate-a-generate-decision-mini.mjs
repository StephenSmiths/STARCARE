/**
 * 判定稿快速 stdout 四行：ref／snippet／HTTP 嚴格／**`gateAAutoRefClosingHintLine()`**；刻意不附 **`gateAStandardCloseoutBlockquotes`**，避免與第四行速查重複。
 */
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv, gateAStrictHttpEnabled } from './gate-a-env-lib.mjs'
import { gateAAutoRefClosingHintLine } from './gate-a-markdown-footer.mjs'

const dir = resolve(process.cwd(), 'docs/evidence')
const files = readdirSync(dir, { withFileTypes: true })
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

process.stdout.write(`${line1}\n${line2}\n${line3}\n${line4}\n`)
