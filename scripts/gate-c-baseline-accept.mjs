/**
 * 寫入工程基線認可證據（Staff E2E PASS + Gate A 覆蓋 TL/Admin 專項）。
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { computeGateCReadyState } from './gate-c-ready-core.mjs'

const cwd = process.cwd()
const state = computeGateCReadyState(cwd)
if (!state.engineeringBaselineReady) {
  process.stderr.write(
    '[gatec:baseline:accept] 失敗：需 Gate A READY、gate-c-e2e-auth-latest PASS、Gate A 403 證據。\n',
  )
  process.exitCode = 1
  process.exit(1)
}

const outPath = resolve(cwd, 'docs/evidence/gate-c-engineering-baseline-latest.md')
const lines = [
  '# Gate C Engineering Baseline（Staff + Gate A）',
  '',
  `- 更新時間：${new Date().toISOString()}`,
  '- 判定：`ACCEPTED`',
  '- Staff E2E：**`docs/evidence/gate-c-e2e-auth-latest.md`**',
  '- Gate A：**`docs/evidence/gate-a-latest.md`**（含 admin/staff 登入截圖、401/403）',
  '',
  '## 4 項 Playwright skip 之對照',
  '',
  '| skip 案例 | 覆蓋證據 |',
  '|-----------|----------|',
  '| `#residents`（TL/Admin） | Gate A 院友／排班人工路徑；UAT S? |',
  '| `#system-settings` P2 h3 | Gate A TL 登入 + UAT 系統設定 |',
  '| `user-role-admin` admin | Gate A admin 截圖 |',
  '| `user-role-admin` staff 403 | Gate A strict-http 403 txt |',
  '',
  '## 升級為全自動',
  '',
  '於 `.env` 設 `E2E_AUTH_TEAMLEAD_*`／`E2E_AUTH_ADMIN_*` 後重跑 `npm run gatec:e2e:auth`（0 skipped）。',
]

writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8')
process.stdout.write(`[gatec] wrote ${outPath}\nengineeringBaseline: ACCEPTED\n`)
