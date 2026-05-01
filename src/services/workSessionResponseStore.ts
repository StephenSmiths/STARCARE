/** 本地持久化（localStorage）；正式環境應改為 Edge／DB（01 §2.1） */

const STORAGE_KEY = 'starcare-work-session-responses-v1'

export type PersistedWorkSessionStatus = 'ACCEPTED' | 'REJECTED' | 'COMPLETED'

export interface StoredWorkSessionResponse {
  sessionId: string
  status: PersistedWorkSessionStatus
  actorId: string
  occurredAt: string
}

/** PDF 02【4】／01 §2.1：工作節接收狀態（Seq 16 前端骨架） */
export class WorkSessionResponseStore {
  private readonly rows = new Map<string, StoredWorkSessionResponse>()

  constructor() {
    this.hydrate()
  }

  private hydrate(): void {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as StoredWorkSessionResponse[]
      if (!Array.isArray(parsed)) return
      for (const item of parsed) {
        if (item?.sessionId) this.rows.set(item.sessionId, item)
      }
    } catch {
      /* 忽略損壞資料 */
    }
  }

  private persist(): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.rows.values()]))
  }

  get(sessionId: string): StoredWorkSessionResponse | undefined {
    return this.rows.get(sessionId)
  }

  set(record: StoredWorkSessionResponse): void {
    this.rows.set(record.sessionId, record)
    this.persist()
  }

  remove(sessionId: string): void {
    this.rows.delete(sessionId)
    this.persist()
  }

  /** 測試／除錯用 */
  clearAll(): void {
    this.rows.clear()
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }
}

export const workSessionResponseStore = new WorkSessionResponseStore()
