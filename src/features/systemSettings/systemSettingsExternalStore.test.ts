import { describe, expect, it, vi } from 'vitest'
import {
  bumpSystemSettingsExternalVersion,
  getSystemSettingsExternalVersion,
  subscribeSystemSettingsExternal,
} from './systemSettingsExternalStore'

describe('systemSettingsExternalStore（Seq 29）', () => {
  it('bump 遞增版本', () => {
    const v0 = getSystemSettingsExternalVersion()
    bumpSystemSettingsExternalVersion()
    expect(getSystemSettingsExternalVersion()).toBe(v0 + 1)
  })

  it('bump 會通知訂閱者；unsubscribe 後不再通知', () => {
    const fn = vi.fn()
    const unsub = subscribeSystemSettingsExternal(fn)
    bumpSystemSettingsExternalVersion()
    expect(fn).toHaveBeenCalledTimes(1)
    unsub()
    bumpSystemSettingsExternalVersion()
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
