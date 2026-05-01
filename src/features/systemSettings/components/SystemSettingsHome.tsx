import { useAuth } from '../../auth'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useSystemSettings } from '../hooks/useSystemSettings'

export const SystemSettingsHome = () => {
  const { user } = useAuth()
  const actorId = user?.id ?? 'anonymous'
  const { draft, setField, validationErrors, savedMessage, save, isSaving } = useSystemSettings(actorId)

  return (
    <div className={uiTokens.stackVertical}>
      <article className={uiTokens.surfaceCard}>
        <h2 className={uiTokens.pageSectionHeading}>排班與時段</h2>
        <p className={uiTokens.sectionHelp}>PDF 02【16】Seq 29：每日排班可用視窗與非治療時段（占位，待接 Pass／引擎）。</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>排班開始（HH:mm）</span>
            <input
              type="text"
              inputMode="numeric"
              className={uiTokens.formInput}
              value={draft.schedulingWindowStart}
              onChange={(e) => setField('schedulingWindowStart', e.target.value)}
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>排班結束（HH:mm）</span>
            <input
              type="text"
              inputMode="numeric"
              className={uiTokens.formInput}
              value={draft.schedulingWindowEnd}
              onChange={(e) => setField('schedulingWindowEnd', e.target.value)}
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>非治療時段開始</span>
            <input
              type="text"
              inputMode="numeric"
              className={uiTokens.formInput}
              value={draft.nonTherapyWindowStart}
              onChange={(e) => setField('nonTherapyWindowStart', e.target.value)}
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>非治療時段結束</span>
            <input
              type="text"
              inputMode="numeric"
              className={uiTokens.formInput}
              value={draft.nonTherapyWindowEnd}
              onChange={(e) => setField('nonTherapyWindowEnd', e.target.value)}
            />
          </label>
        </div>
      </article>

      <article className={uiTokens.surfaceCard}>
        <h2 className={uiTokens.pageSectionHeading}>規則與服務啟用</h2>
        <p className={uiTokens.sectionHelp}>規則引擎、固定活動與服務類型總開關（細項待後端對齊）。</p>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={draft.rulesEngineEnabled}
              onChange={(e) => setField('rulesEngineEnabled', e.target.checked)}
            />
            啟用排班規則引擎
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={draft.fixedActivitiesEnabled}
              onChange={(e) => setField('fixedActivitiesEnabled', e.target.checked)}
            />
            啟用固定活動
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={draft.serviceTypesEnabled}
              onChange={(e) => setField('serviceTypesEnabled', e.target.checked)}
            />
            啟用服務類型（PT／OT／認知等總開關）
          </label>
        </div>
      </article>

      <article className={uiTokens.surfaceCard}>
        <h2 className={uiTokens.pageSectionHeading}>特別照護（SC）</h2>
        <p className={uiTokens.sectionHelp}>對齊 SOP：SC 是否僅分配予治療師（待排班指派規則接入）。</p>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            checked={draft.specialCareTherapistOnly}
            onChange={(e) => setField('specialCareTherapistOnly', e.target.checked)}
          />
          SC 個案僅由治療師承接
        </label>
      </article>

      {validationErrors.length > 0 ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          <ul className="list-inside list-disc space-y-1">
            {validationErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {savedMessage ? <p className="text-sm text-emerald-700">{savedMessage}</p> : null}

      <div>
        <button
          type="button"
          className={uiTokens.btnPrimary}
          onClick={() => save()}
          disabled={isSaving}
        >
          儲存設定
        </button>
      </div>
    </div>
  )
}
