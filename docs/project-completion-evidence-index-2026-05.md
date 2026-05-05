# STARCARE 收尾驗收證據索引（2026-05）

> 對照：`docs/project-completion-2week-tracker-2026-05-05.md`、`docs/project-completion-daily-log-2026-05.md`、`docs/go-live-checklist.md`

## 使用方式

- 每完成一個關鍵任務，就在此表新增一列。
- 證據連結至少包含一種：PR、CI run、SQL 結果、截圖/文件。
- Gate A/B/C 檢核前，先確認對應列已完整。

## 證據總表

| 日期 | Day | 模組/主題 | 對照條款 | PR/Commit | CI/Artifact | SQL 證據 | 截圖/文件 | Owner | 備註 |
|---|---|---|---|---|---|---|---|---|---|
| 2026-05-05 | D1 | 驗收範圍與版本基線 | Plan D1 |  |  |  |  | TL |  |
| 2026-05-06 | D2 | Auth / RLS 初檢 | go-live §1 |  |  |  |  | FE/BE |  |
| 2026-05-07 | D3 | 排班閉環 | go-live §3 |  |  |  |  | FE/BE/QA |  |
| 2026-05-08 | D4 | 審計抽測（RES-06） | go-live §8 |  |  |  |  | FE/BE |  |
| 2026-05-09 | D5 | Gate A 結論 | Gate A |  |  |  |  | TL/QA |  |
| 2026-05-12 | D6 | 回歸 A（residents/staff/import） | Plan D6 |  |  |  |  | FE/QA |  |
| 2026-05-13 | D7 | 回歸 B（scheduling/forms/handover） | Plan D7 |  |  |  |  | FE/QA |  |
| 2026-05-14 | D8 | RC + 缺陷收斂 | Gate B |  |  |  |  | TL/FE/BE |  |
| 2026-05-15 | D9 | 部署/回滾/憑證 | go-live §2/§6 |  |  |  |  | OPS/BE |  |
| 2026-05-16 | D10 | 最終簽核 | Gate C |  |  |  |  | TL/QA/業務 |  |

## Gate 快速核對

### Gate A（D5）
- [ ] go-live §1 證據齊全
- [ ] go-live §3 證據齊全
- [ ] go-live §8 證據齊全
- [ ] `RES-06` 有明確結論（完成/阻塞）

### Gate B（D8）
- [ ] P0/P1 為 0
- [ ] RC 可重複部署
- [ ] CI 穩定綠燈（含 E2E/perf）

### Gate C（D10）
- [ ] go-live checklist 完成簽核
- [ ] 部署與回滾路徑確認
- [ ] 憑證輪替與安全收尾完成
