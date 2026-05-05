/** Edge Function 請求：暫態錯誤退避重試（院友 CRUD 共用）。 */

const wait = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504])

/** 每次重試皆重新取得 headers（Session／anon 可能更新）。 */
export const fetchResidentEdgeWithRetry = async (
  supabaseUrl: string,
  getEdgeHeaders: () => Promise<Record<string, string>>,
  path: string,
  options?: RequestInit,
): Promise<Response> => {
  const retryDelays = [0, 300, 900]
  let lastError: unknown
  for (const delay of retryDelays) {
    if (delay > 0) {
      await wait(delay)
    }
    try {
      const base = await getEdgeHeaders()
      const response = await fetch(`${supabaseUrl}${path}`, {
        ...options,
        headers: {
          ...base,
          ...options?.headers,
        },
      })
      if (response.ok || !RETRYABLE_STATUS.has(response.status)) {
        return response
      }
      lastError = new Error(`暫時性錯誤：${response.status}`)
    } catch (error) {
      lastError = error
    }
  }
  throw new Error(`Edge Function 請求失敗：${String(lastError)}`)
}
