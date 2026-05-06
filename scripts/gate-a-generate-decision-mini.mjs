import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

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

process.stdout.write(`${line1}\n${line2}\n`)
