import { createClient, type User } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { json } from './http.ts'
import { getServiceClient } from './supabaseAdmin.ts'

export type StarcareDbRole = 'staff' | 'teamlead' | 'admin'
export type StaffAuthContext = { user: User; role: StarcareDbRole }
const ALLOWED_ROLES: StarcareDbRole[] = ['staff', 'teamlead', 'admin']

/** 驗證 JWT 並確認 public.user_roles 為 staff/teamlead/admin（與 RLS 一致） */
export async function requireStaffUser(req: Request): Promise<StaffAuthContext | Response> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: '缺少授權標頭' }, 401)
  }
  const url = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!url || !anonKey) {
    return json({ error: '伺服器缺少 SUPABASE_URL 或 SUPABASE_ANON_KEY' }, 500)
  }
  const authClient = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })
  const {
    data: { user },
    error: authErr,
  } = await authClient.auth.getUser()
  if (authErr || !user) {
    return json({ error: '未登入或憑證無效' }, 401)
  }
  const admin = getServiceClient()
  const { data: row, error: roleErr } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (roleErr) {
    return json({ error: roleErr.message }, 500)
  }
  if (!row || !ALLOWED_ROLES.includes(row.role as StarcareDbRole)) {
    return json({ error: '此帳號未授權使用 STARCARE（請聯絡管理員設定 user_roles）' }, 403)
  }
  return { user, role: row.role as StarcareDbRole }
}
