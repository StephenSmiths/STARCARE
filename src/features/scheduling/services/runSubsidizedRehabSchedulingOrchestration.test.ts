/**
 * PDF 02【3】／01 §3：資助復康乾跑編排單元測試；mock 院友／時段／視窗／引擎以驗證 ok／empty／error 分支。
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Resident } from '../../residents/types/resident'
import { residentService } from '../../residents/services/residentService'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { resolveSchedulingWindowSnapshot } from '../../../services/schedulingWindowSnapshotService'
import { schedulingService } from '../../../services/schedulingService'
import type { SchedulingSession } from '../../../services/schedulingService'
import { DEFAULT_SYSTEM_SETTINGS } from '../../systemSettings/repository/systemSettingsRepository'
import { runSubsidizedRehabSchedulingOrchestration } from './runSubsidizedRehabSchedulingOrchestration'

vi.mock('../../residents/services/residentService', () => ({
  residentService: { listActiveResidents: vi.fn() },
}))

vi.mock('../../../services/schedulingConfigService', () => ({
  schedulingConfigService: {
    listSchedulingSessions: vi.fn(),
    getRules: vi.fn(),
  },
}))

vi.mock('../../../services/schedulingWindowSnapshotService', () => ({
  resolveSchedulingWindowSnapshot: vi.fn(),
}))

vi.mock('../../../services/schedulingService', () => ({
  schedulingService: { runSubsidizedRehabSchedulingAsync: vi.fn() },
}))

vi.mock('../../../repositories/schedulingPolicyRepository', () => ({
  createSchedulingPolicyRepository: vi.fn(() => ({
    getCurrentBundle: vi.fn().mockResolvedValue(null),
  })),
}))

const rehabResident: Resident = {
  id: 'r-1',
  name: '資助',
  bedNumber: 'B1',
  area: 'A',
  gender: 'Male',
  age: 80,
  admissionDate: '2026-01-01',
  fundingType: 'Private',
  serviceType: 'Subsidized_Rehab',
  dementiaLevel: 'None',
  isSpecialCareCase: false,
  healthCondition: '',
  medicationRecord: '',
  isDeleted: false,
}

const session: SchedulingSession = {
  id: 's-1',
  staffId: 'st-1',
  staffName: 'OT',
  date: '2026-05-01',
  timeSlot: '10:00',
  serviceType: 'Subsidized_Rehab',
  capacity: 1,
}

const snapshotNoWindowFilter = { ...DEFAULT_SYSTEM_SETTINGS, rulesEngineEnabled: false }

describe('runSubsidizedRehabSchedulingOrchestration', () => {
  beforeEach(() => {
    vi.mocked(residentService.listActiveResidents).mockReset()
    vi.mocked(schedulingConfigService.listSchedulingSessions).mockReset()
    vi.mocked(schedulingConfigService.getRules).mockReset()
    vi.mocked(resolveSchedulingWindowSnapshot).mockReset()
    vi.mocked(schedulingService.runSubsidizedRehabSchedulingAsync).mockReset()
    vi.mocked(schedulingConfigService.listSchedulingSessions).mockResolvedValue([session])
    vi.mocked(schedulingConfigService.getRules).mockResolvedValue(null)
    vi.mocked(resolveSchedulingWindowSnapshot).mockResolvedValue(snapshotNoWindowFilter)
  })

  it('ok：呼叫引擎並回傳 viewModel 與 KPI 列', async () => {
    vi.mocked(residentService.listActiveResidents).mockResolvedValue([rehabResident])
    vi.mocked(schedulingService.runSubsidizedRehabSchedulingAsync).mockResolvedValue({
      assignments: [],
      conflicts: [],
      underTargetResidents: [],
    })
    const out = await runSubsidizedRehabSchedulingOrchestration('actor-z', 'facility-main')
    expect(out.kind).toBe('ok')
    if (out.kind === 'ok') {
      expect(out.nextResidents).toHaveLength(1)
      expect(out.nextResidents[0]?.id).toBe('r-1')
      expect(out.viewModel.assignments).toEqual([])
      expect(out.viewModel.previewSessions).toEqual([session])
      expect(out.kpiRecord.actorId).toBe('actor-z')
      expect(out.kpiRecord.residentCount).toBe(1)
    }
    expect(schedulingService.runSubsidizedRehabSchedulingAsync).toHaveBeenCalledWith(
      'actor-z',
      expect.any(Array),
      expect.any(Array),
      expect.any(Object),
    )
  })

  it('empty：無資助復康合規院友時不呼叫引擎', async () => {
    vi.mocked(residentService.listActiveResidents).mockResolvedValue([
      { ...rehabResident, id: 'dm', serviceType: 'Dementia_Service', dementiaLevel: 'Mild' },
    ])
    const out = await runSubsidizedRehabSchedulingOrchestration('actor-z', 'facility-main')
    expect(out).toEqual({ kind: 'empty' })
    expect(schedulingService.runSubsidizedRehabSchedulingAsync).not.toHaveBeenCalled()
  })

  it('error：依賴拋錯時回傳 error', async () => {
    vi.mocked(residentService.listActiveResidents).mockRejectedValue(new Error('network'))
    const out = await runSubsidizedRehabSchedulingOrchestration('actor-z', 'facility-main')
    expect(out).toEqual({ kind: 'error' })
  })
})
