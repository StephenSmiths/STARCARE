import { describe, expect, it } from 'vitest'
import type { SchedulingConstraints, SchedulingResident, SchedulingSession } from '../../../services/schedulingService'
import { DEMENTIA_WEEKLY_TARGET, runDementiaTrackDryRun } from './dementiaTrackDryRunService'

const constraints: SchedulingConstraints = {
  dailySameServiceLimit: 1,
  minGapDaysSameService: 1,
  groupCapacityLimit: 99,
}

const resident = (id: string, funding: SchedulingResident['fundingType']): SchedulingResident => ({
  id,
  name: id,
  fundingType: funding,
  isSpecialCareCase: false,
  weeklyCompletedCount: 0,
  assignedDates: [],
})

const cog = (id: string, date: string, staffId: string): SchedulingSession => ({
  id,
  staffId,
  staffName: 'OT',
  date,
  timeSlot: '10:00',
  serviceType: 'Dementia_Service',
  capacity: 1,
  staffRoleType: 'OT',
})

const cogGroup = (id: string, date: string, staffId: string, timeSlot: string): SchedulingSession => ({
  id,
  staffId,
  staffName: 'OT',
  date,
  timeSlot,
  serviceType: 'Dementia_Service',
  capacity: 4,
  staffRoleType: 'OT',
})

/** PDF 01 §3.3／Seq 7：認知軌乾跑與資助類別、時段類型隔離 */
describe('dementiaTrackDryRunService', () => {
  it('略過資助復康時段，僅指派 Dementia_Service', () => {
    const sessions: SchedulingSession[] = [
      {
        id: 'sr',
        staffId: 'a',
        staffName: 'OT',
        date: '2026-05-04',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
      cog('dm', '2026-05-06', 'b'),
    ]
    const r = runDementiaTrackDryRun([resident('r1', 'Voucher')], sessions, constraints)
    expect(r.assignments).toHaveLength(1)
    expect(r.assignments[0]?.sessionId).toBe('dm')
  })

  it('不依資助類別篩院友（01 §3.3 忽略資助）；甲一與私位均可排認知時段', () => {
    const sessions = [cog('d1', '2026-05-04', 's1'), cog('d2', '2026-05-06', 's2')]
    const r = runDementiaTrackDryRun(
      [resident('ea', 'GradeA_Subsidized'), resident('pv', 'Private')],
      sessions,
      constraints,
    )
    expect(r.assignments).toHaveLength(2)
    expect(r.residentsOut.every((x) => x.weeklyCompletedCount >= DEMENTIA_WEEKLY_TARGET)).toBe(true)
  })

  it('同批院友依陣列順序競爭容量 1（嚴重度由呼叫端排序）', () => {
    const sessions = [cog('only', '2026-05-04', 's1')]
    const r = runDementiaTrackDryRun([resident('first', 'Private'), resident('second', 'Private')], sessions, constraints)
    expect(r.assignments).toHaveLength(1)
    expect(r.assignments[0]?.residentId).toBe('first')
    expect(r.conflicts.some((c) => c.residentId === 'second')).toBe(true)
  })

  it('PDF 02【16】P1：認知小組活動每日場次上限（與資助軌同一套 numeric）', () => {
    const capped: SchedulingConstraints = { ...constraints, therapistGroupSessionsDailyCap: 1 }
    const sessions = [
      cogGroup('dg1', '2026-05-21', 's1', '09:00'),
      cogGroup('dg2', '2026-05-21', 's1', '10:00'),
    ]
    const r = runDementiaTrackDryRun([resident('a', 'Private'), resident('b', 'Private')], sessions, capped)
    expect(r.assignments).toHaveLength(1)
    expect(r.conflicts.some((c) => c.type === 'STAFF_GROUP_DAILY_CAP')).toBe(true)
  })
})
