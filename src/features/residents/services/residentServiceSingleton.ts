import {
  getSupabaseBrowserCredentials,
  isSupabaseBrowserConfigured,
} from '../../../services/supabaseBrowserEnv'
import {
  InMemoryResidentRepository,
  type ResidentRepository,
} from '../repositories/residentRepository'
import { ResidentEdgeRepository } from '../repositories/residentEdgeRepository'
import { ResidentService } from './residentServiceCore'

const createResidentRepository = (): ResidentRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new InMemoryResidentRepository()
  }
  return new ResidentEdgeRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}

const residentRepo = createResidentRepository()
export const residentService = new ResidentService(residentRepo, isSupabaseBrowserConfigured())
