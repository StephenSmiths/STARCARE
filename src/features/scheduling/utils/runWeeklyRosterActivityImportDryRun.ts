import { createStaffProfilesListRepository } from '../../../repositories/staffProfilesListRepository'
import {
  runActivitySessionRowsDryRun,
  type ActivitySessionDryRunParseBlocked,
  type ActivitySessionDryRunValidateOk,
} from '../../activitySessions/utils/activitySessionImportDryRunFlow'
import {
  parseWeeklyRosterSheetText,
  weeklyRosterDraftsToImportRows,
} from './weeklyRosterImportParseText'
import { buildWeeklyRosterStaffProfileLookup } from './weeklyRosterStaffLookup'

type ThrowOutcome = { kind: 'throw'; error: unknown }

/** 週更表（Excel 首頁轉 CSV 或純 CSV）→ 活動時段預檢（與 `activity-sessions-import-validate` 同源）。 */
export async function runWeeklyRosterActivityImportDryRun(
  sheetCsvText: string,
  facilityId: string,
): Promise<ActivitySessionDryRunParseBlocked | ActivitySessionDryRunValidateOk | ThrowOutcome> {
  const startedAt = Date.now()
  const { drafts, errors: parseErrors } = parseWeeklyRosterSheetText(sheetCsvText)
  if (parseErrors.length > 0) {
    return {
      kind: 'parse_errors',
      errors: parseErrors,
      userMessage: '週更表內容有格式錯誤，請先修正後再進行預檢',
    }
  }
  if (drafts.length === 0) {
    return { kind: 'empty_rows', userMessage: '週更表沒有可用資料列' }
  }

  try {
    const staffRepo = createStaffProfilesListRepository()
    const staff = await staffRepo.listStaffProfiles(facilityId)
    const { map, ambiguousKeys } = buildWeeklyRosterStaffProfileLookup(staff)
    const ambSet = new Set(ambiguousKeys)
    const ambRowErrors = drafts
      .filter((d) => ambSet.has(`${d.displayName.trim()}\t${d.role}`))
      .map((d) => ({
        rowIndex: d.rowIndex,
        message: `員工主檔重覆：同姓名與職位在系統中有多筆，請先整理主檔`,
      }))
    if (ambRowErrors.length > 0) {
      return {
        kind: 'parse_errors',
        errors: ambRowErrors,
        userMessage: '員工主檔資料有歧義，無法匯入週更表',
      }
    }

    const { rows, errors: resolveErrors } = weeklyRosterDraftsToImportRows(drafts, map)
    const mergedParse = resolveErrors
    if (mergedParse.length > 0) {
      return {
        kind: 'parse_errors',
        errors: mergedParse,
        userMessage: '週更表與員工主檔對照有誤，請修正後再預檢',
      }
    }
    return runActivitySessionRowsDryRun(rows, startedAt)
  } catch (error) {
    return { kind: 'throw', error }
  }
}
