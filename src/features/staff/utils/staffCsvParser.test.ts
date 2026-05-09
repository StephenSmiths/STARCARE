import { describe, expect, it } from 'vitest'
import { STARCARE_DEFAULT_FACILITY_ID } from '../../../constants/starcareDefaultFacilityId'
import { parseStaffCsv } from './staffCsvParser'

describe('parseStaffCsv', () => {
  it('可解析中文表頭範本（無院舍／無 ServiceScope）', () => {
    const csv = ['員工編號,姓名,職位,性別,聯絡電話,電子郵箱', 's-001,王小明,PT,男,90001111,a@x.hk'].join('\n')
    const { rows, errors } = parseStaffCsv(csv)
    expect(errors).toHaveLength(0)
    expect(rows[0]).toMatchObject({
      id: 's-001',
      facilityId: STARCARE_DEFAULT_FACILITY_ID,
      displayName: '王小明',
      roleType: 'PT',
      serviceScope: 'Both',
      gender: 'Male',
      phone: '90001111',
      email: 'a@x.hk',
    })
  })

  it('範本常見 M／F 性別可解析', () => {
    const csv = ['員工編號,姓名,職位,性別,聯絡電話,電子郵箱', ',李四,PT,F,,'].join('\n')
    const { rows, errors } = parseStaffCsv(csv)
    expect(errors).toHaveLength(0)
    expect(rows[0]?.gender).toBe('Female')
  })

  it('舊版英文列可不填性別', () => {
    const csv = ['Id,facilityId,DisplayName,RoleType,ServiceScope', 'x,facility-main,Z,PT,Both'].join('\n')
    const { rows, errors } = parseStaffCsv(csv)
    expect(errors).toHaveLength(0)
    expect(rows[0]?.gender).toBeUndefined()
  })

  it('相容舊版英文表頭與 ServiceScope（TeamLead）', () => {
    const csv = [
      'Id,facilityId,DisplayName,RoleType,ServiceScope',
      's-legacy,facility-main,李四,TeamLead,Both',
    ].join('\n')
    const { rows, errors } = parseStaffCsv(csv)
    expect(errors).toHaveLength(0)
    expect(rows[0]?.roleType).toBe('TeamLead')
    expect(rows[0]?.serviceScope).toBe('Both')
  })

  it('非空且非法性別會回報格式錯誤', () => {
    const csv = ['員工編號,姓名,職位,性別,聯絡電話,電子郵箱', ',張三,PT,X,,'].join('\n')
    const { rows, errors } = parseStaffCsv(csv)
    expect(rows).toHaveLength(0)
    expect(errors.some((e) => e.message.includes('性別'))).toBe(true)
  })
})
