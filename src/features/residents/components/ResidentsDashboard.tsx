import { useMemo, useRef, useState, type FormEvent } from 'react'
import { useAuthActorId } from '../../auth'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { ResidentsImportPanel } from './ResidentsImportPanel'
import { ResidentsListPanel } from './ResidentsListPanel'
import { ResidentsOverviewPanel } from './ResidentsOverviewPanel'
import { ResidentsAssessmentDuePanel } from './ResidentsAssessmentDuePanel'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { ResponsiveFormSheet } from '../../shared/components/ResponsiveFormSheet'
import { uiTokens } from '../../shared/ui/uiTokens'
import { ResidentsSingleResidentForm } from './ResidentsSingleResidentForm'
import { useResidents } from '../hooks/useResidents'
import type { ResidentInput } from '../types/resident'
import { downloadResidentsExportCsv } from '../services/residentsExportCsvService'

const defaultForm: ResidentInput = {
  name: '',
  bedNumber: '',
  area: '',
  gender: 'Female',
  age: 70,
  admissionDate: '',
  fundingType: 'GradeA_Subsidized',
  serviceType: 'Subsidized_Rehab',
  dementiaLevel: 'None',
  isSpecialCareCase: false,
  healthCondition: '',
  medicationRecord: '',
}

export const ResidentsDashboard = () => {
  const actorId = useAuthActorId()
  const {
    residents,
    errorMessage,
    createResident,
    updateResident,
    softDeleteResident,
    softDeleteBusyResidentId,
    refreshResidents,
    auditTrail,
  } = useResidents()
  const [form, setForm] = useState<ResidentInput>(defaultForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formSheetOpen, setFormSheetOpen] = useState(false)
  const [isSubmittingResident, setIsSubmittingResident] = useState(false)
  const residentSubmitLockRef = useRef(false)

  const submitLabel = useMemo(() => (editingId ? '儲存修改' : '新增院友'), [editingId])
  const formSheetTitle = useMemo(() => (editingId ? '編輯院友資料' : '新增個別院友'), [editingId])

  const fillForm = (residentId: string) => {
    const selected = residents.find((resident) => resident.id === residentId)
    if (!selected) {
      return
    }
    setEditingId(selected.id)
    setForm({
      name: selected.name,
      bedNumber: selected.bedNumber,
      area: selected.area,
      gender: selected.gender,
      age: selected.age,
      admissionDate: selected.admissionDate,
      fundingType: selected.fundingType,
      serviceType: selected.serviceType,
      dementiaLevel: selected.dementiaLevel,
      isSpecialCareCase: selected.isSpecialCareCase,
      healthCondition: selected.healthCondition,
      medicationRecord: selected.medicationRecord,
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(defaultForm)
  }

  const closeFormSheet = () => {
    setFormSheetOpen(false)
    resetForm()
  }

  const openCreateResidentSheet = () => {
    resetForm()
    setFormSheetOpen(true)
  }

  const openEditResidentSheet = (residentId: string) => {
    fillForm(residentId)
    setFormSheetOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (residentSubmitLockRef.current) return
    residentSubmitLockRef.current = true
    setIsSubmittingResident(true)
    try {
      if (editingId) {
        await updateResident(actorId, editingId, form)
      } else {
        await createResident(actorId, form)
      }
      resetForm()
      setFormSheetOpen(false)
    } finally {
      residentSubmitLockRef.current = false
      setIsSubmittingResident(false)
    }
  }

  const exportResidentsCsv = () => {
    if (residents.length === 0) return
    downloadResidentsExportCsv(residents)
    globalAuditTrailService.record({
      action: 'RESIDENTS_EXPORT',
      entityType: 'Resident',
      entityId: `residents-export-${Date.now()}`,
      actorId,
      beforeState: null,
      afterState: JSON.stringify({ count: residents.length }),
      detail: '匯出院友名單（CSV／Excel 可開）',
      occurredAt: new Date().toISOString(),
    })
  }

  return (
    <article className={uiTokens.surfaceCard}>
      <p className={uiTokens.sectionHelp}>欄位對齊院友管理 SOP，支援新增、修改與軟刪除。</p>
      <div className={`${uiTokens.stackVertical} mt-4`}>
        <ResidentsOverviewPanel residents={residents} />
        <section aria-labelledby="residents-bulk-import-heading">
          <h3 id="residents-bulk-import-heading" className={uiTokens.blockHeading}>
            院友批量匯入
          </h3>
          <p className={uiTokens.blockHelp}>以 CSV 預檢後匯入；通過預檢後再確認寫入名單。</p>
          <ResidentsImportPanel actorId={actorId} onImportCommitted={refreshResidents} />
        </section>
        <section aria-labelledby="residents-single-heading">
          <h3 id="residents-single-heading" className={uiTokens.blockHeading}>
            新增個別院友
          </h3>
          <p className={uiTokens.blockHelp}>
            以表單逐筆建立院友資料（含資助類別與照護標記）。桌機為右側抽屜，手機為全螢幕。
          </p>
          <button className={`${uiTokens.btnPrimary} mt-3 w-fit`} type="button" onClick={openCreateResidentSheet}>
            開啟院友資料表單
          </button>
        </section>
        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
        <ResidentsAssessmentDuePanel actorId={actorId} residents={residents} />
        <section aria-labelledby="residents-list-heading">
          <h3 id="residents-list-heading" className={uiTokens.blockHeading}>
            院友名單
          </h3>
          <p className={uiTokens.blockHelp}>支援搜尋、篩選與軟刪除；編輯會開啟同一張表單。</p>
          <button
            type="button"
            className={`${uiTokens.btnSecondary} mt-3`}
            onClick={exportResidentsCsv}
            disabled={residents.length === 0}
          >
            匯出 Excel（CSV）
          </button>
          <ResidentsListPanel
            residents={residents}
            actorId={actorId}
            softDeleteBusyResidentId={softDeleteBusyResidentId}
            onEdit={openEditResidentSheet}
            onSoftDelete={softDeleteResident}
          />
        </section>
        <AuditTrailPanel auditTrail={auditTrail} />
      </div>
      <ResponsiveFormSheet
        open={formSheetOpen}
        onClose={closeFormSheet}
        title={formSheetTitle}
        description="欄位對齊院友管理 SOP；儲存後寫入名單並留下審計紀錄。"
      >
        <ResidentsSingleResidentForm
          embedded
          form={form}
          submitLabel={submitLabel}
          onChange={setForm}
          onSubmit={handleSubmit}
          onReset={resetForm}
          isSubmitting={isSubmittingResident}
        />
      </ResponsiveFormSheet>
    </article>
  )
}
