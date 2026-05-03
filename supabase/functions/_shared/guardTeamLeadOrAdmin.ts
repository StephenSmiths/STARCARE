import { json } from './http.ts'
import { requireStaffUser } from './requireStaffUser.ts'

/** PDF 01 §1／02【13】：員工主檔維護僅 TeamLead／Admin（與 `view:staff-import` 一致） */
export async function guardTeamLeadOrAdmin(req: Request): Promise<Response | null> {
  const ctx = await requireStaffUser(req)
  if (ctx instanceof Response) return ctx
  if (ctx.role === 'staff') return json({ error: '僅 TeamLead／Admin 可維護員工主檔' }, 403)
  return null
}
