-- STARCARE Stage 2 Week 2 Day 1：員工技能映射（活動級）
-- 用於排班時驗證 staff_profile 是否可執行對應 activity。

CREATE TABLE IF NOT EXISTS public.staff_skills (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL REFERENCES public.facilities (id),
  staff_profile_id TEXT NOT NULL REFERENCES public.staff_profiles (id),
  activity_id TEXT NOT NULL REFERENCES public.activities (id),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (staff_profile_id, activity_id)
);

CREATE INDEX IF NOT EXISTS idx_staff_skills_facility ON public.staff_skills (facility_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_staff_skills_staff ON public.staff_skills (staff_profile_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_staff_skills_activity ON public.staff_skills (activity_id, is_deleted);

COMMENT ON TABLE public.staff_skills IS '員工可執行活動技能映射；排班需符合此映射。';

ALTER TABLE public.staff_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS staff_skills_select_staff ON public.staff_skills;
CREATE POLICY staff_skills_select_staff
  ON public.staff_skills
  FOR SELECT TO authenticated
  USING (
    is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('staff', 'admin')
    )
  );

DROP TRIGGER IF EXISTS trg_staff_skills_updated_at ON public.staff_skills;
CREATE TRIGGER trg_staff_skills_updated_at
  BEFORE UPDATE ON public.staff_skills
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_now();
