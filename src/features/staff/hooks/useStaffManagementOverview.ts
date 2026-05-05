import { useCallback, useEffect, useRef, useState } from 'react'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import { STAFF_WORKSPACE_FACILITY_ID } from '../constants/staffWorkspaceDefaults'
import { staffManagementService, type StaffOverviewRow } from '../services/staffManagementService'

export const useStaffManagementOverview = (facilityId: string = STAFF_WORKSPACE_FACILITY_ID) => {
  const softDeleteLockRef = useRef(false)
  const loadSeqRef = useRef(0)
  const [rows, setRows] = useState<StaffOverviewRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [softDeleteBusyStaffId, setSoftDeleteBusyStaffId] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const seq = ++loadSeqRef.current
    setIsLoading(true)
    setError('')
    try {
      const data = await staffManagementService.listStaffOverview(facilityId)
      if (seq !== loadSeqRef.current) return
      setRows(data)
    } catch {
      if (seq === loadSeqRef.current) {
        setError('無法載入員工資料概覽，請稍後再試。')
      }
    } finally {
      if (seq === loadSeqRef.current) setIsLoading(false)
    }
  }, [facilityId])

  useEffect(() => {
    queueMicrotask(() => {
      void reload()
    })
  }, [reload])

  useInvalidateOnSystemSettingsExternalChange(reload)

  const softDeleteStaff = async (actorId: string, staffId: string): Promise<void> => {
    if (softDeleteLockRef.current) return
    softDeleteLockRef.current = true
    setSoftDeleteBusyStaffId(staffId)
    setError('')
    try {
      await staffManagementService.softDeleteStaff(actorId, staffId)
      setRows((prev) => prev.filter((row) => row.staffId !== staffId))
    } catch {
      setError('員工軟刪除失敗，請稍後再試。')
    } finally {
      softDeleteLockRef.current = false
      setSoftDeleteBusyStaffId(null)
    }
  }

  return { rows, isLoading, error, softDeleteBusyStaffId, softDeleteStaff, reload }
}
