import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { useResidentsActiveListState } from './useResidentsActiveListState'
import { useResidentsMutations } from './useResidentsMutations'

/** 院友名單：載入、CRUD、審計軌跡（Repository／Service 閉環見各子 hook）。 */
export const useResidents = () => {
  const auditTrail = useAuditTrailList()
  const { residents, errorMessage, setErrorMessage, refreshResidents } = useResidentsActiveListState()
  const {
    createResident,
    updateResident,
    softDeleteResident,
    softDeleteBusyResidentId,
  } = useResidentsMutations(refreshResidents, setErrorMessage)

  return {
    residents,
    errorMessage,
    createResident,
    updateResident,
    softDeleteResident,
    softDeleteBusyResidentId,
    refreshResidents,
    auditTrail,
  }
}
