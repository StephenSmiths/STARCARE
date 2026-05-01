/** 01 §2.2 表單狀態機（Seq 17） */
export type ServiceFormStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED_NEEDS_REVISION'

/** 服務紀錄表單（本地骨架；正式環境應搬至 Edge／PostgreSQL） */
export interface ServiceFormRecord {
  id: string
  sessionId: string
  sessionDate: string
  staffProfileId: string
  residentId: string
  residentName: string
  /** 服務內容／紀要（簡化單欄；PDF 全文待對表） */
  narrative: string
  status: ServiceFormStatus
  /** 填表人 JWT sub 或 demo actor（審核時比對不可審自己） */
  ownerActorId: string
  createdAt: string
  updatedAt: string
  submittedAt: string | null
  reviewedAt: string | null
  reviewerActorId: string | null
  reviewNote: string | null
}
