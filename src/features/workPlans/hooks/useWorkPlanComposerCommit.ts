import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { WorkPlanDraftLine } from '../services/workPlanDraftService'
import { workPlanCommitService } from '../services/workPlanCommitService'

/** PDF 02【2】發布草稿（Seq 14 防連點）。 */
export const useWorkPlanComposerCommit = (
  actorId: string,
  facilityId: string,
  drafts: WorkPlanDraftLine[],
  setDrafts: Dispatch<SetStateAction<WorkPlanDraftLine[]>>,
) => {
  const commitLockRef = useRef(false)
  const [commitError, setCommitError] = useState('')
  const [commitSuccess, setCommitSuccess] = useState('')
  const [isCommitting, setIsCommitting] = useState(false)

  const commitDrafts = useCallback(async () => {
    if (commitLockRef.current || drafts.length === 0) return
    commitLockRef.current = true
    setCommitError('')
    setCommitSuccess('')
    setIsCommitting(true)
    try {
      const result = await workPlanCommitService.commitWorkPlanDrafts(actorId, facilityId, drafts)
      setCommitSuccess(`已發布 ${result.inserted} 個工作節時段，可至「智能排班」載入後執行排班。`)
      setDrafts([])
    } catch (error) {
      setCommitError(error instanceof Error ? error.message : '儲存失敗')
    } finally {
      commitLockRef.current = false
      setIsCommitting(false)
    }
  }, [actorId, drafts, facilityId, setDrafts])

  return {
    commitDrafts,
    commitError,
    commitSuccess,
    isCommitting,
  }
}
