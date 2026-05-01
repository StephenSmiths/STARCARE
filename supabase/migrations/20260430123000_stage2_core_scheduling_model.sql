-- STARCARE Stage 2 Day 1：智能排班核心模型（院舍/員工/活動/活動時段/排班規則）
-- 對齊 SOP 章節：3.1 基礎約束、3.2 資助復康 3-Pass、3.3 認知障礙症服務、5 資料完整性

CREATE OR REPLACE FUNCTION public.set_updated_at_now()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.facilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL REFERENCES public.facilities (id),
  display_name TEXT NOT NULL,
  role_type TEXT NOT NULL CHECK (role_type IN ('PT', 'OT', 'PTA', 'OTA', 'TeamLead')),
  service_scope TEXT NOT NULL CHECK (service_scope IN ('Subsidized_Rehab', 'Dementia_Care', 'Both')),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL REFERENCES public.facilities (id),
  name TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('Subsidized_Rehab', 'Dementia_Care')),
  activity_kind TEXT NOT NULL CHECK (activity_kind IN ('Training', 'Assessment', 'Other')),
  delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('Individual', 'Group')),
  min_duration_minutes INTEGER NOT NULL CHECK (min_duration_minutes IN (15, 30, 60)),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.activity_sessions (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL REFERENCES public.facilities (id),
  activity_id TEXT NOT NULL REFERENCES public.activities (id),
  staff_profile_id TEXT NOT NULL REFERENCES public.staff_profiles (id),
  session_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity >= 1),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.scheduling_rules (
  facility_id TEXT PRIMARY KEY REFERENCES public.facilities (id),
  enable_subsidized_rehab BOOLEAN NOT NULL DEFAULT true,
  enable_dementia_care BOOLEAN NOT NULL DEFAULT true,
  daily_same_service_limit INTEGER NOT NULL DEFAULT 1 CHECK (daily_same_service_limit >= 1),
  min_gap_days_same_service INTEGER NOT NULL DEFAULT 1 CHECK (min_gap_days_same_service >= 0),
  sc_priority_enabled BOOLEAN NOT NULL DEFAULT true,
  allow_sc_therapist_only BOOLEAN NOT NULL DEFAULT true,
  group_capacity_limit INTEGER NOT NULL DEFAULT 6 CHECK (group_capacity_limit >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_facilities_is_deleted ON public.facilities (is_deleted);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_facility ON public.staff_profiles (facility_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_activities_facility ON public.activities (facility_id, service_type, is_deleted);
CREATE INDEX IF NOT EXISTS idx_activity_sessions_date ON public.activity_sessions (facility_id, session_date);
CREATE INDEX IF NOT EXISTS idx_activity_sessions_staff ON public.activity_sessions (staff_profile_id, session_date);

COMMENT ON TABLE public.facilities IS '院舍主檔；支援多院舍場景；禁止硬刪。';
COMMENT ON TABLE public.staff_profiles IS '排班使用之員工主檔（PT/OT/PTA/OTA/TeamLead）；禁止硬刪。';
COMMENT ON TABLE public.activities IS '活動主檔；明確區分服務類型與活動模式。';
COMMENT ON TABLE public.activity_sessions IS '活動時段供應池；排班引擎以此做匹配。';
COMMENT ON TABLE public.scheduling_rules IS '院舍級排班規則（SOP 3.x 約束參數化）。';

INSERT INTO public.facilities (id, name, code)
VALUES ('facility-main', 'STARCARE 主院舍', 'MAIN')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.scheduling_rules (facility_id)
VALUES ('facility-main')
ON CONFLICT (facility_id) DO NOTHING;

ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduling_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS facilities_select_staff ON public.facilities;
CREATE POLICY facilities_select_staff
  ON public.facilities
  FOR SELECT TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'admin')
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
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'admin')
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
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'admin')
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
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'admin')
    )
  );

DROP POLICY IF EXISTS scheduling_rules_select_staff ON public.scheduling_rules;
CREATE POLICY scheduling_rules_select_staff
  ON public.scheduling_rules
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'admin')
    )
  );

DROP TRIGGER IF EXISTS trg_facilities_updated_at ON public.facilities;
CREATE TRIGGER trg_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_now();

DROP TRIGGER IF EXISTS trg_staff_profiles_updated_at ON public.staff_profiles;
CREATE TRIGGER trg_staff_profiles_updated_at
  BEFORE UPDATE ON public.staff_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_now();

DROP TRIGGER IF EXISTS trg_activities_updated_at ON public.activities;
CREATE TRIGGER trg_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_now();

DROP TRIGGER IF EXISTS trg_activity_sessions_updated_at ON public.activity_sessions;
CREATE TRIGGER trg_activity_sessions_updated_at
  BEFORE UPDATE ON public.activity_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_now();

DROP TRIGGER IF EXISTS trg_scheduling_rules_updated_at ON public.scheduling_rules;
CREATE TRIGGER trg_scheduling_rules_updated_at
  BEFORE UPDATE ON public.scheduling_rules
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_now();
