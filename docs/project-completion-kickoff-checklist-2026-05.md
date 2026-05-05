# STARCARE 收尾啟動 30 分鐘清單（2026-05）

> 目的：讓任何成員在 30 分鐘內完成收尾任務啟動，避免只看懂文件但無法開工。  
> 背景與完成率估算：`docs/project-completion-audit-2026-05-05.md`。

## 0) 先開哪些文件（5 分鐘）

- `README.md`（看「專案收尾」小節）
- `docs/project-completion-audit-2026-05-05.md`（可選：先看完成度與缺口）
- `docs/project-completion-2week-tracker-2026-05-05.md`
- `docs/project-completion-daily-log-2026-05.md`
- `docs/project-completion-evidence-index-2026-05.md`
- `docs/go-live-checklist.md`
- `docs/supabase-deploy-runbook.md`（OPS：遠端部署與驗證）
- `docs/security-token-rotation-checklist.md`（OPS：PAT 與 §D 自檢）

## 1) 先對齊角色（5 分鐘）

- [ ] 指定今日 `TL / FE / BE / QA / OPS` 責任人
- [ ] 確認今天對應 Day（D1～D10）
- [ ] 確認今日 Gate 風險（A/B/C 是否受影響）

## 2) 先跑基礎檢查（10 分鐘）

```bash
# 全閘門（本機）
npm run ci

# 可選：登入態 E2E（需 E2E_AUTH_*）
npm run test:e2e:auth

# 與 CI 同源的效能治理
npm run perf:bundle:ci
npm run perf:bundle:ci:summary
```

## 3) 先建立今日留痕（10 分鐘）

- [ ] 在追蹤板填入今日 Owner/狀態
- [ ] 在日誌建立今日段落（完成/未完成/阻塞/明日）
- [ ] 在證據索引新增今日列（PR/CI/SQL/截圖至少 1 種）
- [ ] 若有 DB 驗證，貼上 SQL 結果連結或截圖

## 完成判定（啟動成功）

以下皆達成才算啟動成功：

- [ ] 今日角色分工已明確
- [ ] 今日追蹤列與日誌段落已建立
- [ ] 至少一條可驗證證據已入索引
- [ ] 明日目標已寫入日誌
