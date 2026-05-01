import { getEdgeAccessToken } from './edgeAuth'

/** 呼叫 Supabase Edge 之標頭：Bearer 為使用者 JWT，apikey 為 anon（閘道要求） */
export const buildEdgeInvokeHeaders = async (
  anonKey: string,
  idempotencyKey?: string,
): Promise<Record<string, string>> => {
  const token = (await getEdgeAccessToken())?.trim()
  if (!token) {
    throw new Error('請先登入')
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    apikey: anonKey,
  }
  if (idempotencyKey) {
    headers['X-Idempotency-Key'] = idempotencyKey
  }
  return headers
}
