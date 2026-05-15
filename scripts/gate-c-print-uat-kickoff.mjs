/**
 * 輸出 UAT 開測郵件（含 Supabase 專案 ref；前端 URL 由參數或環境覆寫）。
 * 用法：`FRONTEND_URL=https://... npm run gatec:uat:kickoff`
 */
import { buildSpawnBaseEnv } from './gate-a-env-lib.mjs'

const e = buildSpawnBaseEnv()
const ref = String(e.VITE_SUPABASE_URL ?? '')
  .replace(/^https?:\/\//, '')
  .replace(/\.supabase\.co.*$/, '')
const frontend =
  process.env.FRONTEND_URL?.trim() ||
  process.env.STARCARE_STAGING_URL?.trim() ||
  '（由專案方填入 Vercel／Staging 前端 URL）'
const contact = process.env.UAT_CONTACT?.trim() || '（專案聯絡人姓名／電話）'
const dateRange = process.env.UAT_DATE_RANGE?.trim() || '2026-05-16 ～ 2026-05-23'

const body = `主旨：STARCARE Staging UAT 開測 — 系統設定與智能排班

各位好，

Staging 後端與 Edge 已部署（Gate A/B 工程驗收通過），現邀請進行 UAT。

【環境】
- 前端（請用此 URL 登入）：${frontend}
- Supabase 專案 ref（工程對照用）：${ref || '（未設 VITE_SUPABASE_URL）'}
- 測試帳號：見附件「UAT 帳號表」（僅 email）
- 密碼：另以 ${contact} 提供（勿經 email 明文）

【劇本順序】
1. 系統設定 → 2. 週更表匯入 → 3. 智能排班 → 4. 儲存
- 智能排班：docs/uat/scheduling-intelligent-uat-2026-05-15.md（S1～S10）
- 系統設定：docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md

【已知限制】
- 週更擇活動依目錄職位門檻；私位週目標仍為 1；排班演算於前端。
- 正式 go-live 待 PAT 與管理層簽核。

【時程】${dateRange}
【聯絡】${contact}

謝謝。`

process.stdout.write(`${body}\n`)
