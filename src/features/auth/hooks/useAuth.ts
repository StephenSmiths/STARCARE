import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from '../context/authContext'

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth 必須在 AuthProvider 內使用')
  }
  return ctx
}
