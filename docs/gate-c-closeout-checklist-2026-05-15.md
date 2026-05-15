# Gate C 收尾一頁清單（2026-05-15）

> 即時狀態：**`npm run gatec:preflight`** · **`docs/evidence/gate-c-latest.md`**

## 已完成（工程）

- [x] Gate A READY · Gate B CI · D9 deploy
- [x] Staff E2E 11 passed（`gate-c-e2e-auth-latest.md`）
- [x] 工程基線 6/6（`gate-c-engineering-baseline-latest.md`）
- [x] 簽核用語 · PAT 執行單 · UAT 郵件產生器

## 待辦（按順序）

| # | 動作 | 負責 | 文件／指令 |
|---|------|------|------------|
| 1 | 技術簽名（可先） | TL | `gate-c-section7-signoff-wording` |
| 2 | PAT 輪替 | OPS | `gate-c-pat-ops-runbook` |
| 3 | 設 `GATE_C_PAT_DONE=1` + sync | 工程 | `npm run gatec:evidence:sync` |
| 4 | 發 UAT 開測信 | PM/TL | `gatec:uat:kickoff`；Preview 已煙霧 **`gate-c-staging-preview-smoke`** |
| 5 | 客戶跑 UAT + 簽名 | 業務 | **`uat-facilitator-runbook`** + 排班劇本 |
| 6 | 決策人 Go（PAT 後） | 決策 | `go-live` §7 |
| 7 | 設 `GATE_C_SIGNOFF_DONE=1` + sync | 工程 | `gatec:evidence:sync` |

## 可選

- [ ] TL 帳號 `E2E_AUTH_TEAMLEAD_*` → `gatec:e2e:auth`（0 skipped）
- [ ] SQL：`docs/sql/gate-c-go-live-verification.sql` 截圖入簽核包

## Go 條件

§6 PAT 全勾 + §7 三方簽名 + UAT 無 P0/P1 → **`gate-c-latest` READY**
