import { describe, expect, it } from 'vitest'
import { getViewFromHash } from './viewRouting'

describe('viewRouting', () => {
  it('getViewFromHash 接受 #/ 前綴', () => {
    expect(getViewFromHash('#/user-role-admin')).toBe('user-role-admin')
    expect(getViewFromHash('#user-role-admin')).toBe('user-role-admin')
  })
})
