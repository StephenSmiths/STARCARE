import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireAdmin } from '../_shared/requireAdmin.ts'
import {
  parseNewRole,
  resolveTargetUserId,
  runAdminUserRoleSet,
} from '../_shared/adminUserRoleSetCore.ts'

/** PDF 01 §1：僅 Admin；同步 public.user_roles 與 Auth app_metadata，並寫 audit_events（entity Auth） */
Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') return emptyOk()
    if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)

    const adminCtx = await requireAdmin(req)
    if (adminCtx instanceof Response) return adminCtx

    let body: { targetUserId?: unknown; targetEmail?: unknown; role?: unknown }
    try {
      body = (await req.json()) as typeof body
    } catch {
      return json({ error: 'JSON 解析失敗' }, 400)
    }

    const supabase = getServiceClient()
    const resolved = await resolveTargetUserId(supabase, body.targetUserId, body.targetEmail)
    if ('error' in resolved) return json({ error: resolved.error }, resolved.status)

    const newRole = parseNewRole(body.role)
    if (!newRole) return json({ error: 'role 須為 staff、teamlead 或 admin' }, 400)

    const out = await runAdminUserRoleSet({
      supabase,
      actorUserId: adminCtx.user.id,
      targetUserId: resolved.id,
      newRole,
    })
    if (!out.ok) return json({ error: out.error }, out.status)
    return json({ ok: true, targetUserId: resolved.id, role: newRole })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
