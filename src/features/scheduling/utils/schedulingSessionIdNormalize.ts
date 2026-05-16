/** 排班儲存時：將 P2 切分產生之虛擬 session id 還原為活動時段主檔 id */
export const P2_SESSION_SPLIT_MARKER = '~p2~'

export const isP2SplitSchedulingSessionId = (sessionId: string): boolean =>
  sessionId.includes(P2_SESSION_SPLIT_MARKER)

export const normalizeSchedulingSessionIdForPersistence = (sessionId: string): string => {
  const idx = sessionId.indexOf(P2_SESSION_SPLIT_MARKER)
  if (idx < 0) return sessionId
  return sessionId.slice(0, idx)
}
