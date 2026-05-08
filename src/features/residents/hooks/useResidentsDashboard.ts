import { useAuth, useAuthActorId } from '../../auth'
import { useResidents } from './useResidents'
import { downloadResidentsExportCsv } from '../services/residentsExportCsvService'
import { recordResidentsListExportAudit } from '../services/residentsReportingAuditService'
import { useResidentsDashboardFormSheet } from './useResidentsDashboardFormSheet'
import { mapResidentToDashboardFormInput } from '../utils/mapResidentToDashboardFormInput'
import type { ResidentInput } from '../types/resident'

/** 院友總覽頁：表單／抽屜／匯出與 useResidents 組裝（PDF 01 §院友管理） */
export const useResidentsDashboard = () => {
  const { hasPermission } = useAuth()
  const canMaintainResidentRecords = hasPermission('view:residents')
  const actorId = useAuthActorId()
  const {
    residents,
    errorMessage,
    createResident,
    updateResident,
    softDeleteResident,
    batchSoftDeleteResidents,
    batchUpdateResidents,
    softDeleteBusyResidentId,
    refreshResidents,
    auditTrail,
  } = useResidents()

  const sheet = useResidentsDashboardFormSheet(
    residents,
    canMaintainResidentRecords,
    actorId,
    createResident,
    updateResident,
  )

  const exportResidentsCsv = () => {
    if (residents.length === 0) return
    downloadResidentsExportCsv(residents)
    recordResidentsListExportAudit(actorId, residents.length)
  }

  const exportSelectedResidentsCsv = (residentIds: string[]) => {
    const selected = residents.filter((item) => residentIds.includes(item.id))
    if (selected.length === 0) return
    downloadResidentsExportCsv(selected)
    recordResidentsListExportAudit(actorId, selected.length)
  }

  const batchSoftDeleteResidentsByIds = async (residentIds: string[]): Promise<void> => {
    await batchSoftDeleteResidents(actorId, residentIds)
  }

  const batchUpdateResidentsByIds = async (
    residentIds: string[],
    patch: Partial<Pick<ResidentInput, 'fundingType' | 'serviceType'>>,
  ): Promise<void> => {
    const updates = residents
      .filter((item) => residentIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        input: {
          ...mapResidentToDashboardFormInput(item),
          ...(patch.fundingType ? { fundingType: patch.fundingType } : null),
          ...(patch.serviceType ? { serviceType: patch.serviceType } : null),
        },
      }))
    await batchUpdateResidents(actorId, updates)
  }

  return {
    canMaintainResidentRecords,
    actorId,
    residents,
    errorMessage,
    softDeleteBusyResidentId,
    refreshResidents,
    auditTrail,
    ...sheet,
    exportResidentsCsv,
    exportSelectedResidentsCsv,
    batchSoftDeleteResidentsByIds,
    batchUpdateResidentsByIds,
    softDeleteResident,
  }
}
