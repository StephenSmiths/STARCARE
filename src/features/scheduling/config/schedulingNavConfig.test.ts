import { describe, expect, it } from 'vitest'
import { SCHEDULING_NAV_GROUPS } from './schedulingNavConfig'

describe('SCHEDULING_NAV_GROUPS（排班側欄導覽）', () => {
  it('含智能排班錨點與 view:scheduling 權限', () => {
    const flat = SCHEDULING_NAV_GROUPS.flatMap((g) => g.items)
    const scheduling = flat.find((i) => i.href === '#scheduling')
    expect(scheduling).toEqual(
      expect.objectContaining({ label: '智能排班', permission: 'view:scheduling' }),
    )
  })

  it('各分組與項目均有標題、連結與權限字首', () => {
    for (const g of SCHEDULING_NAV_GROUPS) {
      expect(g.heading.trim().length).toBeGreaterThan(0)
      expect(g.items.length).toBeGreaterThan(0)
      for (const item of g.items) {
        expect(item.label.trim().length).toBeGreaterThan(0)
        expect(item.href.startsWith('#')).toBe(true)
        expect(item.permission.startsWith('view:')).toBe(true)
      }
    }
  })
})
