import { json } from './http.ts'
import { requireStaffUser, type StaffAuthContext } from './requireStaffUser.ts'

/** 僅資料庫 role=admin 可呼叫（與 PDF 01 §1 三角色治理一致） */
export async function requireAdmin(req: Request): Promise<StaffAuthContext | Response> {
  const ctx = await requireStaffUser(req)
  if (ctx instanceof Response) return ctx
  if (ctx.role !== 'admin') return json({ error: '僅 Admin 可變更使用者 STARCARE 角色' }, 403)
  return ctx
}
