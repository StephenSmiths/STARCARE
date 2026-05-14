/** @vitest-environment happy-dom */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingRules } from '../../../repositories/schedulingRulesRepository'
import { DEFAULT_SYSTEM_SETTINGS } from '../../systemSettings/repository/systemSettingsRepository'
import { buildEngineConstraintsFromRulesAndUi, mapRulesToConstraints } from './schedulingHookHelpers'

const loadSystemSettingsMock = vi.hoisted(() => vi.fn())

const baseRules = (over: Partial<SchedulingRules>): SchedulingRules => ({
  facilityId: 'f-test',
  enableSubsidizedRehab: true,
  enableDementiaCare: true,
  scPriorityEnabled: true,
  dailySameServiceLimit: 1,
  minGapDaysSameService: 1,
  groupCapacityLimit: 99,
  allowScTherapistOnly: false,
  therapistGroupSessionsDailyCap: 8,
  assistantGroupSessionsDailyCap: 8,
  ...over,
})

vi.mock('../../systemSettings', () => ({
  loadSystemSettings: () => loadSystemSettingsMock(),
}))

describe('schedulingHookHelpers（PDF 02【16】規則→引擎約束）', () => {
  describe('mapRulesToConstraints', () => {
    it('null 時回傳預設並帶出 P1 小組場次上限（可為 undefined）', () => {
      const c = mapRulesToConstraints(null)
      expect(c.dailySameServiceLimit).toBe(1)
      expect(c.minGapDaysSameService).toBe(1)
      expect(c.groupCapacityLimit).toBe(Number.POSITIVE_INFINITY)
      expect(c.allowScTherapistOnly).toBe(false)
      expect(c.therapistGroupSessionsDailyCap).toBeUndefined()
      expect(c.assistantGroupSessionsDailyCap).toBeUndefined()
    })

    it('合併 DB 規則欄位', () => {
      const rules = baseRules({
        dailySameServiceLimit: 2,
        minGapDaysSameService: 3,
        groupCapacityLimit: 8,
        allowScTherapistOnly: true,
        therapistGroupSessionsDailyCap: 2,
        assistantGroupSessionsDailyCap: 3,
      })
      const c = mapRulesToConstraints(rules)
      expect(c).toMatchObject({
        dailySameServiceLimit: 2,
        minGapDaysSameService: 3,
        groupCapacityLimit: 8,
        allowScTherapistOnly: true,
        therapistGroupSessionsDailyCap: 2,
        assistantGroupSessionsDailyCap: 3,
      })
    })
  })

  describe('buildEngineConstraintsFromRulesAndUi', () => {
    beforeEach(() => {
      loadSystemSettingsMock.mockReset()
      loadSystemSettingsMock.mockReturnValue({
        ...DEFAULT_SYSTEM_SETTINGS,
        specialCareTherapistOnly: false,
      })
    })

    it('規則與本機皆 false 時 allowScTherapistOnly 為 false', () => {
      const rules = baseRules({ allowScTherapistOnly: false })
      expect(buildEngineConstraintsFromRulesAndUi(rules).allowScTherapistOnly).toBe(false)
    })

    it('規則為 true 時啟用（本機 false）', () => {
      const rules = baseRules({ allowScTherapistOnly: true })
      expect(buildEngineConstraintsFromRulesAndUi(rules).allowScTherapistOnly).toBe(true)
    })

    it('本機 specialCareTherapistOnly 為 true 時與規則 OR 合併', () => {
      loadSystemSettingsMock.mockReturnValue({
        ...DEFAULT_SYSTEM_SETTINGS,
        specialCareTherapistOnly: true,
      })
      const rules = baseRules({ allowScTherapistOnly: false })
      expect(buildEngineConstraintsFromRulesAndUi(rules).allowScTherapistOnly).toBe(true)
    })
  })
})
