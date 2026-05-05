import type { Resident, ResidentInput } from '../types/resident'
import { useResidentsDashboardFormSheetCore } from './useResidentsDashboardFormSheetCore'
import { useResidentsDashboardFormSheetSubmit } from './useResidentsDashboardFormSheetSubmit'

/** 院友總覽：側邊表單狀態、開關與提交鎖（業務 PDF 防重覆提交） */
export const useResidentsDashboardFormSheet = (
  residents: Resident[],
  canMaintainResidentRecords: boolean,
  actorId: string,
  createResident: (actorId: string, input: ResidentInput) => Promise<void>,
  updateResident: (actorId: string, id: string, input: ResidentInput) => Promise<void>,
) => {
  const core = useResidentsDashboardFormSheetCore(residents, canMaintainResidentRecords)

  const { handleSubmit, isSubmittingResident } = useResidentsDashboardFormSheetSubmit({
    canMaintainResidentRecords,
    actorId,
    editingId: core.editingId,
    form: core.form,
    createResident,
    updateResident,
    resetForm: core.resetForm,
    setFormSheetOpen: core.setFormSheetOpen,
  })

  return {
    form: core.form,
    setForm: core.setForm,
    submitLabel: core.submitLabel,
    formSheetTitle: core.formSheetTitle,
    formSheetOpen: core.formSheetOpen,
    closeFormSheet: core.closeFormSheet,
    openCreateResidentSheet: core.openCreateResidentSheet,
    openEditResidentSheet: core.openEditResidentSheet,
    handleSubmit,
    resetForm: core.resetForm,
    isSubmittingResident,
  }
}
