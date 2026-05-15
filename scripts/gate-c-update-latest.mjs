/**
 * 刷新 `docs/evidence/gate-c-latest.md` 固定入口。
 */
import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { computeGateCReadyState, recommendGateCNextCommand } from './gate-c-ready-core.mjs'

const cwd = process.cwd()
const state = computeGateCReadyState(cwd)
const rec = recommendGateCNextCommand(state)

const e2ePath = resolve(cwd, 'docs/evidence/gate-c-e2e-auth-latest.md')
const e2eEvidence = existsSync(e2ePath) ? '`docs/evidence/gate-c-e2e-auth-latest.md`' : '`（未執行 gatec:e2e:auth）`'

const lines = [
  '# Gate C Latest Pointers',
  '',
  `- 更新時間：${new Date().toISOString()}`,
  `- 判定狀態：\`${state.ready ? 'READY' : 'NOT_READY'}\``,
  `- 工程自動項：\`${state.autoDone}/${state.autoTotal}\`（engineering：\`${state.engineeringReady ? 'READY' : 'NOT_READY'}\`）`,
  `- 基線豁免（Staff+Gate A 403）：\`${state.baselineWaiver ? 'ON' : 'OFF'}\``,
  `- e2e auth 證據：${e2eEvidence}`,
  `- 工程基線認可：${existsSync(resolve(cwd, 'docs/evidence/gate-c-engineering-baseline-latest.md')) ? '`docs/evidence/gate-c-engineering-baseline-latest.md`' : '（未執行 gatec:baseline:accept）'}`,
  `- 簽核草稿：\`docs/gate-c-go-live-signoff-draft-2026-05-15.md\``,
  '',
  '## 阻塞（未勾）',
  ...state.missing.map((m) => `- [ ] ${m.label}${m.auto ? '' : '（人工）'}`),
  '',
  '## Next Command',
  `- \`${rec.command}\`（${rec.reason}）`,
  '',
  '> 人工完成 PAT／簽核後，於 `.env` 設 `GATE_C_PAT_DONE=1`、`GATE_C_SIGNOFF_DONE=1`（勿 commit），再跑 `npm run gatec:evidence:sync`。',
]

const outPath = resolve(cwd, 'docs/evidence/gate-c-latest.md')
writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8')
process.stdout.write(`[updated] ${outPath}\nRESULT: ${state.ready ? 'READY' : 'NOT_READY'}\n`)
