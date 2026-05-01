import type { ScheduleSession } from '../types/schedule'

export interface SchedulingRepository {
  listSessions: () => Promise<ScheduleSession[]>
}

export class InMemorySchedulingRepository implements SchedulingRepository {
  async listSessions(): Promise<ScheduleSession[]> {
    return Promise.resolve([
      {
        id: 'session-001',
        staffName: 'OT 王姑娘',
        serviceType: 'Subsidized_Rehab',
        residentCount: 3,
      },
      {
        id: 'session-002',
        staffName: 'PTA 李先生',
        serviceType: 'Dementia_Service',
        residentCount: 4,
      },
    ])
  }
}
