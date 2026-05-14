import { describe, expect, it } from 'vitest'
import { SCHEDULING_DATA_LOAD_ERROR_MESSAGE } from './schedulingDataLoadMessage'

describe('schedulingDataLoadMessage', () => {
  it('載入失敗固定句（UI／E2E 對齊）', () => {
    expect(SCHEDULING_DATA_LOAD_ERROR_MESSAGE).toContain('網路')
    expect(SCHEDULING_DATA_LOAD_ERROR_MESSAGE).toContain('API')
  })
})
