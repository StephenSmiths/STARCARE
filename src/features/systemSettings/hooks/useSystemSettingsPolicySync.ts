import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  hydrateRef.current = hydrateP1FromBundle

  useEffect(() => {
    if (!edgeEnabled) return
    let alive = true
    void (async () => {
      setIsPolicyLoading(true)
      try {
        const [b, versions] = await Promise.all([
          repo.getCurrentBundle(STARCARE_DEFAULT_FACILITY_ID),
          repo.listPolicyVersionSummaries(STARCARE_DEFAULT_FACILITY_ID, 50),
        ])
        if (!alive) return
        setBaseBundle(b)
        setPolicyVersions(versions)
        if (b) hydrateRef.current(b)
        setLoadError(null)
      } catch (e) {
        if (alive) setLoadError(String(e))
      } finally {
        if (alive) setIsPolicyLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [edgeEnabled, repo])

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
        const [fresh, vList] = await Promise.all([
          repo.getCurrentBundle(STARCARE_DEFAULT_FACILITY_ID),
          repo.listPolicyVersionSummaries(STARCARE_DEFAULT_FACILITY_ID, 50),
        ])
        setBaseBundle(fresh)
        setPolicyVersions(vList)
        if (fresh) hydrateRef.current(fresh)
      } catch (e) {
        setSubmitMessage(String(e))
      } finally {
        setIsSubmitting(false)
        lockRef.current = false
      }
    },
    [draft, baseBundle, edgeEnabled, repo],
  )

  return {
    edgeEnabled,
    loadError,
    isPolicyLoading,
    currentPolicyVersion: baseBundle?.policyVersion ?? null,
    policyVersions,
    validateErrors,
    submitMessage,
    isSubmitting,
    submitPolicyVersion,
  }
}
