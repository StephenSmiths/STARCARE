# UAT 開測通知（郵件草稿）

> 寄出前替換 `{STAGING_URL}`、`{CONTACT}`、帳號表；**勿在郵件內附密碼**（改電話／加密通道交付）。

---

**主旨**：STARCARE Staging UAT 開測 — 系統設定與智能排班

各位好，

Staging 環境已部署完成，工程驗收（Gate A/B）已通過，現邀請貴方進行 **用戶驗收測試（UAT）**。

### 環境與帳號

- **網址**：{STAGING_URL}
- **測試帳號**：見附件表格（Team Lead／Admin 各一；Staff 可選）
- **密碼**：將另以 {CONTACT} 提供

### 測試範圍與劇本

1. **院舍政策／系統設定**  
   `docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`（工程可提供 PDF 或 Confluence 連結）

2. **智能排班（PDF 02【3】）**  
   `docs/uat/scheduling-intelligent-uat-2026-05-15.md`（S1～S10）

建議順序：**系統設定 → 週更表匯入 → 智能排班 → 儲存**。

### 已知限制（請一併驗收）

- 週更表擇活動依**目錄職位門檻**，非院友個別復康計劃優先。
- 私位週目標程式仍為 **1**（若業務預期為 2，請於 UAT 備註待裁定）。
- 排班演算主要於**前端**執行；正式 go-live 前尚需管理層簽核與憑證輪替。

### 回報方式

- 通過：於劇本 **§五 簽核** 簽名掃描回傳。
- 缺陷：填 **§六 缺陷記錄**（含步驟編號 S?、嚴重度 P0/P1/P2）。

### 時程建議

- UAT 窗口：{DATE_RANGE}
- 聯絡人：{CONTACT}

謝謝。

---

**附件建議**：`scheduling-intelligent-uat-2026-05-15.md` 匯出 PDF、帳號表（email 欄位即可）。
