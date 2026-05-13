import { describe, expect, it } from 'vitest'
import type { SchedulingSession } from '../../../services/schedulingService'
import type { SystemSettingsSnapshot } from '../../systemSettings'
import { DEFAULT_SYSTEM_SETTINGS } from '../../systemSettings/repository/systemSettingsRepository'
import {
  filterSchedulingSessionsForSubsidizedEngine,
  filterToDementiaServiceOnly,
  filterToSubsidizedRehabServiceOnly,
} from './schedulingSessionWindowFilterService'

const baseSnap = (): SystemSettingsSnapshot => ({ ...DEFAULT_SYSTEM_SETTINGS })

const rehab = (id: string, timeSlot: string): SchedulingSession => ({
  id,
  staffId: 'st1',
  staffName: 'OT',
  date: '2026-05-04',
  timeSlot,
  serviceType: 'Subsidized_Rehab',
  capacity: 4,
})

describe('filterToSubsidizedRehabServiceOnly（PDF 01 §3 Seq 4）', () => {
  it('剔除 Dementia_Service 僅保留資助復康', () => {
    const sessions = [
      rehab('a', '10:00'),
      { ...rehab('b', '11:00'), id: 'b', serviceType: 'Dementia_Service' as const },
    ]
    expect(filterToSubsidizedRehabServiceOnly(sessions).map((s) => s.id)).toEqual(['a'])
  })
})

describe('filterToDementiaServiceOnly（PDF 01 §3 Seq 7）', () => {
  it('剔除資助復康僅保留認知時段', () => {
    const sessions = [
      rehab('a', '10:00'),
      { ...rehab('b', '11:00'), id: 'b', serviceType: 'Dementia_Service' as const },
    ]
    expect(filterToDementiaServiceOnly(sessions).map((s) => s.id)).toEqual(['b'])
  })
})

describe('schedulingSessionWindowFilterService（PDF 02【16】Seq 29）', () => {
  it('rulesEngineEnabled 為 false 時保留全部時段', () => {
    const sessions = [rehab('a', '23:00')]
    const snap = { ...baseSnap(), rulesEngineEnabled: false }
    expect(filterSchedulingSessionsForSubsidizedEngine(sessions, snap)).toHaveLength(1)
  })

  it('排班視窗外之資助復康時段剔除', () => {
    const sessions = [rehab('ok', '10:00'), rehab('late', '22:30')]
    const out = filterSchedulingSessionsForSubsidizedEngine(sessions, baseSnap())
    expect(out.map((s) => s.id)).toEqual(['ok'])
  })

  it('非治療視窗內之資助復康時段剔除；認知時段仍保留', () => {
    const sessions = [
      rehab('lunch', '13:00'),
      {
        ...rehab('cog', '13:00'),
        id: 'cog',
        serviceType: 'Dementia_Service' as const,
      },
    ]
    const out = filterSchedulingSessionsForSubsidizedEngine(sessions, baseSnap())
    expect(out.map((s) => s.id)).toEqual(['cog'])
  })

  it('支援 HH:mm-HH:mm 取起點判斷', () => {
    const sessions = [rehab('range', '12:30-13:30')]
    const out = filterSchedulingSessionsForSubsidizedEngine(sessions, baseSnap())
    expect(out).toHaveLength(0)
  })

  it('subsidizedRehabNonTherapyIntervals 多段時，資助復康於任一段內皆剔除', () => {
    const snap: SystemSettingsSnapshot = {
      ...baseSnap(),
      subsidizedRehabNonTherapyIntervals: [
        { timeStart: '10:00', timeEnd: '10:30' },
        { timeStart: '12:00', timeEnd: '14:00' },
      ],
    }
    const sessions = [
      rehab('a', '10:15'),
      rehab('b', '13:00'),
      rehab('c', '09:00'),
      { ...rehab('d', '13:00'), id: 'd', serviceType: 'Dementia_Service' as const },
    ]
    const out = filterSchedulingSessionsForSubsidizedEngine(sessions, snap)
    expect(out.map((s) => s.id).sort()).toEqual(['c', 'd'].sort())
  })
})
