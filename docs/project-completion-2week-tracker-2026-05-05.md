# STARCARE 兩週收尾進度板（2026-05-05）

> 對照：`docs/project-completion-2week-plan-2026-05-05.md`  
> 用法：每日 standup 更新「狀態 / 阻塞 / 證據」，EOD 勾選完成項。

## 狀態圖例

- `todo`：未開始
- `doing`：進行中
- `done`：已完成
- `blocked`：受阻塞

## 週次總覽

| 週次 | 目標 | 目前狀態 | 備註 |
|---|---|---|---|
| Week 1 | 正式庫閉環 + 權限/RLS/審計抽測（WP1+WP2） | todo |  |
| Week 2 | 回歸收斂 + RC + 簽核上線（WP3+WP4+WP5） | todo |  |

## 每日追蹤（D1～D10）

| Day | 任務 | Owner | 狀態 | 阻塞 | 證據連結（PR/SQL/截圖/Artifact） | 完成勾選 |
|---|---|---|---|---|---|---|
| D1 | 凍結驗收範圍、版本鎖定、風險清單 v1 | TL + QA | todo |  |  | [ ] |
| D2 | go-live §1：Auth/RLS 初檢（admin/staff/401/403） | FE + BE | todo |  |  | [ ] |
| D3 | go-live §3：排班閉環（排班→儲存→DB） | FE + BE + QA | todo |  |  | [ ] |
| D4 | go-live §8：審計抽測（含 RLS 可見性） | FE + BE | todo |  |  | [ ] |
| D5 | Week1 Gate：判定 RES-06、整理 P0/P1/P2 | TL + QA | todo |  |  | [ ] |
| D6 | 回歸 A：residents/staff/import | FE + QA | todo |  |  | [ ] |
| D7 | 回歸 B：scheduling/forms/handover | FE + QA | todo |  |  | [ ] |
| D8 | 缺陷收斂、產出 RC、風險清單 v2 | FE + BE + TL | todo |  |  | [ ] |
| D9 | 部署/回滾演練、PAT/部署一致性 | OPS + BE | todo |  |  | [ ] |
| D10 | 最終簽核（go/no-go） | TL + QA + 業務 | todo |  |  | [ ] |

## Gate 檢核（Hard Gates）

| Gate | 時點 | 必要條件 | 是否通過 | 備註 |
|---|---|---|---|---|
| Gate A | D5 | go-live §1/§3/§8 證據齊全、RES-06 有結論 | [ ] |  |
| Gate B | D8 | P0/P1=0、RC 可重複部署、CI 綠燈 | [ ] |  |
| Gate C | D10 | go-live checklist 可簽核、回滾路徑可用 | [ ] |  |

## 缺陷收斂板（上線範圍）

| ID | 模組 | 嚴重度 | 現況 | Owner | 目標日 | 備註 |
|---|---|---|---|---|---|---|
| BUG-001 |  | P0/P1/P2 | todo |  |  |  |
| BUG-002 |  | P0/P1/P2 | todo |  |  |  |
| BUG-003 |  | P0/P1/P2 | todo |  |  |  |

## 每日 EOD 總結模板

```md
### YYYY-MM-DD EOD
- 今日完成：
- 未完成（原因）：
- 新增阻塞：
- 明日目標：
- 需要協助：
```

## 快速連結

- 完成度盤點：`docs/project-completion-audit-2026-05-05.md`
- 兩週計畫：`docs/project-completion-2week-plan-2026-05-05.md`
- 上線檢核：`docs/go-live-checklist.md`
- 功能清單：`docs/feature-list.md`
