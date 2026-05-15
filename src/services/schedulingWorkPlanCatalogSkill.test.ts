import { describe, expect, it } from 'vitest'
import type { Activity } from '../repositories/activityRepository'
import {
  isActivityPermittedByWorkPlanCatalogForStaffRole,
  mapActivityToWorkPlanActivityType,
} from './schedulingWorkPlanCatalogSkill'

const act = (partial: Partial<Activity> & Pick<Activity, 'id' | 'name'>): Activity => ({
  facilityId: 'f',
  serviceType: 'Subsidized_Rehab',
  activityKind: 'Training',
  deliveryMode: 'Group',
  minDurationMinutes: 30,
  ...partial,
})

describe('schedulingWorkPlanCatalogSkill', () => {
  it('mapActivityToWorkPlanActivityType：Training＋Group → Group', () => {
    expect(mapActivityToWorkPlanActivityType(act({ id: 'a', name: 'x', deliveryMode: 'Group' }))).toBe('Group')
    expect(mapActivityToWorkPlanActivityType(act({ id: 'a', name: 'x', deliveryMode: 'Individual' }))).toBe('Individual')
  })

  it('mapActivityToWorkPlanActivityType：Assessment／Other', () => {
    expect(mapActivityToWorkPlanActivityType(act({ id: 'a', name: 'x', activityKind: 'Assessment' }))).toBe('Assessment')
    expect(mapActivityToWorkPlanActivityType(act({ id: 'a', name: 'x', activityKind: 'Other' }))).toBe('Other')
  })

  it('OT 小組活動名稱與目錄完全一致時允許', () => {
    const a = act({ id: '1', name: '懷舊治療小組', serviceType: 'Dementia_Care', deliveryMode: 'Group' })
    expect(isActivityPermittedByWorkPlanCatalogForStaffRole(a, 'OT')).toBe(true)
  })

  it('PT 小組：活動名稱包含目錄選項字串時允許（例：肌力訓練）', () => {
    const a = act({ id: '2', name: '下肢肌力訓練', deliveryMode: 'Group' })
    expect(isActivityPermittedByWorkPlanCatalogForStaffRole(a, 'PT')).toBe(true)
  })

  it('職位未定或 TeamLead 不允許目錄放寬', () => {
    const a = act({ id: '3', name: '懷舊治療小組', deliveryMode: 'Group' })
    expect(isActivityPermittedByWorkPlanCatalogForStaffRole(a, undefined)).toBe(false)
    expect(isActivityPermittedByWorkPlanCatalogForStaffRole(a, 'TeamLead')).toBe(false)
  })

  it('名稱不在目錄內則不允許', () => {
    const a = act({ id: '4', name: '完全不存在的活動', deliveryMode: 'Group' })
    expect(isActivityPermittedByWorkPlanCatalogForStaffRole(a, 'OT')).toBe(false)
  })
})
