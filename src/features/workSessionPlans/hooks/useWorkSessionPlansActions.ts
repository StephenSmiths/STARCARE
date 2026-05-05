import { useCallback } from 'react'
import {
  acceptWorkSession,
  bulkSoftDeleteWorkSessionsForTeam,
  rejectWorkSession,
} from '../services/workSessionPlanLifecycleMutations'

type Params = {
  actorId: string
  bumpStore: () => void
  reload: () => Promise<void>
}

/** 接收／拒絕／主管批量軟刪後 bump 與重載（PDF 02【4】）。 */
export const useWorkSessionPlansActions = ({ actorId, bumpStore, reload }: Params) => {
  const accept = useCallback(
    (sessionId: string) => {
      try {
        acceptWorkSession(actorId, sessionId)
        bumpStore()
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '接收失敗')
      }
    },
    [actorId, bumpStore],
  )

  const reject = useCallback(
    (sessionId: string) => {
      try {
        rejectWorkSession(actorId, sessionId)
        bumpStore()
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '拒絕失敗')
      }
    },
    [actorId, bumpStore],
  )

  const bulkSoftDelete = useCallback(
    async (sessionIds: string[]) => {
      await bulkSoftDeleteWorkSessionsForTeam(actorId, sessionIds)
      bumpStore()
      await reload()
    },
    [actorId, bumpStore, reload],
  )

  return { accept, reject, bulkSoftDelete }
}
