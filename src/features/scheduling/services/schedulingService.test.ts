/** PDF 02【3】：排班資料服務薄封裝（Seq 15；getSessions 委派 Repository）。 */
import { describe, expect, it, vi } from 'vitest'
import type { SchedulingRepository } from '../repositories/schedulingRepository'
import type { ScheduleSession } from '../types/schedule'
import { SchedulingService } from './schedulingService'

describe('SchedulingService（features/scheduling/services）', () => {
  it('getSessions 委派 repository.listSessions', async () => {
    const demo: ScheduleSession = {
      id: 'sess-x',
      staffName: '示範 OT',
      serviceType: 'Subsidized_Rehab',
      residentCount: 2,
    }
    const listSessions = vi.fn().mockResolvedValue([demo])
    const repo: SchedulingRepository = { listSessions }
    const svc = new SchedulingService(repo)
    const rows = await svc.getSessions()
    expect(listSessions).toHaveBeenCalledTimes(1)
    expect(rows).toEqual([demo])
  })
})
