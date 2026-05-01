import { describe, expect, it, beforeEach } from 'vitest'
import type { SchedulingSession } from '../../../services/schedulingService'
import { workSessionResponseStore } from '../../../services/workSessionResponseStore'
import { saveServiceForms } from '../../../services/serviceFormStorage'
import { acceptWorkSession } from '../../workSessionPlans/services/workSessionPlanService'
import {
  assertSessionAcceptedForSubmit,
  submitServiceForm,
  upsertDraftServiceForm,
} from './serviceFormDomainService'

const session = (): SchedulingSession => ({
  id: 'sess-form-1',
  staffId: 'staff-match',
  staffName: '測試員',
  date: '2026-05-15',
  timeSlot: '10:00',
  serviceType: 'Subsidized_Rehab',
  capacity: 1,
})

describe('serviceFormDomainService (Seq 17)', () => {
  beforeEach(() => {
    workSessionResponseStore.clearAll()
    saveServiceForms([])
  })

  it('assertSessionAcceptedForSubmit：未接收時拒絕', () => {
    expect(() => assertSessionAcceptedForSubmit('sess-form-1')).toThrow(/已接收/)
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
})
