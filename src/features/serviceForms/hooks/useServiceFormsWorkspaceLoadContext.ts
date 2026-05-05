import { useCallback, useEffect, useRef, useState } from 'react'
import type { SchedulingSession } from '../../../services/schedulingService'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { residentService } from '../../residents/services/residentService'
import type { Resident } from '../../residents/types/resident'
import { loadServiceForms } from '../../../services/serviceFormStorage'
import {
  createServiceFormRepository,
  type ServiceFormRepository,
} from '../../../repositories/serviceFormRepository'
import { mergeServiceFormsWithRemote } from '../../../repositories/serviceFormSyncService'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import type { ServiceFormRecord } from '../types/serviceForm'
import { SERVICE_FORMS_WORKSPACE_FACILITY_ID } from './serviceFormWorkspaceFacility'

/** PDF 02【5】時段／院友／表單合併載入（Seq 17） */
export const useServiceFormsWorkspaceLoadContext = () => {
  const serviceFormRepoRef = useRef<ServiceFormRepository>(createServiceFormRepository())
  const [sessions, setSessions] = useState<SchedulingSession[]>([])
  const [residents, setResidents] = useState<Resident[]>([])
  const [forms, setForms] = useState<ServiceFormRecord[]>(() => loadServiceForms())
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const loadSeqRef = useRef(0)

  const refreshForms = useCallback(() => setForms(loadServiceForms()), [])

  const reloadContext = useCallback(async () => {
    const seq = ++loadSeqRef.current
    setLoadError('')
    setIsLoading(true)
    try {
      const [sess, res] = await Promise.all([
        schedulingConfigService.listSchedulingSessions(SERVICE_FORMS_WORKSPACE_FACILITY_ID),
        residentService.listActiveResidents(),
      ])
      if (seq !== loadSeqRef.current) return
      setSessions(sess)
      setResidents(res)
      const merged = await mergeServiceFormsWithRemote(SERVICE_FORMS_WORKSPACE_FACILITY_ID)
      if (seq !== loadSeqRef.current) return
      setForms(merged)
    } catch {
      if (seq === loadSeqRef.current) {
        setLoadError('無法載入時段或院友資料')
      }
    } finally {
      if (seq === loadSeqRef.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void reloadContext()
    })
  }, [reloadContext])

  useInvalidateOnSystemSettingsExternalChange(reloadContext)

  return {
    serviceFormRepoRef,
    sessions,
    residents,
    forms,
    isLoading,
    loadError,
    reloadContext,
    refreshForms,
  }
}
