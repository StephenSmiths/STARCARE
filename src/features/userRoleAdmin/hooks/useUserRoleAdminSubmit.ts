import { useCallback, useState } from 'react'
import { createAdminUserRoleRepository } from '../../../repositories/adminUserRoleRepository'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export type UserRoleAdminFormRole = 'staff' | 'teamlead' | 'admin'

/** 提交變更他人 STARCARE 角色（Edge admin-user-role-set）；busy 鎖定防重覆送出 */
export const useUserRoleAdminSubmit = () => {
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState<UserRoleAdminFormRole>('staff')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(async () => {
    if (busy) return
    const id = userId.trim()
    const em = email.trim()
    if (!id && !em) {
      setError('請填寫目標電子郵件或使用者 UUID')
      setMessage(null)
      return
    }
    if (id && !UUID_RE.test(id)) {
      setError('UUID 格式不正確')
      setMessage(null)
      return
    }
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const repo = createAdminUserRoleRepository()
      const r = await repo.setUserRole(id ? { targetUserId: id, role } : { targetEmail: em, role })
      setMessage(
        `已將使用者 ${r.targetUserId} 設為 ${r.role}；對方需重新登入後側欄角色才會更新。`,
      )
      setEmail('')
      setUserId('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }, [busy, email, userId, role])

  return { email, setEmail, userId, setUserId, role, setRole, busy, message, error, submit }
}
