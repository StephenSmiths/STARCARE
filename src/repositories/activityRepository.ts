import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export type Activity = {
  id: string
  facilityId: string
  name: string
  serviceType: 'Subsidized_Rehab' | 'Dementia_Care'
  activityKind: 'Training' | 'Assessment' | 'Other'
  deliveryMode: 'Individual' | 'Group'
  minDurationMinutes: number
}

export interface ActivityRepository {
  listActivities: (facilityId?: string) => Promise<Activity[]>
}

/** 無 Supabase 時供 Seq 14／排班設定對齊之離線活動主檔（對齊 migrations seed） */
const DEMO_ACTIVITIES: Activity[] = [
  {
    id: 'activity-rehab-01',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    name: '下肢肌力訓練',
    serviceType: 'Subsidized_Rehab',
    activityKind: 'Training',
    deliveryMode: 'Group',
    minDurationMinutes: 30,
  },
  {
    id: 'activity-rehab-02',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    name: '平衡訓練',
    serviceType: 'Subsidized_Rehab',
    activityKind: 'Training',
    deliveryMode: 'Group',
    minDurationMinutes: 30,
  },
  {
    id: 'activity-rehab-03',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    name: '主動伸展',
    serviceType: 'Subsidized_Rehab',
    activityKind: 'Training',
    deliveryMode: 'Group',
    minDurationMinutes: 60,
  },
  {
    id: 'activity-rehab-ot-1',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    name: '懷舊治療小組',
    serviceType: 'Subsidized_Rehab',
    activityKind: 'Training',
    deliveryMode: 'Group',
    minDurationMinutes: 60,
  },
  {
    id: 'activity-rehab-ota-1',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    name: '日常生活技能小組',
    serviceType: 'Subsidized_Rehab',
    activityKind: 'Training',
    deliveryMode: 'Group',
    minDurationMinutes: 30,
  },
  {
    id: 'activity-rehab-pt-ind-1',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    name: '肌力訓練',
    serviceType: 'Subsidized_Rehab',
    activityKind: 'Training',
    deliveryMode: 'Individual',
    minDurationMinutes: 15,
  },
  {
    id: 'activity-rehab-ot-ind-1',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    name: '日常生活活動訓練',
    serviceType: 'Subsidized_Rehab',
    activityKind: 'Training',
    deliveryMode: 'Individual',
    minDurationMinutes: 30,
  },
  {
    id: 'activity-dementia-01',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    name: '認知刺激小組',
    serviceType: 'Dementia_Care',
    activityKind: 'Training',
    deliveryMode: 'Group',
    minDurationMinutes: 45,
  },
  {
    id: 'activity-dementia-02',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    name: '認知訓練小組',
    serviceType: 'Dementia_Care',
    activityKind: 'Training',
    deliveryMode: 'Group',
    minDurationMinutes: 60,
  },
]

class InMemoryActivityRepository implements ActivityRepository {
  async listActivities(facilityId?: string): Promise<Activity[]> {
    if (!facilityId) return [...DEMO_ACTIVITIES]
    return DEMO_ACTIVITIES.filter((a) => a.facilityId === facilityId)
  }
}

class EdgeActivityRepository implements ActivityRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async listActivities(facilityId?: string): Promise<Activity[]> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const query = facilityId ? `?facilityId=${encodeURIComponent(facilityId)}` : ''
    const response = await fetch(`${this.supabaseUrl}/functions/v1/activities-list${query}`, { headers })
    if (!response.ok) throw new Error(`載入活動失敗（HTTP ${response.status}）`)
    return (await response.json()) as Activity[]
  }
}

export const createActivityRepository = (): ActivityRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new InMemoryActivityRepository()
  }
  return new EdgeActivityRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}

/** 與離線 `DEMO_ACTIVITIES` 同源；週更表擇 id 於 Edge 不可用時回退，或供 Vitest 避免誤走 Edge。 */
export const getStarcareDemoActivities = (): Activity[] => [...DEMO_ACTIVITIES]
