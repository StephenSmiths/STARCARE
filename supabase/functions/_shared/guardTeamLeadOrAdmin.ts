import { json } from './http.ts'
import { requireStaffUser, type StaffAuthContext } from './requireStaffUser.ts'

/** TeamLead／Admin；回傳 JWT context 供審計 `actor_id`（院友／匯入等與 `guardTeamLeadOrAdmin` 相同授權） */
export async function requireTeamLeadOrAdmin(req: Request): Promise<StaffAuthContext | Response> {
  const ctx = await requireStaffUser(req)
  if (ctx instanceof Response) return ctx
  if (ctx.role === 'staff') return json({ error: '僅 TeamLead／Admin 可維護員工主檔' }, 403)
  return ctx
}

/** PDF 01 §1／02【13】：員工主檔維護僅 TeamLead／Admin（與 `view:staff-import` 一致） */
export async function guardTeamLeadOrAdmin(req: Request): Promise<Response | null> {
  const ctx = await requireTeamLeadOrAdmin(req)
  return ctx instanceof Response ? ctx : null
}
