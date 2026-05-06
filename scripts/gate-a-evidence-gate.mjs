import { computeGateAReadyState } from './gate-a-ready-core.mjs'

const s = computeGateAReadyState()

if (s.ready) {
  process.stdout.write('Gate A gate: PASS (READY)\n')
  process.exitCode = 0
} else {
  process.stdout.write('Gate A gate: FAIL (NOT_READY)\n')
  process.stdout.write('Try: npm run gatea:evidence:next\n')
  process.exitCode = 1
}
