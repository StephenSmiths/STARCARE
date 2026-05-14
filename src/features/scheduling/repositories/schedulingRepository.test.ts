/** PDF 02【3】：排班時段記憶體倉（Seq 15；schedulingService 預設注入）。 */
import { describe, expect, it } from 'vitest'
import { InMemorySchedulingRepository } from './schedulingRepository'

describe('InMemorySchedulingRepository', () => {
  it('listSessions 回傳資助復康與認知各一筆示範列', async () => {
    const repo = new InMemorySchedulingRepository()
    const rows = await repo.listSessions()
    expect(rows).toHaveLength(2)
    expect(rows.map((r) => r.serviceType).sort()).toEqual(['Dementia_Service', 'Subsidized_Rehab'].sort())
    expect(rows.every((r) => typeof r.id === 'string' && r.residentCount > 0)).toBe(true)
  })
})
