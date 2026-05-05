import { ResidentsAdminWriteSections } from './ResidentsAdminWriteSections'
import { ResidentsListPanel } from './ResidentsListPanel'
import { ResidentsOverviewPanel } from './ResidentsOverviewPanel'
import { ResidentsAssessmentDuePanel } from './ResidentsAssessmentDuePanel'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { ResponsiveFormSheet } from '../../shared/components/ResponsiveFormSheet'
import { uiTokens } from '../../shared/ui/uiTokens'
import { ResidentsSingleResidentForm } from './ResidentsSingleResidentForm'
import { useResidentsDashboard } from '../hooks/useResidentsDashboard'

export const ResidentsDashboard = () => {
  const vm = useResidentsDashboard()

  return (
    <article className={uiTokens.surfaceCard}>
      <p className={uiTokens.sectionHelp}>欄位對齊院友管理 SOP，支援新增、修改與軟刪除。</p>
      <div className={uiTokens.stackVerticalMt4}>
        <ResidentsOverviewPanel residents={vm.residents} />
        <ResidentsAdminWriteSections
          actorId={vm.actorId}
          canMaintain={vm.canMaintainResidentRecords}
          onImportCommitted={vm.refreshResidents}
          onOpenCreateSheet={vm.openCreateResidentSheet}
        />
        {vm.errorMessage ? <p className={uiTokens.formInlineError}>{vm.errorMessage}</p> : null}
        <ResidentsAssessmentDuePanel actorId={vm.actorId} residents={vm.residents} />
        <section aria-labelledby="residents-list-heading">
          <h3 id="residents-list-heading" className={uiTokens.blockHeading}>
            院友名單
          </h3>
          <p className={uiTokens.blockHelp}>
            支援搜尋、篩選與軟刪除；編輯會開啟同一張表單。匯出 CSV 末三欄為機讀代碼（資助／服務類型／特殊照護），語意與批量匯入範本一致。
          </p>
          <button
            type="button"
            className={uiTokens.btnSecondaryMt3}
            onClick={vm.exportResidentsCsv}
            disabled={vm.residents.length === 0}
          >
            匯出 Excel（CSV）
          </button>
          <ResidentsListPanel
            residents={vm.residents}
            actorId={vm.actorId}
            canMaintainResidentRecords={vm.canMaintainResidentRecords}
            softDeleteBusyResidentId={vm.softDeleteBusyResidentId}
            onEdit={vm.openEditResidentSheet}
            onSoftDelete={vm.softDeleteResident}
          />
        </section>
        <AuditTrailPanel auditTrail={vm.auditTrail} />
      </div>
      <ResponsiveFormSheet
        open={vm.formSheetOpen && vm.canMaintainResidentRecords}
        onClose={vm.closeFormSheet}
        title={vm.formSheetTitle}
        description="欄位對齊院友管理 SOP；儲存後寫入名單並留下審計紀錄。"
      >
        <ResidentsSingleResidentForm
          embedded
          form={vm.form}
          submitLabel={vm.submitLabel}
          onChange={vm.setForm}
          onSubmit={vm.handleSubmit}
          onReset={vm.resetForm}
          isSubmitting={vm.isSubmittingResident}
        />
      </ResponsiveFormSheet>
    </article>
  )
}
