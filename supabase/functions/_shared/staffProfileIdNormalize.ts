/** 去除 BOM、trim、NFKC；匯入／單筆與庫內 staff_profiles.id 對齊用（Excel 隱藏字元）。 */
export const normalizeStaffProfileId = (raw: unknown): string => {
  const s = String(raw ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
  try {
    return s.normalize('NFKC')
  } catch {
    return s
  }
}
