import { useEffect, useRef, useState } from 'react'
import { staffManagementService, type StaffOverviewRow } from '../services/staffManagementService'

export const useStaffManagementOverview = (facilityId = 'facility-main') => {
  const softDeleteLockRef = useRef(false)
  const [rows, setRows] = useState<StaffOverviewRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [softDeleteBusyStaffId, setSoftDeleteBusyStaffId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await staffManagementService.listStaffOverview(facilityId)
        if (!cancelled) setRows(data)
      } catch {
        if (!cancelled) setError('無法載入員工資料概覽，請稍後再試。')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [facilityId])

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

  return { rows, isLoading, error, softDeleteBusyStaffId, softDeleteStaff }
}
