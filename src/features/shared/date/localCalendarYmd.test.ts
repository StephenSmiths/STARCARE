import { describe, expect, it } from 'vitest'
import { localCalendarYmd } from './localCalendarYmd'

describe('localCalendarYmd', () => {
  it('輸出為 YYYY-MM-DD（十進位月日補零）', () => {
    expect(localCalendarYmd()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
