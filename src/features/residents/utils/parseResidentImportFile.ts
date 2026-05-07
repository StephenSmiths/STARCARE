import * as XLSX from 'xlsx'

/** 匯入檔讀取：支援 CSV 與 Excel（.xlsx/.xls）並轉成 CSV 字串供既有解析流程重用。 */
export const parseResidentImportFileToCsvText = async (file: File): Promise<string> => {
  const lowerName = file.name.toLowerCase()
  if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    if (!firstSheetName) return ''
    const firstSheet = workbook.Sheets[firstSheetName]
    return XLSX.utils.sheet_to_csv(firstSheet, { blankrows: false })
  }
  return file.text()
}
