import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { AuthPermission, StarcareRole } from '../permissions'

export type AuthContextValue = {
  session: Session | null
  user: User | null
  role: StarcareRole
  isLoading: boolean
  isConfigured: boolean
  hasPermission: (permission: AuthPermission) => boolean
  canApproveForm: (actorId: string, formOwnerId: string) => boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
