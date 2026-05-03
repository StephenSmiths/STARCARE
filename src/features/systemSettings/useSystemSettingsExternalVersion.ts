import { useSyncExternalStore } from 'react'
import {
  getSystemSettingsExternalVersion,
  subscribeSystemSettingsExternal,
} from './systemSettingsExternalStore'

/** 訂閱本機院舍設定寫入／他分頁 `storage`（Seq 29） */
export const useSystemSettingsExternalVersion = (): number =>
  useSyncExternalStore(
    subscribeSystemSettingsExternal,
    getSystemSettingsExternalVersion,
    getSystemSettingsExternalVersion,
  )
