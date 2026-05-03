/**
 * 01 §2.2：表單本機與 Edge `service-forms-list` 合併（Seq 3／17／23）。
 * 遠端失敗時回傳本機快照且不覆寫 storage。
 */
import type { ServiceFormRecord } from '../features/serviceForms/types/serviceForm'
import { createServiceFormRepository } from './serviceFormRepository'
import { loadServiceForms, saveServiceForms } from '../services/serviceFormStorage'

/** 同 id 以遠端列覆寫；其餘本機列保留（Seq 3／23 合併規則） */
export const mergeServiceFormSnapshotsById = (
  local: ServiceFormRecord[],
  remote: ServiceFormRecord[],
): ServiceFormRecord[] => {
  const byId = new Map(local.map((f) => [f.id, f]))
  for (const row of remote) {
    byId.set(row.id, row)
  }
  return [...byId.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export const mergeServiceFormsWithRemote = async (
  facilityId: string,
): Promise<ServiceFormRecord[]> => {
  const local = loadServiceForms()
  const remote = await createServiceFormRepository().listForms(facilityId)
  if (remote === null) return local
  const merged = mergeServiceFormSnapshotsById(local, remote)
  saveServiceForms(merged)
  return merged
}

/**
 * PDF 02【10】Seq 23：僅自遠端拉 **APPROVED** 列覆蓋同 id，不刪除本機尚不存在於遠端之草稿／待審。
 */
export const mergeApprovedFormsFromRemote = async (
  facilityId: string,
): Promise<ServiceFormRecord[]> => {
  const local = loadServiceForms()
  const remote = await createServiceFormRepository().listForms(facilityId, { approvedOnly: true })
  if (remote === null) return local
  const merged = mergeServiceFormSnapshotsById(local, remote)
  saveServiceForms(merged)
  return merged
}

/**
 * PDF 02【10】／Seq 3：歷史文件等「以庫為準」場景——遠端成功時回傳 **僅 DB 核准列**，
 * 並將該批併入本機快取（不擴充展示清單至本機獨有已核准列）。
 */
export const loadApprovedServiceFormsDbPrimary = async (
  facilityId: string,
): Promise<ServiceFormRecord[] | null> => {
  const remote = await createServiceFormRepository().listForms(facilityId, { approvedOnly: true })
  if (remote === null) return null
  const merged = mergeServiceFormSnapshotsById(loadServiceForms(), remote)
  saveServiceForms(merged)
  return remote
}
