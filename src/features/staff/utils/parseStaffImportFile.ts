import * as XLSX from 'xlsx'

/** 員工匯入檔：Excel（.xlsx/.xls）或 CSV 轉成 CSV 字串供既有解析器使用。 */
export const parseStaffImportFileToCsvText = async (file: File): Promise<string> => {
  const lower = file.name.toLowerCase()
  if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) return ''
    return XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName], { blankrows: false })
  }
  return file.text()
}
