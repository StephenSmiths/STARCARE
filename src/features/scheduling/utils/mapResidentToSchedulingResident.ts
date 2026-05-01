import type { Resident } from '../../residents/types/resident'
import type { SchedulingResident } from '../../../services/schedulingService'

/** 將院友主檔轉為排班引擎所需欄位（本週已完成次數由排程過程累加） */
export const mapResidentToSchedulingResident = (resident: Resident): SchedulingResident => {
  return {
    id: resident.id,
    name: resident.name,
    fundingType: resident.fundingType,
    isSpecialCareCase: resident.isSpecialCareCase,
    weeklyCompletedCount: 0,
    assignedDates: [],
  }
}
