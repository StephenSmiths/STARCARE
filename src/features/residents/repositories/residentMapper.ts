import type { Resident, ResidentRecord } from '../types/resident'

export const toResident = (record: ResidentRecord): Resident => {
  return {
    id: record.id,
    name: record.name,
    bedNumber: record.bed_number,
    area: record.area,
    gender: record.gender,
    age: record.age,
    admissionDate: record.admission_date,
    fundingType: record.funding_type,
    serviceType: record.service_type,
    dementiaLevel: record.dementia_level,
    isSpecialCareCase: record.is_special_care,
    healthCondition: record.health_condition,
    medicationRecord: record.medication_record,
    isDeleted: record.is_deleted,
  }
}

export const toResidentRecord = (resident: Resident): ResidentRecord => {
  return {
    id: resident.id,
    name: resident.name,
    bed_number: resident.bedNumber,
    area: resident.area,
    gender: resident.gender,
    age: resident.age,
    admission_date: resident.admissionDate,
    funding_type: resident.fundingType,
    service_type: resident.serviceType,
    dementia_level: resident.dementiaLevel,
    is_special_care: resident.isSpecialCareCase,
    health_condition: resident.healthCondition,
    medication_record: resident.medicationRecord,
    is_deleted: resident.isDeleted,
  }
}
