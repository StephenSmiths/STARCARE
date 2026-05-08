/**
 * 產出 `public/scheduling-weekly-roster-import-template.xlsx`（週更表欄位）。
 * 執行：node scripts/generate-scheduling-weekly-roster-template.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const headers = [
  '服務類型',
  '職位',
  '姓名',
  '計劃日期',
  '計劃開始時間',
  '計劃結束時間',
  '負責院友範圍',
]

const example = ['資助復康服務', 'PT', '範例治療師', '2026-05-12', '9:00', '10:00', '全院資助復康個案']

const wb = XLSX.utils.book_new()
const ws = XLSX.utils.aoa_to_sheet([headers, example])
XLSX.utils.book_append_sheet(wb, ws, '週更表')

const outPath = join(root, 'public', 'scheduling-weekly-roster-import-template.xlsx')
writeFileSync(outPath, XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }))
process.stdout.write(`Wrote ${outPath}\n`)
