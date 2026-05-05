import type { MutableRefObject } from 'react'
import type { ServiceFormRepository } from '../../../repositories/serviceFormRepository'
import type { ServiceFormRecord } from '../types/serviceForm'
import { SERVICE_FORMS_WORKSPACE_FACILITY_ID } from './serviceFormWorkspaceFacility'
import { scheduleEdgeUpsertAfterLocalMutation } from './serviceFormWorkspacePostMutation'

/** Seq 17：本機 domain 變更後排程 Edge upsert（skipAudit 須與 domain 呼叫一致）。 */
export const scheduleWorkspaceServiceFormEdgeUpsert = (
  serviceFormRepoRef: MutableRefObject<ServiceFormRepository>,
  refreshForms: () => void,
  row: ServiceFormRecord,
  skipAudit: boolean,
): void => {
  scheduleEdgeUpsertAfterLocalMutation(
    serviceFormRepoRef.current,
    SERVICE_FORMS_WORKSPACE_FACILITY_ID,
    row,
    skipAudit,
    refreshForms,
  )
}
