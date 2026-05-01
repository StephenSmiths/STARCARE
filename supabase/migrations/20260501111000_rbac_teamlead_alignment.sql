-- STARCARE Seq 1：RBAC 三角色對齊（admin / teamlead / staff）
-- 對齊文件：docs/pdf/01-STARCare-核心業務邏輯與-SOP.pdf §1

ALTER TABLE public.user_roles
DROP CONSTRAINT IF EXISTS user_roles_role_check;

ALTER TABLE public.user_roles
ADD CONSTRAINT user_roles_role_check
CHECK (role IN ('staff', 'teamlead', 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_auth_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r TEXT;
BEGIN
  r := COALESCE(NULLIF(TRIM(NEW.raw_app_meta_data->>'starcare_role'), ''), 'staff');
  IF r NOT IN ('staff', 'teamlead', 'admin') THEN
    r := 'staff';
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, r)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
  RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS residents_select_staff ON public.residents;
CREATE POLICY residents_select_staff
  ON public.residents
  FOR SELECT
  TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS scheduling_history_select_staff ON public.scheduling_history;
CREATE POLICY scheduling_history_select_staff
  ON public.scheduling_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS scheduling_sessions_select_staff ON public.scheduling_sessions;
CREATE POLICY scheduling_sessions_select_staff
  ON public.scheduling_sessions
  FOR SELECT
  TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS facilities_select_staff ON public.facilities;
CREATE POLICY facilities_select_staff
  ON public.facilities
  FOR SELECT TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS staff_profiles_select_staff ON public.staff_profiles;
CREATE POLICY staff_profiles_select_staff
  ON public.staff_profiles
  FOR SELECT TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS activities_select_staff ON public.activities;
CREATE POLICY activities_select_staff
  ON public.activities
  FOR SELECT TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS activity_sessions_select_staff ON public.activity_sessions;
CREATE POLICY activity_sessions_select_staff
  ON public.activity_sessions
  FOR SELECT TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS scheduling_rules_select_staff ON public.scheduling_rules;
CREATE POLICY scheduling_rules_select_staff
  ON public.scheduling_rules
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS staff_skills_select_staff ON public.staff_skills;
CREATE POLICY staff_skills_select_staff
  ON public.staff_skills
  FOR SELECT TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );

DROP POLICY IF EXISTS scheduling_kpi_history_select_staff ON public.scheduling_kpi_history;
CREATE POLICY scheduling_kpi_history_select_staff
  ON public.scheduling_kpi_history
  FOR SELECT
  TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('staff', 'teamlead', 'admin')
    )
  );
