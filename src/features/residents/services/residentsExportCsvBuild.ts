import type { Resident } from '../types/resident'
import {
  escapeCsvValue,
  residentFundingExportLabel,
  residentServiceTypeExportLabel,
  residentSpecialCareCaseExportCode,
} from './residentsExportCsvFormatting'

/** PDF 02【12】院友名單匯出（CSV + UTF-8 BOM，Excel 可開） */
export const buildResidentsExportCsv = (rows: Resident[]): string => {
  const header = [
    '院友ID',
    '姓名',
    '床號',
    '區域',
    '性別',
    '年齡',
    '入院日期',
    '下次評估到期日',
    '資助類別',
    '服務類型',
    '認知程度',
    '特殊照護',
    '健康狀況',
    '用藥紀錄',
    '資助類別代碼',
    '服務類型代碼',
    '特殊照護代碼',
  ]
  const lines = rows.map((row) => [
    escapeCsvValue(row.id),
    escapeCsvValue(row.name),
    escapeCsvValue(row.bedNumber),
    escapeCsvValue(row.area),
    escapeCsvValue(row.gender),
    escapeCsvValue(String(row.age)),
    escapeCsvValue(row.admissionDate),
    escapeCsvValue(row.assessmentNextDueDate ?? ''),
    escapeCsvValue(residentFundingExportLabel(row.fundingType)),
    escapeCsvValue(residentServiceTypeExportLabel(row.serviceType)),
    escapeCsvValue(row.dementiaLevel),
    escapeCsvValue(row.isSpecialCareCase ? '是' : '否'),
    escapeCsvValue(row.healthCondition),
    escapeCsvValue(row.medicationRecord),
    escapeCsvValue(row.fundingType),
    escapeCsvValue(row.serviceType),
    escapeCsvValue(residentSpecialCareCaseExportCode(row)),
  ])
  const bom = '\uFEFF'
  return bom + [header.join(','), ...lines.map((cols) => cols.join(','))].join('\n')
}
