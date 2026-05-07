import { describe, expect, it } from 'vitest'
import { InMemoryResidentRepository } from '../repositories/residentRepository'
import { ResidentService } from './residentService'

const baseInput = {
  name: '測試院友',
  bedNumber: 'T-01',
  area: '測試區',
  gender: 'Male' as const,
  birthDate: '1954-01-01',
  age: 72,
  admissionDate: '2026-01-01',
  fundingType: 'Private' as const,
  serviceType: 'Subsidized_Rehab' as const,
  dementiaLevel: 'None' as const,
  isSpecialCareCase: false,
  healthCondition: '穩定',
  medicationRecord: '無',
}

describe('residentService soft delete', () => {
  it('只會把資料標記為 is_deleted，不會物理刪除資料', async () => {
    const repository = new InMemoryResidentRepository()
    const service = new ResidentService(repository)
    const actorId = 'TeamLead_test'

    await service.createResident(actorId, { ...baseInput })

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

describe('residentService 評估到期欄位（Seq 9）', () => {
  it('非法評估到期日格式拒絕', async () => {
    const service = new ResidentService(new InMemoryResidentRepository())
    await expect(
      service.createResident('actor', {
        ...baseInput,
        name: '甲',
        bedNumber: 'B-a1',
        assessmentNextDueDate: 'not-a-date',
      }),
    ).rejects.toThrow(/YYYY-MM-DD/)
  })

  it('合法 assessmentNextDueDate 寫入院友', async () => {
    const repository = new InMemoryResidentRepository()
    const service = new ResidentService(repository)
    await service.createResident('actor', {
      ...baseInput,
      name: '乙',
      bedNumber: 'B-a2',
      assessmentNextDueDate: '2026-06-15',
    })
    const row = await repository.findResidentById((await repository.listResidents())[0]?.id ?? '')
    expect(row?.assessmentNextDueDate).toBe('2026-06-15')
  })

  it('更新時以空字串清空評估到期日（正規化為 null）', async () => {
    const repository = new InMemoryResidentRepository()
    const service = new ResidentService(repository)
    await service.createResident('actor', {
      ...baseInput,
      name: '丙',
      bedNumber: 'B-a3',
      assessmentNextDueDate: '2026-08-01',
    })
    const id = (await repository.listResidents())[0]?.id ?? ''
    await service.updateResident('actor', id, {
      ...baseInput,
      name: '丙',
      bedNumber: 'B-a3',
      assessmentNextDueDate: '',
    })
    const row = await repository.findResidentById(id)
    expect(row?.assessmentNextDueDate).toBeNull()
  })
})
