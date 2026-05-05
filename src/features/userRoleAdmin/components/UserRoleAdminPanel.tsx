import { uiTokens } from '../../shared/ui/uiTokens'
import { useUserRoleAdminSubmit, type UserRoleAdminFormRole } from '../hooks/useUserRoleAdminSubmit'

const ROLE_OPTIONS: { value: UserRoleAdminFormRole; label: string }[] = [
  { value: 'staff', label: 'Staff（職員）' },
  { value: 'teamlead', label: 'TeamLead（組長）' },
  { value: 'admin', label: 'Admin（管理員）' },
]

/** PDF 01 §1：Admin 表單；後端 admin-user-role-set 同步 user_roles 與 app_metadata */
export const UserRoleAdminPanel = () => {
  const { email, setEmail, userId, setUserId, role, setRole, busy, message, error, submit } =
    useUserRoleAdminSubmit()

  return (
    <article className={uiTokens.surfaceCard}>
      <p className={uiTokens.sectionHelp}>
        填寫對方登入信箱<strong>或</strong> Auth UUID（擇一；若兩者皆填則以 UUID 為準）。送出後同步資料庫與
        JWT metadata；須已部署 Edge <code className="text-xs">admin-user-role-set</code>。
      </p>
      <div className={uiTokens.stackVerticalMt4}>
        <div className={uiTokens.formFieldStack}>
          <label className={uiTokens.formLabel} htmlFor="user-role-admin-email">
            目標電子郵件
          </label>
          <input
            id="user-role-admin-email"
            className={uiTokens.formInput}
            type="email"
            autoComplete="off"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="name@example.com"
            disabled={busy}
          />
        </div>
        <div className={uiTokens.formFieldStack}>
          <label className={uiTokens.formLabel} htmlFor="user-role-admin-uuid">
            目標使用者 UUID（選填）
          </label>
          <input
            id="user-role-admin-uuid"
            className={uiTokens.formInput}
            type="text"
            autoComplete="off"
            value={userId}
            onChange={(ev) => setUserId(ev.target.value)}
            placeholder="00000000-0000-0000-0000-000000000000"
            disabled={busy}
          />
        </div>
        <div className={uiTokens.formFieldStack}>
          <label className={uiTokens.formLabel} htmlFor="user-role-admin-role">
            新角色
          </label>
          <select
            id="user-role-admin-role"
            className={uiTokens.formSelect}
            value={role}
            onChange={(ev) => setRole(ev.target.value as UserRoleAdminFormRole)}
            disabled={busy}
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {error ? (
          <p className={uiTokens.formInlineError} role="alert">
            {error}
          </p>
        ) : null}
        {message ? <p className={uiTokens.inlineSuccessText}>{message}</p> : null}
        <div>
          <button type="button" className={uiTokens.btnPrimary} onClick={() => void submit()} disabled={busy}>
            {busy ? '處理中…' : '變更角色'}
          </button>
        </div>
      </div>
    </article>
  )
}
