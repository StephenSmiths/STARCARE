import { describe, expect, it } from 'vitest'
import { allowedActivityTypesByRole, getContentOptions, resolveDetailOptions } from './workPlanCascadeCatalog'

describe('workPlanCascadeCatalog', () => {
  it('PTA 不可選評估', () => {
    expect(allowedActivityTypesByRole.PTA).not.toContain('Assessment')
  })

  it('OT 個別訓練可展開細項', () => {
    const options = getContentOptions('OT', 'Individual')
    expect(options.some((item) => item.value === '日常生活活動訓練')).toBe(true)
    expect(resolveDetailOptions('OT', 'Individual', '日常生活活動訓練')).toContain('進食')
  })

  it('活動內容為其他時，僅提供其他選項', () => {
    expect(getContentOptions('PT', 'Other')).toEqual([{ value: '其他' }])
  })
})
