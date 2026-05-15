# 週更表 UAT 樣本 CSV 說明

檔案：**`weekly-roster-uat-sample.csv`**

## 欄位規則（與排班頁提示一致）

| 欄 | 允許值 |
|----|--------|
| 服務類型 | `資助復康服務` 或 `認知障礙症服務` |
| **職位** | **`PT`、`PTA`、`OT`、`OTA` 四選一**（必填英文代碼） |
| 姓名 | 須與系統 **員工主檔** 之 `display_name` 一致 |
| 計劃日期 | `yyyy-mm-dd` |
| 時間 | `hh:mm` |
| 負責院友範圍 | 自由文字（例：`全院`） |

## 預檢兩階段

1. **格式**（上傳後即時）：職位／服務類型／日期時間格式。  
2. **主檔對照**（按預檢）：`姓名 + 職位` 必須能對上 `staff_profiles`。

若第 2 步失敗：至 **員工管理** 查實際姓名，改 CSV 後重新上傳。

## 程式對照

`src/features/scheduling/constants/weeklyRosterImportConstants.ts`  
`src/features/scheduling/utils/weeklyRosterImportParseText.ts`（`ROLE_SET`）
