import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { buildSpawnBaseEnv, gateAStrictHttpEnabled } from './gate-a-env-lib.mjs'

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

const original = readFileSync(decisionDraftPath, 'utf8')
const updated = original
  .replace(/^- decision ref：.*$/m, line1)
  .replace(/^- fill snippet：.*$/m, line2)
  .replace(/^- HTTP 嚴格取證：.*$/m, line3)

if (updated !== original) {
  writeFileSync(decisionDraftPath, updated, 'utf8')
}

process.stdout.write(`[updated] ${decisionDraftPath}\n${line1}\n${line2}\n${line3}\n`)
