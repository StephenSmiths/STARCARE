import { describe, expect, it, beforeEach } from 'vitest'
import { workSessionResponseStore } from '../../../services/workSessionResponseStore'
import {
  acceptWorkSession,
  resolveLifecycleStatus,
} from '../../workSessionPlans/services/workSessionPlanService'
import { completeWorkSessionAfterFormApproved } from './workSessionCompletionService'

describe('workSessionCompletionService（01 §2.1 Seq 2）', () => {
  beforeEach(() => {
    workSessionResponseStore.clearAll()
  })

  it('核准閉環：ACCEPTED → COMPLETED', () => {
    acceptWorkSession('staff-1', 'sess-a')
    expect(resolveLifecycleStatus('sess-a')).toBe('ACCEPTED')
    completeWorkSessionAfterFormApproved('sess-a', 'lead-1')
    expect(resolveLifecycleStatus('sess-a')).toBe('COMPLETED')
  })

  it('重複完成為幂等', () => {
    acceptWorkSession('staff-1', 'sess-b')
    completeWorkSessionAfterFormApproved('sess-b', 'lead-1')
    completeWorkSessionAfterFormApproved('sess-b', 'lead-1')
    expect(resolveLifecycleStatus('sess-b')).toBe('COMPLETED')
  })

  it('未接收不可標完成', () => {
    expect(() => completeWorkSessionAfterFormApproved('sess-x', 'lead-1')).toThrow(/已接收/)
  })
})
