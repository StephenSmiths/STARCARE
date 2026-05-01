import type { ViewId } from './viewRouting'
import { ActivitySessionImportPanel } from '../features/activitySessions'
import { ResidentsDashboard } from '../features/residents'
import { DashboardHome } from '../features/dashboard'
import { SchedulingDashboard } from '../features/scheduling'
import { StaffImportPanel } from '../features/staff'
import { WorkPlansHome } from '../features/workPlans'
import { WorkSessionPlansHome } from '../features/workSessionPlans'
import { ServiceFormsHome } from '../features/serviceForms'
import { ShiftStartHandoverHome } from '../features/shiftStartHandover'
import { EndShiftHandoverHome } from '../features/endShiftHandover'
import { WorkAnalysisReviewHome } from '../features/workAnalysisReview'
import { RehabActivityTrackingHome } from '../features/rehabActivityTracking'
import { AssessmentManagementHome } from '../features/assessmentManagement'
import { HistoricalDocumentsHome } from '../features/historicalDocuments'
import { AiReportCenterHome } from '../features/aiReportCenter'
import { NotificationCenterHome } from '../features/notificationCenter'
import { UserManualHome } from '../features/userManual'
import { SystemSettingsHome } from '../features/systemSettings'
import type { AuthPermission } from '../features/auth/permissions'

type Props = {
  effectiveView: ViewId
  hasPermission: (permission: AuthPermission) => boolean
}

/** 依路由渲染各功能首頁（與 App 解耦以利維護） */
export const AppMainViews = ({ effectiveView, hasPermission }: Props) => (
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
)
