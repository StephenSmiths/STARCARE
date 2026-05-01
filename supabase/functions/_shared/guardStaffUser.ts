import { requireStaffUser } from './requireStaffUser.ts'

/** 已登入且具 staff/teamlead/admin；通過回傳 null，否則回傳錯誤 Response */
export async function guardStaffUser(req: Request): Promise<Response | null> {
  const r = await requireStaffUser(req)
  return r instanceof Response ? r : null
}
