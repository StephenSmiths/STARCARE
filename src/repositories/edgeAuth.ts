/** Edge Function 呼叫時帶入之 access_token（由 AuthProvider 註冊） */
export type EdgeAccessTokenGetter = () => Promise<string | null>

let getter: EdgeAccessTokenGetter | null = null

export const registerEdgeAccessTokenGetter = (fn: EdgeAccessTokenGetter | null): void => {
  getter = fn
}

export const getEdgeAccessToken = async (): Promise<string | null> => {
  return getter ? await getter() : null
}
