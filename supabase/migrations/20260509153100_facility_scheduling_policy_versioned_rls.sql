-- 院舍政策版本表：RLS（SELECT；寫入預設走 Edge service_role）
-- 前置：`20260509153000_facility_scheduling_policy_versioned_skeleton.sql`

ALTER TABLE public.facility_scheduling_policy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_policy_non_therapy_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_policy_numeric_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_policy_fixed_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_policy_subsidized_tier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_policy_subsidized_role_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_policy_subsidized_pass_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_policy_dementia_core ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_policy_dementia_role_offerings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS facility_scheduling_policy_versions_select_staff ON public.facility_scheduling_policy_versions;
CREATE POLICY facility_scheduling_policy_versions_select_staff
  ON public.facility_scheduling_policy_versions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS facility_policy_non_therapy_slots_select_staff ON public.facility_policy_non_therapy_slots;
CREATE POLICY facility_policy_non_therapy_slots_select_staff
  ON public.facility_policy_non_therapy_slots
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS facility_policy_numeric_limits_select_staff ON public.facility_policy_numeric_limits;
CREATE POLICY facility_policy_numeric_limits_select_staff
  ON public.facility_policy_numeric_limits
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS facility_policy_fixed_activities_select_staff ON public.facility_policy_fixed_activities;
CREATE POLICY facility_policy_fixed_activities_select_staff
  ON public.facility_policy_fixed_activities
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS facility_policy_subsidized_tier_select_staff ON public.facility_policy_subsidized_tier;
CREATE POLICY facility_policy_subsidized_tier_select_staff
  ON public.facility_policy_subsidized_tier
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS facility_policy_subsidized_role_offerings_select_staff ON public.facility_policy_subsidized_role_offerings;
CREATE POLICY facility_policy_subsidized_role_offerings_select_staff
  ON public.facility_policy_subsidized_role_offerings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS facility_policy_subsidized_pass_order_select_staff ON public.facility_policy_subsidized_pass_order;
CREATE POLICY facility_policy_subsidized_pass_order_select_staff
  ON public.facility_policy_subsidized_pass_order
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS facility_policy_dementia_core_select_staff ON public.facility_policy_dementia_core;
CREATE POLICY facility_policy_dementia_core_select_staff
  ON public.facility_policy_dementia_core
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS facility_policy_dementia_role_offerings_select_staff ON public.facility_policy_dementia_role_offerings;
CREATE POLICY facility_policy_dementia_role_offerings_select_staff
  ON public.facility_policy_dementia_role_offerings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );
