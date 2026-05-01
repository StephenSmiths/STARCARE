import { describe, expect, it } from 'vitest'
import { InMemoryResidentRepository } from '../repositories/residentRepository'
import { ResidentService } from './residentService'

describe('residentService soft delete', () => {
  it('只會把資料標記為 is_deleted，不會物理刪除資料', async () => {
    const repository = new InMemoryResidentRepository()
    const service = new ResidentService(repository)
    const actorId = 'TeamLead_test'

    await service.createResident(actorId, {
      name: '測試院友',
      bedNumber: 'T-01',
      area: '測試區',
      gender: 'Male',
      age: 72,
      admissionDate: '2026-01-01',
      fundingType: 'Private',
      serviceType: 'Subsidized_Rehab',
      dementiaLevel: 'None',
      isSpecialCareCase: false,
      healthCondition: '穩定',
      medicationRecord: '無',
    })

    const beforeRows = await repository.listResidents()
    const targetId = beforeRows[0]?.id
    if (!targetId) {
      throw new Error('測試資料不存在')
    }

    await service.softDeleteResident(actorId, targetId)

    const afterRows = await repository.listResidents()
    const target = await repository.findResidentById(targetId)
    expect(afterRows.length).toBe(beforeRows.length)
    expect(target?.isDeleted).toBe(true)
  })
})
