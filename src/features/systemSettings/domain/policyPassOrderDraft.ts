import type {
  PolicySubsidizedPassOrderRow,
  PolicySubsidizedFundingTier,
  SchedulingPolicyBundle,
} from '../../../repositories/schedulingPolicyTypes'
import { POLICY_SUBSIDIZED_FUNDING_TIERS } from '../../../repositories/schedulingPolicyTypes'

const TIER_SET = new Set<string>(POLICY_SUBSIDIZED_FUNDING_TIERS)

/** Edge 與 `mergeP1DraftIntoPolicyBundle` 之預設（甲一 → 院舍券 → 私位） */
export const DEFAULT_POLICY_SUBSIDIZED_PASS_ORDER: PolicySubsidizedPassOrderRow[] = [
  { sortOrder: 1, fundingTier: 'GradeA_Subsidized' },
  { sortOrder: 2, fundingTier: 'Voucher' },
  { sortOrder: 3, fundingTier: 'Private' },
]

const isFundingTier = (s: string): s is PolicySubsidizedFundingTier => TIER_SET.has(s)

/** 三筆、sortOrder 為 1–3 各一、fundingTier 兩兩相異 */
export const isValidPolicySubsidizedPassOrder = (rows: PolicySubsidizedPassOrderRow[]): boolean => {
  if (rows.length !== 3) return false
  const orders = new Set(rows.map((p) => p.sortOrder))
  if (orders.size !== 3 || ![1, 2, 3].every((n) => orders.has(n))) return false
  const tiers = new Set(rows.map((p) => p.fundingTier))
  if (tiers.size !== 3) return false
  return rows.every((r) => isFundingTier(r.fundingTier) && Number.isInteger(r.sortOrder))
}

/** 自 bundle 列還原可編輯列；無效或不足三筆時回預設（與 Edge 載入層容錯一致） */
export const bundlePassOrderToDraft = (rows: SchedulingPolicyBundle['subsidizedPassOrder'] | undefined): PolicySubsidizedPassOrderRow[] => {
  const list: PolicySubsidizedPassOrderRow[] = []
  for (const r of rows ?? []) {
    const sortOrder = Number(r.sortOrder)
    const rawTier = String(r.fundingTier)
    if (!Number.isInteger(sortOrder) || !isFundingTier(rawTier)) continue
    list.push({ sortOrder, fundingTier: rawTier })
  }
  return isValidPolicySubsidizedPassOrder(list) ? [...list].sort((a, b) => a.sortOrder - b.sortOrder) : [...DEFAULT_POLICY_SUBSIDIZED_PASS_ORDER]
}

/** 合併請求前正規化：無效則回預設，避免送出缺漏陣列 */
export const normalizePassOrderForMerge = (rows: PolicySubsidizedPassOrderRow[]): PolicySubsidizedPassOrderRow[] =>
  isValidPolicySubsidizedPassOrder(rows) ? [...rows].sort((a, b) => a.sortOrder - b.sortOrder) : [...DEFAULT_POLICY_SUBSIDIZED_PASS_ORDER]

export const draftPassOrderToBundle = (rows: PolicySubsidizedPassOrderRow[]): SchedulingPolicyBundle['subsidizedPassOrder'] =>
  normalizePassOrderForMerge(rows)

/** 相鄰兩格對調後，重新編 sortOrder 1–3（僅供 UI） */
export const reorderPassOrderSwapAdjacent = (
  rows: PolicySubsidizedPassOrderRow[],
  lowerIndex: number,
): PolicySubsidizedPassOrderRow[] => {
  const sorted = [...rows].sort((a, b) => a.sortOrder - b.sortOrder)
  if (sorted.length !== 3 || lowerIndex < 0 || lowerIndex >= sorted.length - 1) {
    return sorted.map((r, i) => ({ ...r, sortOrder: i + 1 }))
  }
  const next = [...sorted]
  const a = next[lowerIndex]
  const b = next[lowerIndex + 1]
  if (!a || !b) return sorted.map((r, i) => ({ ...r, sortOrder: i + 1 }))
  next[lowerIndex] = b
  next[lowerIndex + 1] = a
  return next.map((r, i) => ({ ...r, sortOrder: i + 1 }))
}
