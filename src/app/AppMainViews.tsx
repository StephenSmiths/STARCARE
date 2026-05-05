import { lazy, Suspense } from 'react'
import type { ViewId } from './viewRouting'
import type { AuthPermission } from '../features/auth/permissions'

type Props = {
  effectiveView: ViewId
  hasPermission: (permission: AuthPermission) => boolean
}

const DashboardHome = lazy(async () => ({
  default: (await import('../features/dashboard')).DashboardHome,
}))
const WorkPlansHome = lazy(async () => ({
  default: (await import('../features/workPlans')).WorkPlansHome,
}))
const WorkSessionPlansHome = lazy(async () => ({
  default: (await import('../features/workSessionPlans')).WorkSessionPlansHome,
}))
const ServiceFormsHome = lazy(async () => ({
  default: (await import('../features/serviceForms')).ServiceFormsHome,
}))
const HistoricalDocumentsHome = lazy(async () => ({
  default: (await import('../features/historicalDocuments')).HistoricalDocumentsHome,
}))
const WorkAnalysisReviewHome = lazy(async () => ({
  default: (await import('../features/workAnalysisReview')).WorkAnalysisReviewHome,
}))
const AiReportCenterHome = lazy(async () => ({
  default: (await import('../features/aiReportCenter')).AiReportCenterHome,
}))
const NotificationCenterHome = lazy(async () => ({
  default: (await import('../features/notificationCenter')).NotificationCenterHome,
}))
const UserManualHome = lazy(async () => ({
  default: (await import('../features/userManual')).UserManualHome,
}))
const ShiftStartHandoverHome = lazy(async () => ({
  default: (await import('../features/shiftStartHandover')).ShiftStartHandoverHome,
}))
const EndShiftHandoverHome = lazy(async () => ({
  default: (await import('../features/endShiftHandover')).EndShiftHandoverHome,
}))
const SchedulingDashboard = lazy(async () => ({
  default: (await import('../features/scheduling')).SchedulingDashboard,
}))
const RehabActivityTrackingHome = lazy(async () => ({
  default: (await import('../features/rehabActivityTracking')).RehabActivityTrackingHome,
}))
const AssessmentManagementHome = lazy(async () => ({
  default: (await import('../features/assessmentManagement')).AssessmentManagementHome,
}))
const SystemSettingsHome = lazy(async () => ({
  default: (await import('../features/systemSettings')).SystemSettingsHome,
}))
const ResidentsDashboard = lazy(async () => ({
  default: (await import('../features/residents')).ResidentsDashboard,
}))
const StaffImportPanel = lazy(async () => ({
  default: (await import('../features/staff')).StaffImportPanel,
}))
const ActivitySessionImportPanel = lazy(async () => ({
  default: (await import('../features/activitySessions')).ActivitySessionImportPanel,
}))

/** 依路由渲染各功能首頁（與 App 解耦以利維護） */
export const AppMainViews = ({ effectiveView, hasPermission }: Props) => (
  <Suspense fallback={<div>載入模組中...</div>}>
    <>
      {effectiveView === 'dashboard' && hasPermission('view:dashboard') ? <DashboardHome /> : null}
      {effectiveView === 'work-plan' && hasPermission('view:work-plan-compose') ? <WorkPlansHome /> : null}
      {effectiveView === 'work-session-plans' && hasPermission('view:work-session-plans') ? (
        <WorkSessionPlansHome />
      ) : null}
      {effectiveView === 'service-forms' && hasPermission('view:service-forms') ? <ServiceFormsHome /> : null}
      {effectiveView === 'historical-documents' && hasPermission('view:historical-documents') ? (
        <HistoricalDocumentsHome />
      ) : null}
      {effectiveView === 'work-analysis-review' && hasPermission('view:work-analysis-review') ? (
        <WorkAnalysisReviewHome />
      ) : null}
      {effectiveView === 'ai-report-center' && hasPermission('view:ai-report-center') ? (
        <AiReportCenterHome />
      ) : null}
      {effectiveView === 'notification-center' && hasPermission('view:notification-center') ? (
        <NotificationCenterHome />
      ) : null}
      {effectiveView === 'user-manual' && hasPermission('view:user-manual') ? <UserManualHome /> : null}
      {effectiveView === 'shift-start-handover' && hasPermission('view:shift-start-handover') ? (
        <ShiftStartHandoverHome />
      ) : null}
      {effectiveView === 'shift-end-handover' && hasPermission('view:shift-end-handover') ? (
        <EndShiftHandoverHome />
      ) : null}
      {effectiveView === 'scheduling' && hasPermission('view:scheduling') ? <SchedulingDashboard /> : null}
      {effectiveView === 'rehab-activity-tracking' && hasPermission('view:rehab-activity-tracking') ? (
        <RehabActivityTrackingHome />
      ) : null}
      {effectiveView === 'assessment-management' && hasPermission('view:assessment-management') ? (
        <AssessmentManagementHome />
      ) : null}
      {effectiveView === 'system-settings' && hasPermission('view:system-settings') ? (
        <SystemSettingsHome />
      ) : null}
      {effectiveView === 'residents' && hasPermission('view:residents') ? <ResidentsDashboard /> : null}
      {effectiveView === 'staff-import' && hasPermission('view:staff-import') ? <StaffImportPanel /> : null}
      {effectiveView === 'activity-sessions-import' && hasPermission('view:activity-sessions-import') ? (
        <ActivitySessionImportPanel />
      ) : null}
    </>
  </Suspense>
)
