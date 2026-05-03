import { useEffect, useState } from 'react'
import type { AuditTrailRecord } from '../../../services/auditTrailService'
import { globalAuditTrailService } from '../../../services/auditTrailService'

/** 訂閱全域審計變更（含遠端合併），供面板與通知中心重繪（Seq 12） */
export const useAuditTrailList = (): AuditTrailRecord[] => {
  const [, setTick] = useState(0)
  useEffect(
    () => globalAuditTrailService.subscribe(() => setTick((t) => t + 1)),
    [],
  )
  return globalAuditTrailService.list()
}
