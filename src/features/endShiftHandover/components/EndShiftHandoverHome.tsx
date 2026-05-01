import { uiTokens } from '../../shared/ui/uiTokens'
import { useEndShiftHandoverWorkspace } from '../hooks/useEndShiftHandoverWorkspace'
import { EndShiftHandoverPanel } from './EndShiftHandoverPanel'

/** PDF 02【6】收工交更入口 */
export const EndShiftHandoverHome = () => {
  const workspace = useEndShiftHandoverWorkspace()

  return (
    <div className={`mx-auto w-full max-w-5xl ${uiTokens.stackVertical}`}>
      <EndShiftHandoverPanel workspace={workspace} />
    </div>
  )
}
