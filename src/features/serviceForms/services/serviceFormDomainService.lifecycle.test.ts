/** @vitest-environment happy-dom */
import { describe, expect, it, beforeEach } from 'vitest'
import type { SchedulingSession } from '../../../services/schedulingService'
import { workSessionResponseStore } from '../../../services/workSessionResponseStore'
import { saveServiceForms } from '../../../services/serviceFormStorage'
import { acceptWorkSession } from '../../workSessionPlans/services/workSessionPlanService'
import {
  approveServiceForm,
  rejectServiceFormRevision,
  submitServiceForm,
  upsertDraftServiceForm,
} from './serviceFormDomainService'
import { resolveLifecycleStatus } from '../../workSessionPlans/services/workSessionPlanService'

const session = (): SchedulingSession => ({
  id: 'sess-form-1',
  staffId: 'staff-match',
  staffName: '測試員',
  date: '2026-05-15',
  timeSlot: '10:00',
  serviceType: 'Subsidized_Rehab',
  capacity: 1,
})

/** 01 §2.1／§2.2 與 localStorage 連動之流程（Seq 17） */
describe('serviceFormDomainService 生命週期', () => {
  beforeEach(() => {
    workSessionResponseStore.clearAll()
    saveServiceForms([])
  })

  it('submitServiceForm：ACCEPTED 後可提交草稿', () => {
    acceptWorkSession('actor-staff', 'sess-form-1')
    const draft = upsertDraftServiceForm(
      'actor-staff',
      'staff-match',
      session(),
      'res-1',
      '院友甲',
      '肌力訓練完成',
      null,
    )
    const submitted = submitServiceForm('actor-staff', 'staff-match', draft, session())
    expect(submitted.status).toBe('SUBMITTED')
  })

  it('核准表單後工作節為 COMPLETED（01 §2.1）', () => {
    acceptWorkSession('actor-staff', 'sess-form-1')
    const draft = upsertDraftServiceForm(
      'actor-staff',
      'staff-match',
      session(),
      'res-1',
      '院友甲',
      '紀要',
      null,
    )
    const submitted = submitServiceForm('actor-staff', 'staff-match', draft, session())
    approveServiceForm('TeamLead', 'actor-lead', submitted)
    expect(resolveLifecycleStatus('sess-form-1')).toBe('COMPLETED')
  })

  it('upsertDraftServiceForm：已 SUBMITTED 之 id 再儲存時拒絕（01 §2.2）', () => {
    const s = { ...session(), id: 'sess-form-subm' }
    acceptWorkSession('actor-staff', s.id)
    const draft = upsertDraftServiceForm('actor-staff', 'staff-match', s, 'res-1', '院友甲', '初稿', null)
    const submitted = submitServiceForm('actor-staff', 'staff-match', draft, s)
    expect(submitted.status).toBe('SUBMITTED')
    expect(() =>
      upsertDraftServiceForm('actor-staff', 'staff-match', s, 'res-1', '院友甲', '試圖改寫', submitted.id),
    ).toThrow(/待審/)
  })

  it('upsertDraftServiceForm：退回 REJECTED_NEEDS_REVISION 後可再儲存草稿（01 §2.2）', () => {
    const s = { ...session(), id: 'sess-form-rev' }
    acceptWorkSession('actor-staff', s.id)
    const draft = upsertDraftServiceForm('actor-staff', 'staff-match', s, 'res-1', '院友甲', '初稿', null)
    const submitted = submitServiceForm('actor-staff', 'staff-match', draft, s)
    const rejected = rejectServiceFormRevision('TeamLead', 'actor-lead', submitted, '請補強紀錄')
    expect(rejected.status).toBe('REJECTED_NEEDS_REVISION')
    const revised = upsertDraftServiceForm(
      'actor-staff',
      'staff-match',
      s,
      'res-1',
      '院友甲',
      '修訂版紀要',
      rejected.id,
    )
    expect(revised.narrative).toBe('修訂版紀要')
    expect(revised.status).toBe('REJECTED_NEEDS_REVISION')
  })

  it('upsertDraftServiceForm：已 APPROVED 之 id 再儲存時拒絕（01 §2.2）', () => {
    acceptWorkSession('actor-staff', 'sess-form-1')
    const draft = upsertDraftServiceForm(
      'actor-staff',
      'staff-match',
      session(),
      'res-1',
      '院友甲',
      '初稿',
      null,
    )
    const submitted = submitServiceForm('actor-staff', 'staff-match', draft, session())
    const approved = approveServiceForm('TeamLead', 'actor-lead', submitted)
    expect(() =>
      upsertDraftServiceForm(
        'actor-staff',
        'staff-match',
        session(),
        'res-1',
        '院友甲',
        '試圖改寫',
        approved.id,
      ),
    ).toThrow(/已核准並鎖定/)
  })
})
