import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { STARCARE_DEFAULT_FACILITY_ID } from '../../../constants/starcareDefaultFacilityId'
import { createSchedulingPolicyRepository } from '../../../repositories/schedulingPolicyRepository'
import type { PolicyValidateError, SchedulingPolicyBundle, SchedulingPolicyVersionSummary } from '../../../repositories/schedulingPolicyTypes'
import { getSupabaseBrowserCredentials } from '../../../services/supabaseBrowserEnv'
import { bundleToPolicyCommitBody, mergeP1DraftIntoPolicyBundle } from '../domain/mergeP1DraftIntoPolicyBundle'
import { validateSystemSettings } from '../domain/systemSettingsValidation'
import type { SystemSettingsSnapshot } from '../types'
import { bumpSystemSettingsExternalVersion } from '../systemSettingsExternalStore'

type Args = {
  draft: SystemSettingsSnapshot
  hydrateP1FromBundle: (b: SchedulingPolicyBundle) => void
}

type LoadPolicyResult = { ok: true } | { ok: false; error: string }

/** P1：政策版本（雲端提交）— 載入 `scheduling-policy-current-get`、驗證並提交 `version-commit`（Repository 閉環） */
export const useSystemSettingsPolicySync = ({ draft, hydrateP1FromBundle }: Args) => {
  const edgeEnabled = Boolean(getSupabaseBrowserCredentials())
  const repo = useMemo(() => createSchedulingPolicyRepository(), [])
  const [baseBundle, setBaseBundle] = useState<SchedulingPolicyBundle | null>(null)
  const [policyVersions, setPolicyVersions] = useState<SchedulingPolicyVersionSummary[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isPolicyLoading, setIsPolicyLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [validateErrors, setValidateErrors] = useState<PolicyValidateError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const lockRef = useRef(false)
  const hydrateRef = useRef(hydrateP1FromBundle)
  const loadSeqRef = useRef(0)
  useLayoutEffect(() => {
    hydrateRef.current = hydrateP1FromBundle
  }, [hydrateP1FromBundle])

  const loadPolicy = useCallback(async (opts?: { withLoadingIndicator?: boolean }): Promise<LoadPolicyResult> => {
    if (!edgeEnabled) return { ok: true }
    const withLoadingIndicator = opts?.withLoadingIndicator !== false
    const seq = ++loadSeqRef.current
    if (withLoadingIndicator) setIsPolicyLoading(true)
    try {
      const [b, versions] = await Promise.all([
        repo.getCurrentBundle(STARCARE_DEFAULT_FACILITY_ID),
        repo.listPolicyVersionSummaries(STARCARE_DEFAULT_FACILITY_ID, 50),
      ])
      if (seq !== loadSeqRef.current) return { ok: true }
      setBaseBundle(b)
      setPolicyVersions(versions)
      if (b) hydrateRef.current(b)
      setLoadError(null)
      return { ok: true }
    } catch (e) {
      if (seq !== loadSeqRef.current) return { ok: true }
      const msg = String(e)
      setLoadError(msg)
      return { ok: false, error: msg }
    } finally {
      if (seq === loadSeqRef.current && withLoadingIndicator) setIsPolicyLoading(false)
    }
  }, [edgeEnabled, repo])

  useEffect(() => {
    void loadPolicy()
  }, [loadPolicy])

  const reloadPolicy = useCallback(() => {
    void loadPolicy()
  }, [loadPolicy])

  const submitPolicyVersion = useCallback(
    async (params: { effectiveFromLocal: string; changeSummary: string; confirmed: boolean }) => {
      if (!edgeEnabled || lockRef.current) return
      setValidateErrors([])
      setSubmitMessage(null)
      if (!params.confirmed) {
        setSubmitMessage('請勾選「已確認變更」')
        return
      }
      const summary = params.changeSummary.trim()
      if (!summary) {
        setSubmitMessage('請填寫變更原因／備註')
        return
      }
      const ef = new Date(params.effectiveFromLocal)
      if (Number.isNaN(ef.getTime())) {
        setSubmitMessage('生效時間格式無效')
        return
      }
      if (!validateSystemSettings(draft).ok) {
        setSubmitMessage('請先修正上方表單校驗錯誤再提交')
        return
      }
      lockRef.current = true
      setIsSubmitting(true)
      try {
        const merged = mergeP1DraftIntoPolicyBundle(draft, baseBundle, STARCARE_DEFAULT_FACILITY_ID)
        const idem = crypto.randomUUID()
        const bodyRecord: Record<string, unknown> = {
          ...bundleToPolicyCommitBody(merged, {
            effectiveFromIso: ef.toISOString(),
            changeSummary: summary,
            confirmToken: 'CONFIRMED',
          }),
          idempotencyKey: idem,
        }
        const val = await repo.validateBundle(bodyRecord)
        if (!val.ok) {
          setValidateErrors(val.errors)
          return
        }
        const committed = await repo.commitBundle(bodyRecord, idem)
        if (!committed.ok) {
          if (committed.errors?.length) setValidateErrors(committed.errors)
          else setSubmitMessage(committed.error ?? '提交失敗')
          return
        }
        setSubmitMessage(`已建立政策版本（${committed.policyVersionId.slice(0, 8)}…）`)
        bumpSystemSettingsExternalVersion()
        const refresh = await loadPolicy({ withLoadingIndicator: false })
        if (!refresh.ok) {
          setSubmitMessage(
            `已建立政策版本（${committed.policyVersionId.slice(0, 8)}…）；重新載入雲端摘要／版本列時失敗，請按「重新載入雲端政策」或稍後再試。`,
          )
        }
      } catch (e) {
        setSubmitMessage(String(e))
      } finally {
        setIsSubmitting(false)
        lockRef.current = false
      }
    },
    [draft, baseBundle, edgeEnabled, repo, loadPolicy],
  )

  return {
    edgeEnabled,
    loadError,
    isPolicyLoading,
    reloadPolicy,
    currentPolicyVersion: baseBundle?.policyVersion ?? null,
    policyVersions,
    validateErrors,
    submitMessage,
    isSubmitting,
    submitPolicyVersion,
  }
}
