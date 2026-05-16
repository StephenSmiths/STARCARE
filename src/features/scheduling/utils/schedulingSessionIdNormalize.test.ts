import { describe, expect, it } from 'vitest'
import {
  normalizeSchedulingSessionIdForPersistence,
  P2_SESSION_SPLIT_MARKER,
} from './schedulingSessionIdNormalize'

describe('normalizeSchedulingSessionIdForPersistence', () => {
  it('虛擬 P2 id 還原為主檔 id', () => {
    expect(normalizeSchedulingSessionIdForPersistence(`abc${P2_SESSION_SPLIT_MARKER}2`)).toBe('abc')
  })

  it('一般 id 不變', () => {
    expect(normalizeSchedulingSessionIdForPersistence('session-1')).toBe('session-1')
  })
})
