import { describe, expect, it } from 'vitest'
import type { StaffProfileListRow } from '../../../repositories/staffProfilesListRepository'
import { buildWeeklyRosterStaffProfileLookup } from './weeklyRosterStaffLookup'

const row = (over: Partial<StaffProfileListRow>): StaffProfileListRow => ({
  id: 'p1',
  facilityId: 'f1',
  displayName: '測試員',
  roleType: 'OT',
  serviceScope: 'Subsidized_Rehab',
  ...over,
})

describe('buildWeeklyRosterStaffProfileLookup（週更表：姓名＋職位→主檔 id）', () => {
  it('空列回傳空 Map 與無歧義', () => {
    const { map, ambiguousKeys } = buildWeeklyRosterStaffProfileLookup([])
    expect(map.size).toBe(0)
    expect(ambiguousKeys).toEqual([])
  })

  it('略過 TeamLead（週更表不以此職類對應主檔）', () => {
    const { map } = buildWeeklyRosterStaffProfileLookup([row({ id: 'tl1', roleType: 'TeamLead', displayName: '組長' })])
    expect(map.size).toBe(0)
  })

  it('單一 PT／OT 等列可對應 id', () => {
    const { map, ambiguousKeys } = buildWeeklyRosterStaffProfileLookup([
      row({ id: 'ot-99', displayName: '  王姑娘  ', roleType: 'OT' }),
    ])
    expect(ambiguousKeys).toEqual([])
    expect(map.get('王姑娘\tOT')).toBe('ot-99')
  })

  it('同鍵多筆列為歧義且不寫入 Map', () => {
    const { map, ambiguousKeys } = buildWeeklyRosterStaffProfileLookup([
      row({ id: 'a', displayName: '同名人', roleType: 'PT' }),
      row({ id: 'b', displayName: '同名人', roleType: 'PT' }),
    ])
    expect(ambiguousKeys).toEqual(['同名人\tPT'])
    expect(map.has('同名人\tPT')).toBe(false)
  })

  it('同名不同職類為獨立鍵', () => {
    const { map, ambiguousKeys } = buildWeeklyRosterStaffProfileLookup([
      row({ id: 'x', displayName: '李某', roleType: 'PT' }),
      row({ id: 'y', displayName: '李某', roleType: 'OT' }),
    ])
    expect(ambiguousKeys).toEqual([])
    expect(map.get('李某\tPT')).toBe('x')
    expect(map.get('李某\tOT')).toBe('y')
  })
})
