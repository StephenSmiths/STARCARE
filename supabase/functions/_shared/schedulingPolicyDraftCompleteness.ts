/**
 * PDF 02【16】：政策草稿子表「筆數／鍵」完整性，與前端 P2 `isValid*` 對齊（Edge validate 防不完整寫入）。
 */
import type { PolicyDraftArrays } from './schedulingPolicyDraftMappers.ts'
import { FUNDING_TIERS, ROLE_TYPES_DEM, ROLE_TYPES_SUB, SLOT_VARIANTS } from './schedulingPolicyTypes.ts'

const mkErr = (code: string, message: string) => ({ code, message })

const SUB_TIER_EXPECT = FUNDING_TIERS.size
const SUB_ROLE_OFFER_EXPECT = FUNDING_TIERS.size * ROLE_TYPES_SUB.size * SLOT_VARIANTS.size
const DEM_ROLE_OFFER_EXPECT = ROLE_TYPES_DEM.size * SLOT_VARIANTS.size

/** 將子表網格完整性錯誤附加至既有 errors（不短路；由呼叫端檢查 length） */
export const appendPolicyDraftCompletenessErrors = (
  arrays: PolicyDraftArrays,
  errors: Array<{ code: string; message: string }>,
): void => {
  const tiers = arrays.subsidizedTiers
  if (tiers.length > 0 && tiers.length !== SUB_TIER_EXPECT) {
    errors.push(
      mkErr(
        'BAD_TIER_COUNT',
        `subsidizedTiers 須恰好 ${SUB_TIER_EXPECT} 筆（甲一／院舍券／私位）或留空`,
      ),
    )
  }

  const roles = arrays.subsidizedRoleOfferings
  if (roles.length > 0 && roles.length !== SUB_ROLE_OFFER_EXPECT) {
    errors.push(
      mkErr(
        'BAD_ROLE_OFFER_COUNT',
        `subsidizedRoleOfferings 須恰好 ${SUB_ROLE_OFFER_EXPECT} 筆或留空（完整矩陣）`,
      ),
    )
  }
  if (roles.length === SUB_ROLE_OFFER_EXPECT) {
    const keys = new Set(roles.map((r) => `${r.fundingTier}\0${r.roleType}\0${r.slotVariant}`))
    if (keys.size !== SUB_ROLE_OFFER_EXPECT) {
      errors.push(mkErr('BAD_ROLE_OFFER_DUP', 'subsidizedRoleOfferings 鍵重複'))
    }
  }

  const demRows = arrays.dementiaRoleOfferings
  if (demRows.length > 0 && demRows.length !== DEM_ROLE_OFFER_EXPECT) {
    errors.push(
      mkErr('BAD_DEM_ROLE_COUNT', `dementiaRoleOfferings 須恰好 ${DEM_ROLE_OFFER_EXPECT} 筆或留空`),
    )
  }
  if (demRows.length === DEM_ROLE_OFFER_EXPECT) {
    const keys = new Set(demRows.map((r) => `${r.roleType}\0${r.slotVariant}`))
    if (keys.size !== DEM_ROLE_OFFER_EXPECT) {
      errors.push(mkErr('BAD_DEM_ROLE_DUP', 'dementiaRoleOfferings 鍵重複'))
    }
  }

  if (arrays.dementiaCore != null) {
    const w = arrays.dementiaCore.weeklyMinSessions
    if (!Number.isFinite(w) || !Number.isInteger(w) || w < 0) {
      errors.push(mkErr('BAD_DEM_CORE', 'dementiaCore.weeklyMinSessions 須為非負整數'))
    }
  }
}
