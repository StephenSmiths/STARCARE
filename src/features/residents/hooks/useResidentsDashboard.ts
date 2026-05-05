import { useAuth, useAuthActorId } from '../../auth'
import { useResidents } from './useResidents'
import { downloadResidentsExportCsv } from '../services/residentsExportCsvService'
import { recordResidentsListExportAudit } from '../services/residentsReportingAuditService'
import { useResidentsDashboardFormSheet } from './useResidentsDashboardFormSheet'

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
    softDeleteResident,
  }
}
