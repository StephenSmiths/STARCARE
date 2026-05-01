import { useRef, useState, type FormEvent } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useAuth } from '../hooks/useAuth'

/** 已設定 Supabase 且未登入時顯示 */
export const SignInScreen = () => {
  const { signIn } = useAuth()
  /** 防止連點／雙重在送出完成前重入（對齊業務 PDF 防重覆提交） */
  const submitLockRef = useRef(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitLockRef.current) return
    submitLockRef.current = true
    setError('')
    setPending(true)
    try {
      const { error: msg } = await signIn(email.trim(), password)
      if (msg) {
        setError(msg)
      }
    } finally {
      submitLockRef.current = false
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">STARCARE 登入</h1>
        <p className="mt-2 text-sm text-slate-600">請使用院舍管理員於 Supabase Auth 建立之帳號。</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className={uiTokens.formFieldStack}>
            <label className={uiTokens.formLabel} htmlFor="email">
              電子郵件
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              className={uiTokens.formInput}
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
          <div className={uiTokens.formFieldStack}>
            <label className={uiTokens.formLabel} htmlFor="password">
              密碼
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className={uiTokens.formInput}
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className={`${uiTokens.btnAccent} w-full`}
          >
            {pending ? '登入中…' : '登入'}
          </button>
        </form>
      </div>
    </div>
  )
}
