import { computeGateBReadyState } from './gate-b-ready-core.mjs'

const strict = process.argv.includes('--strict')
const state = computeGateBReadyState()

process.stdout.write('# Gate B Ready Check\n\n')
process.stdout.write(`- evidence completeness: ${state.done}/${state.total}\n`)
process.stdout.write(`RESULT: ${state.ready ? 'READY' : 'NOT_READY'}\n`)

if (!state.ready) {
  process.stdout.write('hint: run `npm run gateb:evidence:doctor` and complete missing checklist artifacts.\n')
}

if (strict && !state.ready) {
  process.exitCode = 1
}

