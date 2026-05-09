/**
 * 產出 `public/staff-import-test-sample.xlsx`：員工批量匯入小樣本（供本機／客戶試匯入）。
 * 欄位對齊 `staffCsvParser` 中文表頭；員工編號留空由匯入落庫時產生 UUID。
 * 執行：node scripts/generate-staff-import-test-sample-xlsx.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const headers = ['員工編號', '姓名', '職位', '性別', '聯絡電話', '電子郵箱']

const rows = [
  ['', '測試員工甲', 'PT', 'M', '90000001', 'staff.import.test.01@demo.local'],
  ['', '測試員工乙', 'PTA', 'F', '90000002', 'staff.import.test.02@demo.local'],
  ['', '測試員工丙', 'OT', '男', '90000003', 'staff.import.test.03@demo.local'],
  ['', '測試員工丁', 'OTA', '女', '90000004', 'staff.import.test.04@demo.local'],
]

const wb = XLSX.utils.book_new()
const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
XLSX.utils.book_append_sheet(wb, ws, '員工匯入')

const outPath = join(root, 'public', 'staff-import-test-sample.xlsx')
writeFileSync(outPath, XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }))
process.stdout.write(`Wrote ${outPath}\n`)
