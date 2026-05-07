# Gate B 啟動清單（2026-05-07）

> 前置狀態：Gate A 已 `READY`（`npm run gatea:evidence:summary`：doctor `12/12`）。  
> 對照：`docs/go-live-checklist.md`、`docs/business-logic.md`、`README.md`。  
> 全案收尾與證據留痕：見 `docs/go-live-checklist.md` 開首。

## 0) 範圍與目標

- 目標：以 Gate B 驗證下一階段交付是否符合「可執行、可驗證、可回溯」。
- 範圍：僅納入本階段新需求與 Gate A 後續修補，不重覆盤點已關閉項。
- 產出：
  - Gate B 狀態頁（本檔）
  - Gate B 證據索引（`docs/evidence/`）
  - 最終 strict gate 結果（READY / NOT_READY）

## 1) 閉環定義（Closed-Loop）

- Input（觸發）：需求變更、缺陷修補、驗收條件更新。
- Logic（處理）：實作 + 測試 + 文件同步 + 證據落檔。
- Output（輸出）：功能行為、測試結果、證據檔案、判定結果。
- Feedback（回饋）：PM/業務簽核、QA 驗證、工程自查。
- Metrics（量測）：
  - 自動檢查通過率
  - 人工證據完成率
  - strict gate 結果

## 2) 驗收最小清單（MVP）

> 2026-05-07 已完成：`npm run lint && npm run typecheck`、`npm run ci`。

- [x] 自動檢查：`npm run lint && npm run typecheck`
- [x] 整合檢查：`npm run ci`（若時間不足，至少執行前兩項）
- [x] 證據彙總：產生 Gate B 對應 summary / report（`docs/evidence/gate-b-summary-2026-05-07.md`）
- [ ] 人工證據：完成本階段必要截圖與 SQL 查核（`docs/gate-b-manual-evidence-checklist-2026-05-07.md`）
- [ ] 關卡判定：strict gate 為 `READY`

## 3) 執行指令（建議順序）

```bash
# 1) 基礎健康檢查
npm run lint
npm run typecheck

# 2) 可選整體檢查
npm run ci

# 3) 依 Gate B 腳本（建立後）執行彙總與判定
# npm run gateb:evidence:summary
# npm run gateb:evidence:ready -- --strict
```

## 4) 證據命名規範（先行）

- 圖檔：`gateB-<area>-<topic>-YYYY-MM-DD.png`
- SQL 截圖：`gateB-<area>-sql-YYYY-MM-DD.png`
- 報告：`gate-b-report-<timestamp>.md`
- 以 `docs/evidence/` 為固定落點，避免分散。

## 5) 風險與回滾

- 若 strict gate 失敗：
  - 先修正失敗項，再重跑最小驗收清單
  - 保留失敗證據於 `docs/evidence/`，不得覆蓋
- 若需求與 `docs/business-logic.md` 不一致：
  - 暫停實作，先回到業務規則確認

## 6) 結案條件

- [ ] 本檔清單全勾選
- [ ] strict gate = `READY`
- [ ] 證據檔與回報文件已同步
- [ ] 變更已提交並推送遠端

