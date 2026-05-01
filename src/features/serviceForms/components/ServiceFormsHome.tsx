import { uiTokens } from '../../shared/ui/uiTokens'
import { useServiceFormsWorkspace } from '../hooks/useServiceFormsWorkspace'
import { ServiceFormStaffPanel } from './ServiceFormStaffPanel'
import { ServiceFormReviewPanel } from './ServiceFormReviewPanel'

/** PDF 02【5】服務表單入口（Seq 17） */
export const ServiceFormsHome = () => {
  const workspace = useServiceFormsWorkspace()

  if (workspace.isLoading) {
    return <p className="text-sm text-slate-600">載入服務表單模組…</p>
  }

  if (workspace.loadError) {
    return <p className="text-sm text-red-700">{workspace.loadError}</p>
  }

  return (
    <div className={`${uiTokens.stackVertical}`}>
      <ServiceFormStaffPanel workspace={workspace} />
      <ServiceFormReviewPanel workspace={workspace} />
    </div>
  )
}
