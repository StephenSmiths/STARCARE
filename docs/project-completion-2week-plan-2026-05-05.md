# STARCARE 兩週收尾計畫（2026-05-05）

> **對照**：盤點 **`docs/project-completion-audit-2026-05-05.md`**；進度板 **`docs/project-completion-2week-tracker-2026-05-05.md`**；運維總覽 **`docs/business-logic.md`** §0；序號主檔 **`docs/pdf-sequenced-gap-checklist.md`**「**運維與工程**」列。  
> **全案收尾母索引**：**`README.md`**「專案收尾」；啟動清單 **`docs/project-completion-kickoff-checklist-2026-05.md`**。  
> 依據：`docs/project-completion-audit-2026-05-05.md`。  
> 目標：在 10 個工作天內完成「可上線宣告」所需的閉環驗收、權限/RLS抽測、缺陷收斂與簽核。

## 角色定義

- `TL`：Tech Lead（技術決策、風險與簽核）
- `FE`：Frontend（UI/流程修正、E2E）
- `BE`：Supabase/Edge（RLS、Function、資料驗證）
- `QA`：驗收與測試（清單勾選、證據整理）
- `OPS`：部署與憑證（PAT、部署、回滾演練）

## 週目標

- **Week 1**：完成正式庫閉環與權限/審計抽測（對應 WP1 + WP2）
- **Week 2**：完成跨模組回歸、缺陷清零、簽核與上線準備（對應 WP3 + WP4 + WP5）

## Day-by-Day 計畫（10 天）

| Day | 主責 | 目標 | 當日可交付物（DoD） |
|---|---|---|---|
| D1 | TL + QA | 凍結驗收範圍與版本基線 | 1) 驗收範圍清單 2) 今日版本 tag/commit 鎖定 3) 風險清單 v1 |
| D2 | FE + BE | 跑 go-live §1（Auth/RLS 初檢） | 1) admin/staff 登入證據 2) 401/403 抽測截圖 3) `user_roles` SQL 結果 |
| D3 | FE + BE + QA | 跑 go-live §3（排班閉環） | 1) 排班->儲存->DB 寫入完整證據 2) `scheduling_history` SQL 結果 |
| D4 | FE + BE | 跑 go-live §8（審計 RES-06） | 1) `audit_events` SQL 結果 2) staff/teamlead/admin 可見性差異證據 |
| D5 | TL + QA | Week1 Gate | 1) `RES-06` 是否可改 `已完成` 2) Week1 缺陷列表（P0/P1/P2） |
| D6 | FE + QA | 跨模組回歸（resident/staff/import） | 1) 回歸報告 A 2) 阻塞缺陷單（含重現步驟） |
| D7 | FE + QA | 跨模組回歸（scheduling/forms/handover） | 1) 回歸報告 B 2) E2E 結果摘要 |
| D8 | FE + BE + TL | 缺陷收斂與 release candidate | 1) P0/P1 = 0 2) RC 版本號 3) 風險清單 v2（剩餘風險） |
| D9 | OPS + BE | 部署/回滾演練與憑證收尾 | 1) PAT 輪替紀錄 2) migration/function 一致性證據 3) rollback 演練紀錄 |
| D10 | TL + QA + 業務 | 最終簽核與上線決策 | 1) go-live checklist 全勾 2) 簽核紀錄 3) go/no-go 結論 |

## 每日固定節奏（建議）

- 10:00 Standup：同步阻塞與跨組依賴。
- 15:00 中段檢查：是否偏離 DOD、是否需要切 scope。
- 18:00 EOD：更新 checklist、缺陷板與證據檔案連結。

## 驗收閘門（Hard Gates）

- `Gate A（D5）`：
  - go-live §1 / §3 / §8 主證據齊全
  - `RES-06` 明確判定（完成或列阻塞）
  - 取證自動化與固定入口：`docs/go-live-checklist.md` §0.1、`docs/evidence/gate-a-latest.md`；可選 **`npm run gatea:evidence:refresh`**
- `Gate B（D8）`：
  - P0/P1 必須為 0
  - RC 可重複部署且 CI 綠燈
- `Gate C（D10）`：
  - go-live checklist 可簽核
  - 憑證、回滾、部署一致性全部完成

## 風險與應對

- **R1：正式庫抽測發現 RLS 偏差**
  - 應對：D4 當天修正 migration/政策，D5 重新抽測，不帶病進 Week2。
- **R2：跨模組回歸爆出連鎖缺陷**
  - 應對：D6/D7 只收斂 P0/P1；P2 進版本後 backlog。
- **R3：部署窗口被壓縮**
  - 應對：D9 提前完成 rollback 演練，D10 只做最終核對與決策。

## 完成判定（兩週結束時）

以下皆為 true 才算達標：

- `go-live checklist` 核心勾選完成（§1、§2、§3、§6、§7、§8）。
- `feature-list` 狀態與正式驗收一致（尤其 RES-06）。
- `CI + E2E + perf governance` 維持穩定綠燈，無新 P0/P1。
- 有可追溯證據（SQL、截圖、artifact、簽核記錄）。

## 執行追蹤入口

- 首次啟動（30 分鐘）：`docs/project-completion-kickoff-checklist-2026-05.md`
- 每日進度板：`docs/project-completion-2week-tracker-2026-05-05.md`
- 每日日誌：`docs/project-completion-daily-log-2026-05.md`
- 證據索引：`docs/project-completion-evidence-index-2026-05.md`
- Gate A 證據固定入口：`docs/evidence/gate-a-latest.md`
