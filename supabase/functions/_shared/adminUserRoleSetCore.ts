import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { insertAuditEvent } from './insertAuditEvent.ts'
import type { StarcareDbRole } from './requireStaffUser.ts'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isDbRole = (s: string): s is StarcareDbRole =>
  s === 'staff' || s === 'teamlead' || s === 'admin'

/** 解析目標：UUID 或信箱（Admin API 分頁掃描，最多 10 頁） */
export async function resolveTargetUserId(
  admin: SupabaseClient,
  targetUserId: unknown,
  targetEmail: unknown,
): Promise<{ id: string } | { error: string; status: number }> {
  const idRaw = typeof targetUserId === 'string' ? targetUserId.trim() : ''
  if (idRaw && UUID_RE.test(idRaw)) return { id: idRaw }
  const email = typeof targetEmail === 'string' ? targetEmail.trim().toLowerCase() : ''
  if (!email) return { error: '需提供 targetUserId 或 targetEmail', status: 400 }
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) return { error: error.message, status: 500 }
    const users = data?.users ?? []
    const hit = users.find((u) => (u.email ?? '').toLowerCase() === email)
    if (hit) return { id: hit.id }
    if (users.length < 200) break
  }
  return { error: '找不到指定信箱之使用者', status: 404 }
}

/** 同一流程：user_roles、JWT app_metadata、審計；失敗盡力回溯 */
export async function runAdminUserRoleSet(params: {
  supabase: SupabaseClient
  actorUserId: string
  targetUserId: string
  newRole: StarcareDbRole
}): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const { supabase, actorUserId, targetUserId, newRole } = params

  const { data: authBefore, error: authGetErr } = await supabase.auth.admin.getUserById(targetUserId)
  if (authGetErr || !authBefore?.user) {
    return { ok: false, status: 404, error: '找不到 Auth 使用者' }
  }

  const { data: roleRow, error: roleSelErr } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', targetUserId)
    .maybeSingle()
  if (roleSelErr) return { ok: false, status: 500, error: roleSelErr.message }

  const beforeDbRole = (roleRow?.role as string | undefined) ?? null
  const prevMeta = { ...(authBefore.user.app_metadata ?? {}) }
  const prevStarcare = typeof prevMeta.starcare_role === 'string' ? prevMeta.starcare_role : ''

  if (beforeDbRole === newRole && prevStarcare.toLowerCase() === newRole) {
    return { ok: true }
  }

  if (beforeDbRole === 'admin' && newRole !== 'admin') {
    const { data: admins, error: cntErr } = await supabase.from('user_roles').select('user_id').eq('role', 'admin')
    if (cntErr) return { ok: false, status: 500, error: cntErr.message }
    const adminIds = admins ?? []
    if (adminIds.length === 1 && adminIds[0]?.user_id === targetUserId) {
      return { ok: false, status: 400, error: '系統須至少保留一位 Admin，無法將唯一管理員降權' }
    }
  }

  const mergedMeta = { ...prevMeta, starcare_role: newRole }

  const { error: urErr } = await supabase.from('user_roles').upsert(
    { user_id: targetUserId, role: newRole },
    { onConflict: 'user_id' },
  )
  if (urErr) return { ok: false, status: 500, error: urErr.message }

  const { error: authUpdErr } = await supabase.auth.admin.updateUserById(targetUserId, {
    app_metadata: mergedMeta,
  })

  if (authUpdErr) {
    if (beforeDbRole == null) {
      await supabase.from('user_roles').delete().eq('user_id', targetUserId)
    } else {
      await supabase.from('user_roles').update({ role: beforeDbRole }).eq('user_id', targetUserId)
    }
    return { ok: false, status: 500, error: `Auth metadata 更新失敗，已回溯 user_roles：${authUpdErr.message}` }
  }

  const audit = await insertAuditEvent(supabase, {
    action: 'USER_RBAC_ROLE_SET',
    entity_type: 'Auth',
    entity_id: targetUserId,
    actor_id: actorUserId,
    before_state: JSON.stringify({ dbRole: beforeDbRole, appMetadataStarcare: prevStarcare || null }),
    after_state: JSON.stringify({ dbRole: newRole, appMetadataStarcare: newRole }),
    detail: 'Admin 變更使用者 STARCARE 角色（user_roles 與 app_metadata.starcare_role）；受影響者須重登入以刷新 JWT。',
  })

  if (!audit.ok) {
    await supabase.auth.admin.updateUserById(targetUserId, { app_metadata: prevMeta })
    if (beforeDbRole == null) {
      await supabase.from('user_roles').delete().eq('user_id', targetUserId)
    } else {
      await supabase.from('user_roles').update({ role: beforeDbRole }).eq('user_id', targetUserId)
    }
    return { ok: false, status: 500, error: `審計落庫失敗，已回溯：${audit.message}` }
  }

  return { ok: true }
}

export const parseNewRole = (raw: unknown): StarcareDbRole | null => {
  const s = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
  return isDbRole(s) ? s : null
}
